import { supabase } from './supabase';

export async function saveScheduleToCloud(scheduleData) {
  const workouts = Object.values(scheduleData);
  const workoutCount = workouts.filter(w => w.type !== 'rest').length;
  const typeBreakdown = workouts.reduce((acc, w) => {
    acc[w.type] = (acc[w.type] || 0) + 1;
    return acc;
  }, {});

  const { data, error } = await supabase
    .from('workout_schedules')
    .insert([{ schedule_data: scheduleData, workout_count: workoutCount, type_breakdown: typeBreakdown }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function fetchScheduleHistory() {
  const { data, error } = await supabase
    .from('workout_schedules')
    .select('id, created_at, workout_count, type_breakdown')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function fetchScheduleById(id) {
  const { data, error } = await supabase
    .from('workout_schedules')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}
