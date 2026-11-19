// 먹거리 — 백년가게(공공데이터포털) · 서울 오래가게. 이름 · 주소는 원래 데이터 그대로, 숙소와 같은 동 먼저
const { send, query, cached, reasonOf } = require('./_lib/util');
const { dataGoJson, baseFrom } = require('./_lib/publicApi');
const { rowsOf, meta, loadChunks } = require('./_lib/docs');
const { STAYS } = require('./_lib/demo');

const DAY = 24 * 3600 * 1000;

async function baengnyeon() {
  return cached('baengnyeon', DAY, async () => {
    try {
      const base = baseFrom('BAENGNYEON_SHOP_API', 'https://api.odcloud.kr/api/15132695/v1/uddi:706576c0-3d19-4e32-96be-d446b2b76bab');
      const { fetchTimeout } = require('./_lib/util');
      const key = (process.env.DATA_GO_KR_KEY || '').trim();
      if (!key) { const e = new Error('no key'); e.code = 'NO_KEY'; throw e; }
      const k = /%[0-9A-Fa-f]{2}/.test(key) ? key : encodeURIComponent(key);
      const r = await fetchTimeout(`${base}?serviceKey=${k}&page=1&perPage=2000&returnType=JSON`, {}, 9000);
      if (r.status === 401 || r.status === 403) { const e = new Error('x'); e.code = 'NOT_APPROVED'; throw e; }
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const j = await r.json();
      const rows = (j.data || []).filter((x) => /성북구/.test(Object.values(x).join(' ')));
      if (!rows.length) throw new Error('성북구 자료 없음');
      const list = rows.map((x) => {
        const name = x['업체명'] || x['상호명'] || Object.values(x)[1];
        const addr = x['업체주소'] || x['주소'] || Object.values(x).find((v) => /성북구/.test(String(v))) || '';
        return { name, addr };
      });
      return { mode: 'live', list };
    } catch (e) {
      return { mode: 'demo', reason: reasonOf(e) };
    }
  });
}

module.exports = async (req, res) => {
  const stay = STAYS[query(req).stay] || STAYS.A;
  const m = meta('소상공인시장진흥공단_백년가게성북구');
  let shops = rowsOf('소상공인시장진흥공단_백년가게성북구').map((r) => ({ name: r['업체명'], addr: r['업체주소'] }));
  const live = await baengnyeon();
  if (live.mode === 'live') shops = live.list;
  const near = (a) => (String(a.addr).includes(stay.dong.replace(/동$/, '')) ? 0 : 1);
  shops.sort((a, b) => near(a) - near(b));

  const oraeChunk = loadChunks().find((c) => c.file.startsWith('서울시_오래가게성북구') && /\|/.test(c.text));
  const orae = oraeChunk ? rowsOf('서울시_오래가게성북구') : [];

  send(res, 200, {
    stay: { id: stay.id, dong: stay.dong },
    baengnyeon: { mode: live.mode, reason: live.reason, list: shops, source: m.source || '공공데이터포털 백년가게', date: live.mode === 'live' ? '오늘 조회' : m.date },
    orae: { list: orae, source: '서울시 「내 손안에 서울」 오래가게 (2020)', date: '2020-11-10', note: '2020년 선정 자료 — 지금 영업하는지 확인 필요 · 주소는 120 다산콜센터' },
  });
};
