const KEY = 'workout_set_history';
const SESSIONS_KEY = 'workout_sessions';
const REST_TIMER_KEY = 'rest_timer_default';

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}');
  } catch {
    return {};
  }
}

function getSessions() {
  try { return JSON.parse(localStorage.getItem(SESSIONS_KEY) || '[]'); } catch { return []; }
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
  recordWorkoutSession();
}

export function getLastSession(exerciseName) {
  return getHistory()[exerciseName]?.[0] ?? null;
}

export function recordWorkoutSession() {
  const sessions = getSessions();
  const today = new Date().toISOString().slice(0, 10);
  sessions.unshift({ date: today });
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions.slice(0, 365)));
}

export function getSessionStats() {
  const sessions = getSessions();
  const uniqueDates = [...new Set(sessions.map(s => s.date))].sort().reverse();
  const thisMonth = new Date().toISOString().slice(0, 7);
  const today = new Date().toISOString().slice(0, 10);

  const thisMonthCount = uniqueDates.filter(d => d.startsWith(thisMonth)).length;

  // Streak: consecutive days ending today or yesterday
  let streak = 0;
  const hasToday = uniqueDates.includes(today);
  const startOffset = hasToday ? 0 : 1;
  for (let i = startOffset; i < 365; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    if (uniqueDates.includes(key)) {
      streak++;
    } else {
      break;
    }
  }

  return { total: uniqueDates.length, streak, thisMonth: thisMonthCount };
}

export function getRestTimerDefault() {
  const val = parseInt(localStorage.getItem(REST_TIMER_KEY));
  return isNaN(val) ? 90 : val;
}

export function setRestTimerDefault(seconds) {
  localStorage.setItem(REST_TIMER_KEY, String(seconds));
}
