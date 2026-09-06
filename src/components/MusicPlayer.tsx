import { useEffect, useRef, useState } from "react";

/**
 * Update this list with your own tracks + artist credits.
 * Files should live in /public/music/ and be referenced with a leading slash.
 *
 * NOTE: If these files fail to load in production, consider renaming them
 * to simple names like "21-savage-a-lot.mp3" to avoid URL encoding issues.
 */
const TRACKS = [
  {
    title: "a lot",
    artist: "21 Savage ft. J. Cole",
    src: "/music/21 Savage - a lot (Official Video) ft. J. Cole [DmWWqogr_r8].mp3",
  },
  {
    title: "The Winner Takes It All",
    artist: "ABBA",
    src: "/music/ABBA - The Winner Takes It All [92cwKCU8Z5c].mp3",
  },
  {
    title: "Dance Now",
    artist: "JID, Kenny Mason",
    src: "/music/JID, Kenny Mason - Dance Now (Official Video) [EVlGLtCnN-Y].mp3",
  },
  {
    title: "Chicago",
    artist: "Michael Jackson",
    src: "/music/Michael Jackson - Chicago (Official Audio) [Y_8mUx4VOmo].mp3",
  },
  {
    title: "Click Song (Qongqothwane)",
    artist: "Miriam Makeba",
    src: "/music/Miriam Makeba - Click Song (Qongqothwane) (Live) [vhgb60Qsjrs].mp3",
  },
  {
    title: "PUNK B_TCH",
    artist: "PARTYOF2, Jadagrace, SWIM",
    src: "/music/PARTYOF2, Jadagrace, SWIM - PUNK B_TCH (OFFICIAL VIDEO) [Ve4EeGrewvY].mp3",
  },
  {
    title: "The Scythe",
    artist: "The Scythe Presents ft. Denzel Curry, TiaCorine & FERG",
    src: "/music/The Scythe Presents_ The Scythe ft. Denzel Curry, TiaCorine & FERG [gLUj9Qrl_I8].mp3",
  },
  {
    title: "Da Wizard_Boston (Interlude)",
    artist: "Travis Scott",
    src: "/music/Travis Scott – Da Wizard_Boston (Interlude) [from JackBoys 2 Deluxe] [v_UjVpsGDZk].mp3",
  },
  {
    title: "Thought I Was Dead",
    artist: "Tyler, The Creator",
    src: "/music/Tyler, The Creator - Thought I Was Dead (Letra_Legendado) [0CJB4WhN7g0].mp3",
  },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds <= 0) return "--:--";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playlist] = useState(() => shuffle(TRACKS));
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [duration, setDuration] = useState(0);
  const collapseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const current = playlist[trackIndex];

  // Attempt to start playback; if the browser blocks it, wait for the
  // first user interaction anywhere on the page and retry then.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const attemptPlay = () => {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          const onFirstInteract = () => {
            audio.play().then(() => setIsPlaying(true)).catch(() => {});
            document.removeEventListener("pointerdown", onFirstInteract);
            document.removeEventListener("keydown", onFirstInteract);
          };
          document.addEventListener("pointerdown", onFirstInteract, { once: true });
          document.addEventListener("keydown", onFirstInteract, { once: true });
        });
    };

    attemptPlay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackIndex]);

  // Show the expanded pill whenever a track actually starts, then
  // auto-collapse to just the record icon after ~4s.
  useEffect(() => {
    if (!isPlaying) return;
    setExpanded(true);
    if (collapseTimer.current) clearTimeout(collapseTimer.current);
    collapseTimer.current = setTimeout(() => setExpanded(false), 4000);
    return () => {
      if (collapseTimer.current) clearTimeout(collapseTimer.current);
    };
  }, [isPlaying, trackIndex]);

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current?.duration ?? 0);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setTrackIndex((i) => (i + 1) % playlist.length);
  };

  // 🆕 FIX: If a track fails to load (404, CORS, etc.), skip to the next one
  const handleAudioError = () => {
    console.warn(`Failed to load track: ${current.title}. Skipping to next.`);
    setIsPlaying(false);
    setTrackIndex((i) => (i + 1) % playlist.length);
  };

  const togglePill = () => setExpanded((e) => !e);

  if (playlist.length === 0) return null;

  return (
    <div className="fixed left-4 top-4 z-50">
      <audio
        ref={audioRef}
        src={current.src}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onError={handleAudioError} // 🆕 Added error handler
      />
      <button
        onClick={togglePill}
        aria-label={expanded ? "Collapse now-playing" : "Expand now-playing"}
        className={`flex items-center gap-3 overflow-hidden border-2 border-foreground bg-card text-foreground shadow-[4px_4px_0_0_var(--color-foreground)] transition-all duration-300 ${
          expanded ? "w-64 rounded-full px-3 py-2" : "h-11 w-11 rounded-full p-0"
        }`}
      >
        <span
          className={`relative inline-flex shrink-0 items-center justify-center rounded-full bg-foreground text-background ${
            expanded ? "h-7 w-7" : "h-11 w-11"
          }`}
        >
          <span
            className={`block rounded-full border-2 border-background/70 ${
              expanded ? "h-4 w-4" : "h-6 w-6"
            } ${isPlaying ? "animate-spin" : ""}`}
            style={{ animationDuration: "3s" }}
          />
          <span className="absolute h-1 w-1 rounded-full bg-background/90" />
        </span>
        {expanded && (
          <span className="min-w-0 flex-1 text-left">
            <span className="block truncate text-xs font-bold uppercase tracking-wide">
              {current.title}
            </span>
            <span className="block truncate text-[0.65rem] text-muted-foreground">
              {current.artist} · {formatTime(duration)}
            </span>
          </span>
        )}
      </button>
    </div>
  );
}