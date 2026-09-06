import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import posterAsset from "@/assets/ayo-poster.png";

const POSTER_URL = posterAsset;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vote Ayo — Ayolela Vena for House Secretary & Treasurer" },
      {
        name: "description",
        content:
          "Ayolela Vena — candidate for House Secretary & Treasurer of Chris Hani Residence, Rhodes University. 80.13% academic average. Service. Accountability. Integrity.",
      },
      { property: "og:title", content: "Vote Ayo — Ayolela Vena" },
      {
        property: "og:description",
        content:
          "Service. Accountability. Integrity. Earning your trust through action — Chris Hani Residence, Rhodes University.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CampaignPage,
});

/* ---------- Scroll reveal + count-up hooks ---------- */

function useInView<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, inView };
}

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal ${inView ? "reveal-visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

function CountUp({
  to,
  decimals = 0,
  suffix = "",
  prefix = "",
  duration = 1600,
}: {
  to: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(to * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);
  return (
    <span ref={ref}>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/* ---------- Data ---------- */

const STATS: Array<{
  value: number;
  decimals?: number;
  suffix: string;
  prefix?: string;
  label: string;
}> = [
  { value: 80.13, decimals: 2, suffix: "%", label: "Weighted Academic Average" },
  { value: 10, suffix: "%", prefix: "Top ", label: "Of Cohort, Rhodes University" },
  { value: 2, suffix: "nd", label: "Nationally — FNB DataQuest 2026" },
  { value: 30, suffix: "%", prefix: "+", label: "Avg. Grade Boost as Maths Tutor" },
];

const PILLARS = [
  {
    numeral: "I",
    title: "Service",
    body: "Leadership isn't being the loudest in the room — it's the unseen work that keeps the house running. Every meeting attended, every birthday card delivered before 09h00, every resident checked in on.",
  },
  {
    numeral: "II",
    title: "Accountability",
    body: "Every rand accounted for. Receipts managed within one week. Financial reports at every House Meeting. Mistakes owned and fixed — never hidden.",
  },
  {
    numeral: "III",
    title: "Integrity",
    body: "A name built on service, accountability and integrity was entrusted to this residence by Chris Hani's own family. That legacy is honoured through action, not slogans.",
  },
];

const CALIBERS = [
  {
    tag: "Academics",
    title: "Triple-Major Scholar",
    body: "Penultimate-year BSc — Computer Science, Statistics & Information Systems, with multiple distinctions across his coursework.",
  },
  {
    tag: "Competition",
    title: "2nd Nationally — FNB DataQuest 2026",
    body: "Built a fairness-audited credit scoring model on real-world financial data. R10,000 prize and a guaranteed FNB Future League interview.",
  },
  {
    tag: "Industry",
    title: "Junior Systems Administrator — ABSA",
    body: "Server infrastructure, access management, security updates — and author of compliance checklists and Standard Operating Procedures.",
  },
  {
    tag: "Leadership",
    title: "Treasurer & Vice Chair — RU Rifle Club",
    body: "Currently managing real budgets, real money and real accountability. Proven systems — not learning on the job.",
  },
  {
    tag: "Certification",
    title: "Document Control Certified",
    body: "Diplomas in Advanced C# and SQL Server. Certified in Document Control & Structured Information Architecture — minutes that are accurate, filed and retrievable.",
  },
  {
    tag: "Community",
    title: "Academic Tutor — Nine Tenths",
    body: "Mentoring matric students in Mathematics, lifting grades by an average of 30%. Service already practised, not promised.",
  },
];

const QA = [
  {
    q: "Who is Ayolela Vena?",
    a: "A second-year BSc student triple-majoring in Computer Science, Statistics and Information Systems — 80.13% average, top 10% of cohort, 2nd nationally in FNB DataQuest 2026. By day: Junior Systems Administrator at ABSA. By commitment: Treasurer & Vice Chair of the Rifle Club and a maths tutor. You may know me as the quiet one in the common room — the one doing the unseen work.",
  },
  {
    q: "Why is he running?",
    a: "Because a House Committee seat is not a title — it's a year of showing up. Meetings, meal tables, notice boards every three days, isolated students encouraged back in. Ayo is running to do that work reliably, and to honour the legacy of the name this residence carries.",
  },
  {
    q: "Can he handle both Secretary AND Treasurer?",
    a: "The combination means total administrative and financial oversight — exactly his skill set. Certified Document Control for the minutes and records; strong Accounting background and Rifle Club treasury experience for the money. Both sides of the role are already proven in practice.",
  },
  {
    q: "How will the money be handled?",
    a: "100% financial transparency. Accounts available to the House Committee at all times, a finance report at every House Meeting, receipts reconciled within one week, and a tuckshop that is stocked, fairly priced and profitable — with profits benefiting residents.",
  },
  {
    q: "Will he have time alongside his studies?",
    a: "He already balances a triple major at a top-10% average with national competitions, industry work, club leadership and tutoring. He commits to communicating early if pressure builds — and his academic record is proof he knows how to sacrifice.",
  },
  {
    q: "What will he do differently?",
    a: "Better communication, better financial management, better support for first-years — and systems that outlast his term. Not promises of perfection: promises of improvement, backed by data and documented process.",
  },
  {
    q: "What does Chris Hani mean to him?",
    a: "It's personal. Chris Hani didn't just talk about change — he worked for it. Ayo wants to bring that same spirit to the residence: not just talking about what the house should be, but doing the work to get there.",
  },
];

const COMMITMENTS = [
  "Show up — every meeting, every event, every time",
  "Minutes distributed within one week — accurate and error-free",
  "Birthday cards delivered before 09h00",
  "Financial report at every House Meeting",
  "Tuckshop stocked, fairly priced, fully reconciled",
  "Exam snacks and events fully budgeted and funded",
  "One hour a week minimum in the common room",
  "Isolated students identified and actively encouraged",
];

/* ---------- Page ---------- */

function Marquee() {
  const items = Array.from({ length: 6 });
  return (
    <div className="overflow-hidden border-y-2 border-foreground bg-primary py-2 text-primary-foreground">
      <div className="animate-marquee flex w-max whitespace-nowrap">
        {[0, 1].map((half) => (
          <div key={half} className="flex" aria-hidden={half === 1}>
            {items.map((_, i) => (
              <span key={i} className="kicker flex items-center text-sm">
                <span className="px-6">Vote Ayo</span>
                <span className="animate-star">★</span>
                <span className="px-6">Service · Accountability · Integrity</span>
                <span className="animate-star">★</span>
                <span className="px-6">Chris Hani Residence</span>
                <span className="animate-star">★</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function CampaignPage() {
  const [openQ, setOpenQ] = useState<number | null>(0);

  return (
    <div className="paper-grain min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b-2 border-foreground px-4 py-3 sm:px-8">
        <span className="kicker text-xs">Chris Hani Residence — Rhodes University</span>
        <span className="kicker hidden text-xs text-primary sm:block">
          2027 Campaign
        </span>
      </header>

      {/* Hero */}
      <section className="halftone relative overflow-hidden border-b-2 border-foreground">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:py-20">
          <div>
            <Reveal>
              <p className="kicker mb-4 text-sm text-primary">
                House Secretary &amp; Treasurer — Combined Portfolio
              </p>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="headline text-[clamp(4rem,14vw,10rem)] text-foreground">
                AYO
                <span className="block bg-primary px-3 text-primary-foreground">
                  2027
                </span>
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-6 max-w-md text-lg font-medium leading-relaxed">
                <span className="font-bold">Ayolela Vena.</span> Brotherhood built
                on trust. Leadership built on action.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#why"
                  className="headline border-2 border-foreground bg-foreground px-8 py-4 text-xl text-background shadow-[6px_6px_0_0_var(--color-primary)] transition-transform duration-200 hover:-translate-y-1"
                >
                  Why Ayo?
                </a>
                <a
                  href="#qa"
                  className="headline border-2 border-foreground bg-background px-8 py-4 text-xl text-foreground transition-colors duration-200 hover:bg-primary hover:text-primary-foreground"
                >
                  Ask Him Anything
                </a>
              </div>
            </Reveal>
            <Reveal delay={400}>
              <p className="kicker mt-10 text-xs">
                Service <span className="text-primary">★</span> Accountability{" "}
                <span className="text-primary">★</span> Integrity
              </p>
            </Reveal>
          </div>
          <Reveal delay={200} className="relative">
            <div className="animate-stamp absolute -left-3 -top-3 z-10 border-4 border-primary px-4 py-2">
              <span className="headline text-2xl text-primary">Vote</span>
            </div>
            <img
              src={POSTER_URL}
              alt="Official campaign poster — Ayolela Vena for House Secretary and Treasurer, Chris Hani Residence"
              className="w-full border-2 border-foreground object-cover shadow-[10px_10px_0_0_var(--color-foreground)]"
              loading="eager"
            />
          </Reveal>
        </div>
      </section>

      <Marquee />

      {/* Stats */}
      <section className="border-b-2 border-foreground bg-secondary text-secondary-foreground">
        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x-2 divide-secondary-foreground/20 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <div key={i} className="halftone-red px-6 py-10 text-center">
              <div className="headline text-4xl text-primary-foreground sm:text-5xl">
                <CountUp
                  to={s.value}
                  decimals={s.decimals ?? 0}
                  suffix={s.suffix}
                  prefix={s.prefix ?? ""}
                />
              </div>
              <p className="kicker mt-3 text-[0.65rem] opacity-80">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pillars */}
      <section id="why" className="border-b-2 border-foreground">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-8">
          <Reveal>
            <p className="kicker text-sm text-primary">The Platform</p>
            <h2 className="headline mt-2 text-5xl sm:text-7xl">
              Three Words.<span className="text-primary"> One Standard.</span>
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {PILLARS.map((p, i) => (
              <Reveal key={p.numeral} delay={i * 120}>
                <article className="group h-full border-2 border-foreground bg-card p-8 transition-all duration-200 hover:-translate-y-1 hover:shadow-[8px_8px_0_0_var(--color-primary)]">
                  <span className="headline text-5xl text-primary">
                    {p.numeral}
                  </span>
                  <h3 className="headline mt-4 text-3xl">{p.title}</h3>
                  <p className="mt-4 leading-relaxed text-muted-foreground">
                    {p.body}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Calibers */}
      <section className="halftone border-b-2 border-foreground bg-muted">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-8">
          <Reveal>
            <p className="kicker text-sm text-primary">The Calibers</p>
            <h2 className="headline mt-2 text-5xl sm:text-7xl">
              Proven On <span className="text-primary">Paper.</span>
              <span className="block">Proven In Practice.</span>
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-px border-2 border-foreground bg-foreground sm:grid-cols-2 lg:grid-cols-3">
            {CALIBERS.map((c, i) => (
              <Reveal key={c.tag} delay={i * 80}>
                <article className="h-full bg-card p-7">
                  <span className="kicker inline-block border border-primary px-2 py-1 text-[0.6rem] text-primary">
                    {c.tag}
                  </span>
                  <h3 className="mt-4 font-condensed text-2xl font-bold uppercase leading-tight tracking-wide">
                    {c.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {c.body}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Q&A */}
      <section id="qa" className="border-b-2 border-foreground">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-8">
          <Reveal>
            <p className="kicker text-sm text-primary">Open Floor</p>
            <h2 className="headline mt-2 text-5xl sm:text-7xl">
              Questions.<span className="text-primary"> Answered.</span>
            </h2>
          </Reveal>
          <div className="mt-12 divide-y-2 divide-foreground border-2 border-foreground bg-card">
            {QA.map((item, i) => {
              const open = openQ === i;
              return (
                <div key={i}>
                  <button
                    onClick={() => setOpenQ(open ? null : i)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-muted"
                  >
                    <span className="font-condensed text-xl font-bold uppercase tracking-wide sm:text-2xl">
                      {item.q}
                    </span>
                    <span
                      className={`headline shrink-0 text-2xl text-primary transition-transform duration-300 ${open ? "rotate-45" : ""}`}
                    >
                      +
                    </span>
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                  >
                    <div className="overflow-hidden">
                      <p className="border-l-4 border-primary px-6 pb-6 leading-relaxed text-muted-foreground">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Commitments */}
      <section className="halftone-red border-b-2 border-foreground bg-primary text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-8">
          <Reveal>
            <h2 className="headline text-5xl sm:text-7xl">The Contract</h2>
            <p className="kicker mt-3 text-sm opacity-90">
              Not promises — commitments, in writing
            </p>
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {COMMITMENTS.map((c, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="flex items-start gap-4 border-2 border-primary-foreground/40 p-5">
                  <span className="headline text-xl">★</span>
                  <p className="font-condensed text-lg font-semibold uppercase tracking-wide">
                    {c}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="halftone">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-8">
          <Reveal>
            <p className="kicker text-sm text-primary">
              "This isn't just a speech. This is a commitment."
            </p>
            <h2 className="headline mt-6 text-[clamp(3rem,10vw,7rem)]">
              Vote <span className="bg-foreground px-4 text-background">AYO</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
              Secretary &amp; Treasurer — Chris Hani Residence. Give him the chance
              to earn your trust through action. He won't let you down.
            </p>
          </Reveal>
        </div>
      </section>

      <Marquee />

      <footer className="flex flex-col items-center gap-2 px-4 py-8 text-center">
        <p className="kicker text-xs">
          Ayolela Vena <span className="text-primary">★</span> Chris Hani Residence{" "}
          <span className="text-primary">★</span> Rhodes University
        </p>
        <p className="text-xs text-muted-foreground">
          Service. Accountability. Integrity. — 2027 Campaign
        </p>
      </footer>
    </div>
  );
}