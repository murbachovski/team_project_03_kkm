// 오늘의 안전 알림 — 미세먼지(에어코리아) · 비(기상청 단기예보). 문장은 서버 고정 문장
const { send, query, cached, reasonOf } = require('./_lib/util');
const { dataGoJson, baseFrom } = require('./_lib/publicApi');
const { SAFETY, DEMO_WEATHER } = require('./_lib/demo');

const HOUR = 3600 * 1000;

function gradeOf(pm10, pm25) {
  if (pm10 == null && pm25 == null) return null;
  if ((pm10 ?? 0) > 80 || (pm25 ?? 0) > 35) return '나쁨';
  if ((pm10 ?? 0) > 30 || (pm25 ?? 0) > 15) return '보통';
  return '좋음';
}

async function dust() {
  return cached('dust', HOUR, async () => {
    try {
      // 주소가 바뀌면 .env 에 AIRKOREA_API=새 주소 를 넣으면 된다
      const items = await dataGoJson(baseFrom('AIRKOREA_API', 'https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureInfo'), {
        stationName: '성북구', dataTerm: 'DAILY', ver: '1.0', returnType: 'json', numOfRows: 1, pageNo: 1,
      });
      const it = items[0];
      if (!it) throw new Error('측정값 없음');
      const pm10 = Number(it.pm10Value), pm25 = Number(it.pm25Value);
      const v10 = isNaN(pm10) ? null : pm10, v25 = isNaN(pm25) ? null : pm25;
      return { mode: 'live', station: '성북구', time: it.dataTime, pm10: v10, pm25: v25, grade: gradeOf(v10, v25), source: '한국환경공단 에어코리아' };
    } catch (e) {
      return { mode: 'demo', reason: reasonOf(e), pm10: DEMO_WEATHER.pm10, pm25: DEMO_WEATHER.pm25, grade: DEMO_WEATHER.grade, source: '한국환경공단 에어코리아' };
    }
  });
}

function kmaBase() {
  // 단기예보 발표: 02 05 08 11 14 17 20 23시 (+10분 뒤 제공)
  const now = new Date(Date.now() + 9 * HOUR - 15 * 60 * 1000);
  const hours = [2, 5, 8, 11, 14, 17, 20, 23];
  let h = hours.filter((x) => x <= now.getUTCHours()).pop();
  if (h === undefined) { now.setUTCDate(now.getUTCDate() - 1); h = 23; }
  const d = now.toISOString().slice(0, 10).replace(/-/g, '');
  return { base_date: d, base_time: String(h).padStart(2, '0') + '00' };
}

async function rain() {
  return cached('rain', HOUR, async () => {
    try {
      const base = baseFrom('KMA_SHORT_FORECAST_API', 'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst');
      const url = /getVilageFcst|getUltra/.test(base) ? base : base.replace(/\/$/, '') + '/getVilageFcst';
      const items = await dataGoJson(url, { ...kmaBase(), nx: 61, ny: 127, dataType: 'JSON', numOfRows: 300, pageNo: 1 });
      const today = new Date(Date.now() + 9 * HOUR).toISOString().slice(0, 10).replace(/-/g, '');
      const pops = items.filter((i) => i.category === 'POP' && i.fcstDate === today).map((i) => Number(i.fcstValue));
      const ptys = items.filter((i) => i.category === 'PTY' && i.fcstDate === today).map((i) => Number(i.fcstValue));
      if (!pops.length) throw new Error('오늘 예보 없음');
      const rainProb = Math.max(...pops);
      return { mode: 'live', grid: '성북구 (61,127)', rainProb, rain: rainProb >= 60 || ptys.some((x) => x > 0), source: '기상청 단기예보' };
    } catch (e) {
      return { mode: 'demo', reason: reasonOf(e), rainProb: DEMO_WEATHER.rainProb, rain: DEMO_WEATHER.rain, source: '기상청 단기예보' };
    }
  });
}

module.exports = async (req, res) => {
  const q = query(req);
  const lang = ['ko', 'en', 'zh', 'ja'].includes(q.lang) ? q.lang : 'ko';
  const [d, r] = await Promise.all([dust(), rain()]);
  // 시연: 날씨를 「비」로 바꿔 볼 수 있다
  const rainNow = q.sim === 'rain' ? true : r.rain;
  const dustBad = q.sim === 'dust' ? true : d.grade === '나쁨';
  send(res, 200, {
    dust: d,
    rain: { ...r, rain: rainNow, simulated: q.sim === 'rain' },
    indoorFirst: rainNow || dustBad,
    messages: [
      dustBad ? SAFETY.dustBad[lang] : SAFETY.dustOk[lang],
      rainNow ? SAFETY.rain[lang] : SAFETY.noRain[lang],
    ],
    emergency: SAFETY.emergency[lang],
    fixedText: true,
  });
};
