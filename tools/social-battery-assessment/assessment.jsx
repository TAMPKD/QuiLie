// ─────────────── QuiLie — Social Battery Leak Assessment ───────────────
// Standalone tool. Same no-build-step pattern as app.jsx: plain React 18
// UMD + Babel-standalone, no bundler, no router. Mounted independently
// from the main App() tree — intentionally has no <Nav>/<Footer>.

const { useState, useEffect, useRef, useMemo } = React;

/* ═══════════ Content layer (questions, scoring, archetypes) ═══════════ */

const AXES = {
  somatic:   { key: 'somatic',   label: 'Somatic Tension',  short: 'Somatic' },
  cognitive: { key: 'cognitive', label: 'Cognitive Load',   short: 'Cognitive' },
  recovery:  { key: 'recovery',  label: 'Recovery Debt',    short: 'Recovery' },
};

// 9 scored questions, 3 per axis. Weights: 1 / 3 / 5 (or 2 where original
// PRD used a finer-grained option). See content-spec.md for full rationale.
const QUESTIONS = [
  {
    id: 's1', axis: 'somatic',
    q: "On a video call or in an open office, what's actually happening in your body?",
    options: [
      { label: 'Relaxed — I move and sit naturally.', w: 1 },
      { label: 'A little stiff, but it fades once the meeting ends.', w: 3 },
      { label: 'Jaw clenched, breath shallow, constantly adjusting my posture or eye contact.', w: 5 },
    ],
  },
  {
    id: 's2', axis: 'somatic',
    q: 'After a full day of meetings or customer-facing work, what does your face feel like?',
    options: [
      { label: "Normal — I don't really notice my face.", w: 1 },
      { label: 'A bit tired, like I smiled more than usual.', w: 3 },
      { label: "Sore — like I've been holding an expression for hours and forgot to stop.", w: 5 },
    ],
  },
  {
    id: 's3', axis: 'somatic',
    q: "Do people ever say you 'sound different' at work vs. with close friends?",
    options: [
      { label: 'No — my voice and energy are the same everywhere.', w: 1 },
      { label: 'Maybe slightly more upbeat or formal at work.', w: 2 },
      { label: 'Yes, often — people say I sound like a different person, and I know they\'re right.', w: 5 },
    ],
  },
  {
    id: 'c1', axis: 'cognitive',
    q: 'Before a routine meeting or work social moment, do you prep?',
    options: [
      { label: 'No, I just show up and talk naturally.', w: 1 },
      { label: "I review notes so I don't look unprepared.", w: 2 },
      { label: 'I script small talk, rehearse expressions, or plan how to seem "approachable."', w: 5 },
    ],
  },
  {
    id: 'c2', axis: 'cognitive',
    q: 'How much does your personality shift between your private self and your work self?',
    options: [
      { label: "Barely at all — I'm the same person everywhere.", w: 1 },
      { label: 'A little — I filter some opinions to stay professional.', w: 3 },
      { label: 'Drastically — I switch on an "always-on" character that feels foreign to who I actually am.', w: 5 },
    ],
  },
  {
    id: 'c3', axis: 'cognitive',
    q: 'Going from a work conversation straight into a personal one — how does that transition feel?',
    options: [
      { label: "Seamless, I don't think about it.", w: 1 },
      { label: 'I need a beat to "reset" but it\'s quick.', w: 3 },
      { label: 'Genuinely disorienting, like mentally changing costumes.', w: 5 },
    ],
  },
  {
    id: 'r1', axis: 'recovery',
    q: "When your workday ends, what's your immediate routine?",
    options: [
      { label: 'I switch gears easily and see people right away.', w: 1 },
      { label: 'I need about 30 minutes alone, phone-scrolling, to transition.', w: 3 },
      { label: 'I sit in silence for over an hour before I can speak to anyone.', w: 5 },
    ],
  },
  {
    id: 'r2', axis: 'recovery',
    q: 'How do your weekend social plans actually go?',
    options: [
      { label: 'I look forward to them all week.', w: 1 },
      { label: 'I go, but I balance it with downtime.', w: 3 },
      { label: 'I regularly cancel plans I wanted to attend because the week drained me to zero.', w: 5 },
    ],
  },
  {
    id: 'r3', axis: 'recovery',
    q: 'Compare this month to 6 months ago: is your weekend recovery time getting longer, shorter, or the same?',
    options: [
      { label: 'Shorter or the same — I bounce back at least as fast as before.', w: 1 },
      { label: "A little longer, but not dramatically.", w: 3 },
      { label: 'Noticeably longer — it now takes most of the weekend just to feel human again.', w: 5 },
    ],
  },
];

// Unscored flavor question — feeds the result-page social-proof callout
// only, never the Masking Index. See content-spec.md item 2.
const TWIST_QUESTION = {
  id: 'twist',
  q: 'Be honest — when was the last time you cried, or nearly did, somewhere private and alone, specifically because of something work-related?',
  options: [
    { label: "Can't remember.", stat: 'cry-never' },
    { label: 'This year.', stat: 'cry-year' },
    { label: 'This month.', stat: 'cry-month' },
    { label: '...today, actually.', stat: 'cry-today' },
  ],
};

// Placeholder share stats until real response volume exists (see content-spec.md).
const TWIST_STATS = {
  'cry-never': 'You picked the rarest answer here.',
  'cry-year':  '41% of people who land in your tier picked this too.',
  'cry-month': '58% of people who land in your tier picked this too.',
  'cry-today': "You're not the only one today. 1 in 4 in your tier said the same.",
};

// Momentum copy shown between axis groups (after Q3 and after Q6).
const MOMENTUM_LINES = {
  3: 'Halfway-ish. This next part is the one that actually matters.',
  6: 'Almost there — one more angle, then your result.',
};

function scoreAxis(answers, axisKey) {
  const qs = QUESTIONS.filter(q => q.axis === axisKey);
  const max = qs.length * 5; // 3 questions × max weight 5
  const total = qs.reduce((sum, q) => {
    const picked = answers[q.id];
    return sum + (picked != null ? picked.w : 0);
  }, 0);
  return Math.round((total / max) * 100);
}

function getArchetype(masking) {
  if (masking <= 35) {
    return {
      key: 'unmasked', name: 'The Unmasked',
      copy: "You're mostly just you, wherever you are. Your work self and your real self aren't running two different scripts — which means you're spending your energy on the day, not on the performance of getting through it. That's rarer than it sounds.",
    };
  }
  if (masking <= 70) {
    return {
      key: 'quiet-performer', name: 'The Quiet Performer',
      copy: "You're good at this — maybe too good. From the outside, you look completely fine. From the inside, there's a meter running that nobody else can see, and it doesn't reset just because the meeting ended. The mask isn't heavy enough to break anything yet. It's heavy enough that you'll feel it by Friday.",
    };
  }
  return {
    key: 'vigilant-one', name: 'The Vigilant One',
    copy: "You're not just adjusting at work — you're performing a completely different person, and your body knows it even when your calendar doesn't. The jaw, the breath, the rehearsed warmth: that's not nothing, that's a full-time job running underneath your actual full-time job. This isn't a verdict on you. It's a pattern a lot of high-functioning people fall into, and patterns can change.",
  };
}

/* ═══════════ Small shared bits ═══════════ */

function BrandMark() {
  return (
    <div className="assess-brand">
      <span className="brand-mark"><img src="../../assets/quilie-logo.png" alt="QuiLie" /></span>
      <span>QuiLie</span>
    </div>
  );
}

function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100);
  return (
    <React.Fragment>
      <div className="assess-progress-track">
        <div className="assess-progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="assess-progress-label">
        <span>Question {Math.min(current + 1, total)} of {total}</span>
        <span>{pct}%</span>
      </div>
    </React.Fragment>
  );
}

function AxisPreview({ answers }) {
  const somatic = scoreAxis(answers, 'somatic');
  const cognitive = scoreAxis(answers, 'cognitive');
  const recovery = scoreAxis(answers, 'recovery');
  const rows = [
    { key: 'somatic', label: 'Somatic', val: somatic },
    { key: 'cognitive', label: 'Cognitive', val: cognitive },
    { key: 'recovery', label: 'Recovery', val: recovery },
  ];
  return (
    <div className="assess-axis-preview">
      {rows.map(r => (
        <div key={r.key} className={`assess-axis-mini ${r.key}`}>
          <span className="label">{r.label}</span>
          <div className="track"><div className="fill" style={{ width: `${r.val}%` }} /></div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════ Question flow ═══════════ */

function QuestionCard({ question, axisLabel, selectedWeight, onSelect, isTwist, twistSelected, onTwistSelect, cardState }) {
  return (
    <div className={`assess-card ${isTwist ? 'twist' : ''} card-${cardState}`}>
      <div className="assess-axis-tag"><span className="dot"></span>{isTwist ? 'One honest one' : axisLabel}</div>
      <h2 className="assess-question">{question.q}</h2>
      <div className="assess-options">
        {question.options.map((opt, i) => {
          const letters = ['A', 'B', 'C', 'D'];
          const isSelected = isTwist
            ? twistSelected === opt.stat
            : selectedWeight === opt.w;
          return (
            <button
              key={i}
              type="button"
              className={`assess-option ${isSelected ? 'selected' : ''}`}
              onClick={() => isTwist ? onTwistSelect(opt.stat) : onSelect(opt.w)}
            >
              <span className="letter">{letters[i]}</span>
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════ Result screen ═══════════ */

function AxisResultRow({ axisKey, title, value, delayMs }) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setInView(true), delayMs);
    return () => clearTimeout(t);
  }, [delayMs]);
  return (
    <div className={`assess-axis-row ${axisKey} ${inView ? 'in' : ''}`}>
      <span className="axis-num">{value}</span>
      <div className="axis-body">
        <span className="axis-title">{title}</span>
        <div className="axis-track">
          <div className="axis-fill" style={{ width: inView ? `${value}%` : '0%' }} />
        </div>
      </div>
    </div>
  );
}

function ShareCardCanvas({ archetype, somatic, cognitive, recovery }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = 1080, H = 1080;
    canvas.width = W; canvas.height = H;

    // Background — cream paper matching --bg, soft tint washes matching body bg
    ctx.fillStyle = '#fbfaf7';
    ctx.fillRect(0, 0, W, H);
    const grad1 = ctx.createRadialGradient(W, 0, 0, W, 0, W * 0.6);
    grad1.addColorStop(0, 'rgba(230, 218, 245, 0.55)');
    grad1.addColorStop(1, 'rgba(230, 218, 245, 0)');
    ctx.fillStyle = grad1;
    ctx.fillRect(0, 0, W, H);
    const grad2 = ctx.createRadialGradient(0, H * 0.3, 0, 0, H * 0.3, W * 0.5);
    grad2.addColorStop(0, 'rgba(214, 240, 227, 0.5)');
    grad2.addColorStop(1, 'rgba(214, 240, 227, 0)');
    ctx.fillStyle = grad2;
    ctx.fillRect(0, 0, W, H);

    // Eyebrow
    ctx.fillStyle = '#8a8593';
    ctx.font = '500 22px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('QUILIE  ·  SOCIAL BATTERY ASSESSMENT', W / 2, 130);

    // Archetype name
    ctx.fillStyle = '#5a3fa3';
    ctx.font = '700 64px "Sora", sans-serif';
    wrapCenteredText(ctx, archetype.name, W / 2, 230, W - 160, 72);

    // Axis bars
    const axes = [
      { label: 'SOMATIC', val: somatic, color: '#7e57c2' },
      { label: 'COGNITIVE', val: cognitive, color: '#4fae8e' },
      { label: 'RECOVERY DEBT', val: recovery, color: '#c98a3a' },
    ];
    const barStartY = 480;
    const barGap = 130;
    axes.forEach((a, i) => {
      const y = barStartY + i * barGap;
      ctx.fillStyle = '#3a3640';
      ctx.font = '600 26px "Sora", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(a.label, 90, y - 18);
      ctx.fillStyle = '#6b6575';
      ctx.font = '600 26px "Sora", sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`${a.val}%`, W - 90, y - 18);

      const trackW = W - 180;
      ctx.fillStyle = '#e9e5ec';
      roundRect(ctx, 90, y, trackW, 18, 9);
      ctx.fill();
      ctx.fillStyle = a.color;
      roundRect(ctx, 90, y, Math.max(18, (a.val / 100) * trackW), 18, 9);
      ctx.fill();
    });

    // Footer tag
    ctx.fillStyle = '#a39db0';
    ctx.font = 'italic 30px "Instrument Serif", serif';
    ctx.textAlign = 'center';
    ctx.fillText('Drop the mask. Become who you really are.', W / 2, 980);
    ctx.fillStyle = '#c4bfcc';
    ctx.font = '500 20px "JetBrains Mono", monospace';
    ctx.fillText('quilie.life', W / 2, 1020);
  }, [archetype, somatic, cognitive, recovery]);

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
  function wrapCenteredText(ctx, text, cx, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '', lines = [];
    words.forEach(w => {
      const test = line ? line + ' ' + w : w;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line); line = w;
      } else { line = test; }
    });
    if (line) lines.push(line);
    const startY = y - ((lines.length - 1) * lineHeight) / 2;
    lines.forEach((l, i) => ctx.fillText(l, cx, startY + i * lineHeight));
  }

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `quilie-${archetype.key}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <React.Fragment>
      <div className="assess-share-preview">
        <canvas ref={canvasRef} />
      </div>
      <div className="assess-share-row">
        <button type="button" className="btn btn-ghost" onClick={downloadImage}>
          Download image
        </button>
      </div>
    </React.Fragment>
  );
}

function ResultScreen({ answers, twistAnswer }) {
  const somatic = scoreAxis(answers, 'somatic');
  const cognitive = scoreAxis(answers, 'cognitive');
  const recovery = scoreAxis(answers, 'recovery');
  const masking = Math.round((somatic + cognitive + recovery) / 3);
  const archetype = getArchetype(masking);
  const [nameIn, setNameIn] = useState(false);

  useEffect(() => {
    // Name fades in last, after the three bars have had time to animate.
    const t = setTimeout(() => setNameIn(true), 1700);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="assess-shell">
      <div className="assess-result-head">
        <div className="assess-result-eyebrow">Your result</div>
        <h1 className={`assess-archetype-name ${nameIn ? 'in' : ''}`}>{archetype.name}</h1>
        <p className="assess-archetype-copy">{archetype.copy}</p>
      </div>

      <div className="assess-axis-results">
        <AxisResultRow axisKey="somatic" title="Somatic Tension" value={somatic} delayMs={200} />
        <AxisResultRow axisKey="cognitive" title="Cognitive Load" value={cognitive} delayMs={700} />
        <AxisResultRow axisKey="recovery" title="Recovery Debt" value={recovery} delayMs={1200} />
      </div>

      {twistAnswer && (
        <p className="assess-archetype-copy" style={{ textAlign: 'center', marginBottom: 28, fontSize: 14.5 }}>
          {TWIST_STATS[twistAnswer]}
        </p>
      )}

      <p className="assess-disclaimer">
        This is a self-reflection tool, not a clinical or diagnostic assessment.
      </p>

      <ShareCardCanvas archetype={archetype} somatic={somatic} cognitive={cognitive} recovery={recovery} />

      <div className="assess-cta-card">
        <p className="blind-spot">
          Knowing your score is step one. Your answers point to a distinct energy
          leak during mid-week interactions — the kind that's easy to feel and
          hard to track on your own.
        </p>
        <a className="btn btn-purple btn-lg" href="https://app.quilie.life" target="_blank" rel="noopener noreferrer">
          Start tracking your energy leaks safely
        </a>
        <div className="subtext">3-DAY FREE TRIAL · NO CREDIT CARD · E2E ENCRYPTED</div>
      </div>

      <p className="assess-disclaimer" style={{ marginTop: 28 }}>
        Your responses are processed in your browser and are never stored or sent
        to a marketing database.
      </p>
    </div>
  );
}

/* ═══════════ Root flow controller ═══════════ */

function AssessmentApp() {
  // step: 0..8 = scored questions, 9 = twist question, 10 = result
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [twistAnswer, setTwistAnswer] = useState(null);
  const [cardState, setCardState] = useState('in');

  const totalSteps = QUESTIONS.length + 1; // +1 for twist, shown in progress bar
  const isTwistStep = step === QUESTIONS.length;
  const isResult = step > QUESTIONS.length;
  const currentQuestion = !isTwistStep && !isResult ? QUESTIONS[step] : null;

  const advance = () => {
    setCardState('card-leave');
    setTimeout(() => {
      setStep(s => s + 1);
      setCardState('card-enter');
      requestAnimationFrame(() => requestAnimationFrame(() => setCardState('card-in')));
    }, 280);
  };

  const handleSelect = (weight) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: { w: weight } }));
    setTimeout(advance, 260); // brief pause so the "selected" state is visible
  };

  const handleTwistSelect = (statKey) => {
    setTwistAnswer(statKey);
    setTimeout(advance, 260);
  };

  if (isResult) {
    return (
      <div className="assess-page">
        <BrandMark />
        <ResultScreen answers={answers} twistAnswer={twistAnswer} />
      </div>
    );
  }

  const momentumLine = MOMENTUM_LINES[step];

  return (
    <div className="assess-page">
      <BrandMark />
      <div className="assess-shell">
        <ProgressBar current={step} total={totalSteps} />
        <AxisPreview answers={answers} />

        {momentumLine && (
          <p className="assess-momentum">{momentumLine}</p>
        )}

        {isTwistStep ? (
          <QuestionCard
            question={TWIST_QUESTION}
            isTwist
            twistSelected={twistAnswer}
            onTwistSelect={handleTwistSelect}
            cardState={cardState}
          />
        ) : (
          <QuestionCard
            question={currentQuestion}
            axisLabel={AXES[currentQuestion.axis].label}
            selectedWeight={answers[currentQuestion.id]?.w ?? null}
            onSelect={handleSelect}
            cardState={cardState}
          />
        )}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<AssessmentApp />);
