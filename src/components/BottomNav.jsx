import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Calendar, Zap, Clock, User, X, ChevronRight, Dumbbell, Sparkles } from 'lucide-react';
import { C } from '../lib/theme';
import { getCachedSchedule, getManualOverrides } from '../lib/aiSchedule';
import { WORKOUTS } from '../lib/exercises';
import { getLastSession } from '../lib/sessionHistory';

const tabs = [
  { icon: Home,     label: 'Home',     path: '/' },
  { icon: Calendar, label: 'Schedule', path: '/schedule' },
  null,
  { icon: Clock,    label: 'History',  path: '/history' },
  { icon: User,     label: 'Profile',  path: '/profile' },
];

const PRESET_WORKOUTS = [
  { key: 'arms',     name: 'Arms & Shoulders', desc: '6 exercises · ~40 min' },
  { key: 'fullbody', name: 'Full Body Circuit', desc: '8 exercises · ~50 min' },
  { key: 'cardio',   name: 'Cardio Blast',      desc: 'HIIT · 30 min'        },
  { key: 'recovery', name: 'Stretch & Recover', desc: 'Mobility · 20 min'    },
];

function makeDateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getTodayWorkout() {
  const todayKey = makeDateKey(new Date());
  const schedule = { ...(getCachedSchedule() || {}), ...(getManualOverrides() || {}) };
  const aiDay = schedule[todayKey];
  if (aiDay?.exercises?.length > 0) {
    return { name: aiDay.name, tip: aiDay.tip || WORKOUTS.today.tip, exercises: aiDay.exercises, type: aiDay.type };
  }
  return {
    name: WORKOUTS.today.name,
    tip: WORKOUTS.today.tip,
    exercises: WORKOUTS.today.exercises.map(e => e.name),
    type: 'strength',
  };
}

function buildTrainerTip(exercises) {
  for (const name of exercises) {
    const last = getLastSession(name);
    if (last && last.weight > 0) {
      return `Last session: ${name} at ${last.weight} lb × ${last.reps} reps. Try going up 5 lb if it felt manageable.`;
    }
  }
  return null;
}

function WorkoutPickerSheet({ onClose }) {
  const navigate = useNavigate();
  const workout = getTodayWorkout();
  const trainerTip = buildTrainerTip(workout.exercises);
  const [selected, setSelected] = useState('arms');
  const [showAlts, setShowAlts] = useState(false);

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 100 }} />
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: 393, maxHeight: '80vh', overflowY: 'auto',
        background: '#0b1e16', borderRadius: '20px 20px 0 0',
        border: `1px solid ${C.cardBorder}`, borderBottom: 'none',
        zIndex: 101,
      }}>
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: C.cardBorder }} />
        </div>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px 0' }}>
          <p style={{ color: C.text, fontSize: 18, fontWeight: 700, margin: 0, fontFamily: C.font, letterSpacing: '-0.4px' }}>
            Start Workout
          </p>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <X size={18} color={C.muted} />
          </button>
        </div>

        <div style={{ padding: '12px 20px 40px' }}>
          {/* Today's workout card */}
          <div style={{ background: C.accentDark, border: `1px solid ${C.accentBorder}`, borderRadius: 14, padding: '14px 16px', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Dumbbell size={14} color={C.accent} />
              <span style={{ color: C.accent, fontSize: 11, fontFamily: C.font, letterSpacing: '0.6px', textTransform: 'uppercase' }}>
                Today's Plan
              </span>
            </div>
            <p style={{ color: C.text, fontSize: 17, fontWeight: 600, margin: '0 0 10px', letterSpacing: '-0.3px' }}>
              {workout.name}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {workout.exercises.slice(0, 4).map(ex => (
                <span key={ex} style={{ fontSize: 11, fontFamily: C.font, color: C.muted, background: C.chipBg, borderRadius: 20, padding: '3px 10px' }}>
                  {ex}
                </span>
              ))}
              {workout.exercises.length > 4 && (
                <span style={{ fontSize: 11, color: C.dim, fontFamily: C.font, background: C.chipBg, borderRadius: 20, padding: '3px 10px' }}>
                  +{workout.exercises.length - 4} more
                </span>
              )}
            </div>
          </div>

          {/* AI trainer tip (history-based or workout tip) */}
          <div style={{ background: C.chipBg, borderRadius: 12, padding: '10px 14px', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
              <Sparkles size={13} color={C.accent} />
              <span style={{ color: C.accent, fontSize: 10, fontFamily: C.font, letterSpacing: '0.6px', textTransform: 'uppercase' }}>
                AI Trainer
              </span>
            </div>
            <p style={{ color: C.muted, fontSize: 13, margin: 0, lineHeight: 1.55 }}>
              {trainerTip || workout.tip}
            </p>
          </div>

          {/* Choose different workout */}
          <button
            onClick={() => setShowAlts(!showAlts)}
            style={{
              width: '100%', background: 'none', border: `1px solid ${C.cardBorder}`,
              borderRadius: 12, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 14px', marginBottom: showAlts ? 6 : 10,
            }}
          >
            <span style={{ color: C.muted, fontSize: 13, fontFamily: C.font }}>Choose different workout</span>
            <ChevronRight
              size={15} color={C.muted}
              style={{ transform: showAlts ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}
            />
          </button>

          {showAlts && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
              {PRESET_WORKOUTS.map(alt => (
                <button
                  key={alt.key}
                  onClick={() => setSelected(alt.key)}
                  style={{
                    background: selected === alt.key ? C.accentDark : C.chipBg,
                    border: `1px solid ${selected === alt.key ? C.accentBorder : 'transparent'}`,
                    borderRadius: 12, padding: '10px 14px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    textAlign: 'left',
                  }}
                >
                  <div>
                    <p style={{ color: C.text, fontSize: 14, fontWeight: 600, margin: 0, fontFamily: C.font }}>{alt.name}</p>
                    <p style={{ color: C.muted, fontSize: 12, margin: '2px 0 0', fontFamily: C.font }}>{alt.desc}</p>
                  </div>
                  {selected === alt.key && (
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ color: '#020d0a', fontSize: 13, lineHeight: 1, fontWeight: 700 }}>✓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Start button */}
          <button
            onClick={() => { onClose(); navigate('/active'); }}
            style={{
              width: '100%', background: C.accent, border: 'none', borderRadius: 14,
              padding: '16px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              color: '#020d0a', fontSize: 16, fontWeight: 700, fontFamily: C.font, cursor: 'pointer',
              letterSpacing: '-0.3px',
            }}
          >
            <Zap size={17} color="#020d0a" fill="#020d0a" />
            Start Workout
          </button>
        </div>
      </div>
    </>
  );
}

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [showPicker, setShowPicker] = useState(false);

  const isActive = (path) => pathname === path;

  return (
    <div className="md:hidden">
      {showPicker && <WorkoutPickerSheet onClose={() => setShowPicker(false)} />}
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
                  onClick={() => setShowPicker(true)}
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
        <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 8 }}>
          <div style={{ width: 120, height: 4, borderRadius: 360, background: 'rgba(215,228,225,0.15)' }} />
        </div>
      </div>
    </div>
  );
}
