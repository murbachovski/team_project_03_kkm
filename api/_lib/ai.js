// AI 부르기: CLAUDE_API_KEY → GROQ_API_KEY → GEMINI_API_KEY
// 앞이 실패하면(키 비어 있음 · 오류 · 시간 초과) 다음으로 넘어가고, 누가 답했는지 남긴다.
// 모델 이름은 코드에 박지 않고, 각 키로 모델 목록을 조회해 고른다.
const { fetchTimeout, reasonOf } = require('./util');

const models = {}; // 조회한 모델 이름 기억

function pick(ids, prefs) {
  for (const p of prefs) { const hit = ids.find((id) => p.test(id)); if (hit) return hit; }
  return ids[0];
}

const PROVIDERS = [
  {
    name: 'claude',
    env: 'CLAUDE_API_KEY',
    async model(key) {
      const r = await fetchTimeout('https://api.anthropic.com/v1/models?limit=100', { headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01' } }, 8000);
      if (!r.ok) throw new Error('모델 목록 HTTP ' + r.status);
      const ids = (await r.json()).data.map((m) => m.id);
      return pick(ids, [/haiku/, /sonnet/]);
    },
    async call(key, model, system, user) {
      const r = await fetchTimeout('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
        body: JSON.stringify({ model, max_tokens: 2000, system, messages: [{ role: 'user', content: user }] }),
      }, 15000);
      if (!r.ok) throw httpErr(r);
      const j = await r.json();
      return j.content.map((c) => c.text || '').join('').trim();
    },
  },
  {
    name: 'groq',
    env: 'GROQ_API_KEY',
    async model(key) {
      const r = await fetchTimeout('https://api.groq.com/openai/v1/models', { headers: { Authorization: 'Bearer ' + key } }, 8000);
      if (!r.ok) throw new Error('모델 목록 HTTP ' + r.status);
      const ids = (await r.json()).data.filter((m) => m.active !== false).map((m) => m.id).filter((id) => !/whisper|guard|tts/i.test(id));
      return pick(ids, [/llama-3\.3-70b/, /llama.*70b/, /llama/, /qwen|gpt-oss/]);
    },
    async call(key, model, system, user) {
      const r = await fetchTimeout('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + key, 'content-type': 'application/json' },
        body: JSON.stringify({ model, max_completion_tokens: 2000, messages: [{ role: 'system', content: system }, { role: 'user', content: user }] }),
      }, 15000);
      if (!r.ok) throw httpErr(r);
      return (await r.json()).choices[0].message.content.trim();
    },
  },
  {
    name: 'gemini',
    env: 'GEMINI_API_KEY',
    async model(key) {
      const r = await fetchTimeout('https://generativelanguage.googleapis.com/v1beta/models?pageSize=200&key=' + encodeURIComponent(key), {}, 8000);
      if (!r.ok) throw new Error('모델 목록 HTTP ' + r.status);
      const ids = (await r.json()).models
        .filter((m) => (m.supportedGenerationMethods || []).includes('generateContent'))
        .map((m) => m.name.replace(/^models\//, ''));
      return pick(ids, [/^gemini-flash-latest$/, /^gemini-[\d.]+-flash$/, /flash(?!.*(image|tts|live|lite))/]);
    },
    async call(key, model, system, user) {
      const r = await fetchTimeout(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ systemInstruction: { parts: [{ text: system }] }, contents: [{ role: 'user', parts: [{ text: user }] }] }),
      }, 25000);
      if (!r.ok) throw httpErr(r);
      const j = await r.json();
      return (j.candidates?.[0]?.content?.parts || []).map((p) => p.text || '').join('').trim();
    },
  },
];

function httpErr(r) {
  const e = new Error('HTTP ' + r.status + (r.status === 404 ? ' (모델 이름부터 의심)' : ''));
  e.status = r.status;
  return e;
}

async function ask(system, user) {
  const tried = [];
  for (const p of PROVIDERS) {
    const key = (process.env[p.env] || '').trim();
    if (!key) { tried.push({ provider: p.name, reason: '키 비어 있음' }); continue; }
    try {
      if (!models[p.name]) models[p.name] = await p.model(key);
      const text = await p.call(key, models[p.name], system, user);
      if (!text) throw new Error('빈 답');
      return { ok: true, provider: p.name, model: models[p.name], text, tried };
    } catch (e) {
      if (e.status === 404) { console.warn(`[AI] ${p.name} 404 — 모델 이름(${models[p.name]})부터 확인`); delete models[p.name]; }
      tried.push({ provider: p.name, reason: reasonOf(e) });
    }
  }
  return { ok: false, provider: null, text: '', tried };
}

module.exports = { ask };
