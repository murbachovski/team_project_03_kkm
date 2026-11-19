// 로컬 실행: node --env-file=.env server.js  →  http://localhost:3000
// public 폴더(화면)와 /api/이름 (서버 기능)을 함께 띄운다. 배포(Vercel)에서는 쓰지 않는다.
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT) || 3000;
const PUB = path.join(__dirname, 'public');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json' };

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const m = url.pathname.match(/^\/api\/([a-z]+)$/);
  if (m) {
    const file = path.join(__dirname, 'api', m[1] + '.js');
    if (!fs.existsSync(file)) { res.statusCode = 404; return res.end('{"error":"없는 주소"}'); }
    try {
      req.query = Object.fromEntries(url.searchParams);
      await require(file)(req, res);
    } catch (e) {
      console.error(e);
      res.statusCode = 500;
      res.end(JSON.stringify({ error: '서버 오류' }));
    }
    return;
  }
  let p = path.normalize(path.join(PUB, decodeURIComponent(url.pathname)));
  if (!p.startsWith(PUB)) { res.statusCode = 403; return res.end(); }
  if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, 'index.html');
  if (!fs.existsSync(p)) { res.statusCode = 404; return res.end('Not found'); }
  res.setHeader('Content-Type', TYPES[path.extname(p)] || 'application/octet-stream');
  fs.createReadStream(p).pipe(res);
}).listen(PORT, () => console.log(`성북 세이프패스: http://localhost:${PORT}  (숙소 A: /?stay=A · 숙소 B: /?stay=B)`));
