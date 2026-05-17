import { User, Flame, Dumbbell, Calendar, ChevronRight } from 'lucide-react';
import StatusBar from '../components/StatusBar';
import { C } from '../lib/theme';

const STATS = [
  { label: 'Workouts', value: '47', icon: Dumbbell },
  { label: 'Streak',   value: '12d',  icon: Flame },
  { label: 'This Mo.', value: '18',  icon: Calendar },
];

const MENU = [
  { label: 'Personal Info',    sub: 'Mariana Marquez' },
  { label: 'Goals',            sub: 'Build muscle · Moderate' },
  { label: 'Notifications',    sub: 'Daily reminders on' },
  { label: 'Workout History',  sub: '47 sessions logged' },
  { label: 'Rest Timer',       sub: '90 seconds default' },
];

export default function Profile() {
  return (
    <div style={{ background: C.bg, fontFamily: C.font, minHeight: '100vh', paddingBottom: 100 }}>
      <StatusBar />

      {/* Avatar */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 20px 20px' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: C.accentDark, border: `2px solid ${C.accentBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
          <User size={36} color={C.accent} />
        </div>
        <h2 style={{ color: C.text, fontSize: 20, fontWeight: 700, margin: 0, letterSpacing: '-0.4px' }}>Mariana Marquez</h2>
        <p style={{ color: C.muted, fontSize: 13, margin: '4px 0 0' }}>marianabuilds@outlook.com</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 10, padding: '0 20px 24px' }}>
        {STATS.map(({ label, value, icon: Icon }) => (
          <div key={label} style={{ flex: 1, background: C.surface, border: `1px solid ${C.cardBorder}`, borderRadius: 14, padding: '14px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <Icon size={16} color={C.accent} />
            <p style={{ color: C.text, fontSize: 18, fontWeight: 700, margin: 0 }}>{value}</p>
            <p style={{ color: C.muted, fontSize: 11, margin: 0, letterSpacing: '0.3px' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Menu */}
      <div style={{ padding: '0 20px' }}>
        <p style={{ color: C.muted, fontSize: 12, letterSpacing: '0.8px', textTransform: 'uppercase', margin: '0 0 10px' }}>Settings</p>
        <div style={{ background: C.surface, border: `1px solid ${C.cardBorder}`, borderRadius: 16, overflow: 'hidden' }}>
          {MENU.map((item, i) => (
            <button
              key={item.label}
              style={{
                width: '100%', background: 'none', border: 'none',
                borderBottom: i < MENU.length - 1 ? `1px solid ${C.cardBorder}` : 'none',
                padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                cursor: 'pointer', textAlign: 'left',
              }}
            >
              <div>
                <p style={{ color: C.text, fontSize: 14, fontWeight: 500, margin: 0 }}>{item.label}</p>
                <p style={{ color: C.muted, fontSize: 12, margin: '2px 0 0' }}>{item.sub}</p>
              </div>
              <ChevronRight size={16} color={C.dim} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
