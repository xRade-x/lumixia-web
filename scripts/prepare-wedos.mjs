import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = resolve(root, 'release-wedos');
const web = resolve(output, 'www');
const privateDir = resolve(output, 'lumixia-private');
await rm(output, { recursive: true, force: true });
await mkdir(resolve(web, 'api'), { recursive: true });
await mkdir(privateDir, { recursive: true });
for (const name of ['styles.css', 'script.js', 'pixel-guide.js', 'hero-video.js', 'assets']) {
  await cp(resolve(root, name), resolve(web, name), { recursive: true });
}
const hashes = new Set();
for (const name of ['index.html', 'soukromi.html', 'cookies.html', '404.html']) {
  let html = await readFile(resolve(root, name), 'utf8');
  html = html.replace('data-site-mode="preview"', 'data-site-mode="production"')
    .replace(/<(div|aside)\b[^>]*data-preview-only[^>]*>[\s\S]*?<\/\1>/g, '');
  if (name !== '404.html') html = html.replace('content="noindex, nofollow"', 'content="index, follow, max-image-preview:large"');
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    hashes.add(`'sha256-${createHash('sha256').update(match[1]).digest('base64')}'`);
  }
  await writeFile(resolve(web, name), html);
}
await writeFile(resolve(web, 'robots.txt'), 'User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: https://lumixia.cz/sitemap.xml\n');
await writeFile(resolve(web, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  ['', 'soukromi.html', 'cookies.html'].map(path => `  <url><loc>https://lumixia.cz/${path}</loc></url>`).join('\n') + '\n</urlset>\n');
await cp(resolve(root, 'server/poptavka.php'), resolve(web, 'api/poptavka.php'));
for (const name of ['config.example.php', 'inquiry.php', 'mail.php', 'vendor', '.htaccess']) {
  await cp(resolve(root, 'server', name), resolve(privateDir, name), { recursive: true });
}
let htaccess = await readFile(resolve(root, 'server/public.htaccess'), 'utf8');
htaccess = htaccess.replace('INLINE_SCRIPT_HASHES', [...hashes].join(' '));
await writeFile(resolve(web, '.htaccess'), htaccess);
await writeFile(resolve(web, '.user.ini'), 'display_errors=Off\ndisplay_startup_errors=Off\nlog_errors=On\nallow_url_include=Off\ndefault_charset="UTF-8"\n');
await cp(resolve(root, 'SPUSTENI.md'), resolve(output, 'SPUSTENI.md'));
// Build output must never silently include a real SMTP secret or runtime state.
if ((await readdir(privateDir)).includes('config.php')) throw new Error('Release contains a secret configuration.');
console.log('Připraven WEDOS balíček: release-wedos (www + neveřejné lumixia-private).');
