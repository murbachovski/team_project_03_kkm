// 답변참고문서 읽기: AI 근거는 청킹만, 숙소 인허가 4종은 서버 데이터로만
const fs = require('fs');
const path = require('path');

const ROOT = path.join(process.cwd(), 'docs', '답변참고문서');
const CHUNK_DIR = path.join(ROOT, '청킹');
let chunks = null;

function loadChunks() {
  if (chunks) return chunks;
  chunks = [];
  try {
    for (const f of fs.readdirSync(CHUNK_DIR)) {
      if (!f.endsWith('.md')) continue;
      const text = fs.readFileSync(path.join(CHUNK_DIR, f), 'utf8');
      const title = (text.match(/^# (.+)$/m) || [])[1] || f;
      const kw = (text.match(/^키워드: (.+)$/m) || [])[1] || '';
      chunks.push({ file: f, title, kw, text });
    }
  } catch { /* 폴더가 없으면 빈 목록 */ }
  return chunks;
}

function chunksOf(prefix) {
  return loadChunks().filter((c) => c.file.startsWith(prefix)).sort((a, b) => a.file.localeCompare(b.file));
}

// 마크다운 표 → 행 객체 목록 (원래 데이터 그대로)
function parseTables(text) {
  const rows = [];
  const lines = text.split(/\r?\n/);
  let head = null;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i].trim();
    if (!l.startsWith('|')) { head = null; continue; }
    const cells = l.slice(1, -1).split('|').map((s) => s.trim());
    if (!head) { head = cells; i++; continue; }
    const o = {};
    head.forEach((h, k) => (o[h] = cells[k] ?? ''));
    rows.push(o);
  }
  return rows;
}

function rowsOf(prefix) {
  const out = [];
  for (const c of chunksOf(prefix)) out.push(...parseTables(c.text));
  return out;
}

function meta(prefix) {
  const c = chunksOf(prefix)[0];
  if (!c) return { title: prefix, source: '', date: '' };
  return {
    title: c.title,
    source: ((c.text.match(/^- 출처: (.+)$/m) || [])[1] || '').trim(),
    date: ((c.text.match(/^- 받은 날: (.+)$/m) || [])[1] || '').trim(),
  };
}

// 간단한 낱말 겹침 검색 — 근거 문서 이름을 함께 돌려준다
function search(q, n = 4) {
  const words = String(q).split(/[\s,·]+/).filter((w) => w.length >= 2);
  return loadChunks()
    .map((c) => {
      let s = 0;
      for (const w of words) {
        if (c.kw.includes(w)) s += 3;
        if (c.title.includes(w)) s += 2;
        if (c.text.includes(w)) s += 1;
      }
      return { c, s };
    })
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, n)
    .map((x) => ({ file: x.c.file, title: x.c.title, text: x.c.text.slice(0, 1800) }));
}

// QR 발급 대상 숙소(인허가 4종) — 청킹전 파일 4개, AI 근거 아님
function lodgingCounts() {
  const dir = path.join(ROOT, '청킹전');
  const out = {};
  for (const kind of ['외국인관광도시민박업', '관광숙박업', '한옥체험업', '숙박업']) {
    try {
      const t = fs.readFileSync(path.join(dir, `성북구_${kind}인허가_2026.md`), 'utf8');
      out[kind] = parseTables(t).length;
    } catch { out[kind] = null; }
  }
  return out;
}

module.exports = { rowsOf, meta, search, lodgingCounts, loadChunks };
