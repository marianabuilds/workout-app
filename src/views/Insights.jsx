import { useState } from 'react';
import { Zap, Moon, Apple, Droplets, Wind, Heart, Flame, Utensils } from 'lucide-react';
import StatusBar from '../components/StatusBar';
import { C } from '../lib/theme';

const CATEGORIES = ['All', 'Pre-Workout', 'Post-Workout', 'Recovery', 'Nutrition'];

const INSIGHTS = [
  {
    category: 'Pre-Workout',
    icon: Zap,
    color: '#fbbf24',
    title: 'Fuel Up 60–90 Minutes Before',
    body: 'Eat a balanced meal with complex carbs and protein 60–90 minutes before training. Oats with a banana and eggs is a solid choice. Avoid high-fat meals — they slow digestion and leave you sluggish.',
    tips: ['Oats + banana + eggs', 'Avoid high fat within 1 hr', 'Hydrate 16 oz before session'],
  },
  {
    category: 'Pre-Workout',
    icon: Wind,
    color: '#34d399',
    title: 'Warm Up Properly',
    body: 'Cold muscles are injury-prone. Spend 5–8 minutes increasing heart rate with light cardio, then do dynamic stretching targeting your workout muscles.',
    tips: ['5 min light cardio', 'Dynamic stretches (not static)', 'Activation sets at 50% weight'],
  },
  {
    category: 'Post-Workout',
    icon: Apple,
    color: '#f87171',
    title: 'The 30-Minute Anabolic Window',
    body: 'Muscle protein synthesis peaks in the 30 minutes after training. Get 20–40g protein + fast-digesting carbs in this window to maximize recovery and growth.',
    tips: ['Whey protein + banana', '20–40g protein target', 'Replenish glycogen fast'],
  },
  {
    category: 'Post-Workout',
    icon: Droplets,
    color: '#60a5fa',
    title: 'Rehydrate Strategically',
    body: 'You lose ~0.5–1L of water per hour of training. Drink 16–24 oz of water for every pound lost. Add electrolytes if you trained over 60 minutes or sweat heavily.',
    tips: ['16–24 oz per lb lost', 'Add electrolytes for long sessions', 'Avoid excessive caffeine post-workout'],
  },
  {
    category: 'Recovery',
    icon: Moon,
    color: '#a78bfa',
    title: 'Sleep Is Your Superpower',
    body: 'Growth hormone is released during deep sleep — this is when muscle repair actually happens. Target 7–9 hours. Poor sleep tanks testosterone, spikes cortisol, and kills your gains.',
    tips: ['7–9 hours minimum', 'Consistent sleep schedule', 'Dark, cool room (65–68°F)'],
  },
  {
    category: 'Recovery',
    icon: Heart,
    color: '#fb7185',
    title: 'Active Recovery Beats Total Rest',
    body: 'Light activity on rest days — walking, yoga, swimming — increases blood flow and accelerates muscle repair without adding stress. Full couch days slow recovery for most athletes.',
    tips: ['20–30 min light walk', 'Foam roll sore areas', 'Yoga or mobility work'],
  },
  {
    category: 'Nutrition',
    icon: Apple,
    color: '#34d399',
    title: 'Protein: The Non-Negotiable',
    body: 'Most active people underestimate their protein needs. Aim for 0.7–1g per pound of bodyweight. Spread intake across meals — your body can only absorb ~40g per sitting for muscle protein synthesis.',
    tips: ['0.7–1g per lb bodyweight', 'Spread across 4–5 meals', 'Whole foods first, supplements second'],
  },
  {
    category: 'Nutrition',
    icon: Flame,
    color: '#fb923c',
    title: 'Carbs Are Not the Enemy',
    body: 'Carbohydrates are your muscles\' primary fuel source. On training days, prioritize complex carbs like oats, sweet potatoes, and rice. Restricting carbs too aggressively tanks performance and recovery.',
    tips: ['Complex carbs on training days', 'Time carbs around workouts', 'Don\'t fear fruit — nature\'s fast fuel'],
  },
  {
    category: 'Nutrition',
    icon: Droplets,
    color: '#38bdf8',
    title: 'Hydration Drives Performance',
    body: 'Even mild dehydration (2% body weight) cuts strength and endurance by 10–20%. Drink consistently through the day — not just during workouts. Check your urine: pale yellow means you\'re good.',
    tips: ['Aim for 80–100 oz daily', 'Drink 16 oz on waking', 'Pale yellow urine = hydrated'],
  },
  {
    category: 'Nutrition',
    icon: Utensils,
    color: '#e879f9',
    title: 'Meal Timing for Muscle',
    body: 'Eating every 3–5 hours keeps protein synthesis elevated throughout the day. Skipping meals means your body taps muscle for energy. Prep ahead so you\'re never scrambling for food post-workout.',
    tips: ['Eat every 3–5 hours', 'Never skip post-workout meal', 'Meal prep saves gains'],
  },
];

export default function Insights() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All' ? INSIGHTS : INSIGHTS.filter(i => i.category === activeCategory);

  return (
    <div style={{ background: C.bg, fontFamily: C.bodyFont, minHeight: '100vh', paddingBottom: 100 }}>
      <StatusBar />

      <div style={{ padding: '16px 20px 0' }}>
        <h1 style={{ color: C.text, fontSize: 26, fontWeight: 700, margin: 0, letterSpacing: '-0.6px', fontFamily: C.font }}>Insights</h1>
        <p style={{ color: C.muted, fontSize: 13, margin: '4px 0 0' }}>Training, nutrition, and recovery guides</p>
      </div>

      {/* Category filter */}
      <div className="hide-scroll" style={{ display: 'flex', gap: 8, padding: '16px 20px 4px', overflowX: 'auto' }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              flexShrink: 0,
              background: activeCategory === cat ? C.accent : C.chipBg,
              border: `1px solid ${activeCategory === cat ? C.accent : C.cardBorder}`,
              borderRadius: 20, padding: '7px 16px',
              color: activeCategory === cat ? '#020d0a' : C.muted,
              fontSize: 12, fontFamily: C.font, cursor: 'pointer',
              fontWeight: activeCategory === cat ? 700 : 400,
              transition: 'all 0.15s',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Cards — text shown upfront, no tap required */}
      <div style={{ padding: '16px 20px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {filtered.map(insight => {
          const Icon = insight.icon;
          return (
            <div
              key={insight.title}
              style={{
                background: C.surface,
                border: `1px solid ${insight.color}33`,
                borderRadius: 16,
                overflow: 'hidden',
              }}
            >
              {/* Color accent strip */}
              <div style={{ height: 3, background: insight.color, opacity: 0.7 }} />

              <div style={{ padding: '16px 18px 18px' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: insight.color + '1a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={20} color={insight.color} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'inline-block', fontSize: 10, color: insight.color, background: insight.color + '1a', border: `1px solid ${insight.color}33`, borderRadius: 20, padding: '2px 9px', marginBottom: 6, fontFamily: C.font, letterSpacing: '0.4px' }}>
                      {insight.category}
                    </span>
                    <p style={{ color: C.text, fontSize: 15, fontWeight: 700, margin: 0, letterSpacing: '-0.3px', lineHeight: 1.3, fontFamily: C.font }}>
                      {insight.title}
                    </p>
                  </div>
                </div>

                {/* Body text */}
                <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.75, margin: '0 0 14px' }}>
                  {insight.body}
                </p>

                {/* Tips */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {insight.tips.map(tip => (
                    <div key={tip} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: insight.color, flexShrink: 0 }} />
                      <span style={{ color: C.text, fontSize: 13 }}>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
