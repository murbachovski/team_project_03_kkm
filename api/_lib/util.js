// 공통 도구: 응답 보내기 · 메모리 캐시 · 시간 제한 fetch · 거리 계산
const cache = new Map();

function send(res, status, obj) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(obj));
}

function query(req) {
  if (req.query) return req.query;
  const u = new URL(req.url, 'http://x');
  return Object.fromEntries(u.searchParams);
}

// 서버가 켜져 있는 동안 기억해 둔다 (기획서: 날씨 1시간, 관광·행사 하루)
async function cached(key, ms, fn) {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < ms) return { ...hit.value, cachedAt: new Date(hit.at).toISOString() };
  const value = await fn();
  if (value && value.mode === 'live') cache.set(key, { at: Date.now(), value });
  return value;
}

async function fetchTimeout(url, opts = {}, ms = 8000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { ...opts, signal: ctrl.signal });
  } finally {
    clearTimeout(t);
  }
}

// 실패 이유를 쉬운 말로
function reasonOf(err) {
  if (!err) return '알 수 없는 오류';
  if (err.code === 'NO_KEY') return '키 비어 있음';
  if (err.name === 'AbortError') return '시간 초과';
  if (err.code === 'NOT_APPROVED') return '승인 안 됨 (키 · 활용신청 확인)';
  return '오류: ' + String(err.message || err).slice(0, 120);
}

function distanceKm(a, b) {
  const R = 6371, rad = (d) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(h)) * 100) / 100;
}

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') { try { return JSON.parse(req.body); } catch { return {}; } }
  const chunks = [];
  for await (const c of req) chunks.push(c);
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'); } catch { return {}; }
}

module.exports = { send, query, cached, fetchTimeout, reasonOf, distanceKm, readBody };
