// 진행 중 · 예정 행사 (성북구) — 서울시 문화행사 정보. 이름 · 기간 · 장소는 원래 데이터 그대로
const { send, cached, reasonOf } = require('./_lib/util');
const { seoulJson } = require('./_lib/publicApi');
const { rowsOf, meta } = require('./_lib/docs');

const DAY = 24 * 3600 * 1000;
const today = () => new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);

async function live() {
  return cached('events', DAY, async () => {
    try {
      const rows = [];
      for (const [a, b] of [[1, 1000], [1001, 2000], [2001, 3000]]) {
        const part = await seoulJson('SEOUL_CULTURE_EVENT_API', 'culturalEventInfo', a, b);
        rows.push(...part);
        if (part.length < 1000) break;
      }
      const list = rows
        .filter((r) => r.GUNAME === '성북구' && String(r.END_DATE).slice(0, 10) >= today())
        .map((r) => ({ kind: r.CODENAME, title: r.TITLE, place: r.PLACE, start: String(r.STRTDATE).slice(0, 10), end: String(r.END_DATE).slice(0, 10), time: r.PRO_TIME, fee: r.IS_FREE + (r.USE_FEE ? ' · ' + r.USE_FEE : ''), url: r.HMPG_ADDR }))
        .sort((x, y) => x.start.localeCompare(y.start));
      return { mode: 'live', list, date: today() + ' 조회' };
    } catch (e) {
      return { mode: 'demo', reason: reasonOf(e) };
    }
  });
}

module.exports = async (req, res) => {
  let data = await live();
  if (data.mode !== 'live') {
    const m = meta('서울시_문화행사정보성북구');
    const list = rowsOf('서울시_문화행사정보성북구')
      .filter((r) => r['종료일'] >= today())
      .map((r) => ({ kind: r['분류'], title: r['공연/행사명'], place: r['장소'], start: r['시작일'], end: r['종료일'], time: r['행사시간'], fee: [r['유무료'], r['이용요금']].filter(Boolean).join(' · '), url: r['문화포털상세URL'] }));
    data = { ...data, list, date: m.date + ' 받은 자료' };
  }
  send(res, 200, { ...data, source: '서울시 문화행사 정보 (서울 열린데이터광장 OA-15486)', note: '날짜는 가기 전에 꼭 확인하세요' });
};
