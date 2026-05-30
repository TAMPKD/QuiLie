// ─────────────────── QuiLie Landing ───────────────────
// Light, Stripe/Notion-style focused landing.

const { useState, useEffect, useRef, useMemo } = React;

/* ───── Icons ───── */
function Arrow({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function DroidIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 9.5h12V18a2 2 0 0 1-2 2h-1v2h-2v-2h-2v2H9v-2H8a2 2 0 0 1-2-2V9.5zM4 10a1.5 1.5 0 0 1 3 0v6a1.5 1.5 0 0 1-3 0v-6zm13 0a1.5 1.5 0 0 1 3 0v6a1.5 1.5 0 0 1-3 0v-6zM7.5 8.4a5.5 5.5 0 0 1 9 0zM9 5.5l-.9-1.6a.4.4 0 0 1 .7-.4l.9 1.6m4.6 0 .9-1.6a.4.4 0 0 1 .7.4l-.9 1.6" />
    </svg>
  );
}
function AppleIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 1.5c0 1.3-.5 2.5-1.3 3.4-1 1-2.2 1.6-3.4 1.5-.1-1.3.5-2.5 1.3-3.4.9-.9 2.3-1.6 3.4-1.5zM20 17.6c-.5 1-.7 1.5-1.3 2.4-.9 1.3-2.2 3-3.7 3-1.4 0-1.7-.9-3.6-.9s-2.3.9-3.6.9c-1.6 0-2.8-1.5-3.7-2.8C2 17.4 1.6 13 3.2 10.4c1.1-1.8 2.9-2.9 4.6-2.9 1.8 0 2.9 1 4.3 1 1.4 0 2.2-1 4.3-1 1.5 0 3.2.9 4.3 2.4-3.7 2-3.1 7.3-.7 7.7z" />
    </svg>
  );
}
function LeafIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19.2 2.96c1.4 9.3-2 14.94-8.2 17.04Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6" />
    </svg>
  );
}
function SparkIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.94 14.06 2 22M14.06 9.94 22 2M14 4l1 3 3 1-3 1-1 3-1-3-3-1 3-1zM5 13l.7 2.3L8 16l-2.3.7L5 19l-.7-2.3L2 16l2.3-.7z" />
    </svg>
  );
}
function ChatIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

/* ───── Atmosphere ───── */
function useTilt(intensity = 5) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      const rx = (px - 0.5) * intensity;
      const ry = (py - 0.5) * -intensity;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--rx', `${rx}deg`);
        el.style.setProperty('--ry', `${ry}deg`);
      });
    };
    const onLeave = () => {
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
    };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, [intensity]);
  return ref;
}

function Petals({ count = 12, palette = 'hero' }) {
  const colors = palette === 'hero'
    ? ['var(--lavender)', 'var(--purple-soft)', 'var(--mint-soft)', 'oklch(0.94 0.04 320)']
    : ['var(--purple-soft)', 'var(--mint-soft)'];
  const items = useMemo(() => (
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      dx: (Math.random() - 0.5) * 80,
      s: 4 + Math.random() * 8,
      dur: 14 + Math.random() * 14,
      delay: -Math.random() * 18,
      o: 0.18 + Math.random() * 0.35,
      c: colors[i % colors.length],
    }))
  ), [count, palette]);
  return (
    <div className="petals" aria-hidden="true">
      {items.map(p => (
        <span key={p.id} className="petal" style={{
          '--x': `${p.x}%`,
          '--dx': `${p.dx}px`,
          '--s': `${p.s}px`,
          '--dur': `${p.dur}s`,
          '--delay': `${p.delay}s`,
          '--o': p.o,
          '--c': p.c,
          animationDelay: `${p.delay}s`,
        }} />
      ))}
    </div>
  );
}

function AmbientLight() {
  // Two soft orbs that follow the cursor with damping for a video-like glow.
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const target = useRef({ x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0, y: 200 });
  const pos1 = useRef({ x: target.current.x, y: target.current.y });
  const pos2 = useRef({ x: target.current.x, y: target.current.y });
  useEffect(() => {
    const onMove = (e) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };
    window.addEventListener('mousemove', onMove);
    let raf;
    const loop = () => {
      pos1.current.x += (target.current.x - pos1.current.x) * 0.06;
      pos1.current.y += (target.current.y - pos1.current.y) * 0.06;
      pos2.current.x += (target.current.x - pos2.current.x) * 0.025;
      pos2.current.y += (target.current.y - pos2.current.y) * 0.025;
      if (ref1.current) ref1.current.style.transform =
        `translate3d(${pos1.current.x - 260}px, ${pos1.current.y - 260}px, 0)`;
      if (ref2.current) ref2.current.style.transform =
        `translate3d(${pos2.current.x - 180}px, ${pos2.current.y - 180}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <React.Fragment>
      <div ref={ref1} className="ambient" aria-hidden="true"></div>
      <div ref={ref2} className="ambient mint" aria-hidden="true"></div>
    </React.Fragment>
  );
}

function ScrollProgress() {
  const ref = useRef(null);
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      if (ref.current) ref.current.style.width = `${pct}%`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className="scroll-progress" aria-hidden="true">
      <div ref={ref} className="bar"></div>
    </div>
  );
}

/* ───── Nav ───── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <header className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-inner">
        <a href="#" className="brand">
          <span className="brand-mark"><img src="assets/quilie-logo.png" alt="QuiLie" /></span>
          <span>QuiLie</span>
        </a>
        <nav className="nav-links">
          <a href="#story">How it works</a>
          <a href="#masks">Masks</a>
          <a href="#trees">Levels</a>
          <a href="#download">Download</a>
        </nav>
        <div className="nav-cta">
          <a className="btn btn-ghost" href="https://app.quilie.life" target="_blank" rel="noopener noreferrer">Open Web App</a>
          <a className="btn btn-primary" href="https://github.com/TAMPKD/QuiLie/releases/download/v1.0.0/QuiLieV1.apk">
            Download APK
            <Arrow />
          </a>
        </div>
      </div>
    </header>
  );
}

/* ───── Hero ───── */
function Hero() {
  return (
    <section className="hero">
      <div className="hero-aurora"></div>
      <div className="hero-watercolor"></div>
      <div className="hero-watercolor left"></div>
      <Petals count={14} palette="hero" />

      <div className="container hero-inner">
        <div className="hero-copy">
          <div className="eyebrow purple reveal in"><span className="dot"></span>An emotional authenticity app</div>
          <h1 className="hero-title reveal in" style={{ '--d': '0.05s' }}>
            <span className="line">Drop the mask.</span>
            <span className="line live">Become who you really are.</span>
          </h1>
          <p className="hero-sub reveal in" style={{ '--d': '0.18s' }}>
            QuiLie is a calm, private space to notice the masks you wear —
            and shed them, a little more yourself each day. Two minutes a day. One
            truer version of you.
          </p>
          <div className="hero-ctas reveal in" style={{ '--d': '0.28s' }}>
            <a className="btn btn-primary btn-lg" href="https://github.com/TAMPKD/QuiLie/releases/download/v1.0.0/QuiLieV1.apk">
              <DroidIcon size={16} />
              Download APK
              <span className="meta">v1.0 · ~150 MB</span>
            </a>
            <a className="btn btn-ghost btn-lg" href="https://app.quilie.life" target="_blank" rel="noopener noreferrer">
              <AppleIcon size={16} />
              Open Web App
              <span className="meta">iOS · No install</span>
            </a>
          </div>

          <TodayWidget />
        </div>

        <div className="hero-phone-wrap reveal in" style={{ '--d': '0.15s' }}>
          <div className="hero-phone">
            <img src="assets/screen-home.jpg" alt="QuiLie home screen with watercolor mask portrait and authenticity score" />
          </div>

          <div className="hero-chip streak">
            <div className="glyph"><LeafIcon size={16} /></div>
            <div>
              <strong>21‑day streak</strong>
              <div><small>+1% authentic today</small></div>
            </div>
          </div>

          <div className="hero-chip coach">
            <div className="glyph"><ChatIcon size={16} /></div>
            <p>"You traded one uncomfortable sentence for an uncomfortable evening."</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───── Sticky scroll story ───── */
const STORY_STEPS = [
  {
    key: 'notice',
    eyebrow: 'Step 01 · Notice',
    title: 'Catch yourself in the moment of the mask.',
    body: 'A small chime, a quick tap. Open QuiLie the second you catch yourself performing — laughing at the joke that hurt, agreeing for peace, hiding behind "I\'m fine."',
    quote: '"I said yes when I meant later."',
    cite: 'Logged Tuesday · 6:53pm',
    img: 'assets/screen-home.jpg',
    tint: 'oklch(0.92 0.04 295)',
  },
  {
    key: 'reflect',
    eyebrow: 'Step 02 · Reflect',
    title: 'One calm sentence back. Never a lecture.',
    body: 'Your AI coach reads what you logged and reflects one quiet observation. Pick a tone — gentle, direct, or a little dry. It feels like a mirror you can trust, not a tracker.',
    quote: '"What would the real you have sounded like, if it were safe to say?"',
    cite: 'From your coach',
    img: 'reflect',
    tint: 'oklch(0.93 0.04 165)',
  },
  {
    key: 'grow',
    eyebrow: 'Step 03 · Grow',
    title: 'Visible proof that you\'re becoming yourself.',
    body: 'Every real moment you log brightens your mask, extends your streak, and grows the sapling on your Growth screen. The transformation isn\'t abstract — you can watch it.',
    quote: '"You\'ve grown 1% more authentic in 1 day."',
    cite: 'Day 21 · Level 2 · Aware',
    img: 'assets/screen-growth.jpg',
    tint: 'oklch(0.93 0.05 165)',
  },
];

function StorySection() {
  const stepRefs = useRef([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      // pick the entry closest to the middle that is intersecting
      let best = null;
      entries.forEach(e => {
        if (e.isIntersecting) {
          if (!best || Math.abs(e.intersectionRatio - 1) < Math.abs(best.intersectionRatio - 1)) {
            best = e;
          }
        }
      });
      if (best) {
        const idx = Number(best.target.dataset.idx);
        setActive(idx);
      }
    }, { threshold: [0.3, 0.5, 0.7], rootMargin: '-30% 0px -30% 0px' });

    stepRefs.current.forEach(el => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="section story-section" id="story">
      <div className="container">
        <div className="sec-head reveal">
          <div className="eyebrow"><span className="dot"></span>How it works</div>
          <h2>Notice. Reflect. <em>Grow.</em></h2>
          <p>
            The whole app is built around one calm loop. No streak guilt. No
            infinite feed. Just a small, kind ritual that, done daily, changes
            how you show up.
          </p>

          <div className="story-rhythm" aria-hidden="true">
            {STORY_STEPS.map((s, i) => (
              <div
                key={s.key}
                className={`node ${i === active ? 'active' : (i < active ? 'done' : '')}`}
              >
                <span className="dot">{String(i + 1).padStart(2, '0')}</span>
                <span className="label">{s.key.charAt(0).toUpperCase() + s.key.slice(1)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="story">
          <div className="story-text">
            {STORY_STEPS.map((s, i) => (
              <div
                key={s.key}
                ref={el => (stepRefs.current[i] = el)}
                data-idx={i}
                className="story-step"
              >
                <span className="numeral">{['I', 'II', 'III'][i]}</span>
                <div className={`eyebrow ${i === 0 ? 'purple' : ''}`}>
                  <span className="dot"></span>{s.eyebrow}
                </div>
                <h3>{s.title.split(' ').map((w, j) => (
                  /grow|honest|yourself|honesty|mirror/i.test(w)
                    ? <em key={j}>{w} </em>
                    : <span key={j}>{w} </span>
                ))}</h3>
                <p>{s.body}</p>
                <StoryProp kind={s.key} />
                <blockquote className="quote">
                  {s.quote}
                  <cite>{s.cite}</cite>
                </blockquote>
              </div>
            ))}
          </div>

          <div className="story-sticky">
            <div className="story-stage">
              <div className="story-bg-tint" style={{
                background: STORY_STEPS[active].tint,
                opacity: 0.7,
              }}></div>

              <div className="story-phone">
                {STORY_STEPS.map((s, i) => (
                  <PhoneScreen key={s.key} step={s} active={i === active} />
                ))}
              </div>

              <div className="story-caption">
                {String(active + 1).padStart(2, '0')} / 03 — {STORY_STEPS[active].key.toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TodayWidget() {
  const tiltRef = useTilt(6);

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long' });
  const monthDay = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const todayIdx = now.getDay();

  const trend = [4, 6, 5, 9, 7, 10, 11];
  const max = Math.max(...trend);
  const days = trend.map((v, i) => {
    const dayOffset = 6 - i;
    const idx = (todayIdx - dayOffset + 7) % 7;
    const isToday = i === 6;
    return {
      v, lbl: dayNames[idx],
      h: `${Math.max(8, (v / max) * 100)}%`,
      isToday,
    };
  });

  // Ring: 11% of 251 (2*PI*40)
  const ringPct = 11;
  const ringOff = 251 - (251 * ringPct / 100);

  return (
    <div className="reveal in" style={{ '--d': '0.4s' }}>
      <div ref={tiltRef} className="today-widget">
        <div className="tw-head">
          <span className="date">{dateStr}<span className="day">· {monthDay}</span></span>
          <span className="live">Live</span>
        </div>

        <div className="tw-hero">
          <div className="tw-ring">
            <svg viewBox="0 0 90 90">
              <defs>
                <linearGradient id="twRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="oklch(0.66 0.1 165)" />
                  <stop offset="55%" stopColor="oklch(0.55 0.18 295)" />
                  <stop offset="100%" stopColor="oklch(0.42 0.2 295)" />
                </linearGradient>
              </defs>
              <circle className="track" cx="45" cy="45" r="40" />
              <circle className="fill" cx="45" cy="45" r="40" style={{ '--off': ringOff }} />
            </svg>
            <div className="center">Today</div>
          </div>
          <div className="info">
            <span className="label">Authenticity</span>
            <span className="big">11<span className="pct">%</span></span>
            <span className="sub">
              <span className="arrow-up">↑</span>
              +1% vs yesterday
            </span>
          </div>
        </div>

        <div className="tw-stats">
          <div className="stat">
            <span className="label">
              <span className="ico">🔥</span>
              Streak
            </span>
            <span className="v">21<small>days</small></span>
          </div>
          <div className="stat">
            <span className="label purple">
              <span className="ico">★</span>
              Level
            </span>
            <span className="v">02<small>· Aware</small></span>
          </div>
        </div>

        <div className="tw-trend">
          <div className="row">
            <span className="l">7-day trend</span>
            <span className="delta">+38% this month</span>
          </div>
          <div className="tw-chart">
            {days.map((d, i) => (
              <div key={i} className={`day ${d.isToday ? 'today' : ''}`}>
                <div className="bar-wrap">
                  <div className="bar" style={{ height: d.h }}></div>
                </div>
                <div className="lbl">{d.lbl}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="tw-foot">
          <span className="left">
            <span className="pip">Q</span>
            <span>Tap to log a moment</span>
          </span>
          <span className="right">Open →</span>
        </div>
      </div>
    </div>
  );
}

function StoryProp({ kind }) {
  if (kind === 'notice')  return <NoticeProp />;
  if (kind === 'reflect') return <ReflectProp />;
  if (kind === 'grow')    return <GrowProp />;
  return null;
}

function NoticeProp() {
  const tiltRef = useTilt(5);
  return (
    <div ref={tiltRef} className="story-prop notice">
      <div className="prop-head">
        <div className="prop-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </svg>
        </div>
        <div>
          <div className="prop-title">A moment from today</div>
          <div className="prop-sub">Tap once · 60 seconds</div>
        </div>
      </div>
      <div className="prop-body">
        <div className="prop-log-pill">
          <span>＋  Log a moment</span>
          <span className="kbd">⌘ N</span>
        </div>
        <div className="prop-tags" style={{ marginTop: 12 }}>
          <span className="prop-tag on">people-pleasing</span>
          <span className="prop-tag">avoiding conflict</span>
          <span className="prop-tag">wore a mask</span>
          <span className="prop-tag">+ add</span>
        </div>
      </div>
    </div>
  );
}

/* Interactive coach card with tone selector */
const COACH_TONES = [
  {
    key: 'gentle', label: 'Gentle',
    jsx: <React.Fragment>What would <em>the real you</em> have sounded like, if it were safe to say?</React.Fragment>,
  },
  {
    key: 'direct', label: 'Direct',
    jsx: <React.Fragment>You said yes. You meant later. What were you <em>protecting</em>?</React.Fragment>,
  },
  {
    key: 'dry', label: 'Dry',
    jsx: <React.Fragment>Congrats on the dinner you didn't want. Want a <em>different sentence</em> next time?</React.Fragment>,
  },
];

function ReflectProp() {
  const tiltRef = useTilt(5);
  const [tone, setTone] = useState('gentle');
  const [swap, setSwap] = useState(false);
  const current = COACH_TONES.find(t => t.key === tone) || COACH_TONES[0];

  const changeTone = (key) => {
    if (key === tone) return;
    setSwap(true);
    setTimeout(() => {
      setTone(key);
      setSwap(false);
    }, 260);
  };

  return (
    <div ref={tiltRef} className="story-prop reflect">
      <div className="prop-head">
        <div className="prop-icon">
          <ChatIcon size={18} />
        </div>
        <div>
          <div className="prop-title">A reflection from your coach</div>
          <div className="prop-sub">Pick a tone · Try them all</div>
        </div>
      </div>
      <div className="prop-tones" role="radiogroup" aria-label="Coach tone">
        {COACH_TONES.map(t => (
          <button
            key={t.key}
            className={`prop-tone ${t.key === tone ? 'active' : ''}`}
            data-tone={t.key}
            onClick={() => changeTone(t.key)}
            type="button"
          >
            <span className="swatch"></span>
            {t.label}
          </button>
        ))}
      </div>
      <div className={`prop-coach ${swap ? 'swapping' : ''}`}>
        <span className="who">Coach · {current.label}</span>
        {swap ? (
          <span className="typing"><span></span><span></span><span></span></span>
        ) : (
          <span>{current.jsx}</span>
        )}
      </div>
    </div>
  );
}

function useCountUp(target, duration = 1400, trigger = true) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(target * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, trigger]);
  return value;
}

function GrowProp() {
  const tiltRef = useTilt(5);
  const rootRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      });
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const pct = useCountUp(1.0, 1400, visible);
  const streak = useCountUp(21, 1200, visible);
  const xp = useCountUp(2840, 1600, visible);

  const setRefs = (node) => {
    rootRef.current = node;
    tiltRef.current = node;
  };

  // XP ring: 2840 / 4400 = ~64.5%
  const xpPct = (xp / 4400) * 100;
  const xpRingOff = 251 - (251 * xpPct / 100);

  return (
    <div ref={setRefs} className="grow-widget">
      <div className="gw-head">
        <span className="date">Growth</span>
        <span className="badge">Day {Math.round(streak)}</span>
      </div>

      <div className="gw-hero">
        <div className="gw-ring">
          <svg viewBox="0 0 90 90">
            <defs>
              <linearGradient id="gwRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="oklch(0.66 0.1 165)" />
                <stop offset="100%" stopColor="oklch(0.55 0.18 295)" />
              </linearGradient>
            </defs>
            <circle className="track" cx="45" cy="45" r="40" />
            <circle className="fill" cx="45" cy="45" r="40" style={{ '--off': xpRingOff }} />
          </svg>
          <img src="assets/trees/tree-2-aware.png" alt="" className="gw-sapling" />
        </div>
        <div className="info">
          <span className="label">Today</span>
          <span className="big">
            <em>{pct.toFixed(1)}%</em>
            <span className="suf">more you</span>
          </span>
          <span className="sub">
            <span className="arrow-up">↑</span>
            +1.0% vs yesterday
          </span>
        </div>
      </div>

      <div className="gw-stats">
        <div className="stat">
          <span className="label">
            <span className="ico mint">L</span>
            Level
          </span>
          <span className="v">02<small>Aware</small></span>
        </div>
        <div className="stat">
          <span className="label">
            <span className="ico">🔥</span>
            Streak
          </span>
          <span className="v">{Math.round(streak)}<small>days</small></span>
        </div>
      </div>

      <div className="gw-xp">
        <div className="xp-row">
          <span className="l">XP to Level 03</span>
          <span className="v">{Math.round(xp).toLocaleString()}<span className="den"> / 4,400</span></span>
        </div>
        <div className="xp-bar"><div className="fill" style={{ width: `${xpPct}%` }}></div></div>
      </div>

      <div className="gw-streak">
        <div className="l">Week unmasked</div>
        <div className="cells">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className={`cell ${i < 6 ? 'on' : ''} ${i === 5 ? 'today' : ''}`}>
              <span>{['M','T','W','T','F','S','S'][i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PhoneScreen({ step, active }) {
  // Real screenshot screens
  if (step.img === 'assets/screen-home.jpg' || step.img === 'assets/screen-growth.jpg') {
    return (
      <img
        src={step.img}
        alt={`QuiLie ${step.key} screen`}
        className={active ? 'active' : ''}
      />
    );
  }
  // Reflect screen — built in HTML to match app style
  return (
    <div
      className={`active`}
      style={{
        position: 'absolute', inset: 0,
        opacity: active ? 1 : 0,
        transition: 'opacity .6s ease',
        background: 'oklch(0.975 0.008 85)',
        display: 'flex', flexDirection: 'column',
        fontFamily: 'var(--sans)',
        padding: '32px 18px 14px',
      }}
    >
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        fontSize: 11, color: 'var(--ink-3)', fontFamily: 'var(--mono)',
        letterSpacing: '0.06em', marginBottom: 14,
      }}>
        <span>6:53</span>
        <span>REFLECT</span>
        <span>29%</span>
      </div>

      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 14, color: 'var(--ink-3)', marginBottom: 4 }}>Your coach</div>
        <div style={{
          fontSize: 22, fontWeight: 700, lineHeight: 1.15,
          letterSpacing: '-0.02em', color: 'var(--ink)',
        }}>
          A small <em style={{
            fontFamily: 'var(--serif)', fontStyle: 'italic', fontWeight: 400,
            color: 'var(--purple)',
          }}>real</em> thing.
        </div>
      </div>

      <div style={{
        alignSelf: 'flex-end', maxWidth: '85%',
        background: 'var(--purple)', color: 'white',
        padding: '10px 14px', borderRadius: '16px 16px 4px 16px',
        fontSize: 13, marginBottom: 10, lineHeight: 1.4,
      }}>
        Agreed to dinner I didn't want. Again.
      </div>

      <div style={{
        alignSelf: 'flex-start', maxWidth: '90%',
        background: 'white', border: '1px solid var(--line)',
        padding: '12px 14px', borderRadius: '16px 16px 16px 4px',
        fontSize: 13, marginBottom: 10, lineHeight: 1.45, color: 'var(--ink)',
        boxShadow: '0 2px 6px oklch(0.55 0.18 295 / 0.06)',
      }}>
        You traded one uncomfortable sentence for an uncomfortable evening. What was the sentence?
      </div>

      <div style={{
        alignSelf: 'flex-end', maxWidth: '85%',
        background: 'var(--purple)', color: 'white',
        padding: '10px 14px', borderRadius: '16px 16px 4px 16px',
        fontSize: 13, marginBottom: 10, lineHeight: 1.4,
      }}>
        "I'm exhausted, can we Sunday?"
      </div>

      <div style={{
        alignSelf: 'flex-start', maxWidth: '90%',
        background: 'white', border: '1px solid var(--line)',
        padding: '12px 14px', borderRadius: '16px 16px 16px 4px',
        fontSize: 13, lineHeight: 1.45, color: 'var(--ink)',
        boxShadow: '0 2px 6px oklch(0.55 0.18 295 / 0.06)',
      }}>
        Try it next time, <em style={{ color: 'var(--purple)', fontStyle: 'italic', fontFamily: 'var(--serif)' }}>before</em> it costs you the night.
      </div>

      <div style={{
        marginTop: 'auto',
        background: 'white', border: '1px solid var(--line)',
        padding: '10px 14px', borderRadius: 999,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontSize: 12, color: 'var(--ink-3)',
        boxShadow: '0 2px 6px oklch(0.55 0.18 295 / 0.04)',
      }}>
        <span>Reply to your coach…</span>
        <span style={{
          width: 28, height: 28, borderRadius: '50%',
          background: 'var(--purple)', color: 'white',
          display: 'grid', placeItems: 'center', fontSize: 14,
        }}>↑</span>
      </div>

      {/* Tab bar */}
      <div style={{
        marginTop: 14, paddingTop: 10, borderTop: '1px solid var(--line-soft)',
        display: 'flex', justifyContent: 'space-around',
        fontFamily: 'var(--sans)', fontSize: 10, color: 'var(--ink-3)',
      }}>
        <span>Home</span>
        <span style={{ color: 'var(--purple)', fontWeight: 600 }}>● Reflect</span>
        <span>Journal</span>
        <span>Insights</span>
        <span>Growth</span>
      </div>
    </div>
  );
}

/* ───── Masks gallery ───── */
const MASKS = [
  {
    key: 'perfectionist',
    name: 'The Perfectionist',
    short: 'Perfectionist',
    tag: 'Hidden behind the mask',
    sig: '“It’s not done yet.”',
    desc: 'You polish until the moment is gone. You’d rather not show up than show up half‑formed.',
    img: 'assets/masks/perfectionist.png',
  },
  {
    key: 'people-pleaser',
    name: 'The People‑Pleaser',
    short: 'People‑Pleaser',
    tag: 'Yes is the safe answer',
    sig: '“Whatever you want.”',
    desc: 'You’d rather agree to a dinner you didn’t want than risk a moment of friction.',
    img: 'assets/masks/people-pleaser.png',
  },
  {
    key: 'overachiever',
    name: 'The Overachiever',
    short: 'Overachiever',
    tag: 'Worth, measured in output',
    sig: '“I’m fine — just busy.”',
    desc: 'You stack accomplishments like armor. Resting feels like a small failure.',
    img: 'assets/masks/overachiever.png',
  },
  {
    key: 'comedian',
    name: 'The Comedian',
    short: 'Comedian',
    tag: 'Laughter as a shield',
    sig: '“Just kidding!”',
    desc: 'You turn the hard moment into a joke before anyone can see your face change.',
    img: 'assets/masks/comedian.png',
  },
  {
    key: 'invisible',
    name: 'The Invisible One',
    short: 'Invisible One',
    tag: 'Smaller is safer',
    sig: '“It’s nothing.”',
    desc: 'You shrink in rooms. You’d rather be unseen than seen wrongly.',
    img: 'assets/masks/invisible-one.png',
  },
];

function MasksSection() {
  const [idx, setIdx] = useState(0);
  const [swap, setSwap] = useState(false);
  const current = MASKS[idx];

  const choose = (i) => {
    if (i === idx) return;
    setSwap(true);
    setTimeout(() => {
      setIdx(i);
      setSwap(false);
    }, 300);
  };

  // Auto-cycle when user hasn’t interacted yet
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setSwap(true);
      setTimeout(() => {
        setIdx(i => (i + 1) % MASKS.length);
        setSwap(false);
      }, 300);
    }, 5200);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <section className="masks-section" id="masks">
      <div className="container">
        <div className="sec-head reveal">
          <div className="eyebrow purple"><span className="dot"></span>Recognize yourself?</div>
          <h2>Five masks. <em>One you, underneath.</em></h2>
          <p>
            Most of us wear two or three. QuiLie helps you name which mask
            shows up where — the first step in choosing, gently, to set it down.
          </p>
        </div>

        <div className="masks-stage reveal" onMouseEnter={() => setPaused(true)}>
          <div className="mask-featured">
            <div className="badge">Featured · <b>{String(idx + 1).padStart(2,'0')} / 05</b></div>
            <div className="portrait">
              <img
                src={current.img}
                alt={current.name}
                className={swap ? 'swap-out' : ''}
              />
            </div>
          </div>

          <div className={`mask-info ${swap ? 'swap' : ''}`}>
            <span className="tag">{current.tag}</span>
            <h3>{current.name.split(' ').map((w, j) => (
              j === 1 ? <em key={j}>{w}</em> : <span key={j}>{w} </span>
            ))}</h3>
            <p className="sig">{current.sig}</p>
            <p className="desc">{current.desc}</p>

            <div className="mask-chips" style={{ marginTop: 24 }}>
              {MASKS.map((m, i) => (
                <button
                  key={m.key}
                  className={`mask-chip-btn ${i === idx ? 'active' : ''}`}
                  onClick={() => { setPaused(true); choose(i); }}
                  aria-label={m.name}
                  type="button"
                >
                  <img src={m.img} alt="" />
                  <span className="label">{m.short}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───── Tree journey ───── */
const TREES = [
  { key: 'hidden',  num: '01', name: 'Hidden',  img: 'assets/trees/tree-1-hidden.png',  desc: 'A single shoot, half‑buried. Day one. You’ve named the mask — nothing more yet, and nothing less.' },
  { key: 'aware',   num: '02', name: 'Aware',   img: 'assets/trees/tree-2-aware.png',   desc: 'Leaves. Real ones. You can feel the moment of the mask before you put it on. That’s the whole game.' },
  { key: 'open',    num: '03', name: 'Open',    img: 'assets/trees/tree-3-open.png',    desc: 'The trunk has shape now. A few real sentences have been said out loud, in actual rooms. The body remembers.' },
  { key: 'genuine', num: '04', name: 'Genuine', img: 'assets/trees/tree-4-genuine.png', desc: 'A full canopy. You’re catching the mask before it lands. People notice you “seem different,” and they’re right.' },
  { key: 'honest',  num: '05', name: 'Honest',  img: 'assets/trees/tree-5-honest.png',  desc: 'Roots, deep ones. Being your real self is no longer a brave act. It’s just the default sentence.' },
  { key: 'free',    num: '06', name: 'Free',    img: 'assets/trees/tree-6-free.png',    desc: 'The mask is something you used to wear. You can still see it on a shelf — and you don’t reach for it.' },
  { key: 'true',    num: '07', name: 'True',    img: 'assets/trees/tree-7-true.png',    desc: 'You. Whole. Old‑growth. Other people meet you and know exactly who they met.' },
];

function TreesSection() {
  const [idx, setIdx] = useState(1); // start at "Aware" (matches the in-app default)
  const [swap, setSwap] = useState(false);
  const current = TREES[idx];

  const choose = (i) => {
    if (i === idx) return;
    setSwap(true);
    setTimeout(() => {
      setIdx(i);
      setSwap(false);
    }, 300);
  };

  return (
    <section className="trees-section" id="trees">
      <div className="container">
        <div className="sec-head reveal">
          <div className="eyebrow"><span className="dot"></span>Your level path</div>
          <h2>Seven seasons of <em>becoming.</em></h2>
          <p>
            Your private tree is the long view. It only grows when you do —
            slowly, watercolor by watercolor, from a hidden shoot to old‑growth.
          </p>
        </div>

        <div className="trees-stage reveal">
          <div className="tree-featured">
            <div className="tree-image">
              <img
                src={current.img}
                alt={`Tree at level ${current.num} — ${current.name}`}
                className={swap ? 'swap-out' : ''}
              />
            </div>
            <div className={`tree-info ${swap ? 'swap' : ''}`}>
              <span className="tag">Level {current.num} of 07</span>
              <div className="level-row">
                <span className="level-num">{current.num}</span>
                <h3>{current.name}</h3>
              </div>
              <p className="desc">{current.desc}</p>
            </div>
          </div>

          <div className="tree-path">
            <div className="track">
              {TREES.map((t, i) => (
                <button
                  key={t.key}
                  type="button"
                  className={`tree-node ${i === idx ? 'active' : ''} ${i > idx ? 'locked' : ''}`}
                  onClick={() => choose(i)}
                  onMouseEnter={() => choose(i)}
                >
                  <div className="thumb"><img src={t.img} alt="" /></div>
                  <span className="num">L{t.num}</span>
                  <span className="name">{t.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───── Pillars ───── */
function PillarsSection() {
  return (
    <section className="pillars-section" id="pillars">
      <div className="container">
        <div className="sec-head reveal">
          <div className="eyebrow purple"><span className="dot"></span>What you get</div>
          <h2>Small surface. <em>Real change.</em></h2>
          <p>
            No infinite scroll, no notifications, no streak shaming. Three tools
            that compound when you use them daily.
          </p>
        </div>

        <div className="pillars reveal">
          <div className="pillar p1">
            <div className="glyph"><ChatIcon size={20} /></div>
            <h4>An AI coach that listens first.</h4>
            <p>Calm, specific reflections — never a lecture. Choose gentle, direct, or a little dry.</p>
            <div className="tag">Reflect tab</div>
          </div>
          <div className="pillar p2">
            <div className="glyph"><LeafIcon size={20} /></div>
            <h4>Growth you can actually see.</h4>
            <p>Your mask brightens, your sapling grows, your level path lights up — every day you show up as you.</p>
            <div className="tag">Growth tab</div>
          </div>
          <div className="pillar p3">
            <div className="glyph"><SparkIcon size={20} /></div>
            <h4>A private journal of your truth.</h4>
            <p>Every log lands in a searchable journal. Tag entries real or mask — patterns surface themselves.</p>
            <div className="tag">Journal &amp; Insights</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───── Download ───── */
function DownloadSection() {
  return (
    <section className="dl-section" id="download">
      <div className="container">
        <div className="eyebrow purple dl-eyebrow reveal"><span className="dot"></span>Get on Android or open in any browser</div>
        <h2 className="dl-title reveal" style={{ '--d': '0.05s' }}>
          Get QuiLie. <em>Get real.</em>
        </h2>
        <p className="dl-sub reveal" style={{ '--d': '0.15s' }}>
          Android users get the direct APK — no Play Store needed.
          iOS &amp; everyone else, the full QuiLie experience runs in your browser.
        </p>

        <div className="dl-cards reveal" style={{ '--d': '0.2s' }}>
          <div className="dl-card primary">
            <div className="platform">
              <DroidIcon size={32} />
              <div>
                <div className="name">Android</div>
                <div className="what">Direct APK · v1.0</div>
              </div>
            </div>
            <p className="desc">
              Sideload the latest build directly. No Play Store. Updates ship through the app.
            </p>
            <div className="specs">
              <span>~150 MB</span>
              <span>Android 9+</span>
              <span>Signed</span>
            </div>
            <a
              className="dl-btn"
              href="https://github.com/TAMPKD/QuiLie/releases/download/v1.0.0/QuiLieV1.apk"
            >
              <span>Download APK</span>
              <span className="arrow"><Arrow /></span>
            </a>
          </div>

          <div className="dl-card">
            <div className="platform">
              <AppleIcon size={32} />
              <div>
                <div className="name">iOS &amp; everything else</div>
                <div className="what">Web App · No install</div>
              </div>
            </div>
            <p className="desc">
              No iOS build yet — open the full experience in your browser. Add to Home Screen for an app-like launch.
            </p>
            <div className="specs">
              <span>Works offline</span>
              <span>Safari / Chrome</span>
              <span>PWA</span>
            </div>
            <a
              className="dl-btn"
              href="https://app.quilie.life"
              target="_blank" rel="noopener noreferrer"
            >
              <span>Open Web App</span>
              <span className="arrow"><Arrow /></span>
            </a>
          </div>
        </div>

        <div className="dl-note reveal" style={{ '--d': '0.28s' }}>
          PRIVACY‑FIRST · <b>Your logs stay on your device unless you opt in to sync.</b>
        </div>
      </div>
    </section>
  );
}

/* ───── Doc Modal ───── */
const DocsCtx = React.createContext(() => {});

function DocModal({ docKey, onClose }) {
  const doc = docKey ? window.QUILIE_DOCS?.[docKey] : null;
  const [open, setOpen] = useState(false);
  const [openItems, setOpenItems] = useState({});

  useEffect(() => {
    if (!docKey) { setOpen(false); return; }
    // Mount → animate in next tick
    const t = setTimeout(() => setOpen(true), 20);
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [docKey, onClose]);

  if (!docKey || !doc) return null;

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Parse plain body into section blocks separated by ALL CAPS HEADINGS
  const renderBody = () => {
    if (doc.sections) {
      return doc.sections.map((s, i) => (
        <div key={i} className="faq-section">
          <h4 className="faq-heading">{s.heading}</h4>
          {s.items.map(([q, a], j) => {
            const key = `${i}-${j}`;
            const isOpen = openItems[key];
            return (
              <div key={key} className={`faq-item ${isOpen ? 'open' : ''}`}>
                <button
                  type="button" className="faq-q"
                  onClick={() => setOpenItems(o => ({ ...o, [key]: !o[key] }))}
                >
                  <span>{q}</span>
                  <span className="caret">＋</span>
                </button>
                <div className="faq-a"><p style={{ margin: 0 }}>{a}</p></div>
              </div>
            );
          })}
        </div>
      ));
    }
    // Split plain text into sections
    const blocks = doc.body.split(/\n\s*\n/);
    return blocks.map((b, i) => {
      const lines = b.split('\n');
      const head = lines[0];
      const isHead = /^[A-Z0-9 &‑‐\-]+$/.test(head) && head.length < 80;
      const headTxt = isHead ? head : null;
      const rest = isHead ? lines.slice(1) : lines;
      return (
        <div key={i} className="doc-section">
          {headTxt && <h3>{headTxt}</h3>}
          {rest.map((ln, j) => {
            if (ln.trim().startsWith('•')) {
              return <div key={j} className="bullet">{ln.replace(/^•\s*/, '')}</div>;
            }
            if (/^\(\w\)/.test(ln.trim())) {
              return <div key={j} className="bullet">{ln.trim()}</div>;
            }
            return <p key={j}>{ln}</p>;
          })}
        </div>
      );
    });
  };

  return (
    <div
      className={`modal-backdrop ${open ? 'open' : ''}`}
      onClick={handleBackdrop}
      role="dialog" aria-modal="true" aria-labelledby="modal-title"
    >
      <div className="modal">
        <div className="modal-head">
          <div>
            <div className="meta">
              <span className="dot"></span>
              <span>QuiLie</span>
              <span>Updated {doc.updated}</span>
            </div>
            <h2 id="modal-title">{doc.title}</h2>
            <p className="tagline">{doc.tagline}</p>
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="modal-body">{renderBody()}</div>
      </div>
    </div>
  );
}

/* ───── Footer ───── */
function Footer() {
  const openDoc = React.useContext(DocsCtx);
  return (
    <footer className="foot">
      <div className="container">
        <div className="foot-grid">
          <div className="foot-col">
            <a href="#" className="brand">
              <span className="brand-mark"><img src="assets/quilie-logo.png" alt="QuiLie" /></span>
              <span>QuiLie</span>
            </a>
            <p>An emotional authenticity practice. Built quietly, for people tired of performing.</p>
          </div>
          <div className="foot-col">
            <h5>Product</h5>
            <a href="#story">How it works</a>
            <a href="#masks">Masks</a>
            <a href="#trees">Levels</a>
            <a href="#download">Download</a>
          </div>
          <div className="foot-col">
            <h5>Support</h5>
            <a onClick={() => openDoc('faq')}>Help &amp; FAQ</a>
            <a href="mailto:hello@quilie.life">Contact</a>
            <a href="https://app.quilie.life" target="_blank" rel="noopener noreferrer">Web App</a>
          </div>
          <div className="foot-col">
            <h5>Legal</h5>
            <a onClick={() => openDoc('privacy')}>Privacy Policy</a>
            <a onClick={() => openDoc('terms')}>Terms of Service</a>
            <a onClick={() => openDoc('refund')}>Refund Policy</a>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© 2026 QUILIE · ALL RIGHTS RESERVED</span>
          <span className="tag">Drop the mask. Become who you really are.</span>
          <span>HELLO@QUILIE.LIFE</span>
        </div>
      </div>
    </footer>
  );
}

/* ───── App ───── */
function App() {
  const [docKey, setDocKey] = useState(null);
  const openDoc = (k) => setDocKey(k);
  const closeDoc = () => setDocKey(null);

  useEffect(() => {
    const els = document.querySelectorAll('.reveal:not(.in)');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <DocsCtx.Provider value={openDoc}>
      <ScrollProgress />
      <AmbientLight />
      <Nav />
      <main>
        <Hero />
        <StorySection />
        <MasksSection />
        <TreesSection />
        <PillarsSection />
        <DownloadSection />
      </main>
      <Footer />
      <DocModal docKey={docKey} onClose={closeDoc} />
    </DocsCtx.Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
