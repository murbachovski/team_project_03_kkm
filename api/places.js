// 가까운 관광지 — QR 숙소 기준 가까운 순, 비 · 미세먼지 나쁨이면 실내 먼저
// 시연 관광지 6곳(기획서 7-1) + 한국관광공사 외국어 관광정보(숙소 반경 2km)
const { send, query, cached, reasonOf, distanceKm } = require('./_lib/util');
const { dataGoJson, baseFrom } = require('./_lib/publicApi');
const { STAYS, PLACES } = require('./_lib/demo');

const DAY = 24 * 3600 * 1000;
const KTO = {
  ko: ['KTO_KOR_TOUR_API', 'KorService2'],
  en: ['KTO_ENG_TOUR_API', 'EngService2'],
  zh: ['KTO_CHS_TOUR_API', 'ChsService2'],
  ja: ['KTO_JPN_TOUR_API', 'JpnService2'],
};

async function ktoNearby(stay, lang) {
  return cached(`kto:${stay.id}:${lang}`, DAY, async () => {
    const [env, svc] = KTO[lang];
    try {
      let base = baseFrom(env, `https://apis.data.go.kr/B551011/${svc}`);
      base = base.replace(/\/(areaBasedList|locationBasedList|searchKeyword)\d*$/, '');
      const items = await dataGoJson(base + '/locationBasedList2', {
        MobileOS: 'ETC', MobileApp: 'SeongbukSafePass', _type: 'json', mapX: stay.lng, mapY: stay.lat, radius: 2000, arrange: 'E', numOfRows: 12, pageNo: 1,
      });
      const list = items.map((i) => ({
        name: i.title, addr: [i.addr1, i.addr2].filter(Boolean).join(' '), image: i.firstimage || '',
        distKm: Math.round((Number(i.dist) || 0) / 10) / 100, indoor: null,
      }));
      return { mode: 'live', list, source: '한국관광공사 ' + svc };
    } catch (e) {
      return { mode: 'demo', reason: reasonOf(e), list: [], source: '한국관광공사 ' + svc };
    }
  });
}

module.exports = async (req, res) => {
  const q = query(req);
  const stay = STAYS[q.stay] || STAYS.A;
  const lang = KTO[q.lang] ? q.lang : 'ko';
  const indoorFirst = q.indoorFirst === '1';
  const demo = PLACES.map((p) => ({ ...p, distKm: distanceKm(stay, p) }))
    .sort((a, b) => (indoorFirst ? Number(b.indoor) - Number(a.indoor) : 0) || a.distKm - b.distKm);
  const kto = await ktoNearby(stay, lang);
  send(res, 200, {
    stay: { id: stay.id, name: stay.name, dong: stay.dong },
    indoorFirst,
    places: demo,
    placesNote: '시연 관광지 6곳 · 거리는 숙소에서 직선거리(시연용 대략 좌표)',
    official: kto,
  });
};
