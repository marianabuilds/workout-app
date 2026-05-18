import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronDown, ChevronUp, Plus, Minus, Check, Timer, X, Sparkles } from 'lucide-react';
import StatusBar from '../components/StatusBar';
import ExerciseImage from '../components/ExerciseImage';
import { useRestTimer } from '../hooks/useRestTimer';
import { WORKOUTS } from '../lib/exercises';
import { getCachedSchedule, getManualOverrides } from '../lib/aiSchedule';
import { getWarmupForWorkout, getStretchTip } from '../lib/stretches';
import { saveWorkoutSession, getLastSession, getRestTimerDefault } from '../lib/sessionHistory';
import { C } from '../lib/theme';

const TYPE_COLORS = {
  strength: C.accent,
  cardio: '#ff8c42',
  recovery: '#a78bfa',
  rest: C.muted,
};

function makeDateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getWorkoutData() {
  const selectedKey = sessionStorage.getItem('selectedDateKey') || makeDateKey(new Date());
  const schedule = { ...(getCachedSchedule() || {}), ...(getManualOverrides() || {}) };
  const aiDay = schedule[selectedKey];
  if (aiDay && aiDay.exercises?.length > 0) {
    return { name: aiDay.name, type: aiDay.type, duration: aiDay.duration, exercises: aiDay.exercises };
  }
  return {
    name: WORKOUTS.today.name,
    type: 'strength',
    duration: '~40 min',
    exercises: WORKOUTS.today.exercises.map(e => e.name),
  };
}

/* ── Intensity levels ──────────────────────────────────────────── */
const INTENSITIES = {
  fullsend: {
    key: 'fullsend', label: 'Full Send', emoji: '🔥',
    color: '#ff6b35', bg: '#ff6b3518', border: '#ff6b3540',
    desc: 'Your body is primed. Push your best numbers today.',
    note: '+10% weight · +1 rep per set',
  },
  standard: {
    key: 'standard', label: 'Standard', emoji: '💪',
    color: C.accent, bg: C.chipAccentBg, border: C.accentBorder,
    desc: "You're ready. Stick to your planned weights and sets.",
    note: 'As planned',
  },
  modified: {
    key: 'modified', label: 'Modified', emoji: '🎯',
    color: '#fbbf24', bg: '#fbbf2418', border: '#fbbf2440',
    desc: 'Save energy for quality reps. Drop weight 10%, keep sets.',
    note: '−10% weight · same sets',
  },
  recovery: {
    key: 'recovery', label: 'Recovery Mode', emoji: '🌊',
    color: '#a78bfa', bg: '#a78bfa18', border: '#a78bfa40',
    desc: 'Light session — 2 sets, lighter weight, full focus on form.',
    note: '2 sets · −25% weight',
  },
};

function scoreToIntensity(energy, sleep, soreness) {
  // energy 1-5 + sleep 0-2 + soreness 0-2 → range 1–9
  const score = energy + sleep + soreness;
  if (score >= 8) return INTENSITIES.fullsend;
  if (score >= 6) return INTENSITIES.standard;
  if (score >= 4) return INTENSITIES.modified;
  return INTENSITIES.recovery;
}

function buildExerciseLogs(exerciseNames, intensity) {
  return exerciseNames.map(name => {
    const known = WORKOUTS.today.exercises.find(e => e.name === name);
    const rawSets   = known?.sets ?? 3;
    const rawReps   = parseInt(known?.reps ?? '10');
    const rawWeight = !known || known.weight === 'BW' ? 0 : parseInt(known.weight);

    let sets = rawSets, weight = rawWeight, reps = rawReps;

    if (intensity.key === 'fullsend') {
      weight = rawWeight > 0 ? Math.round(rawWeight * 1.1 / 5) * 5 : 0;
      reps   = rawReps + 1;
    } else if (intensity.key === 'modified') {
      weight = rawWeight > 0 ? Math.max(5, Math.round(rawWeight * 0.9 / 5) * 5) : 0;
    } else if (intensity.key === 'recovery') {
      sets   = Math.min(2, rawSets);
      weight = rawWeight > 0 ? Math.max(5, Math.round(rawWeight * 0.75 / 5) * 5) : 0;
    }

    return {
      name, sets, reps, weight,
      logs: Array.from({ length: sets }, () => ({ reps, weight, done: false })),
    };
  });
}

/* ── Check-in sub-components ───────────────────────────────────── */
const ENERGY_OPTS = [
  { value: 1, emoji: '😴', label: 'Drained' },
  { value: 2, emoji: '😕', label: 'Low' },
  { value: 3, emoji: '😐', label: 'Okay' },
  { value: 4, emoji: '😊', label: 'Good' },
  { value: 5, emoji: '🔥', label: 'Fired up' },
];
const SLEEP_OPTS    = [{ value: 0, label: 'Poor' }, { value: 1, label: 'Average' }, { value: 2, label: 'Good' }];
const SORENESS_OPTS = [{ value: 0, label: 'Pretty sore' }, { value: 1, label: 'A little' }, { value: 2, label: 'Fresh' }];

function Section({ label, children }) {
  return (
    <div style={{ padding: '22px 20px 0' }}>
      <p style={{ color: C.text, fontSize: 14, fontWeight: 600, margin: '0 0 12px', fontFamily: C.font }}>{label}</p>
      {children}
    </div>
  );
}

function ChipBtn({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, background: active ? C.accentDark : C.surface,
      border: `1.5px solid ${active ? C.accent : C.cardBorder}`,
      borderRadius: 12, padding: '12px 6px',
      color: active ? C.accent : C.muted, fontSize: 13, fontFamily: C.font,
      fontWeight: active ? 600 : 400, cursor: 'pointer', transition: 'all 0.15s',
    }}>
      {label}
    </button>
  );
}

function CheckInScreen({ workoutName, onStart, onBack }) {
  const [energy,   setEnergy]   = useState(null);
  const [sleep,    setSleep]    = useState(null);
  const [soreness, setSoreness] = useState(null);

  const allSet = energy !== null && sleep !== null && soreness !== null;
  const rec    = allSet ? scoreToIntensity(energy, sleep, soreness) : null;

  return (
    <div style={{ background: C.bg, fontFamily: C.bodyFont, minHeight: '100vh', paddingBottom: 100 }}>
      <StatusBar />

      <div style={{ display: 'flex', alignItems: 'center', padding: '8px 16px 0' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2, padding: '6px 4px' }}>
          <ChevronLeft size={20} color={C.accent} />
          <span style={{ color: C.accent, fontSize: 15, fontFamily: C.font }}>Back</span>
        </button>
      </div>

      <div style={{ padding: '20px 20px 0' }}>
        <p style={{ color: C.muted, fontSize: 12, margin: '0 0 4px', letterSpacing: '0.8px', textTransform: 'uppercase', fontFamily: C.font }}>{workoutName}</p>
        <h1 style={{ color: C.text, fontSize: 28, fontWeight: 700, margin: 0, letterSpacing: '-0.7px', lineHeight: 1.2, fontFamily: C.font }}>
          How are you<br />feeling today?
        </h1>
        <p style={{ color: C.muted, fontSize: 13, margin: '8px 0 0', lineHeight: 1.6 }}>
          Three honest answers. Your workout intensity adjusts automatically — backed by real readiness science.
        </p>
      </div>

      {/* Energy */}
      <Section label="Energy level">
        <div style={{ display: 'flex', gap: 6 }}>
          {ENERGY_OPTS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setEnergy(opt.value)}
              style={{
                flex: 1, background: energy === opt.value ? C.accentDark : C.surface,
                border: `1.5px solid ${energy === opt.value ? C.accent : C.cardBorder}`,
                borderRadius: 14, padding: '12px 2px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              <span style={{ fontSize: 22 }}>{opt.emoji}</span>
              <span style={{ color: energy === opt.value ? C.accent : C.dim, fontSize: 9, fontFamily: C.font, letterSpacing: '0.2px' }}>{opt.label}</span>
            </button>
          ))}
        </div>
      </Section>

      {/* Sleep */}
      <Section label="Last night's sleep">
        <div style={{ display: 'flex', gap: 8 }}>
          {SLEEP_OPTS.map(opt => <ChipBtn key={opt.value} label={opt.label} active={sleep === opt.value} onClick={() => setSleep(opt.value)} />)}
        </div>
      </Section>

      {/* Soreness */}
      <Section label="Muscle soreness">
        <div style={{ display: 'flex', gap: 8 }}>
          {SORENESS_OPTS.map(opt => <ChipBtn key={opt.value} label={opt.label} active={soreness === opt.value} onClick={() => setSoreness(opt.value)} />)}
        </div>
      </Section>

      {/* Live recommendation */}
      {rec && (
        <div style={{ margin: '24px 20px 0', background: rec.bg, border: `1px solid ${rec.border}`, borderRadius: 16, padding: '16px 18px' }}>
          <p style={{ color: rec.color, fontSize: 10, letterSpacing: '0.8px', textTransform: 'uppercase', margin: '0 0 10px', fontFamily: C.font }}>
            Today's recommendation
          </p>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <span style={{ fontSize: 30, lineHeight: 1 }}>{rec.emoji}</span>
            <div style={{ flex: 1 }}>
              <p style={{ color: C.text, fontSize: 16, fontWeight: 700, margin: 0, fontFamily: C.font }}>{rec.label}</p>
              <p style={{ color: C.muted, fontSize: 13, margin: '4px 0 8px', lineHeight: 1.55 }}>{rec.desc}</p>
              <span style={{
                display: 'inline-block', background: rec.bg, border: `1px solid ${rec.border}`,
                borderRadius: 20, padding: '3px 10px', fontSize: 11, color: rec.color, fontFamily: C.font,
              }}>
                {rec.note}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <div style={{ padding: '24px 20px 0' }}>
        <button
          disabled={!allSet}
          onClick={() => onStart(rec, energy)}
          style={{
            width: '100%', background: allSet ? C.accent : C.chipBg,
            border: 'none', borderRadius: 14, padding: '16px 0',
            color: allSet ? '#020d0a' : C.dim, fontSize: 16, fontWeight: 700,
            fontFamily: C.font, cursor: allSet ? 'pointer' : 'default',
            letterSpacing: '-0.3px', transition: 'all 0.2s',
          }}
        >
          {allSet ? 'Begin Workout' : 'Answer all questions above'}
        </button>
      </div>
    </div>
  );
}

/* ── Rest timer overlay ────────────────────────────────────────── */
function TimerOverlay({ timeLeft, maxTime, onStop, onAdd }) {
  const r = 54, circ = 2 * Math.PI * r, pct = Math.max(0, timeLeft / maxTime);
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(2,13,10,0.96)', zIndex: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28 }}>
      <p style={{ color: C.muted, fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', margin: 0, fontFamily: C.font }}>Rest Timer</p>
      <svg width="148" height="148" viewBox="0 0 148 148">
        <circle cx="74" cy="74" r={r} fill="none" stroke={C.accentDark} strokeWidth="8" />
        <circle cx="74" cy="74" r={r} fill="none" stroke={C.accent} strokeWidth="8"
          strokeDasharray={`${circ * pct} ${circ}`} strokeLinecap="round"
          transform="rotate(-90 74 74)" style={{ transition: 'stroke-dasharray 1s linear' }}
        />
        <text x="74" y="70" textAnchor="middle" dominantBaseline="middle" fill={C.text} fontSize="36" fontWeight="700" fontFamily={C.font}>{timeLeft}</text>
        <text x="74" y="94" textAnchor="middle" fill={C.muted} fontSize="12" fontFamily={C.font}>seconds</text>
      </svg>
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={() => onAdd(-15)} style={{ background: C.chipBg, border: `1px solid ${C.cardBorder}`, borderRadius: 10, padding: '10px 20px', color: C.muted, fontFamily: C.font, fontSize: 14, cursor: 'pointer' }}>−15s</button>
        <button onClick={() => onAdd(15)}  style={{ background: C.chipBg, border: `1px solid ${C.cardBorder}`, borderRadius: 10, padding: '10px 20px', color: C.muted, fontFamily: C.font, fontSize: 14, cursor: 'pointer' }}>+15s</button>
      </div>
      <button onClick={onStop} style={{ background: 'none', border: `1.5px solid ${C.cardBorder}`, borderRadius: 10, padding: '10px 32px', color: C.muted, fontFamily: C.font, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
        <X size={14} /> Skip Rest
      </button>
    </div>
  );
}

/* ── Exercise card ─────────────────────────────────────────────── */
function ExerciseCard({ ex, exIdx, isOpen, onToggle, onUpdateSet, onCompleteSet }) {
  const setsCompleted = ex.logs.filter(s => s.done).length;
  const allDone = setsCompleted === ex.logs.length;
  const last = getLastSession(ex.name);

  return (
    <div style={{
      background: C.surface,
      border: `1px solid ${isOpen ? C.accentBorder : allDone ? C.accentBorder + '88' : C.cardBorder}`,
      borderRadius: 16, overflow: 'hidden', transition: 'border-color 0.2s',
    }}>
      <button
        onClick={onToggle}
        style={{ width: '100%', background: 'none', border: 'none', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', textAlign: 'left' }}
      >
        <div style={{
          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
          background: allDone ? C.accent : C.chipBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s',
        }}>
          {allDone
            ? <Check size={16} color="#020d0a" strokeWidth={3} />
            : <span style={{ color: C.muted, fontSize: 13, fontWeight: 700, fontFamily: C.font }}>{String(exIdx + 1).padStart(2, '0')}</span>}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: allDone ? C.muted : C.text, fontSize: 15, fontWeight: 600, margin: 0, textDecoration: allDone ? 'line-through' : 'none' }}>{ex.name}</p>
          <p style={{ color: C.dim, fontSize: 12, margin: '3px 0 0', fontFamily: C.font }}>
            {setsCompleted}/{ex.sets} sets · {ex.reps} reps · {ex.weight > 0 ? `${ex.weight} lb` : 'BW'}
          </p>
          {last && (
            <p style={{ color: C.dim, fontSize: 11, margin: '2px 0 0', fontFamily: C.font, opacity: 0.7 }}>
              Last: {last.weight > 0 ? `${last.weight} lb` : 'BW'} × {last.reps} reps
            </p>
          )}
        </div>
        <div style={{ display: 'flex', gap: 4, flexShrink: 0, marginRight: 6 }}>
          {ex.logs.map((s, i) => (
            <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: s.done ? C.accent : C.cardBorder, transition: 'background 0.2s' }} />
          ))}
        </div>
        {isOpen ? <ChevronUp size={16} color={C.muted} /> : <ChevronDown size={16} color={C.dim} />}
      </button>

      {isOpen && (
        <div style={{ padding: '0 14px 16px' }}>
          <ExerciseImage name={ex.name} height={190} style={{ marginBottom: 16 }} />

          <div style={{ display: 'grid', gridTemplateColumns: '36px 1fr 1fr 40px', gap: 8, paddingBottom: 6 }}>
            {['Set', 'Weight', 'Reps', ''].map(h => (
              <span key={h} style={{ color: C.dim, fontSize: 10, letterSpacing: '0.5px', textTransform: 'uppercase', textAlign: 'center', fontFamily: C.font }}>{h}</span>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {ex.logs.map((set, si) => (
              <div key={si} style={{
                display: 'grid', gridTemplateColumns: '36px 1fr 1fr 40px', gap: 8, alignItems: 'center',
                background: set.done ? C.chipAccentBg : C.bg,
                border: `1px solid ${set.done ? C.accentBorder : C.cardBorder}`,
                borderRadius: 11, padding: '9px 10px', transition: 'all 0.2s',
              }}>
                <span style={{ color: set.done ? C.accent : C.muted, fontSize: 13, fontWeight: 700, textAlign: 'center', fontFamily: C.font }}>{si + 1}</span>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                  <button onClick={() => onUpdateSet(si, 'weight', -5)} style={{ background: C.chipBg, border: 'none', borderRadius: 6, width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Minus size={11} color={C.muted} /></button>
                  <span style={{ color: C.text, fontSize: 13, fontWeight: 600, minWidth: 34, textAlign: 'center', fontFamily: C.font }}>{set.weight > 0 ? `${set.weight}` : 'BW'}</span>
                  <button onClick={() => onUpdateSet(si, 'weight', 5)} style={{ background: C.chipBg, border: 'none', borderRadius: 6, width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Plus size={11} color={C.muted} /></button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                  <button onClick={() => onUpdateSet(si, 'reps', -1)} style={{ background: C.chipBg, border: 'none', borderRadius: 6, width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Minus size={11} color={C.muted} /></button>
                  <span style={{ color: C.text, fontSize: 13, fontWeight: 600, minWidth: 22, textAlign: 'center', fontFamily: C.font }}>{set.reps}</span>
                  <button onClick={() => onUpdateSet(si, 'reps', 1)} style={{ background: C.chipBg, border: 'none', borderRadius: 6, width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Plus size={11} color={C.muted} /></button>
                </div>

                <button onClick={() => onCompleteSet(si)} style={{
                  width: 34, height: 34, borderRadius: 9, margin: '0 auto',
                  background: set.done ? C.accent : 'transparent',
                  border: `1.5px solid ${set.done ? C.accent : C.cardBorder}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}>
                  <Check size={15} color={set.done ? '#020d0a' : C.muted} strokeWidth={set.done ? 3 : 2} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Stretching screen ─────────────────────────────────────────── */
function StretchingScreen({ workoutName, exercises, intensity, energy, onDone, onBack }) {
  const stretches = getWarmupForWorkout(exercises);
  const tip = getStretchTip(intensity, energy);
  const [checked, setChecked] = useState(new Set());
  const [expandedIdx, setExpandedIdx] = useState(null);

  function toggle(i) {
    setChecked(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  function toggleExpand(i) {
    setExpandedIdx(prev => (prev === i ? null : i));
  }

  const allDone = checked.size >= stretches.length;

  return (
    <div style={{ background: C.bg, fontFamily: C.bodyFont, minHeight: '100vh', paddingBottom: 100 }}>
      <StatusBar />

      <div style={{ display: 'flex', alignItems: 'center', padding: '8px 16px 0' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2, padding: '6px 4px' }}>
          <ChevronLeft size={20} color={C.accent} />
          <span style={{ color: C.accent, fontSize: 15, fontFamily: C.font }}>Back</span>
        </button>
      </div>

      {/* Header */}
      <div style={{ padding: '16px 20px 0' }}>
        <p style={{ color: C.muted, fontSize: 12, margin: '0 0 4px', letterSpacing: '0.8px', textTransform: 'uppercase', fontFamily: C.font }}>{workoutName}</p>
        <h1 style={{ color: C.text, fontSize: 28, fontWeight: 700, margin: 0, letterSpacing: '-0.7px', lineHeight: 1.2, fontFamily: C.font }}>
          Warm-up &<br />Stretch
        </h1>
        <p style={{ color: C.muted, fontSize: 13, margin: '8px 0 0', lineHeight: 1.6 }}>
          {checked.size}/{stretches.length} complete · check off each stretch before lifting
        </p>
      </div>

      {/* AI Trainer tip */}
      <div style={{ margin: '16px 20px 0', background: C.accentDark, border: `1px solid ${C.accentBorder}`, borderRadius: 16, padding: '14px 16px' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <Sparkles size={16} color={C.accent} style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <p style={{ color: C.accent, fontSize: 10, letterSpacing: '0.8px', textTransform: 'uppercase', margin: '0 0 6px', fontFamily: C.font }}>
              AI Trainer
            </p>
            <p style={{ color: C.text, fontSize: 13, lineHeight: 1.6, margin: 0 }}>{tip}</p>
          </div>
        </div>
      </div>

      {/* Stretch list */}
      <div style={{ padding: '16px 20px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {stretches.map((stretch, i) => {
          const done = checked.has(i);
          const isExpanded = expandedIdx === i;
          const hasImages = stretch.images?.length > 0;
          return (
            <div
              key={stretch.name}
              style={{
                background: done ? C.chipAccentBg : C.surface,
                border: `1px solid ${done ? C.accentBorder : isExpanded ? C.accentBorder + '88' : C.cardBorder}`,
                borderRadius: 14, overflow: 'hidden',
                transition: 'all 0.2s',
              }}
            >
              {/* Header row — tap to expand image */}
              <button
                onClick={() => toggleExpand(i)}
                style={{
                  width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                  padding: '14px 16px',
                  display: 'flex', alignItems: 'flex-start', gap: 14, textAlign: 'left',
                }}
              >
                <div style={{ flex: 1 }}>
                  <p style={{ color: done ? C.muted : C.text, fontSize: 14, fontWeight: 600, margin: '0 0 4px', textDecoration: done ? 'line-through' : 'none' }}>
                    {stretch.name}
                  </p>
                  <p style={{ color: C.muted, fontSize: 12, margin: '0 0 8px', lineHeight: 1.5 }}>{stretch.desc}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ display: 'inline-block', background: C.chipBg, borderRadius: 20, padding: '3px 10px', fontSize: 11, color: C.dim, fontFamily: C.font }}>
                      {stretch.duration}s
                    </span>
                    {hasImages && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: isExpanded ? C.accent : C.dim, fontFamily: C.font }}>
                        {isExpanded ? <ChevronUp size={12} color={C.accent} /> : <ChevronDown size={12} color={C.dim} />}
                        {isExpanded ? 'Hide' : 'Reference'}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); toggle(i); }}
                  style={{
                    flexShrink: 0, width: 34, height: 34, borderRadius: '50%', marginTop: 2,
                    background: done ? C.accent : 'transparent',
                    border: `1.5px solid ${done ? C.accent : C.cardBorder}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                >
                  <Check size={16} color={done ? '#020d0a' : C.muted} strokeWidth={done ? 3 : 2} />
                </button>
              </button>

              {/* Expandable image area */}
              {isExpanded && (
                <div style={{ padding: '0 14px 14px' }}>
                  <ExerciseImage
                    name={stretch.name}
                    images={stretch.images}
                    height={170}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div style={{ padding: '20px 20px 0' }}>
        <button
          onClick={onDone}
          style={{
            width: '100%',
            background: allDone ? C.accent : C.accentDark,
            border: `1px solid ${C.accentBorder}`,
            borderRadius: 14, padding: '16px 0',
            color: allDone ? '#020d0a' : C.accent,
            fontSize: 16, fontWeight: 700, fontFamily: C.font,
            cursor: 'pointer', letterSpacing: '-0.3px', transition: 'all 0.2s',
          }}
        >
          {allDone ? 'Start Workout' : 'Skip & Start Workout'}
        </button>
        {!allDone && (
          <p style={{ color: C.dim, fontSize: 12, textAlign: 'center', margin: '10px 0 0', fontFamily: C.font }}>
            Complete all stretches for the full warm-up benefit
          </p>
        )}
      </div>
    </div>
  );
}

/* ── Main ──────────────────────────────────────────────────────── */
export default function ActiveWorkout() {
  const navigate = useNavigate();
  const todayData = getWorkoutData();
  const restDefault = getRestTimerDefault();
  const [phase,       setPhase]       = useState('checkin');
  const [intensity,   setIntensity]   = useState(null);
  const [energyScore, setEnergyScore] = useState(null);
  const [logs,        setLogs]        = useState([]);
  const [expandedIdx, setExpandedIdx] = useState(0);
  const { timeLeft, running, start, stop, addTime } = useRestTimer(restDefault);

  function handleStart(selectedIntensity, energy) {
    setIntensity(selectedIntensity);
    setEnergyScore(energy);
    setPhase('stretching');
  }

  function handleStretchDone() {
    setLogs(buildExerciseLogs(todayData.exercises, intensity));
    setPhase('workout');
  }

  if (phase === 'checkin') {
    return <CheckInScreen workoutName={todayData.name} onStart={handleStart} onBack={() => navigate(-1)} />;
  }

  if (phase === 'stretching') {
    return (
      <StretchingScreen
        workoutName={todayData.name}
        exercises={todayData.exercises}
        intensity={intensity}
        energy={energyScore}
        onDone={handleStretchDone}
        onBack={() => setPhase('checkin')}
      />
    );
  }

  const typeColor = TYPE_COLORS[todayData.type] || C.accent;
  const totalDone = logs.flatMap(e => e.logs).filter(s => s.done).length;
  const totalSets = logs.flatMap(e => e.logs).length;
  const progress  = totalSets > 0 ? totalDone / totalSets : 0;
  const allDone   = totalDone === totalSets && totalSets > 0;

  function updateSet(exIdx, setIdx, field, delta) {
    setLogs(prev => prev.map((e, ei) =>
      ei !== exIdx ? e : {
        ...e,
        logs: e.logs.map((s, si) => si !== setIdx ? s : { ...s, [field]: Math.max(0, s[field] + delta) }),
      }
    ));
  }

  function completeSet(exIdx, setIdx) {
    const wasAlreadyDone = logs[exIdx].logs[setIdx].done;
    setLogs(prev => prev.map((e, ei) =>
      ei !== exIdx ? e : {
        ...e,
        logs: e.logs.map((s, si) => si !== setIdx ? s : { ...s, done: !s.done }),
      }
    ));
    if (!wasAlreadyDone) start(restDefault);
  }

  return (
    <div style={{ background: C.bg, fontFamily: C.bodyFont, minHeight: '100vh', paddingBottom: 100 }}>
      {running && timeLeft > 0 && <TimerOverlay timeLeft={timeLeft} maxTime={restDefault} onStop={stop} onAdd={addTime} />}
      <StatusBar />

      {/* Nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2, padding: '6px 4px' }}>
          <ChevronLeft size={20} color={C.accent} />
          <span style={{ color: C.accent, fontSize: 15, fontFamily: C.font }}>Back</span>
        </button>
        <span style={{ color: C.muted, fontSize: 13, fontFamily: C.font }}>{totalDone}/{totalSets} sets</span>
        <button onClick={() => start(restDefault)} style={{ background: C.chipBg, border: `1px solid ${C.cardBorder}`, borderRadius: 8, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
          <Timer size={14} color={C.accent} />
          <span style={{ color: C.accent, fontSize: 13, fontFamily: C.font }}>Rest</span>
        </button>
      </div>

      {/* Progress bar */}
      <div style={{ height: 3, background: C.cardBorder, margin: '0 20px 16px' }}>
        <div style={{ height: '100%', width: `${progress * 100}%`, background: C.accent, borderRadius: 2, transition: 'width 0.4s ease' }} />
      </div>

      {/* Workout header */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
          <span style={{ display: 'inline-block', background: `${typeColor}1a`, border: `1px solid ${typeColor}44`, borderRadius: 20, padding: '3px 12px', fontSize: 10, color: typeColor, letterSpacing: '0.5px', fontFamily: C.font }}>
            {todayData.type?.charAt(0).toUpperCase() + todayData.type?.slice(1)}
          </span>
          {intensity && (
            <span style={{ display: 'inline-block', background: intensity.bg, border: `1px solid ${intensity.border}`, borderRadius: 20, padding: '3px 12px', fontSize: 10, color: intensity.color, letterSpacing: '0.5px', fontFamily: C.font }}>
              {intensity.emoji} {intensity.label}
            </span>
          )}
        </div>
        <h1 style={{ color: C.text, fontSize: 24, fontWeight: 700, margin: 0, letterSpacing: '-0.5px', fontFamily: C.font }}>
          {todayData.name}
        </h1>
        <p style={{ color: C.muted, fontSize: 13, margin: '4px 0 0' }}>
          {todayData.duration} · {logs.length} exercises
        </p>
      </div>

      {/* Exercise list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '0 16px' }}>
        {logs.map((ex, i) => (
          <ExerciseCard
            key={ex.name}
            ex={ex}
            exIdx={i}
            isOpen={expandedIdx === i}
            onToggle={() => setExpandedIdx(expandedIdx === i ? null : i)}
            onUpdateSet={(setIdx, field, delta) => updateSet(i, setIdx, field, delta)}
            onCompleteSet={setIdx => completeSet(i, setIdx)}
          />
        ))}
      </div>

      {allDone && (
        <div style={{ padding: '24px 16px 0' }}>
          <button
            onClick={() => { saveWorkoutSession(logs); navigate('/'); }}
            style={{ width: '100%', background: C.accent, border: 'none', borderRadius: 14, padding: '16px 0', color: '#020d0a', fontSize: 16, fontWeight: 700, fontFamily: C.font, cursor: 'pointer', letterSpacing: '-0.3px' }}
          >
            Finish Workout
          </button>
        </div>
      )}
    </div>
  );
}
