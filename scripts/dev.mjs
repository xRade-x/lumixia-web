import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const publicFiles = new Set(['index.html', 'styles.css', 'script.js', 'pixel-guide.js']);
const mime = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2'
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
    response.writeHead(200, {
      'Content-Type': mime[extname(file)] || 'application/octet-stream',
      'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff'
    });
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch {
    response.writeHead(404).end('Nenalezeno');
  }
});
server.on('error', error => { console.error(error.message); process.exitCode = 1; });
server.listen(8000, '127.0.0.1', () => console.log('Lumixia: http://127.0.0.1:8000'));
