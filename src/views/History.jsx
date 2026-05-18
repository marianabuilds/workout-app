import { useState, useEffect } from 'react';
import { Clock, RotateCcw, Dumbbell, Wind, Heart, Calendar, CloudOff } from 'lucide-react';
import StatusBar from '../components/StatusBar';
import { C } from '../lib/theme';
import { fetchScheduleHistory, fetchScheduleById } from '../lib/workoutHistory';
import { getCachedSchedule } from '../lib/aiSchedule';

const TYPE_COLORS = {
  strength: C.accent,
  cardio:   '#ff8c42',
  recovery: '#a78bfa',
  rest:     C.muted,
};

const TYPE_ICONS = {
  strength: Dumbbell,
  cardio:   Wind,
  recovery: Heart,
};

function formatDate(isoString) {
  const d = new Date(isoString);
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function formatRelative(isoString) {
  const now = new Date();
  const d = new Date(isoString);
  const diffMs = now - d;
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
  return formatDate(isoString);
}

function ScheduleCard({ entry, isActive, onRestore, restoring }) {
  const breakdown = entry.type_breakdown || {};
  const types = ['strength', 'cardio', 'recovery', 'rest'].filter(t => breakdown[t]);

  return (
    <div style={{
      background: isActive ? `${C.accent}0f` : C.surface,
      border: `1px solid ${isActive ? C.accentBorder : C.cardBorder}`,
      borderRadius: 16,
      padding: '16px 18px',
      position: 'relative',
    }}>
      {isActive && (
        <span style={{
          position: 'absolute', top: 14, right: 14,
          fontSize: 9, fontFamily: C.font, color: '#020d0a',
          background: C.accent, borderRadius: 20, padding: '2px 8px',
          letterSpacing: '0.4px', fontWeight: 700,
        }}>
          ACTIVE
        </span>
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 11,
          background: isActive ? C.accentDark : '#1a2e28',
          border: `1px solid ${isActive ? C.accentBorder : C.cardBorder}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Calendar size={17} color={isActive ? C.accent : C.muted} />
        </div>
        <div>
          <p style={{ color: C.text, fontSize: 15, fontWeight: 600, margin: '0 0 2px', paddingRight: isActive ? 60 : 0 }}>
            4-Week Plan
          </p>
          <p style={{ color: C.muted, fontSize: 12, margin: 0 }}>
            {entry.workout_count} workouts · Generated {formatRelative(entry.created_at)}
          </p>
        </div>
      </div>

      {/* Type breakdown pills */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
        {types.map(type => {
          const Icon = TYPE_ICONS[type];
          return (
            <div key={type} style={{
              display: 'flex', alignItems: 'center', gap: 5,
              background: `${TYPE_COLORS[type]}15`,
              border: `1px solid ${TYPE_COLORS[type]}33`,
              borderRadius: 20, padding: '4px 10px',
            }}>
              {Icon && <Icon size={10} color={TYPE_COLORS[type]} />}
              <span style={{ color: TYPE_COLORS[type], fontSize: 11, fontFamily: C.font }}>
                {breakdown[type]} {type}
              </span>
            </div>
          );
        })}
      </div>

      {!isActive && (
        <button
          onClick={() => onRestore(entry.id)}
          disabled={restoring === entry.id}
          style={{
            width: '100%', background: 'none',
            border: `1px solid ${C.cardBorder}`,
            borderRadius: 10, padding: '10px 0',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            cursor: restoring === entry.id ? 'wait' : 'pointer',
            opacity: restoring === entry.id ? 0.5 : 1,
            transition: 'opacity 0.15s',
          }}
        >
          <RotateCcw size={13} color={C.muted} />
          <span style={{ color: C.muted, fontSize: 13, fontFamily: C.font }}>
            {restoring === entry.id ? 'Restoring…' : 'Restore this plan'}
          </span>
        </button>
      )}
    </div>
  );
}

export default function History() {
  const [entries, setEntries]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [restoring, setRestoring] = useState(null);
  const [restored, setRestored]   = useState(null);

  const activeSchedule = getCachedSchedule();

  useEffect(() => {
    fetchScheduleHistory()
      .then(data => { setEntries(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  async function handleRestore(id) {
    setRestoring(id);
    try {
      const row = await fetchScheduleById(id);
      localStorage.setItem('ai_schedule_v1', JSON.stringify(row.schedule_data));
      setRestored(id);
    } catch (err) {
      console.error('Restore failed:', err);
    } finally {
      setRestoring(null);
    }
  }

  function isActive(entry) {
    if (!activeSchedule) return false;
    // Compare a sample of keys to check if this entry matches the loaded schedule
    const entryKeys = Object.keys(entry.type_breakdown || {});
    const breakdown = entryKeys.reduce((acc, type) => {
      const count = Object.values(activeSchedule).filter(w => w.type === type).length;
      acc[type] = count;
      return acc;
    }, {});
    return JSON.stringify(breakdown) === JSON.stringify(entry.type_breakdown);
  }

  return (
    <div style={{ background: C.bg, fontFamily: C.bodyFont, minHeight: '100vh', paddingBottom: 100 }}>
      <StatusBar />

      <div style={{ padding: '16px 20px 0' }}>
        <h1 style={{ color: C.text, fontSize: 26, fontWeight: 700, margin: '0 0 4px', letterSpacing: '-0.6px', fontFamily: C.font }}>
          History
        </h1>
        <p style={{ color: C.muted, fontSize: 13, margin: '0 0 24px' }}>
          All your AI-generated workout plans
        </p>
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 0 }}>
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: C.accentDark, border: `1px solid ${C.accentBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <Clock size={18} color={C.accent} />
            </div>
            <p style={{ color: C.muted, fontSize: 14, margin: 0 }}>Loading history…</p>
          </div>
        )}

        {error && (
          <div style={{ background: '#1f1010', border: '1px solid #ff444433', borderRadius: 14, padding: '16px 18px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <CloudOff size={18} color='#ff6666' style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <p style={{ color: '#ff8888', fontSize: 13, fontWeight: 600, margin: '0 0 4px' }}>Couldn't load history</p>
              <p style={{ color: '#ff666688', fontSize: 12, margin: 0 }}>{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && entries.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: C.surface, border: `1px solid ${C.cardBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Clock size={24} color={C.muted} />
            </div>
            <p style={{ color: C.text, fontSize: 16, fontWeight: 600, margin: '0 0 8px' }}>No history yet</p>
            <p style={{ color: C.muted, fontSize: 13, margin: 0, lineHeight: 1.6 }}>
              Generate your first AI workout plan{'\n'}from the Schedule tab to get started.
            </p>
          </div>
        )}

        {!loading && !error && entries.length > 0 && (
          <>
            {restored && (
              <div style={{ background: `${C.accent}15`, border: `1px solid ${C.accentBorder}`, borderRadius: 12, padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                <RotateCcw size={14} color={C.accent} />
                <p style={{ color: C.accent, fontSize: 13, margin: 0 }}>Plan restored — head to Schedule to view it.</p>
              </div>
            )}

            {/* Timeline */}
            <div style={{ position: 'relative' }}>
              {/* Vertical line */}
              <div style={{
                position: 'absolute', left: 18, top: 24, bottom: 24,
                width: 1, background: `linear-gradient(to bottom, ${C.accentBorder}, ${C.cardBorder}30)`,
                zIndex: 0,
              }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {entries.map((entry, idx) => (
                  <div key={entry.id} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 20 }}>
                    {/* Timeline dot */}
                    <div style={{
                      width: 9, height: 9, borderRadius: '50%', flexShrink: 0,
                      background: isActive(entry) ? C.accent : C.cardBorder,
                      border: `2px solid ${isActive(entry) ? C.accent : '#1a2e28'}`,
                      marginTop: 15, zIndex: 1, boxShadow: isActive(entry) ? `0 0 8px ${C.accent}66` : 'none',
                    }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ color: C.dim, fontSize: 10, fontFamily: C.font, margin: '0 0 8px', letterSpacing: '0.4px', textTransform: 'uppercase' }}>
                        {formatDate(entry.created_at)}
                      </p>
                      <ScheduleCard
                        entry={entry}
                        isActive={isActive(entry)}
                        onRestore={handleRestore}
                        restoring={restoring}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
