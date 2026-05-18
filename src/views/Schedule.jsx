import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, RefreshCw, Dumbbell, Wind, Heart, Pencil, Plus } from 'lucide-react';
import StatusBar from '../components/StatusBar';
import { C } from '../lib/theme';
import {
  getCachedSchedule, generateSchedule, clearSchedule,
  getManualOverrides, setManualOverride, clearManualOverride,
} from '../lib/aiSchedule';
import { saveScheduleToCloud } from '../lib/workoutHistory';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const TYPE_META = {
  strength: { color: C.accent,   label: 'Strength', icon: Dumbbell },
  cardio:   { color: '#ff8c42',  label: 'Cardio',   icon: Wind     },
  recovery: { color: '#a78bfa',  label: 'Recovery', icon: Heart    },
  rest:     { color: C.muted,    label: 'Rest',      icon: null    },
};

function buildCalendar(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

function toDateKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/* ── Generate screen ── */
function GenerateScreen({ onGenerate }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 32px', textAlign: 'center', gap: 24 }}>
      <div style={{ width: 72, height: 72, borderRadius: 22, background: C.accentDark, border: `1px solid ${C.accentBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Sparkles size={32} color={C.accent} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <h2 style={{ color: C.text, fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: '-0.5px', fontFamily: C.font }}>
          AI Workout Schedule
        </h2>
        <p style={{ color: C.muted, fontSize: 14, margin: 0, lineHeight: 1.7 }}>
          Your AI trainer will build a personalized 4-week progressive plan starting{' '}
          <span style={{ color: C.accent }}>Monday, May 18</span>.
        </p>
      </div>
      <div style={{ background: C.surface, border: `1px solid ${C.cardBorder}`, borderRadius: 14, padding: '16px 18px', width: '100%', textAlign: 'left' }}>
        {['Beginner-friendly progression', 'Strength · Cardio · Recovery balance', 'Week-by-week intensity increase'].map(item => (
          <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.accent, flexShrink: 0 }} />
            <span style={{ color: C.muted, fontSize: 13 }}>{item}</span>
          </div>
        ))}
      </div>
      <button
        onClick={onGenerate}
        style={{ width: '100%', background: C.accent, border: 'none', borderRadius: 14, padding: '16px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer', fontFamily: C.font }}
      >
        <Sparkles size={16} color="#020d0a" />
        <span style={{ color: '#020d0a', fontSize: 16, fontWeight: 700, letterSpacing: '-0.3px' }}>Build My Schedule</span>
      </button>
    </div>
  );
}

/* ── Generating progress screen ── */
function GeneratingScreen({ chunk }) {
  const pct = Math.min(chunk ? Math.floor(chunk.length / 80) * 5 : 0, 95);
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 32px', gap: 28 }}>
      <div style={{ width: 72, height: 72, borderRadius: 22, background: C.accentDark, border: `1px solid ${C.accentBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Sparkles size={28} color={C.accent} />
      </div>
      <div style={{ textAlign: 'center', gap: 8, display: 'flex', flexDirection: 'column' }}>
        <p style={{ color: C.text, fontSize: 16, fontWeight: 600, margin: 0, fontFamily: C.font }}>AI Trainer is thinking…</p>
        <p style={{ color: C.muted, fontSize: 13, margin: 0 }}>Building your personalized 4-week plan</p>
      </div>
      <div style={{ width: '100%', background: C.surface, borderRadius: 100, height: 6, overflow: 'hidden', border: `1px solid ${C.cardBorder}` }}>
        <div style={{ width: `${pct}%`, height: '100%', background: C.accent, borderRadius: 100, transition: 'width 0.4s ease' }} />
      </div>
      <p style={{ color: C.dim, fontSize: 12, margin: 0 }}>This takes ~15 seconds…</p>
    </div>
  );
}

/* ── Edit bottom sheet ── */
function EditSheet({ dateLabel, currentWorkout, hasOverride, onSave, onClear, onClose }) {
  const [form, setForm] = useState({
    type: currentWorkout?.type || 'strength',
    name: currentWorkout?.type !== 'rest' ? (currentWorkout?.name || '') : '',
    duration: currentWorkout?.type !== 'rest' ? (currentWorkout?.duration || '') : '',
  });

  function handleSave() {
    const workout = form.type === 'rest'
      ? { type: 'rest', name: 'Rest Day', duration: '', exercises: [] }
      : { type: form.type, name: form.name || 'Custom Workout', duration: form.duration, exercises: [] };
    onSave(workout);
  }

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 100 }} />
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 393, background: '#0c1f1a',
        borderRadius: '20px 20px 0 0', border: `1px solid ${C.cardBorder}`,
        padding: '24px 20px 44px', zIndex: 101,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
          <p style={{ color: C.text, fontSize: 17, fontWeight: 700, margin: 0, fontFamily: C.font }}>Edit Day</p>
          <p style={{ color: C.muted, fontSize: 13, margin: 0 }}>{dateLabel}</p>
        </div>

        {/* Type selector */}
        <p style={{ color: C.muted, fontSize: 11, margin: '0 0 10px', letterSpacing: '0.6px', textTransform: 'uppercase', fontFamily: C.font }}>Type</p>
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {Object.entries(TYPE_META).map(([type, meta]) => (
            <button
              key={type}
              onClick={() => setForm(f => ({ ...f, type }))}
              style={{
                padding: '8px 16px', borderRadius: 100, flexShrink: 0,
                background: form.type === type ? `${meta.color}22` : 'transparent',
                border: `1px solid ${form.type === type ? meta.color : C.cardBorder}`,
                color: form.type === type ? meta.color : C.dim,
                fontSize: 12, fontFamily: C.font, cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              {meta.label}
            </button>
          ))}
        </div>

        {/* Name + Duration — hidden for rest days */}
        {form.type !== 'rest' && (
          <>
            <p style={{ color: C.muted, fontSize: 11, margin: '0 0 8px', letterSpacing: '0.6px', textTransform: 'uppercase', fontFamily: C.font }}>Name</p>
            <input
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Leg Day"
              style={{ width: '100%', background: C.bg, border: `1px solid ${C.cardBorder}`, borderRadius: 10, padding: '12px 14px', color: C.text, fontSize: 15, fontFamily: C.bodyFont, marginBottom: 16, boxSizing: 'border-box', outline: 'none' }}
            />
            <p style={{ color: C.muted, fontSize: 11, margin: '0 0 8px', letterSpacing: '0.6px', textTransform: 'uppercase', fontFamily: C.font }}>Duration</p>
            <input
              value={form.duration}
              onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
              placeholder="e.g. 45 min"
              style={{ width: '100%', background: C.bg, border: `1px solid ${C.cardBorder}`, borderRadius: 10, padding: '12px 14px', color: C.text, fontSize: 15, fontFamily: C.bodyFont, marginBottom: 20, boxSizing: 'border-box', outline: 'none' }}
            />
          </>
        )}

        {form.type === 'rest' && <div style={{ height: 16 }} />}

        <button
          onClick={handleSave}
          style={{ width: '100%', background: C.accent, border: 'none', borderRadius: 12, padding: '14px 0', color: '#020d0a', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: C.font, marginBottom: 10 }}
        >
          Save
        </button>

        {hasOverride && (
          <button
            onClick={onClear}
            style={{ width: '100%', background: 'none', border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: '12px 0', color: C.muted, fontSize: 14, cursor: 'pointer', fontFamily: C.font }}
          >
            Restore AI Plan
          </button>
        )}
      </div>
    </>
  );
}

/* ── Main ── */
export default function Schedule() {
  const today = new Date();
  const [year, setYear]     = useState(today.getFullYear());
  const [month, setMonth]   = useState(today.getMonth());
  const [selected, setSelected] = useState(today.getDate());

  const [schedule, setSchedule]             = useState(null);
  const [overrides, setOverrides]           = useState({});
  const [generating, setGenerating]         = useState(false);
  const [chunk, setChunk]                   = useState('');
  const [error, setError]                   = useState(null);
  const [editOpen, setEditOpen]             = useState(false);

  useEffect(() => {
    const cached = getCachedSchedule();
    if (cached) setSchedule(cached);
    setOverrides(getManualOverrides());
  }, []);

  const mergedSchedule = schedule ? { ...schedule, ...overrides } : null;
  const selectedKey    = toDateKey(year, month, selected);
  const selectedWorkout = mergedSchedule?.[selectedKey] ?? null;
  const hasOverride    = !!overrides[selectedKey];

  async function handleGenerate() {
    setGenerating(true); setError(null); setChunk('');
    await generateSchedule({
      onChunk: text => setChunk(text),
      onDone:  s    => {
        setSchedule(s);
        setGenerating(false);
        saveScheduleToCloud(s).catch(err => console.error('Cloud save failed:', err));
      },
      onError: err  => { setError(err.message); setGenerating(false); },
    });
  }

  function handleRegenerate() { clearSchedule(); setSchedule(null); setError(null); }

  function handleSaveOverride(workout) {
    setManualOverride(selectedKey, workout);
    setOverrides(prev => ({ ...prev, [selectedKey]: workout }));
    setEditOpen(false);
  }

  function handleClearOverride() {
    clearManualOverride(selectedKey);
    setOverrides(prev => { const n = { ...prev }; delete n[selectedKey]; return n; });
    setEditOpen(false);
  }

  const cells = buildCalendar(year, month);

  function prevMonth() { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); }
  function nextMonth() { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); }

  const showCalendar = !!schedule && !generating;

  return (
    <div style={{ background: C.bg, fontFamily: C.bodyFont, minHeight: '100vh', paddingBottom: 100, display: 'flex', flexDirection: 'column' }}>
      <StatusBar />

      {/* Header */}
      <div style={{ padding: '16px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <h1 style={{ color: C.text, fontSize: 26, fontWeight: 700, margin: 0, letterSpacing: '-0.6px', fontFamily: C.font }}>Schedule</h1>
        {showCalendar && (
          <button
            onClick={handleRegenerate}
            style={{ background: 'none', border: `1px solid ${C.cardBorder}`, borderRadius: 20, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
          >
            <RefreshCw size={13} color={C.muted} />
            <span style={{ color: C.muted, fontSize: 13, fontFamily: C.font }}>Redo</span>
          </button>
        )}
      </div>

      {generating ? (
        <GeneratingScreen chunk={chunk} />
      ) : !schedule ? (
        <>
          {error && (
            <div style={{ margin: '16px 20px 0', background: '#3d1a1a', border: '1px solid #ff4444', borderRadius: 12, padding: '12px 16px' }}>
              <p style={{ color: '#ff8888', fontSize: 13, margin: 0, lineHeight: 1.6 }}>{error}</p>
            </div>
          )}
          <GenerateScreen onGenerate={handleGenerate} />
        </>
      ) : (
        <>
          {/* Month nav */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 20px 12px' }}>
            <button onClick={prevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6 }}><ChevronLeft size={20} color={C.muted} /></button>
            <span style={{ color: C.text, fontSize: 16, fontWeight: 600, letterSpacing: '-0.3px', fontFamily: C.font }}>{MONTH_NAMES[month]} {year}</span>
            <button onClick={nextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6 }}><ChevronRight size={20} color={C.muted} /></button>
          </div>

          {/* Day headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', padding: '0 16px', marginBottom: 4 }}>
            {DAY_NAMES.map(d => (
              <div key={d} style={{ textAlign: 'center', paddingBottom: 8 }}>
                <span style={{ color: C.dim, fontSize: 11, letterSpacing: '0.5px', fontFamily: C.font }}>{d}</span>
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', padding: '0 16px', gap: '4px 0' }}>
            {cells.map((day, i) => {
              if (!day) return <div key={`e-${i}`} />;
              const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
              const isSel   = day === selected;
              const workout = mergedSchedule[toDateKey(year, month, day)];
              const dotColor = workout ? TYPE_META[workout.type]?.color : null;
              const isManual = !!overrides[toDateKey(year, month, day)];
              return (
                <button
                  key={day}
                  onClick={() => setSelected(day)}
                  style={{
                    background: isSel ? C.accent : isToday ? C.accentDark : 'transparent',
                    border: isToday && !isSel ? `1px solid ${C.accentBorder}` : '1px solid transparent',
                    borderRadius: 10, height: 44,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    gap: 3, cursor: 'pointer', position: 'relative',
                  }}
                >
                  <span style={{ color: isSel ? '#020d0a' : isToday ? C.accent : C.text, fontSize: 14, fontWeight: isSel || isToday ? 700 : 400, fontFamily: C.font }}>
                    {day}
                  </span>
                  {dotColor && <div style={{ width: 4, height: 4, borderRadius: '50%', background: isSel ? '#020d0a' : dotColor }} />}
                  {isManual && !isSel && (
                    <div style={{ position: 'absolute', top: 4, right: 6, width: 4, height: 4, borderRadius: '50%', background: C.accent, opacity: 0.6 }} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: 14, padding: '14px 20px 0', flexWrap: 'wrap' }}>
            {Object.entries(TYPE_META).map(([type, { color, label }]) => (
              <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: color }} />
                <span style={{ color: C.dim, fontSize: 11, fontFamily: C.font }}>{label}</span>
              </div>
            ))}
          </div>

          {/* Selected day panel */}
          <div style={{ margin: '20px 20px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <p style={{ color: C.muted, fontSize: 12, margin: 0, letterSpacing: '0.6px', textTransform: 'uppercase', fontFamily: C.font }}>
                {MONTH_NAMES[month]} {selected}
                {hasOverride && <span style={{ color: C.accent, marginLeft: 8 }}>· edited</span>}
              </p>
              <button
                onClick={() => setEditOpen(true)}
                style={{ background: C.chipBg, border: `1px solid ${C.cardBorder}`, borderRadius: 20, padding: '5px 12px', display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer' }}
              >
                {selectedWorkout ? <Pencil size={12} color={C.muted} /> : <Plus size={12} color={C.muted} />}
                <span style={{ color: C.muted, fontSize: 12, fontFamily: C.font }}>{selectedWorkout ? 'Edit' : 'Add'}</span>
              </button>
            </div>

            {selectedWorkout ? (() => {
              const meta = TYPE_META[selectedWorkout.type] || TYPE_META.rest;
              const Icon = meta.icon;
              return (
                <div style={{ background: C.surface, border: `1px solid ${meta.color}33`, borderRadius: 14, padding: '16px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: selectedWorkout.exercises?.length ? 12 : 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {Icon && (
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: `${meta.color}1a`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icon size={17} color={meta.color} />
                        </div>
                      )}
                      <div>
                        <p style={{ color: C.text, fontSize: 15, fontWeight: 600, margin: 0 }}>{selectedWorkout.name}</p>
                        {selectedWorkout.duration && <p style={{ color: C.muted, fontSize: 12, margin: '2px 0 0' }}>{selectedWorkout.duration}</p>}
                      </div>
                    </div>
                    <span style={{ fontSize: 10, fontFamily: C.font, padding: '3px 10px', borderRadius: 20, color: meta.color, background: `${meta.color}1a`, border: `1px solid ${meta.color}44`, whiteSpace: 'nowrap' }}>
                      {meta.label}
                    </span>
                  </div>
                  {selectedWorkout.exercises?.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {selectedWorkout.exercises.map(ex => (
                        <span key={ex} style={{ fontSize: 11, fontFamily: C.font, color: C.muted, background: C.chipBg, borderRadius: 20, padding: '4px 10px' }}>
                          {ex}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })() : (
              <div style={{ background: C.surface, border: `1px solid ${C.cardBorder}`, borderRadius: 14, padding: '24px 20px', textAlign: 'center' }}>
                <p style={{ color: C.muted, fontSize: 14, margin: 0 }}>No workout scheduled</p>
              </div>
            )}
          </div>

          {/* AI attribution */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '18px 20px 0' }}>
            <Sparkles size={12} color={C.dim} />
            <span style={{ color: C.dim, fontSize: 11, fontFamily: C.font }}>Generated by AI Trainer · claude-opus-4-7</span>
          </div>
        </>
      )}

      {/* Edit sheet */}
      {editOpen && (
        <EditSheet
          dateLabel={`${MONTH_NAMES[month]} ${selected}`}
          currentWorkout={selectedWorkout}
          hasOverride={hasOverride}
          onSave={handleSaveOverride}
          onClear={handleClearOverride}
          onClose={() => setEditOpen(false)}
        />
      )}
    </div>
  );
}
