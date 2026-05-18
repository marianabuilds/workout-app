import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Calendar, Zap, Clock, User } from 'lucide-react';
import { C } from '../lib/theme';

const tabs = [
  { icon: Home,     label: 'Home',     path: '/' },
  { icon: Calendar, label: 'Schedule', path: '/schedule' },
  null, // center action button
  { icon: Clock,    label: 'History',  path: '/history' },
  { icon: User,     label: 'Profile',  path: '/profile' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isActive = (path) => pathname === path;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 393,
      background: `linear-gradient(to top, ${C.bg} 80%, transparent)`,
      paddingTop: 16,
      zIndex: 50,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', paddingBottom: 8, position: 'relative' }}>
        {tabs.map((tab, i) => {
          if (!tab) {
            return (
              <button
                key="center"
                onClick={() => navigate('/active')}
                style={{
                  width: 64, height: 64,
                  borderRadius: '50%',
                  background: isActive('/active') ? C.accent : C.accentDark,
                  border: `2.5px solid ${C.accentBorder}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: `0 0 24px rgba(40,255,191,0.25)`,
                  flexShrink: 0,
                  marginBottom: 4,
                  transition: 'all 0.2s',
                }}
              >
                <Zap size={26} color={isActive('/active') ? '#020d0a' : C.accent} fill={isActive('/active') ? '#020d0a' : 'none'} />
              </button>
            );
          }
          const Icon = tab.icon;
          const active = isActive(tab.path);
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                padding: '6px 12px',
                opacity: active ? 1 : 0.45,
                transition: 'opacity 0.15s',
              }}
            >
              <Icon size={22} color={active ? C.accent : C.text} strokeWidth={active ? 2.5 : 1.8} />
              <span style={{ fontSize: 10, fontFamily: C.font, color: active ? C.accent : C.text, fontWeight: active ? 700 : 400, letterSpacing: '0.3px' }}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
      {/* Home indicator */}
      <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 8 }}>
        <div style={{ width: 120, height: 4, borderRadius: 360, background: 'rgba(215,228,225,0.15)' }} />
      </div>
    </div>
  );
}
