const imgWifi = "https://www.figma.com/api/mcp/asset/7114c22b-04df-4ebd-8d13-714c6ce24ea0";
const imgSignal = "https://www.figma.com/api/mcp/asset/62de3f0e-0840-4d79-b7d4-2b584c4e48c2";

const C = {
  bg: '#020d0a',
  text: '#d7e4e1',
  muted: 'rgba(209,235,227,0.62)',
  accent: '#28ffbf',
  cardBorder: 'rgba(145,182,171,0.2)',
  statBg: 'rgba(129,218,192,0.05)',
};

const exercises = [
  { name: 'Bench Press',      reps: '15-20', sets: '2-3', time: '~25 mins' },
  { name: 'Deadlifts',        reps: '15-20', sets: '2-3', time: '~25 mins' },
  { name: 'Pull-Ups',         reps: '15-20', sets: '2-3', time: '~25 mins' },
  { name: 'Shoulder Press',   reps: '15-20', sets: '2-3', time: '~25 mins' },
];

export default function Workout({ onNavigate }) {
  return (
    <div style={{ background: C.bg, fontFamily: '"Azeret Mono", monospace', display: 'flex', flexDirection: 'column', width: '100%', minHeight: '100vh' }}>

      {/* ── Status Bar ── */}
      <div style={{ height: 56, position: 'relative', width: '100%', overflow: 'hidden', background: C.bg, flexShrink: 0 }}>
        <span style={{ position: 'absolute', left: 32, top: 17, color: C.text, fontSize: 17 }}>10:30 AM</span>
        <div style={{ position: 'absolute', right: 32, top: 20, width: 78.5, height: 14.5 }}>
          {/* Battery (solid) */}
          <div style={{ position: 'absolute', left: 55.5, top: 3, width: 22, height: 11, background: C.text, borderRadius: 4 }} />
          <div style={{ position: 'absolute', left: 69, top: 6, width: 10, height: 5, background: C.text, borderRadius: 4 }} />
          <img alt="" style={{ position: 'absolute', left: 31.5, bottom: 0.5, width: 17, height: 13 }} src={imgWifi} />
          <img alt="" style={{ position: 'absolute', left: 0, top: 0, width: 23.5, height: 14 }} src={imgSignal} />
        </div>
      </div>

      {/* ── Nav Bar with back button ── */}
      <div style={{ height: 48, position: 'relative', width: '100%', overflow: 'hidden', flexShrink: 0 }}>
        <button
          onClick={() => onNavigate('home')}
          style={{
            position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer',
            color: C.accent, fontSize: 17, fontFamily: '"Azeret Mono", monospace',
            padding: '8px 4px', display: 'flex', alignItems: 'center', gap: 4,
          }}
        >
          ‹ Home
        </button>
        <span style={{
          position: 'absolute', left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)',
          color: C.text, fontSize: 17, fontWeight: 600, whiteSpace: 'nowrap',
        }}>
          Workout Details
        </span>
      </div>

      {/* ── AI Trainer Tip ── */}
      <div style={{ borderBottom: `1px solid ${C.cardBorder}`, padding: '28px 16px 24px', flexShrink: 0 }}>
        <div style={{
          background: C.bg,
          border: `1px solid ${C.cardBorder}`,
          borderRadius: 14,
          padding: 12,
        }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
            <span style={{ color: C.muted, fontSize: 15, lineHeight: 1.35, letterSpacing: '-0.075px' }}>💡 AI Trainer Tip</span>
          </div>
          <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.35, letterSpacing: '-0.075px', margin: 0 }}>
            Rest quality: Ensure 48 hours between back workouts for optimal muscle recovery
          </p>
        </div>
      </div>

      {/* ── Exercise List ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingBottom: 32 }}>
        {exercises.map((ex) => (
          <div key={ex.name} style={{ flexShrink: 0 }}>
            <div style={{ padding: '24px 16px 2px' }}>
              <p style={{ color: 'white', fontSize: 18, fontWeight: 600, letterSpacing: '-0.36px', margin: 0 }}>{ex.name}</p>
            </div>
            <div style={{ display: 'flex', gap: 12, padding: '8px 16px 0' }}>
              {[
                { label: 'Reps', value: ex.reps },
                { label: 'Sets', value: ex.sets },
                { label: 'Time', value: ex.time },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{ flex: 1, background: C.statBg, borderRadius: 16, padding: 16 }}
                >
                  <p style={{ color: C.text, fontSize: 17, margin: 0, whiteSpace: 'nowrap' }}>{stat.label}</p>
                  <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.35, margin: '4px 0 0' }}>{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
