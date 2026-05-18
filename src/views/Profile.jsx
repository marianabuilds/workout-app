import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Flame, Calendar, ChevronRight, ChevronDown, Check } from 'lucide-react';
import StatusBar from '../components/StatusBar';
import { C } from '../lib/theme';
import { getSessionStats, getRestTimerDefault, setRestTimerDefault } from '../lib/sessionHistory';

const GOAL_OPTIONS = [
  { key: 'muscle',    label: 'Build Muscle' },
  { key: 'fat_loss',  label: 'Fat Loss' },
  { key: 'endurance', label: 'Endurance' },
  { key: 'general',   label: 'General Fitness' },
];

const REST_OPTIONS = [
  { value: 60,  label: '60s' },
  { value: 90,  label: '90s' },
  { value: 120, label: '2 min' },
  { value: 180, label: '3 min' },
];

function getGoal() {
  return localStorage.getItem('workout_goal') || 'muscle';
}

export default function Profile() {
  const navigate = useNavigate();
  const stats = getSessionStats();
  const [openSection, setOpenSection] = useState(null);
  const [goal, setGoal] = useState(getGoal);
  const [restTimer, setRestTimer] = useState(getRestTimerDefault);

  function handleGoal(key) {
    localStorage.setItem('workout_goal', key);
    setGoal(key);
  }

  function handleRestTimer(val) {
    setRestTimerDefault(val);
    setRestTimer(val);
  }

  function toggle(section) {
    setOpenSection(prev => (prev === section ? null : section));
  }

  const goalLabel = GOAL_OPTIONS.find(o => o.key === goal)?.label ?? 'Build Muscle';
  const restLabel = REST_OPTIONS.find(o => o.value === restTimer)?.label ?? '90s';

  return (
    <div style={{ background: C.bg, fontFamily: C.font, minHeight: '100vh', paddingBottom: 100 }}>
      <StatusBar />

      <div style={{ padding: '20px 20px 24px' }}>
        <h1 style={{ color: C.text, fontSize: 26, fontWeight: 700, margin: 0, letterSpacing: '-0.6px' }}>Profile</h1>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 10, padding: '0 20px 28px' }}>
        {[
          { label: 'Workouts', value: String(stats.total),       icon: Dumbbell },
          { label: 'Streak',   value: `${stats.streak}d`,        icon: Flame },
          { label: 'This Mo.', value: String(stats.thisMonth),   icon: Calendar },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} style={{ flex: 1, background: C.surface, border: `1px solid ${C.cardBorder}`, borderRadius: 14, padding: '14px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <Icon size={16} color={C.accent} />
            <p style={{ color: C.text, fontSize: 18, fontWeight: 700, margin: 0 }}>{value}</p>
            <p style={{ color: C.muted, fontSize: 11, margin: 0, letterSpacing: '0.3px' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Settings */}
      <div style={{ padding: '0 20px' }}>
        <p style={{ color: C.muted, fontSize: 12, letterSpacing: '0.8px', textTransform: 'uppercase', margin: '0 0 10px' }}>Settings</p>
        <div style={{ background: C.surface, border: `1px solid ${C.cardBorder}`, borderRadius: 16, overflow: 'hidden' }}>

          {/* Goal */}
          <div style={{ borderBottom: `1px solid ${C.cardBorder}` }}>
            <button
              onClick={() => toggle('goals')}
              style={{ width: '100%', background: 'none', border: 'none', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', textAlign: 'left' }}
            >
              <div>
                <p style={{ color: C.text, fontSize: 14, fontWeight: 500, margin: 0 }}>Goal</p>
                <p style={{ color: C.muted, fontSize: 12, margin: '2px 0 0' }}>{goalLabel}</p>
              </div>
              {openSection === 'goals'
                ? <ChevronDown size={16} color={C.dim} />
                : <ChevronRight size={16} color={C.dim} />}
            </button>
            {openSection === 'goals' && (
              <div style={{ padding: '0 16px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {GOAL_OPTIONS.map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => handleGoal(opt.key)}
                    style={{
                      width: '100%', background: goal === opt.key ? C.accentDark : 'transparent',
                      border: `1px solid ${goal === opt.key ? C.accent : C.cardBorder}`,
                      borderRadius: 10, padding: '10px 14px',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      cursor: 'pointer', textAlign: 'left',
                    }}
                  >
                    <span style={{ color: goal === opt.key ? C.accent : C.text, fontSize: 14, fontFamily: C.bodyFont }}>{opt.label}</span>
                    {goal === opt.key && <Check size={14} color={C.accent} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Rest Timer */}
          <div style={{ borderBottom: `1px solid ${C.cardBorder}` }}>
            <button
              onClick={() => toggle('rest')}
              style={{ width: '100%', background: 'none', border: 'none', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', textAlign: 'left' }}
            >
              <div>
                <p style={{ color: C.text, fontSize: 14, fontWeight: 500, margin: 0 }}>Rest Timer</p>
                <p style={{ color: C.muted, fontSize: 12, margin: '2px 0 0' }}>{restLabel} default</p>
              </div>
              {openSection === 'rest'
                ? <ChevronDown size={16} color={C.dim} />
                : <ChevronRight size={16} color={C.dim} />}
            </button>
            {openSection === 'rest' && (
              <div style={{ padding: '0 16px 14px', display: 'flex', gap: 8 }}>
                {REST_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => handleRestTimer(opt.value)}
                    style={{
                      flex: 1, background: restTimer === opt.value ? C.accentDark : 'transparent',
                      border: `1px solid ${restTimer === opt.value ? C.accent : C.cardBorder}`,
                      borderRadius: 10, padding: '10px 0',
                      color: restTimer === opt.value ? C.accent : C.muted,
                      fontSize: 14, fontFamily: C.font, cursor: 'pointer', transition: 'all 0.15s',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Workout History */}
          <button
            onClick={() => navigate('/history')}
            style={{ width: '100%', background: 'none', border: 'none', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', textAlign: 'left' }}
          >
            <div>
              <p style={{ color: C.text, fontSize: 14, fontWeight: 500, margin: 0 }}>Workout History</p>
              <p style={{ color: C.muted, fontSize: 12, margin: '2px 0 0' }}>
                {stats.total === 0 ? 'No sessions yet' : `${stats.total} session${stats.total !== 1 ? 's' : ''} logged`}
              </p>
            </div>
            <ChevronRight size={16} color={C.dim} />
          </button>

        </div>
      </div>
    </div>
  );
}
