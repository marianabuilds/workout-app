import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Calendar, Clock, User, Zap, Dumbbell } from 'lucide-react';
import { C } from '../lib/theme';

const NAV_ITEMS = [
  { icon: Home,     label: 'Home',     path: '/' },
  { icon: Calendar, label: 'Schedule', path: '/schedule' },
  { icon: Clock,    label: 'History',  path: '/history' },
  { icon: User,     label: 'Profile',  path: '/profile' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div
      className="hidden md:flex flex-col fixed left-0 top-0 h-screen z-40"
      style={{ width: 256, background: '#050f0b', borderRight: '1px solid rgba(145,182,171,0.12)' }}
    >
      {/* Branding */}
      <div style={{ padding: '28px 24px 24px', borderBottom: '1px solid rgba(145,182,171,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: C.accentDark, border: `1px solid ${C.accentBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Dumbbell size={16} color={C.accent} />
          </div>
          <span style={{ color: C.text, fontSize: 16, fontWeight: 700, fontFamily: C.font, letterSpacing: '-0.4px' }}>
            WorkoutAI
          </span>
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV_ITEMS.map(({ icon: Icon, label, path }) => {
          const active = pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              style={{
                width: '100%', background: active ? C.chipAccentBg : 'transparent',
                border: `1px solid ${active ? C.accentBorder + '66' : 'transparent'}`,
                borderRadius: 12, padding: '10px 14px',
                display: 'flex', alignItems: 'center', gap: 12,
                cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left',
              }}
            >
              <Icon
                size={18}
                color={active ? C.accent : 'rgba(209,235,227,0.45)'}
                strokeWidth={active ? 2.5 : 1.8}
              />
              <span style={{
                color: active ? C.accent : 'rgba(209,235,227,0.55)',
                fontSize: 14, fontWeight: active ? 600 : 400,
                fontFamily: C.font, letterSpacing: '0.1px',
              }}>
                {label}
              </span>
              {active && (
                <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: C.accent }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Start Workout CTA */}
      <div style={{ padding: '0 12px 16px' }}>
        <button
          onClick={() => navigate('/active')}
          style={{
            width: '100%', background: C.accentDark,
            border: `1px solid ${C.accentBorder}`,
            borderRadius: 14, padding: '13px 0',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            color: C.accent, fontSize: 14, fontWeight: 700,
            fontFamily: C.font, cursor: 'pointer',
            letterSpacing: '-0.2px', transition: 'all 0.2s',
          }}
        >
          <Zap size={15} color={C.accent} fill={C.accent} />
          Start Workout
        </button>
      </div>

      {/* User profile */}
      <div style={{ padding: '16px 16px 24px', borderTop: '1px solid rgba(145,182,171,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: C.accentDark, border: `1px solid ${C.accentBorder}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: C.accent, fontSize: 13, fontWeight: 700, fontFamily: C.font,
          }}>
            M
          </div>
          <div>
            <p style={{ color: C.text, fontSize: 13, fontWeight: 600, margin: 0, lineHeight: 1.2 }}>Mariana</p>
            <p style={{ color: 'rgba(209,235,227,0.35)', fontSize: 11, margin: '2px 0 0', fontFamily: C.font }}>marianabuilds</p>
          </div>
        </div>
      </div>
    </div>
  );
}
