const STORAGE_KEY = 'ai_schedule_v1';
const MODEL = 'claude-opus-4-7';
const API_URL = 'https://api.anthropic.com/v1/messages';

const SYSTEM_PROMPT = `You are an expert personal trainer and sports scientist. Build a structured, progressive 4-week beginner workout plan.

The plan starts Monday May 18, 2026, and runs through Sunday June 14, 2026 (28 days total).

PROFILE:
- Fitness level: Beginner
- Goal: Build a consistent habit and improve overall fitness
- Equipment: Dumbbells, bodyweight
- Schedule: Mon/Wed/Fri = strength, Tue/Thu = cardio or recovery, Sat/Sun = rest

PROGRESSION:
- Week 1 (May 18-24): Foundation — low volume, learn movements, perfect form
- Week 2 (May 25-31): Build — add sets or reps
- Week 3 (Jun 1-7): Develop — increase intensity
- Week 4 (Jun 8-14): Peak — highest volume of the month

OUTPUT:
Respond with ONLY valid JSON, no markdown, no explanation. Exactly this shape:
{
  "schedule": {
    "YYYY-MM-DD": {
      "type": "strength" | "cardio" | "recovery" | "rest",
      "name": "short workout name",
      "duration": "XX min",
      "exercises": ["Exercise 1", "Exercise 2"]
    }
  }
}

Rest days: exercises = []. Recovery: light activities only. Cover all 28 days.`;

export function getCachedSchedule() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearSchedule() {
  localStorage.removeItem(STORAGE_KEY);
}

const OVERRIDES_KEY = 'manual_overrides_v1';

export function getManualOverrides() {
  try {
    const raw = localStorage.getItem(OVERRIDES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

export function setManualOverride(dk, workout) {
  const overrides = getManualOverrides();
  overrides[dk] = workout;
  localStorage.setItem(OVERRIDES_KEY, JSON.stringify(overrides));
}

export function clearManualOverride(dk) {
  const overrides = getManualOverrides();
  delete overrides[dk];
  localStorage.setItem(OVERRIDES_KEY, JSON.stringify(overrides));
}

export async function generateSchedule({ onChunk, onDone, onError }) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === 'your_api_key_here') {
    onError(new Error('Add your Anthropic API key to .env.local as VITE_ANTHROPIC_API_KEY'));
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 16000,
        thinking: { type: 'adaptive' },
        output_config: { effort: 'medium' },
        system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
        messages: [{
          role: 'user',
          content: 'Build my 4-week beginner workout schedule starting Monday May 18, 2026. Output only the JSON.',
        }],
        stream: true,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Anthropic API error ${response.status}: ${body}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let jsonText = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const data = line.slice(6).trim();
        if (data === '[DONE]') continue;
        try {
          const event = JSON.parse(data);
          if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
            jsonText += event.delta.text;
            onChunk?.(jsonText);
          }
        } catch {
          // skip malformed SSE frames
        }
      }
    }

    const parsed = JSON.parse(jsonText);
    const schedule = parsed.schedule;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(schedule));
    onDone(schedule);
  } catch (err) {
    onError(err);
  }
}
