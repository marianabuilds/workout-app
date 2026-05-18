const BASE = 'https://wger.de/media/exercise-images';

const MUSCLE_STRETCHES = {
  Biceps: [
    {
      name: 'Cross-body Arm Stretch', duration: 30,
      desc: 'Extend arm across chest, hold with opposite hand. Releases bicep and shoulder tension before curls.',
      images: [`${BASE}/1192/651a4535-8210-4dbd-8f06-61d95fdd9963.png`],
    },
    {
      name: 'Wrist Circles', duration: 20,
      desc: '10 slow rotations each direction. Prepares forearms and wrists for pulling movements.',
      images: [],
    },
  ],
  Triceps: [
    {
      name: 'Overhead Tricep Stretch', duration: 30,
      desc: 'Raise arm overhead, bend at elbow, use opposite hand to gently pull. Targets the long head of the tricep.',
      images: [`${BASE}/1185/c5ca283d-8958-4fd8-9d59-a3f52a3ac66b.jpg`],
    },
    {
      name: 'Cross-chest Shoulder Opener', duration: 25,
      desc: 'Arms behind back, interlace fingers, open chest and squeeze shoulder blades together.',
      images: [],
    },
  ],
  Deltoids: [
    {
      name: 'Arm Circles', duration: 30,
      desc: '10 forward, 10 backward — small to large. Full range of motion lubricates the shoulder joint.',
      images: [],
    },
    {
      name: 'Cross-body Shoulder Stretch', duration: 30,
      desc: 'Hold arm across body at shoulder height, opposite hand on elbow. Hits the rear deltoid and rotator cuff.',
      images: [`${BASE}/1378/7c1fcf34-fb7e-45e7-a0c1-51f296235315.jpg`],
    },
  ],
  'Side Delts': [
    {
      name: 'Lateral Neck Stretch', duration: 20,
      desc: 'Tilt head to each side with gentle pressure. Releases upper trapezius tension that limits shoulder range.',
      images: [],
    },
    {
      name: 'Shoulder Pendulum', duration: 20,
      desc: 'Lean forward, let arm hang loose, make small circles. Decompresses the shoulder joint.',
      images: [],
    },
  ],
  Brachialis: [
    {
      name: 'Elbow Flexor Stretch', duration: 25,
      desc: 'Extend arm fully, palm facing up, gently pull fingers back. Targets the brachialis which sits underneath the bicep.',
      images: [
        `${BASE}/86/Bicep-hammer-curl-1.png`,
        `${BASE}/86/Bicep-hammer-curl-2.png`,
      ],
    },
    {
      name: 'Pronation / Supination', duration: 20,
      desc: '10 slow reps rotating forearm palm-up to palm-down. Warms up the full curl pattern.',
      images: [],
    },
  ],
};

const GENERAL_WARMUP = [
  {
    name: 'Light Cardio', duration: 60,
    desc: '60 seconds of jumping jacks or marching in place. Raises core temperature 1–2°C which directly improves muscle force output.',
    images: [],
  },
  {
    name: 'Shoulder Rolls', duration: 20,
    desc: '10 forward, 10 backward. Loosens the shoulder girdle and activates the rotator cuff before any pressing or pulling.',
    images: [`${BASE}/123/dumbbell-shoulder-press-large-1.png`, `${BASE}/123/dumbbell-shoulder-press-large-2.png`],
  },
  {
    name: 'Neck Rolls', duration: 15,
    desc: 'Slow half-circles, both directions. Releases neck and upper trap tension that restricts shoulder mobility.',
    images: [],
  },
];

const EXERCISE_TO_MUSCLE = {
  'Bicep Curls': 'Biceps',
  'Tricep Dips': 'Triceps',
  'Shoulder Press': 'Deltoids',
  'Lateral Raises': 'Side Delts',
  'Hammer Curls': 'Brachialis',
  'Tricep Pushdowns': 'Triceps',
  'Bench Press': 'Deltoids',
  'Pull Ups': 'Biceps',
  'Push Ups': 'Triceps',
  'Overhead Press': 'Deltoids',
  'Cable Curl': 'Biceps',
  'Skull Crushers': 'Triceps',
};

export function getWarmupForWorkout(exerciseNames) {
  const muscles = new Set();
  exerciseNames.forEach(name => {
    const muscle = EXERCISE_TO_MUSCLE[name];
    if (muscle) muscles.add(muscle);
  });

  const stretches = [...GENERAL_WARMUP];
  const seen = new Set(stretches.map(s => s.name));

  muscles.forEach(muscle => {
    (MUSCLE_STRETCHES[muscle] || []).forEach(s => {
      if (!seen.has(s.name)) {
        seen.add(s.name);
        stretches.push(s);
      }
    });
  });

  return stretches.slice(0, 6);
}

export function getStretchTip(intensity, energy) {
  if (energy !== null && energy <= 2) {
    return "Energy is low today — take 5 full minutes here. Warm muscles fire 20% more efficiently, and you'll feel completely different by rep 3. Don't rush this.";
  }
  if (intensity?.key === 'fullsend') {
    return "Big session ahead. Dynamic warm-up is non-negotiable at high intensity — it reduces injury risk by ~35% and increases power output. Hit each stretch with intention.";
  }
  if (intensity?.key === 'recovery') {
    return "Recovery day means slow, deliberate stretching. Hold each position 5–10 seconds longer than usual. Focus on full exhales — your nervous system releases tension on the out-breath.";
  }
  if (intensity?.key === 'modified') {
    return "Modified intensity today — use this warm-up to tune into how your body actually feels. You might surprise yourself once the blood is flowing.";
  }
  return "3–5 minutes of dynamic stretching raises muscle temperature and improves force production for your lifts. Check off each stretch as you go — your joints will thank you.";
}
