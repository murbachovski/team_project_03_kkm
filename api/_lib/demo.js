// 시연 자료 — 기획서 7-1. 숙소 A·B 는 지어낸 이름 · 위치(실제 개인정보 없음)
const STAYS = {
  A: { id: 'A', name: '한성대입구역 근처 게스트하우스 (시연용 가상 숙소)', dong: '삼선동', lat: 37.5886, lng: 127.0066 },
  B: { id: 'B', name: '성북동 한옥 스테이 (시연용 가상 숙소)', dong: '성북동', lat: 37.5942, lng: 126.9968 },
};

// 이름 · 소재는 원래 이름 그대로. 좌표는 시연용 대략값(서버가 직선거리만 계산)
const PLACES = [
  { name: '길상사', area: '성북구 성북동', indoor: false, lat: 37.5996, lng: 126.9944, note: '성북동 도보해설관광 코스 첫 장소' },
  { name: '심우장', area: '성북구 성북동', indoor: false, lat: 37.5958, lng: 126.9988, note: '한용운 가옥' },
  { name: '최순우 옛집', area: '성북구 성북동', indoor: true, lat: 37.5927, lng: 126.9963, note: '실내 관람 가능' },
  { name: '한양도성 (성북동 구간)', area: '성북구', indoor: false, lat: 37.5895, lng: 127.0021, note: '' },
  { name: '성북선잠박물관', area: '성북구 성북동', indoor: true, lat: 37.5893, lng: 126.9990, note: '운영 시간 확인 필요' },
  { name: '낙산공원', area: '종로구', indoor: false, outside: true, lat: 37.5806, lng: 127.0075, note: '' },
];

// 안전 알림 고정 문장 — AI 가 쓰지 않는다 (사람 확인 필요 표시)
const SAFETY = {
  dustBad: {
    ko: '오늘은 공기가 나쁩니다. 마스크를 쓰고, 실내 관광지를 추천합니다.',
    en: 'The air is bad today. Please wear a mask, and consider indoor places.',
    zh: '今天空气质量较差。请佩戴口罩，建议选择室内景点。',
    ja: '今日は空気がよくありません。マスクを着用し、屋内の観光地をおすすめします。',
  },
  dustOk: {
    ko: '오늘은 공기가 괜찮습니다.',
    en: 'Air quality is fine today.',
    zh: '今天空气质量良好。',
    ja: '今日の空気はきれいです。',
  },
  rain: {
    ko: '오늘은 비 예보가 있습니다. 우산을 챙기세요. 실내 관광지를 먼저 보여 드립니다.',
    en: 'Rain is expected today. Please bring an umbrella. Indoor places are listed first.',
    zh: '今天预计有雨。请带好雨伞。室内景点将优先显示。',
    ja: '今日は雨の予報です。傘をお持ちください。屋内の観光地を先に表示します。',
  },
  noRain: {
    ko: '오늘은 비 예보가 없습니다.',
    en: 'No rain is expected today.',
    zh: '今天预计无雨。',
    ja: '今日は雨の予報はありません。',
  },
  emergency: {
    ko: '긴급: 화재·구급 119 · 경찰 112 · 관광통역안내 1330 (한국어·영어·중국어·일본어)',
    en: 'Emergency: Fire/Ambulance 119 · Police 112 · Tourist hotline 1330 (English, Chinese, Japanese)',
    zh: '紧急电话：火警/急救 119 · 报警 112 · 旅游咨询热线 1330（中文、英语、日语）',
    ja: '緊急：消防・救急 119 ・ 警察 112 ・ 観光案内 1330（日本語・英語・中国語）',
  },
};

// 공공 API 실패 때 보여 줄 「시연 값」
const DEMO_WEATHER = { pm10: 45, pm25: 22, grade: '보통', rainProb: 20, rain: false };

module.exports = { STAYS, PLACES, SAFETY, DEMO_WEATHER };
