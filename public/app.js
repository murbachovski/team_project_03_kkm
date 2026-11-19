// 성북 세이프패스 화면 — 서버(/api)에서 받은 원래 데이터를 그대로 보여 준다
const T = {
  ko: { yourStay: '내 숙소', switchStay: '시연 숙소', safety: '오늘의 안전 알림', places: '가까운 관광지', food: '먹거리', events: '진행 중·예정 행사', life: '생활 안내', more: '더 알아보기',
    demoWeather: '시연:', simReal: '실제 날씨', simRain: '비로 바꾸기', simDust: '미세먼지 나쁨',
    official: '공식 관광정보 (한국관광공사)', indoor: '실내', outdoor: '실외', outside: '성북구 밖', indoorFirst: '오늘 날씨 때문에 실내 관광지를 먼저 보여 드립니다.', nearFirst: '숙소에서 가까운 순서입니다 (직선거리).',
    why: '오늘 가기 좋은 이유', aiBy: 'AI가 쓴 글', aiFail: '지금은 AI 설명을 보여 드릴 수 없습니다. 1330에 문의하세요.', sources: '근거',
    live: '실시간', demo: '시연 값', baeng: '백년가게', orae: '서울 오래가게', trash: '우리 동네 쓰레기 배출일', general: '일반쓰레기', foodWaste: '음식물', recycle: '재활용', noPickup: '수거 안 하는 날',
    center: '주민센터', police: '경찰', transport: '버스·지하철', help: '긴급·도움', dataDate: '자료 기준일', checkDate: '가기 전에 날짜를 꼭 확인하세요.', noData: '자료 없음',
    pm10: '미세먼지', pm25: '초미세먼지', rainProb: '강수확률', privacy: '이 화면은 이름·연락처·위치를 묻지 않습니다.',
    footer: '이름·주소·날짜·시간은 공공데이터 원문 그대로 보여 줍니다. 성북 세이프패스 · 캡스톤 시제품.' },
  en: { yourStay: 'Your stay', switchStay: 'Demo stay', safety: 'Today\'s safety', places: 'Nearby places', food: 'Local eats', events: 'Events now & upcoming', life: 'Living guide', more: 'More help',
    demoWeather: 'Demo:', simReal: 'Real weather', simRain: 'Make it rain', simDust: 'Bad air',
    official: 'Official tourism info (Korea Tourism Organization)', indoor: 'Indoor', outdoor: 'Outdoor', outside: 'Outside Seongbuk-gu', indoorFirst: 'Indoor places are shown first because of today\'s weather.', nearFirst: 'Closest to your stay first (straight-line distance).',
    why: 'Why go today?', aiBy: 'Written by AI', aiFail: 'AI description is not available now. Please call 1330.', sources: 'Sources',
    live: 'Live', demo: 'Demo value', baeng: '100-year shops', orae: 'Seoul Long-standing shops', trash: 'Trash days for your area', general: 'General', foodWaste: 'Food waste', recycle: 'Recycling', noPickup: 'No pickup',
    center: 'Community service center', police: 'Police', transport: 'Buses & subway', help: 'Emergency & help', dataDate: 'Data as of', checkDate: 'Please check the dates before you go.', noData: 'No data',
    pm10: 'PM10', pm25: 'PM2.5', rainProb: 'Chance of rain', privacy: 'This page does not ask for your name, contact or location.',
    footer: 'Names, addresses, dates and times are shown as in the original Korean public data. Seongbuk SafePass · student capstone prototype.' },
  zh: { yourStay: '您的住处', switchStay: '演示住处', safety: '今日安全提醒', places: '附近景点', food: '当地美食', events: '进行中・即将举行的活动', life: '生活指南', more: '更多帮助',
    demoWeather: '演示：', simReal: '实际天气', simRain: '改为下雨', simDust: '空气差',
    official: '官方旅游信息（韩国观光公社）', indoor: '室内', outdoor: '室外', outside: '城北区外', indoorFirst: '因今日天气，优先显示室内景点。', nearFirst: '按离住处的直线距离由近到远排列。',
    why: '今天为什么去？', aiBy: 'AI 撰写', aiFail: '暂时无法提供 AI 说明，请拨打 1330。', sources: '依据',
    live: '实时', demo: '演示数据', baeng: '百年老店', orae: '首尔老字号', trash: '您所在区域的垃圾投放日', general: '一般垃圾', foodWaste: '厨余垃圾', recycle: '可回收物', noPickup: '不收运日',
    center: '居民中心', police: '警察', transport: '公交・地铁', help: '紧急・求助', dataDate: '数据日期', checkDate: '出发前请再次确认日期。', noData: '无资料',
    pm10: 'PM10', pm25: 'PM2.5', rainProb: '降水概率', privacy: '本页面不收集您的姓名、联系方式或位置。',
    footer: '名称、地址、日期和时间按韩语公共数据原文显示。城北 SafePass · 学生毕业设计原型。' },
  ja: { yourStay: 'ご宿泊先', switchStay: 'デモ宿泊先', safety: '今日の安全情報', places: '近くの観光地', food: '地元のグルメ', events: '開催中・予定のイベント', life: '生活ガイド', more: 'その他のサポート',
    demoWeather: 'デモ：', simReal: '実際の天気', simRain: '雨にする', simDust: '空気が悪い',
    official: '公式観光情報（韓国観光公社）', indoor: '屋内', outdoor: '屋外', outside: '城北区外', indoorFirst: '今日の天気のため、屋内の観光地を先に表示しています。', nearFirst: '宿泊先から近い順（直線距離）。',
    why: '今日おすすめの理由', aiBy: 'AI が作成', aiFail: '現在 AI の説明を表示できません。1330 にお問い合わせください。', sources: '根拠',
    live: 'リアルタイム', demo: 'デモ値', baeng: '百年店舗', orae: 'ソウル老舗', trash: 'お住まいの地域のごみ出し日', general: '一般ごみ', foodWaste: '生ごみ', recycle: '資源ごみ', noPickup: '収集なし',
    center: '住民センター', police: '警察', transport: 'バス・地下鉄', help: '緊急・ヘルプ', dataDate: 'データ基準日', checkDate: 'お出かけ前に日付をご確認ください。', noData: '資料なし',
    pm10: 'PM10', pm25: 'PM2.5', rainProb: '降水確率', privacy: 'このページは名前・連絡先・位置情報を求めません。',
    footer: '名称・住所・日付・時間は韓国の公共データの原文のまま表示しています。城北 SafePass ・ 学生キャップストーン試作品。' },
};

// 검토 뒤 추가한 문구 (실패 안내 · 숙소 카드 · 링크)
const T2 = {
  ko: { loadFail: '정보를 불러오지 못했습니다.', retry: '다시 시도', seoul: '서울 성북구', sbOffice: '성북구청 누리집', visit: '비짓서울', hotline: '1330 관광통역안내', emergencyFixed: '긴급: 화재·구급 119 · 경찰 112 · 관광통역안내 1330' },
  en: { loadFail: 'Could not load this information.', retry: 'Try again', seoul: 'Seongbuk-gu, Seoul', sbOffice: 'Seongbuk-gu Office (English)', visit: 'VISIT SEOUL', hotline: '1330 Korea Travel Hotline', emergencyFixed: 'Emergency: Fire/Ambulance 119 · Police 112 · Travel hotline 1330' },
  zh: { loadFail: '无法加载此信息。', retry: '重试', seoul: '首尔 城北区', sbOffice: '城北区厅网站（英文）', visit: 'VISIT SEOUL', hotline: '1330 旅游咨询热线', emergencyFixed: '紧急：火警/急救 119 · 报警 112 · 旅游热线 1330' },
  ja: { loadFail: '情報を読み込めませんでした。', retry: '再試行', seoul: 'ソウル 城北区', sbOffice: '城北区庁サイト（英語）', visit: 'VISIT SEOUL', hotline: '1330 観光通訳案内', emergencyFixed: '緊急：消防・救急 119 ・ 警察 112 ・ 観光案内 1330' },
};
Object.keys(T2).forEach((l) => Object.assign(T[l], T2[l]));
const LINKS = {
  ko: { sb: 'https://www.sb.go.kr', visit: 'https://korean.visitseoul.net' },
  en: { sb: 'https://www.sb.go.kr/en', visit: 'https://english.visitseoul.net' },
  zh: { sb: 'https://www.sb.go.kr/en', visit: 'https://chinese.visitseoul.net' },
  ja: { sb: 'https://www.sb.go.kr/en', visit: 'https://japanese.visitseoul.net' },
};

const params = new URLSearchParams(location.search);
const state = {
  stay: params.get('stay') === 'B' ? 'B' : 'A',
  lang: ['ko', 'en', 'zh', 'ja'].includes(params.get('lang')) ? params.get('lang') : 'ko',
  sim: '',
  indoorFirst: false,
};
const $ = (s) => document.querySelector(s);
const t = (k) => T[state.lang][k] || k;
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const api = (p) => fetch('/api/' + p).then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); });
// 이용자에게는 「시연 값」 배지만. 실패 이유는 관리자용으로 콘솔에만 남긴다
const modeBadge = (o) => {
  if (o.mode === 'live') return `<span class="badge live">${t('live')}</span>`;
  if (o.reason) console.info('[시연 값]', o.source, o.reason);
  return `<span class="badge demo">${t('demo')}</span>`;
};
// 불러오기 실패 때 빈칸 대신 안내와 「다시 시도」 버튼
async function guard(sel, fn) {
  try { await fn(); } catch (e) {
    console.warn(sel, e);
    const box = $(sel);
    box.className = '';
    box.innerHTML = `<p class="fail">${t('loadFail')} <button class="retry">${t('retry')}</button></p>`;
    box.querySelector('.retry').onclick = () => guard(sel, fn);
  }
}
const loadTop = () => guard('#safetyBody', loadSafety).then(() => guard('#placesList', loadPlaces));
const loadAll = () => { guard('#passName', loadStay); loadTop(); guard('#foodBody', loadFood); guard('#eventsBody', loadEvents); guard('#lifeBody', loadLife); };

// 중국어·일본어 글꼴은 그 언어를 고를 때만 내려받는다
const FONT = { zh: 'Noto+Sans+SC', ja: 'Noto+Sans+JP' };
function loadFont(lang) {
  if (!FONT[lang] || document.getElementById('font-' + lang)) return;
  const l = document.createElement('link');
  l.id = 'font-' + lang; l.rel = 'stylesheet';
  l.href = `https://fonts.googleapis.com/css2?family=${FONT[lang]}:wght@400;500;700&display=swap`;
  document.head.appendChild(l);
}

// 쓰레기 배출 요일 「일+화+목」 → 고른 언어의 요일 (원문은 그대로 두고 옆에 덧붙임)
const DAYS = {
  en: { 일: 'Sun', 월: 'Mon', 화: 'Tue', 수: 'Wed', 목: 'Thu', 금: 'Fri', 토: 'Sat' },
  zh: { 일: '周日', 월: '周一', 화: '周二', 수: '周三', 목: '周四', 금: '周五', 토: '周六' },
  ja: { 일: '日', 월: '月', 화: '火', 수: '水', 목: '木', 금: '金', 토: '土' },
};
const dayHelp = (s) => {
  const m = DAYS[state.lang];
  if (!m) return '';
  const parts = String(s).split('+').map((d) => m[d.trim()]).filter(Boolean);
  return parts.length ? `<span class="day-help">(${parts.join(', ')})</span>` : '';
};
// 근거 문서 이름: 확장자(.md)를 지운다
const docName = (f) => String(f).replace(/\.md$/i, '');

function applyText() {
  document.documentElement.lang = state.lang;
  loadFont(state.lang);
  document.querySelectorAll('[data-t]').forEach((el) => (el.textContent = t(el.dataset.t)));
  document.querySelectorAll('.langs button').forEach((b) => b.setAttribute('aria-pressed', b.dataset.lang === state.lang));
  document.querySelectorAll('.sim button').forEach((b) => b.setAttribute('aria-pressed', b.dataset.sim === state.sim));
  document.querySelectorAll('.stub-btns a').forEach((a) => {
    a.href = `?stay=${a.textContent}&lang=${state.lang}`;
    a.setAttribute('aria-current', a.textContent === state.stay);
  });
  $('#linkSb').href = LINKS[state.lang].sb;
  $('#linkVisit').href = LINKS[state.lang].visit;
}

async function loadStay() {
  const d = await api('stays');
  const s = d.stays.find((x) => x.id === state.stay);
  $('#passName').textContent = s.name;
  $('.pass-dong').textContent = `${t('seoul')} ${s.dong} · QR ${s.id}`;
}

async function loadSafety() {
  const d = await api(`safety?lang=${state.lang}&sim=${state.sim}`);
  state.indoorFirst = d.indoorFirst;
  $('#safetyBody').className = '';
  $('#safetyBody').innerHTML = `
    ${d.messages.map((m, i) => `<div class="alert ${(i === 0 && d.dust.grade === '나쁨') || (i === 0 && state.sim === 'dust') || (i === 1 && d.rain.rain) ? 'warn' : ''}">${esc(m)}</div>`).join('')}
    <div class="readings">
      <span>${t('pm10')} <b>${esc(d.dust.pm10 ?? '-')}</b> ㎍/㎥</span>
      <span>${t('pm25')} <b>${esc(d.dust.pm25 ?? '-')}</b> ㎍/㎥</span>
      <span>${t('rainProb')} <b>${esc(d.rain.rainProb ?? '-')}</b> %</span>
    </div>
    <div class="src">${esc(d.dust.source)} ${modeBadge(d.dust)}<br>${esc(d.rain.source)} ${modeBadge(d.rain)}</div>`;
}

async function loadPlaces() {
  const d = await api(`places?stay=${state.stay}&lang=${state.lang}&indoorFirst=${state.indoorFirst ? 1 : 0}`);
  $('#placesHint').textContent = state.indoorFirst ? t('indoorFirst') : t('nearFirst');
  $('#placesList').innerHTML = d.places.map((p) => `
    <li>
      <div class="item-head"><span class="item-name">${esc(p.name)}</span><span class="dist">${p.distKm.toFixed(2)} km</span></div>
      <div class="meta">
        <span class="badge ${p.indoor ? 'in' : 'out'}">${p.indoor ? t('indoor') : t('outdoor')}</span>
        ${p.outside ? `<span class="badge">${t('outside')}</span>` : ''}${esc(p.area)}${p.note ? ' · ' + esc(p.note) : ''}
      </div>
      <button class="ai-btn" data-name="${esc(p.name)}">${t('why')}</button>
      <div class="ai-slot" aria-live="polite"></div>
    </li>`).join('');
  const o = d.official;
  $('#officialList').innerHTML = (o.list.length ? `<ol class="list">${o.list.map((p) => `
    <li><div class="item-head"><span class="item-name">${esc(p.name)}</span><span class="dist">${p.distKm.toFixed(2)} km</span></div>
    <div class="meta">${esc(p.addr)}</div></li>`).join('')}</ol>` : `<p class="hint">${t('noData')}</p>`)
    + `<div class="src">${esc(o.source)} ${modeBadge(o)}</div>`;
}

async function explain(btn) {
  const slot = btn.nextElementSibling;
  btn.disabled = true;
  slot.innerHTML = '<div class="ai-text">…</div>';
  const weather = state.sim || (state.indoorFirst ? 'rain' : 'clear');
  try {
    const r = await fetch('/api/explain', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name: btn.dataset.name, lang: state.lang, weather }) });
    const d = await r.json();
    if (!d.ok) { console.info('[AI 실패]', d.tried || d.note); throw new Error('ai'); }
    slot.innerHTML = `<div class="ai-text">${esc(d.text)}<small>${t('aiBy')}</small><small>${t('sources')}:</small><ul class="ai-src">${d.sources.map((s) => `<li>${esc(docName(s))}</li>`).join('')}</ul></div>`;
  } catch {
    slot.innerHTML = `<div class="ai-text">${t('aiFail')}</div>`;
  } finally {
    btn.disabled = false;
  }
}

async function loadFood() {
  const d = await api(`food?stay=${state.stay}`);
  const b = d.baengnyeon;
  $('#foodBody').innerHTML = `
    <h3>${t('baeng')}</h3>
    <div>${b.list.map((x) => `<div class="row"><div class="item-name">${esc(x.name)}</div><div class="meta">${esc(x.addr)}</div></div>`).join('')}</div>
    <div class="src">${esc(b.source)} · ${t('dataDate')} ${esc(b.date)} ${modeBadge(b)}</div>
    <h3>${t('orae')}</h3>
    <div>${d.orae.list.map((x) => `<div class="row"><div class="item-name">${esc(x['가게'])}</div><div class="meta">${esc(x['종류'])}</div></div>`).join('')}</div>
    <div class="src">${esc(d.orae.source)} · ${esc(d.orae.note)}</div>`;
}

async function loadEvents() {
  const d = await api('events');
  $('#eventsBody').innerHTML = `<p class="hint">${t('checkDate')}</p>
    ${d.list.length ? d.list.map((e) => `<div class="row">
      <div class="item-name">${e.url ? `<a href="${esc(e.url)}" target="_blank" rel="noopener">${esc(e.title)}</a>` : esc(e.title)}</div>
      <div class="meta"><span class="badge">${esc(e.kind)}</span>${esc(e.start)} ~ ${esc(e.end)} · ${esc(e.place)}</div>
      <div class="meta">${esc(e.time)}${e.fee ? ' · ' + esc(e.fee) : ''}</div></div>`).join('') : `<p>${t('noData')}</p>`}
    <div class="src">${esc(d.source)} · ${t('dataDate')} ${esc(d.date)} ${modeBadge(d)}</div>`;
}

async function loadLife() {
  const d = await api(`life?stay=${state.stay}`);
  const tr = d.trash.list[0];
  const row = (label, x) => `<tr><th>${label}</th><td class="num">${esc(x.days)} ${dayHelp(x.days)}<br>${esc(x.from)}–${esc(x.to)}</td><td>${esc(x.how)}</td></tr>`;
  const det = (title, items) => `<details><summary>${esc(title)}</summary><ul>${items.map((l) => `<li>${esc(l)}</li>`).join('')}</ul></details>`;
  $('#lifeBody').innerHTML = `
    <h3>${t('trash')} · ${esc(d.stay.dong)}</h3>
    ${tr ? `<table class="trash">${row(t('general'), tr.general)}${row(t('foodWaste'), tr.food)}${row(t('recycle'), tr.recycle)}
      <tr><th>${t('noPickup')}</th><td colspan="2">${esc(tr.noPickup)}</td></tr></table>
      <div class="src">${esc(tr.area)} · ${esc(tr.place)} · ☎ ${esc(tr.phone)} · ${t('dataDate')} ${esc(tr.date)}</div>` : `<p>${esc(d.trash.note)}</p>`}
    ${d.trashGuide.map((s) => det(s.title, s.lines)).join('')}
    <h3>${t('center')}</h3>
    ${d.centers.list.map((c) => `<div class="row"><div class="item-name">${esc(c.name)}</div><div class="meta">${esc(c.addr)} · <a href="tel:${esc(c.phone)}">${esc(c.phone)}</a></div></div>`).join('') || `<p>${esc(d.centers.note)}</p>`}
    <div class="src">${esc(d.centers.source)} · ${t('dataDate')} ${esc(d.centers.date)}</div>
    <h3>${t('police')}</h3>
    ${det(d.police.list.length + ' · ' + d.police.source, d.police.list.map((p) => `${p.name} (${p.station}) — ${p.addr}`))}
    <h3>${t('transport')}</h3>
    ${d.transport.sections.map((s) => det(s.title, s.lines)).join('')}
    <div class="src">${esc(d.transport.source)} · ${esc(d.transport.date)}</div>
    <h3>${t('help')}</h3>
    ${d.help.map((s) => det(s.title, s.lines)).join('')}`;
}

function bind() {
  document.querySelectorAll('.langs button').forEach((b) => b.addEventListener('click', () => {
    state.lang = b.dataset.lang;
    history.replaceState(null, '', `?stay=${state.stay}&lang=${state.lang}`);
    applyText(); loadAll();
  }));
  document.querySelectorAll('.sim button').forEach((b) => b.addEventListener('click', () => {
    state.sim = b.dataset.sim; applyText(); loadTop();
  }));
  $('#placesList').addEventListener('click', (e) => { const b = e.target.closest('.ai-btn'); if (b) explain(b); });
}

applyText(); bind();
loadAll();
