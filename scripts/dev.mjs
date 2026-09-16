import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const publicFiles = new Set(['index.html', 'soukromi.html', 'cookies.html', '404.html', 'robots.txt', 'styles.css', 'script.js', 'pixel-guide.js', 'hero-video.js']);
const mime = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2', '.mp4': 'video/mp4'
};
const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const name = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
    const file = resolve(root, name);
    const isAsset = name.startsWith('assets/') && file.startsWith(resolve(root, 'assets') + sep)
      && !name.split('/').some(part => part.startsWith('.'));
    if (!publicFiles.has(name) && !isAsset) {
      response.writeHead(404).end('Nenalezeno');
      return;
    }
    if (!['GET', 'HEAD'].includes(request.method)) {
      response.writeHead(405, { Allow: 'GET, HEAD' }).end();
      return;
    }
    const body = await readFile(file);
    const headers = {
      'Content-Type': mime[extname(file)] || 'application/octet-stream',
      'Content-Length': body.length, 'Accept-Ranges': 'bytes',
      'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff'
    };
    // Browsers request MP4 byte ranges to start and seek without downloading again.
    const range = request.method === 'GET' && request.headers.range;
    if (range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(range);
      if (match && (match[1] || match[2])) {
        const start = match[1] ? Number(match[1]) : Math.max(0, body.length - Number(match[2]));
        const end = match[1] && match[2] ? Math.min(Number(match[2]), body.length - 1) : body.length - 1;
        if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start >= body.length) {
          response.writeHead(416, { 'Content-Range': `bytes */${body.length}` }).end();
          return;
        }
        response.writeHead(206, { ...headers, 'Content-Length': end - start + 1,
          'Content-Range': `bytes ${start}-${end}/${body.length}` });
        response.end(body.subarray(start, end + 1));
        return;
      }
    }
    response.writeHead(200, headers);
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch {
    response.writeHead(404).end('Nenalezeno');
  }
});
server.on('error', error => { console.error(error.message); process.exitCode = 1; });
server.listen(8000, '127.0.0.1', () => console.log('Lumixia: http://127.0.0.1:8000'));
