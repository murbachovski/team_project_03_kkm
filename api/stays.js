// QR 숙소 정보 — 시연용 가상 숙소 A · B, 그리고 QR 발급 대상(인허가 4종) 건수
const { send } = require('./_lib/util');
const { lodgingCounts } = require('./_lib/docs');
const { STAYS } = require('./_lib/demo');

module.exports = async (req, res) => {
  send(res, 200, {
    stays: Object.values(STAYS).map(({ id, name, dong }) => ({ id, name, dong })),
    qrTargets: { counts: lodgingCounts(), source: '서울 열린데이터광장 성북구 숙박 인허가 4종 (영업 중, 2026-11-05 받은 자료)' },
  });
};
