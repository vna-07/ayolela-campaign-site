import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ArrowDown,
  ChevronDown,
  ChevronRight,
  Clock3,
  RotateCcw,
  X,
} from 'lucide-react';
import './campaign-ended.css';

export const Route = createFileRoute('/campaign-ended')({
  component: CampaignEndedPage,
  head: () => ({
    meta: [
      { title: 'Voting Closed · Chris Hani House 2026' },
      {
        name: 'description',
        content:
          'The 2026 Chris Hani House elections are officially closed. The campaign site has retired. You might as well play something.',
      },
    ],
  }),
});

const stickers = {
  hero: '/assets/arcade/Adventure_Time_Pixel_Sticker.gif',
  transition: '/assets/arcade/Adventure_Time_Art_Sticker.gif',
  fox: '/assets/arcade/fox_pixel_STICKER.gif',
  cat: '/assets/arcade/Cat_Art_Sticker.gif',
};

type Category = 'all' | 'classics' | 'quick' | 'knowledge';
type GameId =
  | 'tictactoe'
  | 'minesweeper'
  | 'memory'
  | 'wordle'
  | '2048'
  | 'connect'
  | 'cards'
  | 'quiz'
  | 'snake'
  | 'chess'
  | 'ludo';

type Game = {
  id: GameId;
  title: string;
  category: Exclude<Category, 'all'>;
  description: string;
  icon: string;
  label: string;
};

const games: Game[] = [
  { id: 'tictactoe', title: 'Tic-Tac-Toe', category: 'quick', icon: '✕', label: '01', description: 'Ancient technology. Surprisingly difficult to win.' },
  { id: 'minesweeper', title: 'Minesweeper', category: 'classics', icon: '✹', label: '02', description: "One wrong click and it's suddenly everyone's problem." },
  { id: 'memory', title: 'Memory', category: 'quick', icon: '▦', label: '03', description: 'Remember where things are. A useful university skill.' },
  { id: 'wordle', title: 'Campus Wordle', category: 'knowledge', icon: 'A', label: '04', description: 'Five letters. Six guesses. Zero academic credit.' },
  { id: '2048', title: '2048', category: 'classics', icon: '²', label: '05', description: 'Merge numbers until your brain starts merging too.' },
  { id: 'connect', title: 'Connect Four', category: 'quick', icon: '●', label: '06', description: 'Four in a row. No committee meeting required.' },
  { id: 'cards', title: 'Cards', category: 'quick', icon: '♢', label: '07', description: 'Purely recreational. Absolutely no money involved.' },
  { id: 'quiz', title: 'House Quiz', category: 'knowledge', icon: '?', label: '08', description: 'How well do you actually know the place?' },
  { id: 'snake', title: 'Snake', category: 'classics', icon: '≈', label: '09', description: 'Eat things. Become longer. Question your decisions.' },
  { id: 'chess', title: 'Chess', category: 'classics', icon: '♞', label: '10', description: "Because apparently one election wasn't enough strategy." },
  { id: 'ludo', title: 'Ludo', category: 'quick', icon: '●', label: '11', description: 'Friendship may or may not survive.' },
];

const quizQuestions = [
  ['What was Chris Hani’s birth name?', ['Martin Tembisile', 'Thembisile Mkhize', 'Thabo Hani', 'Martin Mbeki'], 0, 'Chris Hani was born Martin Tembisile Hani.'],
  ['What position did Chris Hani hold in uMkhonto weSizwe?', ['Secretary', 'Chief of Staff', 'Commander of the Navy', 'Treasurer'], 1, 'He served as Chief of Staff of MK.'],
  ['Which hospital was renamed Chris Hani Baragwanath Hospital in 1997?', ['Baragwanath Hospital', 'Groote Schuur Hospital', 'Frere Hospital', 'Livingstone Hospital'], 0, 'The full name is Chris Hani Baragwanath Hospital.'],
  ['Which album won Miriam Makeba and Harry Belafonte a Grammy in 1966?', ['Pata Pata', 'An Evening with Belafonte/Makeba', 'Sangoma', 'The Many Voices of Miriam Makeba'], 1, 'An Evening with Belafonte/Makeba won Best Folk Recording.'],
  ['What is “Qongqothwane” commonly known as in English?', ['The Freedom Song', 'The Click Song', 'The Wedding Song', 'The Rain Song'], 1, 'It is widely known as The Click Song.'],
  ['In what year was Rhodes University established?', ['1899', '1904', '1916', '1829'], 1, 'Rhodes University was established in 1904.'],
  ['What major technology milestone was achieved from Rhodes University on 12 November 1991?', ['The first local radio station', 'The first international Internet connection from South Africa', 'The first campus TV broadcast', 'The first mobile call'], 1, 'The first international TCP/IP connection from South Africa was made from Rhodes.'],
  ['What was Makhanda formerly known as?', ['Grahamstown', 'Port Alfred', 'King William’s Town', 'Fort Beaufort'], 0, 'The city was formerly known as Grahamstown.'],
  ['Which Eastern Cape university was founded in 1916?', ['University of Fort Hare', 'Walter Sisulu University', 'Nelson Mandela University', 'Rhodes University'], 0, 'The University of Fort Hare was founded in 1916.'],
  ['Which university traces its roots to the South African College founded in 1829?', ['University of Pretoria', 'University of Cape Town', 'University of KwaZulu-Natal', 'University of the Free State'], 1, 'UCT traces its roots to the South African College.'],
  ['What does the “M” in Makhanda’s former name refer to in current city naming?', ['A river', 'A historical figure', 'A mountain', 'A language'], 1, 'Makhanda is named after the Xhosa prophet and military leader Makhanda Nxele.'],
  ['Which genre is strongly associated with Miriam Makeba?', ['Afro-pop and jazz', 'Heavy metal', 'House only', 'Country western'], 0, 'Makeba’s work crossed jazz, Afro-pop, folk, and traditional sounds.'],
] as const;

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function Sticker({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return <img src={src} alt={alt} className={`sticker ${className}`} />;
}

function GameButton({
  children,
  onClick,
  secondary = false,
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  secondary?: boolean;
  disabled?: boolean;
}) {
  return (
    <button className={`game-button ${secondary ? 'game-button--secondary' : ''}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

function GameShell({
  title,
  children,
  reset,
  close,
}: {
  title: string;
  children: React.ReactNode;
  reset: () => void;
  close: () => void;
}) {
  return (
    <section className="game-shell" aria-label={`${title} game`}>
      <div className="game-shell__header">
        <div>
          <span className="eyebrow">NOW PLAYING</span>
          <h3>{title}</h3>
        </div>
        <div className="game-shell__actions">
          <GameButton secondary onClick={reset}>
            <RotateCcw size={15} /> New game
          </GameButton>
          <button className="icon-button" aria-label="Close game" onClick={close}>
            <X size={18} />
          </button>
        </div>
      </div>
      {children}
    </section>
  );
}

function TicTacToe({ close }: { close: () => void }) {
  const empty = Array(9).fill(null) as (string | null)[];
  const [board, setBoard] = useState(empty);
  const [turn, setTurn] = useState('X');
  const [score, setScore] = useState({ X: 0, O: 0, D: 0 });
  const winner = getWinner(board);
  const over = Boolean(winner || board.every(Boolean));
  function play(index: number) {
    if (board[index] || over || turn !== 'X') return;
    const next = [...board];
    next[index] = 'X';
    setBoard(next);
    setTurn('O');
    setTimeout(() => {
      const move = bestMove(next);
      if (move >= 0 && !getWinner(next)) {
        const after = [...next];
        after[move] = 'O';
        setBoard(after);
        setTurn('X');
      }
    }, 260);
  }
  useEffect(() => {
    if (!over) return;
    const result = winner || 'D';
    setScore((s) => ({ ...s, [result === 'X' ? 'X' : result === 'O' ? 'O' : 'D']: s[result === 'X' ? 'X' : result === 'O' ? 'O' : 'D'] + 1 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [over]);
  const reset = () => {
    setBoard(empty);
    setTurn('X');
  };
  return (
    <GameShell title="Tic-Tac-Toe" reset={reset} close={close}>
      <div className="status-row">
        <span>{winner ? `${winner} wins` : over ? 'A beautifully uneventful draw' : `Your turn · ${turn}`}</span>
        <span>YOU X · CPU O</span>
      </div>
      <div className="ttt-board">
        {board.map((cell, i) => (
          <button key={i} className={`ttt-cell ${cell ? 'ttt-cell--filled' : ''}`} onClick={() => play(i)} aria-label={`Square ${i + 1}${cell ? `, ${cell}` : ''}`}>
            {cell}
          </button>
        ))}
      </div>
      <div className="score-strip">
        <span>
          X <b>{score.X}</b>
        </span>
        <span>
          DRAWS <b>{score.D}</b>
        </span>
        <span>
          O <b>{score.O}</b>
        </span>
      </div>
    </GameShell>
  );
}
function getWinner(board: (string | null)[]) {
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for (const [a, b, c] of lines) if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  return null;
}
function bestMove(board: (string | null)[]) {
  const open = board.map((v, i) => (v ? -1 : i)).filter((i) => i >= 0);
  if (!open.length) return -1;
  for (const i of open) {
    const n = [...board];
    n[i] = 'O';
    if (getWinner(n) === 'O') return i;
  }
  for (const i of open) {
    const n = [...board];
    n[i] = 'X';
    if (getWinner(n) === 'X') return i;
  }
  return open.includes(4) ? 4 : open[Math.floor(Math.random() * open.length)];
}

function Minesweeper({ close }: { close: () => void }) {
  const rows = 9,
    cols = 9,
    mineCount = 10;
  const fresh = () => {
    const mines = new Set<number>();
    while (mines.size < mineCount) mines.add(Math.floor(Math.random() * rows * cols));
    return { mines, open: new Set<number>(), flags: new Set<number>() };
  };
  const [state, setState] = useState(fresh);
  const [flagMode, setFlagMode] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const lost = Array.from(state.open).some((i) => state.mines.has(i));
  const won = state.open.size >= rows * cols - mineCount && !lost;
  useEffect(() => {
    if (lost || won) return;
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [lost, won]);
  const around = (index: number) => {
    const r = Math.floor(index / cols),
      c = index % cols;
    return [-1, 0, 1]
      .flatMap((dr) => [-1, 0, 1].map((dc) => [r + dr, c + dc]))
      .filter(([nr, nc]) => nr >= 0 && nr < rows && nc >= 0 && nc < cols)
      .map(([nr, nc]) => nr * cols + nc);
  };
  const count = (i: number) => around(i).filter((n) => state.mines.has(n)).length;
  function reveal(i: number) {
    if (lost || won || state.flags.has(i)) return;
    const open = new Set(state.open);
    const visit = [i];
    while (visit.length) {
      const n = visit.pop()!;
      if (open.has(n) || state.mines.has(n)) continue;
      open.add(n);
      if (!count(n))
        around(n).forEach((x) => {
          if (!open.has(x) && !state.mines.has(x)) visit.push(x);
        });
    }
    setState({ ...state, open });
  }
  function toggleFlag(i: number) {
    if (state.open.has(i) || lost || won) return;
    const flags = new Set(state.flags);
    flags.has(i) ? flags.delete(i) : flags.add(i);
    setState({ ...state, flags });
  }
  const reset = () => {
    setState(fresh());
    setSeconds(0);
  };
  return (
    <GameShell title="Minesweeper" reset={reset} close={close}>
      <div className="status-row">
        <span>{lost ? 'Boom. The board has opinions.' : won ? 'Clean sweep. Very respectable.' : `${mineCount - state.flags.size} mines remaining`}</span>
        <span>
          <Clock3 size={14} /> {String(Math.floor(seconds / 60)).padStart(2, '0')}:{String(seconds % 60).padStart(2, '0')}
        </span>
      </div>
      <div className="mine-board">
        {Array.from({ length: rows * cols }, (_, i) => {
          const open = state.open.has(i),
            mine = state.mines.has(i);
          return (
            <button
              key={i}
              onClick={() => (flagMode ? toggleFlag(i) : reveal(i))}
              onContextMenu={(e) => {
                e.preventDefault();
                toggleFlag(i);
              }}
              className={`mine-cell ${open ? 'mine-cell--open' : ''} ${mine && lost ? 'mine-cell--mine' : ''}`}
              aria-label={`Cell ${i + 1}`}
            >
              {open ? (mine ? '✹' : count(i) || '') : state.flags.has(i) ? '⚑' : ''}
            </button>
          );
        })}
      </div>
      <div className="game-footer-actions">
        <GameButton secondary onClick={() => setFlagMode(!flagMode)}>
          {flagMode ? 'Flag mode on' : 'Flag mode off'}
        </GameButton>
        <span className="microcopy">Right-click a cell to flag · tap flag mode on mobile</span>
      </div>
    </GameShell>
  );
}

function Memory({ close }: { close: () => void }) {
  const symbols = ['✦', '☼', '◈', '♟', '☾', '✿', '✎', '♢'];
  const fresh = () => shuffle([...symbols, ...symbols]).map((symbol, id) => ({ id, symbol, flipped: false, matched: false }));
  const [cards, setCards] = useState(fresh);
  const [picked, setPicked] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  function pick(id: number) {
    if (picked.length === 2 || cards[id].flipped || cards[id].matched) return;
    const next = cards.map((c) => (c.id === id ? { ...c, flipped: true } : c));
    const pair = [...picked, id];
    setCards(next);
    setPicked(pair);
    if (pair.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = pair;
      if (next[a].symbol === next[b].symbol) {
        setCards(next.map((c) => (pair.includes(c.id) ? { ...c, matched: true } : c)));
        setPicked([]);
      } else
        setTimeout(() => {
          setCards(next.map((c) => (pair.includes(c.id) ? { ...c, flipped: false } : c)));
          setPicked([]);
        }, 650);
    }
  }
  return (
    <GameShell
      title="Memory"
      reset={() => {
        setCards(fresh());
        setPicked([]);
        setMoves(0);
      }}
      close={close}
    >
      <div className="status-row">
        <span>{cards.every((c) => c.matched) ? 'Every pair found. Your brain may rest.' : 'Find all eight pairs'}</span>
        <span>Moves · {moves}</span>
      </div>
      <div className="memory-board">
        {cards.map((c) => (
          <button key={c.id} className={`memory-card ${c.flipped || c.matched ? 'memory-card--flipped' : ''}`} onClick={() => pick(c.id)} aria-label="Memory card">
            {c.flipped || c.matched ? c.symbol : '?'}
          </button>
        ))}
      </div>
    </GameShell>
  );
}

function Wordle({ close }: { close: () => void }) {
  const answers = ['HOUSE', 'HALLS', 'GAMES', 'QUIET', 'BOARD', 'UNITY', 'TIGER', 'SPORT', 'CLOCK', 'MARCH', 'HANIS'];
  const [answer, setAnswer] = useState(() => answers[Math.floor(Math.random() * answers.length)]);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [message, setMessage] = useState('');
  const over = guesses.includes(answer) || guesses.length >= 6;
  function submit() {
    const guess = input.toUpperCase();
    if (guess.length !== 5) return setMessage('Five letters, please. The campus has standards.');
    if (!answers.includes(guess) && !['LIGHT', 'PAPER', 'MUSIC', 'PLACE', 'QUIET', 'STONE', 'TABLE', 'NORTH', 'SOUTH', 'ROUND'].includes(guess))
      return setMessage('That word is not in this tiny dictionary.');
    setGuesses((g) => [...g, guess]);
    setInput('');
    setMessage(guess === answer ? 'Solved. Zero academic credit, but still impressive.' : '');
  }
  const reset = () => {
    setAnswer(answers[Math.floor(Math.random() * answers.length)]);
    setGuesses([]);
    setInput('');
    setMessage('');
  };
  return (
    <GameShell title="Campus Wordle" reset={reset} close={close}>
      <div className="status-row">
        <span>{over ? (guesses.includes(answer) ? 'You got it.' : `The word was ${answer}.`) : `Guess ${guesses.length + 1} / 6`}</span>
        <span>Five letters only</span>
      </div>
      <div className="wordle-grid">
        {Array.from({ length: 6 }, (_, r) => (
          <div className="wordle-row" key={r}>
            {Array.from({ length: 5 }, (_, c) => {
              const word = guesses[r] || (r === guesses.length ? input : '');
              const letter = word[c] || '';
              const state = guesses[r] ? (letter === answer[c] ? 'correct' : answer.includes(letter) ? 'present' : 'absent') : '';
              return (
                <div key={c} className={`wordle-cell wordle-cell--${state}`}>
                  {letter}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="wordle-entry">
        <input
          value={input}
          maxLength={5}
          onChange={(e) => setInput(e.target.value.replace(/[^a-z]/gi, ''))}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="TYPE A GUESS"
          disabled={over}
          aria-label="Word guess"
        />
        <GameButton onClick={submit} disabled={over}>
          Guess
        </GameButton>
      </div>
      {message && <p className="game-message">{message}</p>}
    </GameShell>
  );
}

function TwentyFortyEight({ close }: { close: () => void }) {
  const start = () => {
    const b = Array(16).fill(0);
    b[Math.floor(Math.random() * 16)] = 2;
    let j = Math.floor(Math.random() * 16);
    while (b[j]) j = Math.floor(Math.random() * 16);
    b[j] = 2;
    return b;
  };
  const [board, setBoard] = useState(start);
  const [score, setScore] = useState(0);
  function move(dir: string) {
    const next = [...board];
    const lines = dir === 'left' || dir === 'right' ? [0, 1, 2, 3].map((r) => [r * 4, r * 4 + 1, r * 4 + 2, r * 4 + 3]) : [0, 1, 2, 3].map((c) => [c, c + 4, c + 8, c + 12]);
    let gained = 0;
    lines.forEach((line) => {
      if (dir === 'right' || dir === 'down') line.reverse();
      const values = line.map((i) => board[i]).filter(Boolean) as number[];
      for (let i = 0; i < values.length - 1; i++)
        if (values[i] === values[i + 1]) {
          values[i] *= 2;
          gained += values[i];
          values.splice(i + 1, 1);
        }
      values.push(...Array(4 - values.length).fill(0));
      line.forEach((idx, i) => (next[idx] = values[i]));
    });
    if (next.some((v, i) => v !== board[i])) {
      const open = next.map((v, i) => (v ? -1 : i)).filter((i) => i >= 0);
      if (open.length) next[open[Math.floor(Math.random() * open.length)]] = Math.random() > 0.9 ? 4 : 2;
      setBoard(next);
      setScore((s) => s + gained);
    }
  }
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const m: Record<string, string> = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down', a: 'left', d: 'right', w: 'up', s: 'down' };
      if (m[e.key]) {
        e.preventDefault();
        move(m[e.key]);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });
  return (
    <GameShell
      title="2048"
      reset={() => {
        setBoard(start());
        setScore(0);
      }}
      close={close}
    >
      <div className="status-row">
        <span>Use arrows or WASD</span>
        <span>Score · {score}</span>
      </div>
      <div className="twenty-board">
        {board.map((v, i) => (
          <div key={i} className={`twenty-tile tile-${v || 'empty'}`}>
            {v || ''}
          </div>
        ))}
      </div>
      <p className="microcopy centered">Merge the numbers. Avoid the existential dread.</p>
    </GameShell>
  );
}

function ConnectFour({ close }: { close: () => void }) {
  const fresh = () => Array(42).fill('');
  const [board, setBoard] = useState(fresh);
  const [turn, setTurn] = useState('R');
  const winner = connectWinner(board);
  const over = Boolean(winner) || board.every(Boolean);
  function drop(col: number) {
    if (over) return;
    const next = [...board];
    for (let r = 5; r >= 0; r--) {
      const i = r * 7 + col;
      if (!next[i]) {
        next[i] = turn;
        setBoard(next);
        setTurn(turn === 'R' ? 'B' : 'R');
        break;
      }
    }
  }
  return (
    <GameShell
      title="Connect Four"
      reset={() => {
        setBoard(fresh());
        setTurn('R');
      }}
      close={close}
    >
      <div className="status-row">
        <span>{winner ? `${winner === 'R' ? 'Brick' : 'Charcoal'} wins` : over ? 'A draw. Nobody has to chair the meeting.' : `${turn === 'R' ? 'Brick' : 'Charcoal'} to move`}</span>
        <span>Two players · local</span>
      </div>
      <div className="connect-board">
        {board.map((v, i) => (
          <button
            key={i}
            className={`connect-cell ${v === 'R' ? 'connect-cell--red' : v === 'B' ? 'connect-cell--dark' : ''}`}
            onClick={() => drop(i % 7)}
            aria-label={`Column ${(i % 7) + 1}, row ${Math.floor(i / 7) + 1}`}
          />
        ))}
      </div>
      <div className="connect-controls">
        {Array.from({ length: 7 }, (_, i) => (
          <button key={i} onClick={() => drop(i)} aria-label={`Drop in column ${i + 1}`}>
            <ChevronDown size={15} />
          </button>
        ))}
      </div>
    </GameShell>
  );
}
function connectWinner(b: string[]) {
  for (let r = 0; r < 6; r++)
    for (let c = 0; c < 7; c++) {
      const i = r * 7 + c;
      if (!b[i]) continue;
      for (const [dr, dc] of [
        [0, 1],
        [1, 0],
        [1, 1],
        [1, -1],
      ]) {
        const ids = [0, 1, 2, 3].map((n) => (r + dr * n) * 7 + c + dc * n);
        if (ids.every((x) => x >= 0 && x < 42 && b[x] === b[i])) return b[i];
      }
    }
  return null;
}

function Cards({ close }: { close: () => void }) {
  const [current, setCurrent] = useState(Math.floor(Math.random() * 13) + 1);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const [message, setMessage] = useState('Higher or lower?');
  function guess(choice: string) {
    const next = Math.floor(Math.random() * 13) + 1;
    const good = choice === 'higher' ? next > current : next < current;
    setMessage(good ? 'A point for you. The cards are feeling generous.' : 'The cards have spoken.');
    setStreak((s) => (good ? s + 1 : 0));
    setBest((b) => (good ? Math.max(b, streak + 1) : b));
    setCurrent(next);
  }
  return (
    <GameShell
      title="Cards"
      reset={() => {
        setCurrent(Math.floor(Math.random() * 13) + 1);
        setStreak(0);
        setMessage('Higher or lower?');
      }}
      close={close}
    >
      <div className="status-row">
        <span>Just cards. No money. Please relax.</span>
        <span>Best streak · {best}</span>
      </div>
      <div className="playing-card">
        <span className="card-corner">CURRENT</span>
        <strong>{current}</strong>
        <span className="card-suit">♢</span>
      </div>
      <p className="game-message centered">{message}</p>
      <div className="card-actions">
        <GameButton onClick={() => guess('higher')}>
          Higher <ChevronDown size={15} className="rotate-180" />
        </GameButton>
        <GameButton secondary onClick={() => guess('lower')}>
          Lower <ChevronDown />
        </GameButton>
      </div>
      <p className="score-strip centered">
        Current streak · <b>{streak}</b>
      </p>
    </GameShell>
  );
}

function Quiz({ close }: { close: () => void }) {
  const [questions, setQuestions] = useState(() => shuffle([...quizQuestions]).slice(0, 10));
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const current = questions[index];
  const done = index >= questions.length;
  function answer(i: number) {
    if (selected !== null) return;
    setSelected(i);
    if (i === current[2]) setScore((s) => s + 1);
  }
  function next() {
    setSelected(null);
    setIndex((i) => i + 1);
  }
  const reset = () => {
    setQuestions(shuffle([...quizQuestions]).slice(0, 10));
    setIndex(0);
    setScore(0);
    setSelected(null);
  };
  return (
    <GameShell title="The Chris Hani House Quiz" reset={reset} close={close}>
      {done ? (
        <div className="quiz-result">
          <span className="eyebrow">FINAL SCORE</span>
          <strong>{score} / 10</strong>
          <h4>{score === 10 ? 'HANI HISTORIAN' : score >= 8 ? 'HOUSE SCHOLAR' : score >= 5 ? 'KNOWLEDGEABLE RESIDENT' : score >= 3 ? 'FRESHMAN ENERGY' : 'PLEASE VISIT THE LIBRARY'}</h4>
          <p>
            {score === 10
              ? 'Okay, you clearly came prepared.'
              : score >= 8
                ? 'Very respectable. The archive approves.'
                : score >= 5
                  ? 'You know your way around.'
                  : score >= 3
                    ? 'There’s still time to learn.'
                    : 'We believe in you.'}
          </p>
          <GameButton onClick={reset}>Play again</GameButton>
        </div>
      ) : (
        <>
          <div className="quiz-progress">
            <span>Question {index + 1} / 10</span>
            <span>{score} correct</span>
          </div>
          <h4 className="quiz-question">{current[0]}</h4>
          <div className="quiz-answers">
            {(current[1] as unknown as string[]).map((option, i) => (
              <button
                key={option}
                disabled={selected !== null}
                className={`quiz-answer ${selected !== null && i === current[2] ? 'is-correct' : ''} ${selected === i && i !== current[2] ? 'is-wrong' : ''}`}
                onClick={() => answer(i)}
              >
                <span>{String.fromCharCode(65 + i)}</span>
                {option}
              </button>
            ))}
          </div>
          {selected !== null && (
            <div className="quiz-feedback">
              <strong>{selected === current[2] ? 'Correct.' : 'Not quite.'}</strong>
              <p>{current[3]}</p>
              <GameButton onClick={next}>
                {index === 9 ? 'See result' : 'Next question'} <ChevronRight size={15} />
              </GameButton>
            </div>
          )}
        </>
      )}
    </GameShell>
  );
}

function ArcadeGame({ id, close }: { id: GameId; close: () => void }) {
  if (id === 'tictactoe') return <TicTacToe close={close} />;
  if (id === 'minesweeper') return <Minesweeper close={close} />;
  if (id === 'memory') return <Memory close={close} />;
  if (id === 'wordle') return <Wordle close={close} />;
  if (id === '2048') return <TwentyFortyEight close={close} />;
  if (id === 'connect') return <ConnectFour close={close} />;
  if (id === 'cards') return <Cards close={close} />;
  if (id === 'quiz') return <Quiz close={close} />;
  return (
    <GameShell title={id === 'snake' ? 'Snake' : id === 'chess' ? 'Chess' : 'Ludo'} reset={close} close={close}>
      <div className="coming-game">
        <span className="game-icon">{id === 'snake' ? '≈' : id === 'chess' ? '♞' : '●'}</span>
        <h4>{id === 'snake' ? 'Snake is taking a short nap.' : id === 'chess' ? 'Chess is currently arranging its pieces.' : 'Ludo is looking for the dice.'}</h4>
        <p>This little cabinet is being kept deliberately quiet for now. Try one of the games below instead.</p>
        <GameButton onClick={close}>Back to arcade</GameButton>
      </div>
    </GameShell>
  );
}

function CampaignEndedPage() {
  const [category, setCategory] = useState<Category>('all');
  const [active, setActive] = useState<GameId | null>(null);
  const filtered = useMemo(() => games.filter((g) => category === 'all' || g.category === category), [category]);
  const activeGame = games.find((g) => g.id === active);

  return (
    <div className="chh-arcade">
      <main>
        <section className="hero section-frame">
          <div className="hero__aside">
            <span className="stamp">
              EST. 2026
              <br />
              HOUSE INTERNET
            </span>
            <Sticker src={stickers.hero} alt="Pixel art Adventure Time sticker" className="sticker--hero" />
          </div>
          <div className="hero__copy">
            <p className="eyebrow">POST-ELECTION ARCHIVE · SYSTEM STATUS: RETIRED</p>
            <h1>
              VOTING
              <br />
              <em>CLOSED</em> <span>✓</span>
            </h1>
            <p className="hero__lead">Wel... there&apos;s nothing to see here.</p>
            <p className="hero__body">
              The 2026 Chris Hani House elections are officially closed.
              <br />
              The campaign site has officially retired.
            </p>
            <p className="hero__aside-copy">But since you&apos;re already here...</p>
            <a className="hero__cta" href="#arcade">
              WANT TO PLAY A GAME? <ArrowDown size={17} />
            </a>
          </div>
          <div className="hero__footer">
            <span>CAMPAIGN MODE: DISABLED</span>
            <span>ARCADE MODE: ENABLED</span>
            <span>SCROLL DOWN ↓</span>
          </div>
        </section>

        <section className="retirement section-frame">
          <div className="retirement__note">
            <span className="eyebrow">A QUIET CLOSURE</span>
            <h2>
              The posters are down.
              <br />
              The spreadsheets are closed.
            </h2>
            <p>The campaign site has officially clocked out. Fortunately, the internet is still here.</p>
            <div className="retirement__status">
              <span>NO LONGER CAMPAIGNING</span>
              <span>NOW ACCEPTING PLAYERS</span>
            </div>
          </div>
          <Sticker src={stickers.transition} alt="Pixel art Adventure Time character sticker" className="sticker--transition" />
        </section>

        <section id="arcade" className="arcade section-frame">
          <div className="arcade__intro">
            <div>
              <p className="eyebrow">HOUSE INTERNET · ARCHIVE 01</p>
              <h2>
                Welcome to the completely unnecessary <em>post-election arcade.</em>
              </h2>
              <p>Voting is over. The posters are down. You might as well play something.</p>
            </div>
            <div className="arcade__mascot">
              <Sticker src={stickers.fox} alt="Pixel art fox arcade supervisor sticker" className="sticker--fox" />
              <span>
                ARCADE
                <br />
                SUPERVISOR
              </span>
            </div>
          </div>
          <div className="arcade__toolbar">
            <div className="filters" aria-label="Game categories">
              {(['all', 'classics', 'quick', 'knowledge'] as Category[]).map((filter) => (
                <button key={filter} className={category === filter ? 'is-active' : ''} onClick={() => setCategory(filter)}>
                  {filter === 'all' ? 'All' : filter === 'quick' ? 'Quick games' : filter}
                </button>
              ))}
            </div>
            <span className="game-count">{filtered.length} cabinets open</span>
          </div>
          <div className="game-grid">
            {filtered.map((game) => (
              <button className={`game-card ${active === game.id ? 'is-selected' : ''}`} key={game.id} onClick={() => setActive(game.id)}>
                <span className="game-card__number">
                  {game.label} / {game.category}
                </span>
                <span className="game-card__icon">{game.icon}</span>
                <h3>{game.title}</h3>
                <p>{game.description}</p>
                <span className="game-card__play">
                  Play <ChevronRight size={16} />
                </span>
              </button>
            ))}
          </div>
          {activeGame && <ArcadeGame id={activeGame.id} close={() => setActive(null)} />}
          <div className="scores">
            <div>
              <p className="eyebrow">LOCAL ONLY</p>
              <h3>Your scores</h3>
            </div>
            <p>
              No scores yet.
              <br />
              <span>You have work to do.</span>
            </p>
            <div className="score-dots">
              <i />
              <i />
              <i />
              <i />
            </div>
          </div>
        </section>

        <section className="interlude section-frame">
          <span className="eyebrow">THE ARCHIVE CONTINUES</span>
          <h2>
            Play something silly.
            <br />
            <em>Learn something true.</em>
          </h2>
          <p>The internet remains. It has been given a small table and several games.</p>
          <div className="interlude__line">
            <span>01 — RECREATION</span>
            <span>02 — MEMORY</span>
            <span>03 — A LITTLE HISTORY</span>
          </div>
        </section>

        <section className="farewell section-frame">
          <Sticker src={stickers.cat} alt="Pixel art cat sticker" className="sticker--cat" />
          <div>
            <p className="eyebrow">END OF TRANSMISSION</p>
            <h2>
              Okay, you can
              <br />
              <em>leave now.</em>
            </h2>
            <p>Thanks for stopping by.</p>
            <p>
              Whatever happens next,
              <br />
              keep building.
            </p>
          </div>
          <div className="farewell__mark">✦</div>
        </section>

        <footer>
          <span>© 2026 Ayolela Vena · Chris Hani House</span>
          <span>Campaign mode: retired.</span>
        </footer>
      </main>
    </div>
  );
}
