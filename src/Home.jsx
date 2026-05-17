const imgHero = "https://www.figma.com/api/mcp/asset/8cd6623b-6810-4aa5-96f6-9e6a35cc1f3b";
const imgSquat = "https://www.figma.com/api/mcp/asset/6bf0b866-a48c-4b7b-bba5-482852ed109a";
const imgAthlete = "https://www.figma.com/api/mcp/asset/c148f43e-a090-48fa-980a-18a81c2a2b4f";
const imgChicken = "https://www.figma.com/api/mcp/asset/87454217-df21-4c2c-a6e3-ae87e2837ff5";
const imgFruits = "https://www.figma.com/api/mcp/asset/a53ab569-c209-4f05-b916-5ad2b7637934";
const imgBattery = "https://www.figma.com/api/mcp/asset/ca16ad45-7b43-4ed3-831a-7d66db4587e9";
const imgWifi = "https://www.figma.com/api/mcp/asset/659faf56-6245-4b40-9627-e6083a54d60a";
const imgSignal = "https://www.figma.com/api/mcp/asset/eb9581ab-8074-4bc4-814f-876560333b80";
const imgForward = "https://www.figma.com/api/mcp/asset/17741113-c00e-47fa-ba38-b87d91f1a18a";
const imgIconHome = "https://www.figma.com/api/mcp/asset/9d8d5ddb-92fc-4336-b1eb-dfa362377fc4";
const imgIconSettings = "https://www.figma.com/api/mcp/asset/5b217a91-b52c-4248-a6ce-01027c06a056";

const days = [
  { label: 'Thu', date: 11, active: true },
  { label: 'Fri', date: 12 },
  { label: 'Sat', date: 13 },
  { label: 'Sun', date: 14 },
  { label: 'Mon', date: 15 },
  { label: 'Tue', date: 16 },
  { label: 'Wed', date: 17 },
];

// Events positioned within a 672px tall timeline (top values reference the midpoint)
const calendarEvents = [
  [
    { label: 'Strength Training', height: 48, offsetFromMid: -217 },
    { label: 'Cardio Session',    height: 24, offsetFromMid: 11 },
    { label: 'Morning Yoga',      height: 46, offsetFromMid: 188 },
  ],
  [{ label: 'Lunch Break',        height: 48, offsetFromMid: -55 }],
  [
    { label: 'Dinner',            height: 48, offsetFromMid: -168 },
    { label: 'Evening Meditation',height: 24, offsetFromMid: 132 },
    { label: 'Afternoon Run',     height: 46, offsetFromMid: 237 },
  ],
  [{ label: 'Rest',               height: 48, offsetFromMid: -72 }],
  [
    { label: 'Swimming',          height: 48, offsetFromMid: -168 },
    { label: 'Cycling',           height: 24, offsetFromMid: 132 },
    { label: 'Stretching',        height: 46, offsetFromMid: 237 },
  ],
  [
    { label: 'Cool Down',         height: 48, offsetFromMid: -217 },
    { label: 'Dance Class',       height: 24, offsetFromMid: 11 },
    { label: 'Pilates',           height: 46, offsetFromMid: 188 },
  ],
  [{ label: 'Sleep',              height: 48, offsetFromMid: -55 }],
];

const TIMELINE_H = 672;
const MID = TIMELINE_H / 2;

const bodyTargets = [
  { label: 'Chip', active: false },
  { label: 'Arms', active: true },
  { label: 'Legs', active: false },
  { label: 'Full Body', active: false },
];

const intensities = [
  { label: 'Light',    active: true },
  { label: 'Moderate', active: false },
  { label: 'Heavy',    active: false },
];

const stats = [
  { label: 'Reps', value: '15-20' },
  { label: 'Time', value: '~25 mins' },
  { label: 'Sets', value: '2-3' },
];

const insightCards = [
  {
    img: imgSquat,
    avatar: imgAthlete,
    author: 'Fitness Expert',
    title: 'Training Best Practices',
    desc: 'Learn the best practices to enhance your training routine.',
  },
  {
    img: imgChicken,
    avatar: imgFruits,
    author: 'Nutritionist',
    title: 'Eating Tips',
    desc: 'Discover what to eat before and after your workouts.',
  },
];

const C = {
  bg: '#020d0a',
  text: '#d7e4e1',
  muted: 'rgba(209,235,227,0.62)',
  dim: 'rgba(209,235,227,0.4)',
  accent: '#28ffbf',
  accentDark: '#0e5844',
  accentBorder: '#65e7c4',
  activeTab: '#168e6d',
  cardBorder: 'rgba(145,182,171,0.2)',
  chipBg: 'rgba(184,224,212,0.12)',
  chipAccentBg: 'rgba(0,255,179,0.12)',
  statBg: 'rgba(129,218,192,0.05)',
};

export default function Home({ onNavigate }) {
  return (
    <div style={{ background: C.bg, fontFamily: '"Azeret Mono", monospace', display: 'flex', flexDirection: 'column', width: '100%' }}>

      {/* ── Status Bar ── */}
      <div style={{ height: 56, position: 'relative', width: '100%', overflow: 'hidden', background: C.bg }}>
        <span style={{ position: 'absolute', left: 32, top: 17, color: C.text, fontSize: 17, fontWeight: 400 }}>12:30</span>
        <div style={{ position: 'absolute', right: 32, top: 20, width: 78.5, height: 14.5 }}>
          <img alt="" style={{ position: 'absolute', left: 55.5, top: 3, width: 23.5, height: 11 }} src={imgBattery} />
          <img alt="" style={{ position: 'absolute', left: 31.5, bottom: 0.5, width: 17, height: 13 }} src={imgWifi} />
          <img alt="" style={{ position: 'absolute', left: 0, top: 0, width: 23.5, height: 14 }} src={imgSignal} />
        </div>
      </div>

      {/* ── Nav Bar ── */}
      <div style={{ height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: C.muted, fontSize: 17, letterSpacing: '-0.425px', background: C.bg }}>
        <span>04/30</span>
        <span style={{ fontSize: 15 }}>·</span>
        <span>20 C</span>
        <span style={{ fontSize: 15 }}>·</span>
        <span>Daly City</span>
      </div>

      {/* ── Today's Plan header ── */}
      <div style={{ background: C.bg, paddingBottom: 24 }}>
        <div style={{ padding: '28px 18px 4px' }}>
          <p style={{ color: C.text, fontSize: 28, fontWeight: 600, letterSpacing: '-0.7px', margin: 0 }}>Today's Plan</p>
          <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.35, letterSpacing: '-0.075px', margin: '2px 0 0' }}>
            Let's start with the workout for today, Mariana.
          </p>
        </div>
      </div>

      {/* ── Hero Card ── */}
      <div style={{ width: '100%', overflow: 'hidden' }}>
        <div style={{ width: '100%', height: 206, position: 'relative', overflow: 'hidden' }}>
          <img
            alt="Daily Motivation"
            src={imgHero}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <div style={{ background: C.bg, borderBottom: `1px solid ${C.cardBorder}`, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
              <img alt="" src={imgHero} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <span style={{ color: C.muted, fontSize: 15, lineHeight: 1.35, whiteSpace: 'nowrap' }}>Michael Jordan</span>
            <span style={{ color: C.muted, fontSize: 15 }}>·</span>
            <span style={{ color: C.muted, fontSize: 15, lineHeight: 1.35, whiteSpace: 'nowrap' }}>Today</span>
          </div>
          <p style={{ color: C.text, fontSize: 22, fontWeight: 600, lineHeight: 1.3, letterSpacing: '-0.22px', margin: 0 }}>Daily Motivation</p>
        </div>
      </div>

      {/* ── Calendar Week View ── */}
      <div style={{ width: '100%', paddingTop: 24, overflow: 'hidden' }}>
        {/* Day labels */}
        <div style={{ display: 'flex', width: '100%' }}>
          {days.map((d) => (
            <div key={d.label} style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              <span style={{ color: C.muted, fontSize: 13, whiteSpace: 'nowrap' }}>{d.label}</span>
            </div>
          ))}
        </div>
        {/* Date numbers */}
        <div style={{ display: 'flex', width: '100%' }}>
          {days.map((d) => (
            <div key={d.date} style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', height: 50 }}>
              {d.active ? (
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#000302', fontSize: 17, textAlign: 'center', lineHeight: 1.35 }}>{d.date}</span>
                </div>
              ) : (
                <span style={{ color: C.dim, fontSize: 17, lineHeight: 1.35 }}>{d.date}</span>
              )}
            </div>
          ))}
        </div>
        {/* Event lanes — fixed height timeline */}
        <div style={{ position: 'relative', height: TIMELINE_H, paddingLeft: 50, display: 'flex' }}>
          {calendarEvents.map((dayEvents, i) => (
            <div key={i} style={{ flex: 1, position: 'relative', height: TIMELINE_H, minWidth: 0 }}>
              {dayEvents.map((ev) => {
                const top = MID + ev.offsetFromMid - ev.height / 2;
                return (
                  <div
                    key={ev.label}
                    style={{
                      position: 'absolute',
                      left: 0, right: 0,
                      top,
                      height: ev.height,
                      background: C.accent,
                      border: '0.5px solid #007854',
                      borderRadius: 4,
                      padding: 4,
                      overflow: 'hidden',
                    }}
                  >
                    <span style={{ color: '#090e0d', fontSize: 11, lineHeight: 'normal' }}>{ev.label}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* ── What are we working on? ── */}
      <div style={{ background: C.bg, width: '100%' }}>
        <div style={{ padding: '24px 16px 2px' }}>
          <p style={{ color: C.text, fontSize: 18, fontWeight: 400, letterSpacing: '-0.36px', margin: 0 }}>What are we working on?</p>
        </div>
        {/* Body part chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: '16px 16px 0', background: C.bg }}>
          {bodyTargets.map((t) => (
            <div
              key={t.label}
              style={{
                flex: '1 0 auto',
                background: t.active ? C.chipAccentBg : C.chipBg,
                borderRadius: 24,
                padding: '9px 16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                minHeight: 28,
              }}
            >
              <span style={{ color: C.text, fontSize: 15, lineHeight: 1.35, whiteSpace: 'nowrap' }}>{t.label}</span>
            </div>
          ))}
        </div>
        {/* Intensity chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: 16, background: C.bg }}>
          {intensities.map((t) => (
            <div
              key={t.label}
              style={{
                flex: '1 0 auto',
                background: t.active ? C.chipAccentBg : 'transparent',
                border: '2px solid white',
                borderRadius: 24,
                padding: '9px 16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                minHeight: 28,
              }}
            >
              <span style={{ color: C.text, fontSize: 15, lineHeight: 1.35, whiteSpace: 'nowrap' }}>{t.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Arms Workout Stats ── */}
      <div style={{ width: '100%' }}>
        <div
          onClick={() => onNavigate('workout')}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '24px 16px 2px', cursor: 'pointer' }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ color: C.text, fontSize: 18, fontWeight: 400, letterSpacing: '-0.36px', margin: 0, whiteSpace: 'nowrap' }}>Arms Workout</p>
            <p style={{ color: C.muted, fontSize: 13, margin: '2px 0 0', whiteSpace: 'nowrap' }}>Workout Details</p>
          </div>
          <img alt="" src={imgForward} style={{ width: 22, height: 22, flexShrink: 0 }} />
        </div>
        <div style={{ display: 'flex', gap: 12, padding: '6px 16px 0' }}>
          {stats.map((s) => (
            <div
              key={s.label}
              style={{
                flex: 1, minWidth: 0,
                background: C.statBg,
                borderRadius: 16,
                padding: 16,
              }}
            >
              <p style={{ color: C.text, fontSize: 17, margin: 0, whiteSpace: 'nowrap' }}>{s.label}</p>
              <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.35, margin: '4px 0 0' }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── My Insights ── */}
      <div style={{ background: C.bg, width: '100%' }}>
        <div style={{ padding: '28px 18px 2px' }}>
          <p style={{ color: C.text, fontSize: 18, fontWeight: 400, letterSpacing: '-0.45px', margin: 0 }}>My insights</p>
        </div>
        <div style={{ display: 'flex', gap: 18, padding: '18px 8px', overflowX: 'auto', background: C.bg }}>
          {insightCards.map((card) => (
            <div
              key={card.title}
              style={{
                width: 300, flexShrink: 0,
                background: C.bg,
                border: `1px solid ${C.cardBorder}`,
                borderRadius: 14,
                padding: 12,
                display: 'flex', flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              <div style={{ height: 128, position: 'relative', overflow: 'hidden', borderRadius: 4 }}>
                <img alt="" src={card.img} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ paddingTop: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                    <img alt="" src={card.avatar} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <span style={{ color: C.muted, fontSize: 15, lineHeight: 1.35, letterSpacing: '-0.075px', whiteSpace: 'nowrap' }}>{card.author}</span>
                  <span style={{ color: C.muted, fontSize: 15 }}>·</span>
                  <span style={{ color: C.muted, fontSize: 15, lineHeight: 1.35, whiteSpace: 'nowrap' }}>Today</span>
                </div>
                <p style={{ color: C.text, fontSize: 17, letterSpacing: '-0.425px', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {card.title}
                </p>
                <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.35, letterSpacing: '-0.075px', margin: 0 }}>
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom Tab Bar ── */}
      <div style={{ background: C.bg, paddingTop: 32, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden' }}>
        <div style={{ background: C.bg, width: '100%', display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center', paddingTop: 8, position: 'relative', filter: 'drop-shadow(0px 16px 32px rgba(0,0,0,0.2))' }}>

          {/* Floating center button */}
          <div style={{
            position: 'absolute', top: -66, left: '50%', transform: 'translateX(-50%)',
            background: C.bg, borderRadius: '50%', padding: 8,
            display: 'flex', alignItems: 'center',
          }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: C.accentDark, position: 'relative' }}>
              <div style={{ position: 'absolute', inset: '-6.82%', border: '3px solid #65e7c4', borderRadius: '50%' }} />
            </div>
          </div>

          {/* Tab items */}
          <div style={{ display: 'flex', width: '100%', gap: 88 }}>
            <div style={{ flex: 1, height: 40, position: 'relative' }}>
              <img alt="" src={imgIconHome} style={{ position: 'absolute', width: 24, height: 24, left: '50%', top: '50%', transform: 'translate(-50%, calc(-50% - 8px))' }} />
              <span style={{ position: 'absolute', fontSize: 11, fontWeight: 900, color: C.activeTab, lineHeight: 1.35, left: '50%', top: 'calc(50% + 7px)', transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}>
                Home
              </span>
            </div>
            <div style={{ flex: 1, height: 40, position: 'relative' }}>
              <img alt="" src={imgIconSettings} style={{ position: 'absolute', width: 24, height: 24, left: '50%', top: '50%', transform: 'translate(-50%, calc(-50% - 8px))' }} />
              <span style={{ position: 'absolute', fontSize: 11, fontWeight: 900, color: 'rgba(215,228,225,0.7)', lineHeight: 1.35, left: '50%', top: 'calc(50% + 7px)', transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}>
                Settings
              </span>
            </div>
          </div>

          {/* Gesture bar */}
          <div style={{ height: 32, width: '100%', overflow: 'hidden', position: 'relative' }}>
            <div style={{ width: 120, height: 4, borderRadius: 360, background: 'rgba(215,228,225,0.12)', position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)' }} />
          </div>
        </div>
      </div>

    </div>
  );
}
