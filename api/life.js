// 생활 안내 — 숙소 동의 쓰레기 배출 요일 · 시간, 주민센터 · 경찰, 교통. 원래 데이터 그대로
const { send, query } = require('./_lib/util');
const { rowsOf, meta, loadChunks } = require('./_lib/docs');
const { STAYS } = require('./_lib/demo');

function sections(prefix, wanted) {
  const out = [];
  for (const c of loadChunks().filter((x) => x.file.startsWith(prefix))) {
    for (const part of c.text.split(/^## /m).slice(1)) {
      const [head, ...rest] = part.split(/\r?\n/);
      if (!wanted || wanted.some((w) => head.includes(w))) {
        out.push({ title: head.trim(), lines: rest.filter((l) => l.startsWith('- ')).map((l) => l.slice(2)) });
      }
    }
  }
  return out;
}

module.exports = async (req, res) => {
  const stay = STAYS[query(req).stay] || STAYS.A;
  const short = stay.dong.replace(/동$/, '');

  const trash = rowsOf('생활쓰레기배출정보_서울특별시')
    .filter((r) => String(r['관리구역대상지역명']).includes(short))
    .map((r) => ({
      area: r['관리구역명'], target: r['관리구역대상지역명'], place: r['배출장소'],
      general: { days: r['생활쓰레기배출요일'], from: r['생활쓰레기배출시작시각'], to: r['생활쓰레기배출종료시각'], how: r['생활쓰레기배출방법'] },
      food: { days: r['음식물쓰레기배출요일'], from: r['음식물쓰레기배출시작시각'], to: r['음식물쓰레기배출종료시각'], how: r['음식물쓰레기배출방법'] },
      recycle: { days: r['재활용품배출요일'], from: r['재활용품배출시작시각'], to: r['재활용품배출종료시각'], how: r['재활용품배출방법'] },
      noPickup: r['미수거일'], phone: r['관리부서전화번호'], date: r['데이터기준일자'],
    }));

  const centers = rowsOf('성북구_동주민센터현황').filter((r) => String(r['행정동']).startsWith(short))
    .map((r) => ({ name: r['주민센터명'], addr: r['주소'], phone: r['전화번호'], date: r['기준일자'] }));

  const police = rowsOf('경찰청_전국 지구대 파출소 주소 현황')
    .map((r) => ({ name: `${r['관서명']} ${r['구분']}`, station: r['경찰서'], addr: r['주소'].replace(/\s+/g, ' ') }));

  send(res, 200, {
    stay: { id: stay.id, dong: stay.dong },
    trash: { list: trash, source: meta('생활쓰레기배출정보_서울특별시').title, note: trash.length ? '' : '자료 없음 — 성북구청 청소행정과 02-2241-4400' },
    trashGuide: sections('성북구청_생활안내', ['쓰레기', '종량제']),
    centers: { list: centers, source: '공공데이터포털 성북구 동주민센터 현황', date: '2023-07-17', note: centers.length ? '' : '자료 없음 — 120 다산콜센터' },
    police: { list: police, source: '경찰청 전국 지구대 · 파출소 주소 현황 (2025-12-31)' },
    transport: { sections: sections('서울시_교통카드이용안내'), source: '서울시 「내 손안에 서울」 · 교통 보도자료', date: '가격은 2024년 기사 기준 — 역에서 확인' },
    help: sections('성북구청_생활안내', ['긴급', '병원', '돈']),
  });
};
