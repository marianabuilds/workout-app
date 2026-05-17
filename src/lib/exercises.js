const BASE = 'https://wger.de/media/exercise-images';

// Each key maps to an ordered array of images (start → end position).
export const EXERCISE_IMAGES = {
  'Bicep Curls':      [`${BASE}/1192/651a4535-8210-4dbd-8f06-61d95fdd9963.png`],
  'Tricep Dips':      [`${BASE}/1000/553266a8-a972-48c5-a014-b12afac66f65.png`],
  'Shoulder Press':   [
    `${BASE}/123/dumbbell-shoulder-press-large-1.png`,
    `${BASE}/123/dumbbell-shoulder-press-large-2.png`,
  ],
  'Lateral Raises':   [`${BASE}/1378/7c1fcf34-fb7e-45e7-a0c1-51f296235315.jpg`],
  'Hammer Curls':     [
    `${BASE}/86/Bicep-hammer-curl-1.png`,
    `${BASE}/86/Bicep-hammer-curl-2.png`,
  ],
  'Tricep Pushdowns': [`${BASE}/1185/c5ca283d-8958-4fd8-9d59-a3f52a3ac66b.jpg`],
};

export const WORKOUTS = {
  today: {
    name: 'Arms & Shoulders',
    tag: 'Strength · Moderate',
    tip: 'Warm up with 5 min of light cardio and arm circles. Keep your core tight throughout. Rest 60–90s between sets for hypertrophy.',
    exercises: [
      { name: 'Bicep Curls',      sets: 3, reps: '12–15', weight: '25 lb', muscle: 'Biceps' },
      { name: 'Tricep Dips',      sets: 3, reps: '10–12', weight: 'BW',    muscle: 'Triceps' },
      { name: 'Shoulder Press',   sets: 4, reps: '10–12', weight: '35 lb', muscle: 'Deltoids' },
      { name: 'Lateral Raises',   sets: 3, reps: '12–15', weight: '15 lb', muscle: 'Side Delts' },
      { name: 'Hammer Curls',     sets: 3, reps: '10–12', weight: '30 lb', muscle: 'Brachialis' },
      { name: 'Tricep Pushdowns', sets: 3, reps: '12–15', weight: '40 lb', muscle: 'Triceps' },
    ],
  },
};

export const ACTIVE_EXERCISES = WORKOUTS.today.exercises.map((ex) => ({
  ...ex,
  repsNum: parseInt(ex.reps),
  weightNum: ex.weight === 'BW' ? 0 : parseInt(ex.weight),
}));
