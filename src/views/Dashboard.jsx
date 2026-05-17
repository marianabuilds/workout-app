import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Dumbbell, Wind, Heart, Sparkles, Zap } from 'lucide-react';
import StatusBar from '../components/StatusBar';
import { C } from '../lib/theme';
import { getCachedSchedule, getManualOverrides } from '../lib/aiSchedule';

const QUOTES = [
  { text: "You can't put a limit on anything. The more you dream, the farther you get.", author: "Michael Phelps" },
  { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
  { text: "The only way to define your limits is by going beyond them.", author: "Arthur Clarke" },
  { text: "Success is usually the culmination of controlling failure.", author: "Sylvester Stallone" },
  { text: "Champions keep playing until they get it right.", author: "Billie Jean King" },
];

const TYPE_META = {
  strength: { icon: Dumbbell, color: C.accent,   label: 'Strength' },
  cardio:   { icon: Wind,     color: '#ff8c42',   label: 'Cardio'   },
  recovery: { icon: Heart,    color: '#a78bfa',   label: 'Recovery' },
  rest:     { icon: null,     color: C.muted,     label: 'Rest Day' },
};

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function makeDateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const today = new Date();
  const todayKey = makeDateKey(today);
  const quote = QUOTES[today.getDay() % QUOTES.length];

  const aiSchedule = { ...(getCachedSchedule() || {}), ...(getManualOverrides() || {}) };
  const hasSchedule = Object.keys(aiSchedule).length > 0;

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  const days = Array.from({ length: 28 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    const dk = makeDateKey(d);
    return {
      label: DAY_NAMES[d.getDay()],
      date: d.getDate(),
      dateKey: dk,
      isToday: dk === todayKey,
      workout: aiSchedule[dk] || null,
    };
  });

  const [selectedKey, setSelectedKey] = useState(todayKey);
  const selectedDay = days.find(d => d.dateKey === selectedKey);
  const selectedWorkout = selectedDay?.workout || null;

  useEffect(() => {
    sessionStorage.setItem('selectedDateKey', selectedKey);
  }, [selectedKey]);

  const stripRef = useRef(null);
  useEffect(() => {
    if (!stripRef.current) return;
    const todayIndex = days.findIndex(d => d.isToday);
    if (todayIndex < 0) return;
    const ITEM_W = 54;
    const cw = stripRef.current.offsetWidth;
    stripRef.current.scrollLeft = todayIndex * ITEM_W - cw / 2 + ITEM_W / 2;
  }, []);

  return (
    <div style={{ background: C.bg, fontFamily: C.bodyFont, minHeight: '100vh', paddingBottom: 100 }}>
      <StatusBar />

      {/* Header */}
      <div style={{ padding: '20px 20px 0' }}>
        <p style={{ color: C.muted, fontSize: 13, margin: 0, letterSpacing: '0.5px', textTransform: 'uppercase', fontFamily: C.font }}>
          {today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
        <h1 style={{ color: C.text, fontSize: 30, fontWeight: 500, margin: '4px 0 0', letterSpacing: '-0.8px', lineHeight: 1.2, fontFamily: C.font }}>
          Good morning,<br />Mariana.
        </h1>
      </div>

      {/* Quote card */}
      <div style={{ margin: '24px 20px 0', background: C.accentDark, border: `1px solid ${C.accentBorder}`, borderRadius: 16, padding: 20 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <Flame size={20} color={C.accent} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ color: C.accent, fontSize: 15, lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
              "{quote.text}"
            </p>
            <p style={{ color: C.muted, fontSize: 13, margin: '8px 0 0' }}>— {quote.author}</p>
          </div>
        </div>
      </div>

      {/* Scrollable week strip — 4 weeks */}
      <div style={{ margin: '28px 0 0' }}>
        <p style={{ color: C.muted, fontSize: 12, margin: '0 0 12px 20px', letterSpacing: '0.8px', textTransform: 'uppercase', fontFamily: C.font }}>
          Upcoming
        </p>
        <div
          ref={stripRef}
          className="hide-scroll"
          style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingLeft: 20, paddingRight: 20 }}
        >
          {days.map((d) => {
            const isSelected = selectedKey === d.dateKey;
            const dotColor = d.workout ? TYPE_META[d.workout.type]?.color : null;
            return (
              <button
                key={d.dateKey}
                onClick={() => setSelectedKey(d.dateKey)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  padding: '4px 0', flexShrink: 0, width: 48,
                }}
              >
                <span style={{ color: isSelected ? C.accent : C.dim, fontSize: 10, letterSpacing: '0.3px', fontFamily: C.font, transition: 'color 0.15s' }}>
                  {d.label}
                </span>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: d.isToday ? C.accent : isSelected ? C.accentDark : 'transparent',
                  border: isSelected && !d.isToday ? `1.5px solid ${C.accentBorder}` : d.isToday ? 'none' : `1px solid ${C.cardBorder}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s',
                }}>
                  <span style={{ color: d.isToday ? '#020d0a' : isSelected ? C.accent : C.dim, fontSize: 14, fontWeight: d.isToday || isSelected ? 700 : 400, fontFamily: C.font }}>
                    {d.date}
                  </span>
                </div>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: dotColor || 'transparent', transition: 'background 0.15s' }} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Day workout detail panel */}
      <div style={{ margin: '16px 20px 0', minHeight: 90, transition: 'all 0.2s' }}>
        {selectedWorkout ? (() => {
          const meta = TYPE_META[selectedWorkout.type] || TYPE_META.rest;
          const Icon = meta.icon;
          return (
            <div style={{ background: C.surface, border: `1px solid ${meta.color}33`, borderRadius: 14, padding: '16px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: selectedWorkout.exercises?.length ? 12 : 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {Icon && (
                    <div style={{ width: 34, height: 34, borderRadius: 9, background: `${meta.color}1a`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={16} color={meta.color} />
                    </div>
                  )}
                  <div>
                    <p style={{ color: C.text, fontSize: 15, fontWeight: 600, margin: 0 }}>{selectedWorkout.name}</p>
                    {selectedWorkout.duration && <p style={{ color: C.muted, fontSize: 12, margin: '2px 0 0' }}>{selectedWorkout.duration}</p>}
                  </div>
                </div>
                <span style={{ fontSize: 10, fontFamily: C.font, padding: '3px 10px', borderRadius: 20, color: meta.color, background: `${meta.color}1a`, border: `1px solid ${meta.color}44` }}>
                  {meta.label}
                </span>
              </div>
              {selectedWorkout.exercises?.length > 0 && (
                <>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                    {selectedWorkout.exercises.map((ex) => (
                      <span key={ex} style={{ fontSize: 11, fontFamily: C.font, color: C.muted, background: C.chipBg, borderRadius: 20, padding: '4px 10px' }}>
                        {ex}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => navigate('/active')}
                    style={{
                      width: '100%', background: C.accent, border: 'none', borderRadius: 12,
                      padding: '14px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      color: '#020d0a', fontSize: 15, fontWeight: 700, fontFamily: C.font, cursor: 'pointer',
                      letterSpacing: '-0.2px',
                    }}
                  >
                    <Zap size={17} color="#020d0a" fill="#020d0a" />
                    Start Workout
                  </button>
                </>
              )}
            </div>
          );
        })() : (
          <div style={{ background: C.surface, border: `1px solid ${C.cardBorder}`, borderRadius: 14, padding: '20px 18px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {!hasSchedule ? (
              <>
                <Sparkles size={20} color={C.dim} />
                <p style={{ color: C.muted, fontSize: 13, margin: 0, textAlign: 'center' }}>
                  Go to Schedule to generate<br />your AI workout plan
                </p>
              </>
            ) : (
              <p style={{ color: C.dim, fontSize: 13, margin: 0 }}>Rest day — recovery is part of the plan.</p>
            )}
          </div>
        )}
      </div>

      {/* Insights preview */}
      <div style={{ margin: '32px 20px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <p style={{ color: C.text, fontSize: 18, fontWeight: 600, margin: 0, letterSpacing: '-0.4px', fontFamily: C.font }}>Insights</p>
          <button onClick={() => navigate('/insights')} style={{ background: 'none', border: 'none', color: C.accent, fontSize: 13, fontFamily: C.font, cursor: 'pointer' }}>
            See all
          </button>
        </div>
        <div className="hide-scroll" style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 4 }}>
          {[
            { tag: 'Pre-workout', title: 'Fuel Your Session', body: 'Eat complex carbs + protein 60–90 min before. Oats, banana, and eggs is a solid combo.', color: '#1a3d2e' },
            { tag: 'Recovery',    title: 'Optimize Rest',     body: 'Growth hormone releases during deep sleep. Target 7–9 hours — that\'s when muscle repair happens.', color: '#1a2a3d' },
            { tag: 'Nutrition',   title: 'Hit Your Protein',  body: 'Aim for 0.7–1g per lb of bodyweight, spread across meals. Your body absorbs ~40g per sitting.', color: '#2a1a3d' },
          ].map((card) => (
            <button
              key={card.title}
              onClick={() => navigate('/insights')}
              style={{ flexShrink: 0, width: 188, background: card.color, border: `1px solid ${C.cardBorder}`, borderRadius: 14, padding: 16, cursor: 'pointer', textAlign: 'left' }}
            >
              <span style={{ display: 'inline-block', background: C.chipAccentBg, border: `1px solid ${C.accentBorder}`, borderRadius: 20, padding: '2px 10px', fontSize: 10, color: C.accent, letterSpacing: '0.5px', marginBottom: 10, fontFamily: C.font }}>
                {card.tag}
              </span>
              <p style={{ color: C.text, fontSize: 14, fontWeight: 600, margin: '0 0 6px', letterSpacing: '-0.2px', fontFamily: C.font }}>{card.title}</p>
              <p style={{ color: C.muted, fontSize: 12, margin: 0, lineHeight: 1.6 }}>{card.body}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
