// 공공 API 공통 호출 — 공공데이터포털 키는 Encoding · Decoding 어느 쪽이어도 동작한다
const { fetchTimeout } = require('./util');

function dataGoKey() {
  const raw = (process.env.DATA_GO_KR_KEY || '').trim();
  if (!raw) { const e = new Error('no key'); e.code = 'NO_KEY'; throw e; }
  // Encoding 키(%2B 같은 글자 포함)는 한 번 풀어서 Decoding 키로 맞춘 뒤 다시 인코딩한다
  let decoded = raw;
  if (/%[0-9A-Fa-f]{2}/.test(raw)) { try { decoded = decodeURIComponent(raw); } catch { decoded = raw; } }
  return encodeURIComponent(decoded);
}

// .env 값이 주소면 그 주소를, 아니면 기본 주소를 쓴다
function baseFrom(envName, fallback) {
  const v = (process.env[envName] || '').trim();
  return /^https?:\/\//.test(v) ? v.replace(/\?.*$/, '') : fallback;
}

async function dataGoJson(base, params) {
  const qs = Object.entries(params).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
  const url = `${base}?serviceKey=${dataGoKey()}&${qs}`;
  const r = await fetchTimeout(url, {}, 8000);
  const text = await r.text();
  if (r.status === 401 || r.status === 403 || /SERVICE_KEY_IS_NOT_REGISTERED|SERVICE ACCESS DENIED|Unauthorized/i.test(text)) {
    const e = new Error('not approved'); e.code = 'NOT_APPROVED'; throw e;
  }
  if (/NO_OPENAPI_SERVICE_ERROR/.test(text)) throw new Error('서비스 주소가 없거나 폐기됨 (공공데이터포털에서 새 주소 확인)');
  if (!r.ok) throw new Error('HTTP ' + r.status);
  let j;
  try { j = JSON.parse(text); } catch { throw new Error('JSON 아님: ' + text.slice(0, 80)); }
  const code = j?.response?.header?.resultCode;
  if (code && code !== '00' && code !== '0000') {
    if (code === '30' || code === '20') { const e = new Error('not approved'); e.code = 'NOT_APPROVED'; throw e; }
    if (code === '03') return []; // 데이터 없음
    throw new Error('resultCode ' + code + ' ' + (j.response.header.resultMsg || ''));
  }
  const items = j?.response?.body?.items;
  const list = Array.isArray(items) ? items : items?.item;
  return Array.isArray(list) ? list : list ? [list] : [];
}

// 서울 열린데이터광장: 키 하나 + 서비스 이름
async function seoulJson(serviceEnv, fallbackSvc, from = 1, to = 1000) {
  const key = (process.env.SEOUL_OPEN_DATA_KEY || '').trim();
  if (!key) { const e = new Error('no key'); e.code = 'NO_KEY'; throw e; }
  const svc = (process.env[serviceEnv] || '').trim() || fallbackSvc;
  const r = await fetchTimeout(`http://openapi.seoul.go.kr:8088/${encodeURIComponent(key)}/json/${svc}/${from}/${to}/`, {}, 9000);
  const j = await r.json();
  const body = j[svc];
  if (!body) {
    const code = j?.RESULT?.CODE || '';
    if (/INFO-100/.test(code)) { const e = new Error('not approved'); e.code = 'NOT_APPROVED'; throw e; }
    throw new Error(code + ' ' + (j?.RESULT?.MESSAGE || ''));
  }
  return body.row || [];
}

module.exports = { dataGoJson, seoulJson, baseFrom };
