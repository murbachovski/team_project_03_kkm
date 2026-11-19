// AI 설명 — 공식 외국어 자료가 없는 설명을 번역하고, 오늘 날씨에 맞는 추천 이유를 짧게 쓴다.
// 이름 · 주소 · 기간 · 수치는 쓰지 않게 하고, 근거 문서 이름을 붙인다.
const { send, readBody } = require('./_lib/util');
const { search } = require('./_lib/docs');
const { ask } = require('./_lib/ai');

const LANG = { ko: 'Korean', en: 'English', zh: 'Simplified Chinese', ja: 'Japanese' };
const memo = new Map(); // 한 번 만든 설명은 다시 쓴다

// 답이 고른 언어로 쓰였는지 글자 종류로 확인 (한국어는 확인하지 않음)
function rightLang(text, lang) {
  if (lang === 'ko') return true;
  const hangul = (text.match(/[가-힣]/g) || []).length;
  const total = text.replace(/\s/g, '').length || 1;
  if (hangul / total > 0.2) return false;
  if (lang === 'ja') return /[぀-ヿ]/.test(text);
  return true;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return send(res, 405, { error: 'POST 로 보내 주세요' });
  const b = await readBody(req);
  const name = String(b.name || '').slice(0, 60);
  const lang = LANG[b.lang] ? b.lang : 'ko';
  const weather = b.weather === 'rain' ? 'rain' : b.weather === 'dust' ? 'dust' : 'clear';
  if (!name) return send(res, 400, { error: 'name 이 필요합니다' });

  const key = `${name}|${lang}|${weather}`;
  if (memo.has(key)) return send(res, 200, { ...memo.get(key), reused: true });

  const docs = search(name.replace(/\(.*?\)/g, ''), 3);
  if (!docs.length) {
    return send(res, 200, { ok: false, text: '', sources: [], note: '문서에 자료가 없습니다 — 1330 관광통역안내에 문의하세요' });
  }
  const system = [
    `You write a short, friendly description for a foreign tourist in ${LANG[lang]}.`,
    `Write the whole answer ONLY in ${LANG[lang]}, even if the documents are in Korean or English.`,
    'Use ONLY facts found in the reference documents. If something is not in them, do not mention it.',
    'Do NOT write any names of people, addresses, years, dates, prices, opening hours or other numbers — the app shows those from raw data.',
    'Write at most 2 sentences of description, then 1 sentence explaining why it fits today\'s weather.',
    'Plain text only. No emoji.',
  ].join(' ');
  const user = `Answer language: ${LANG[lang]}
Place: ${name}\nToday's weather: ${weather}\n\nReference documents:\n` + docs.map((d) => `### ${d.title}\n${d.text}`).join('\n\n');

  let r = await ask(system, user);
  // 언어 확인: 일본어·중국어·영어를 골랐는데 한글이 많으면 한 번 더 강하게 요청한다
  if (r.ok && !rightLang(r.text, lang)) {
    const native = { ja: '必ず日本語だけで書いてください。', zh: '请只用简体中文书写。', en: 'Write only in English.' }[lang] || '';
    r = await ask(system + ' ' + native, user + '\n\n' + native);
    if (r.ok && !rightLang(r.text, lang)) r = { ...r, ok: false, text: '', tried: [...(r.tried || []), { provider: r.provider, reason: '다른 언어로 답함' }] };
  }
  const out = { ok: r.ok, provider: r.provider, model: r.model, text: r.text, tried: r.tried, sources: [...new Set(docs.map((d) => d.title))] };
  if (r.ok) memo.set(key, out);
  send(res, 200, out);
};
