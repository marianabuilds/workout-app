const KEY = 'workout_set_history';

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}');
  } catch {
    return {};
  }
}

export function saveWorkoutSession(logs) {
  const history = getHistory();
  logs.forEach(ex => {
    const done = ex.logs.filter(s => s.done);
    if (!done.length) return;
    const last = done[done.length - 1];
    if (!history[ex.name]) history[ex.name] = [];
    history[ex.name] = [
      { weight: last.weight, reps: last.reps, date: Date.now() },
      ...history[ex.name],
    ].slice(0, 10);
  });
  localStorage.setItem(KEY, JSON.stringify(history));
}

export function getLastSession(exerciseName) {
  return getHistory()[exerciseName]?.[0] ?? null;
}
