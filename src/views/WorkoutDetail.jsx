import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Play, Clock, Dumbbell, Repeat, Info, ChevronDown, ChevronUp } from 'lucide-react';
import StatusBar from '../components/StatusBar';
import ExerciseImage from '../components/ExerciseImage';
import { WORKOUTS } from '../lib/exercises';
import { C } from '../lib/theme';

const MUSCLE_COLORS = {
  Biceps: '#28ffbf', Triceps: '#ff8c42', Deltoids: '#a78bfa',
  'Side Delts': '#a78bfa', Brachialis: '#28ffbf',
};

export default function WorkoutDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const workout = WORKOUTS[id] || WORKOUTS.today;
  const [expandedIdx, setExpandedIdx] = useState(null);

  const totalSets = workout.exercises.reduce((a, e) => a + e.sets, 0);
  const totalTime = Math.round(workout.exercises.length * 7);

  return (
    <div style={{ background: C.bg, fontFamily: C.font, minHeight: '100vh', paddingBottom: 100 }}>
      <StatusBar />

      {/* Nav */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2, padding: '6px 8px' }}>
          <ChevronLeft size={20} color={C.accent} />
          <span style={{ color: C.accent, fontSize: 15, fontFamily: C.font }}>Back</span>
        </button>
      </div>

      {/* Title block */}
      <div style={{ padding: '4px 20px 20px', borderBottom: `1px solid ${C.cardBorder}` }}>
        <span style={{ display: 'inline-block', background: C.chipAccentBg, border: `1px solid ${C.accentBorder}`, borderRadius: 20, padding: '3px 12px', fontSize: 11, color: C.accent, letterSpacing: '0.5px', marginBottom: 10, fontFamily: C.font }}>
          {workout.tag}
        </span>
        <h1 style={{ color: C.text, fontSize: 28, fontWeight: 700, margin: '0 0 16px', letterSpacing: '-0.7px' }}>{workout.name}</h1>

        <div style={{ display: 'flex', gap: 10 }}>
          {[
            { icon: Dumbbell, label: 'Exercises', value: workout.exercises.length },
            { icon: Repeat,   label: 'Sets',      value: totalSets },
            { icon: Clock,    label: 'Est. Time',  value: `${totalTime} min` },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} style={{ flex: 1, background: C.statBg, borderRadius: 12, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'center' }}>
              <Icon size={16} color={C.accent} />
              <p style={{ color: C.text, fontSize: 15, fontWeight: 600, margin: 0 }}>{value}</p>
              <p style={{ color: C.muted, fontSize: 10, margin: 0, letterSpacing: '0.3px' }}>{label.toUpperCase()}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Trainer tip */}
      <div style={{ margin: '20px 20px 0', background: C.accentDark, border: `1px solid ${C.accentBorder}`, borderRadius: 14, padding: 16 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <Info size={16} color={C.accent} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ color: C.accent, fontSize: 12, fontWeight: 700, margin: '0 0 4px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>AI Trainer Tip</p>
            <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.6, margin: 0 }}>{workout.tip}</p>
          </div>
        </div>
      </div>

      {/* Exercise list */}
      <div style={{ padding: '24px 20px 0' }}>
        <p style={{ color: C.muted, fontSize: 12, margin: '0 0 14px', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
          Tap an exercise to see the reference
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {workout.exercises.map((ex, idx) => {
            const isOpen = expandedIdx === idx;
            return (
              <div
                key={ex.name}
                style={{
                  background: C.surface,
                  border: `1px solid ${isOpen ? C.accentBorder : C.cardBorder}`,
                  borderRadius: 14,
                  overflow: 'hidden',
                  transition: 'border-color 0.2s',
                }}
              >
                <button
                  onClick={() => setExpandedIdx(isOpen ? null : idx)}
                  style={{ width: '100%', background: 'none', border: 'none', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', textAlign: 'left' }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: C.chipBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ color: C.muted, fontSize: 13, fontWeight: 700 }}>{String(idx + 1).padStart(2, '0')}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: C.text, fontSize: 15, fontWeight: 600, margin: 0 }}>{ex.name}</p>
                    <p style={{ color: C.muted, fontSize: 12, margin: '3px 0 0' }}>
                      {ex.sets} sets · {ex.reps} reps · {ex.weight}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    <span style={{
                      fontSize: 10, fontFamily: C.font, padding: '3px 9px', borderRadius: 20,
                      color: MUSCLE_COLORS[ex.muscle] || C.accent,
                      background: `${(MUSCLE_COLORS[ex.muscle] || C.accent)}1a`,
                      border: `1px solid ${(MUSCLE_COLORS[ex.muscle] || C.accent)}44`,
                      whiteSpace: 'nowrap',
                    }}>
                      {ex.muscle}
                    </span>
                    {isOpen
                      ? <ChevronUp size={16} color={C.muted} />
                      : <ChevronDown size={16} color={C.dim} />}
                  </div>
                </button>

                {isOpen && (
                  <div style={{ padding: '0 16px 16px' }}>
                    <ExerciseImage name={ex.name} height={220} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Start button */}
      <div style={{ padding: '28px 20px 0' }}>
        <button
          onClick={() => navigate('/active')}
          style={{
            width: '100%', background: C.accent, border: 'none', borderRadius: 14,
            padding: '16px 0', display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 10, cursor: 'pointer', fontFamily: C.font,
          }}
        >
          <Play size={18} color="#020d0a" fill="#020d0a" />
          <span style={{ color: '#020d0a', fontSize: 16, fontWeight: 700, letterSpacing: '-0.3px' }}>Start Workout</span>
        </button>
      </div>
    </div>
  );
}
