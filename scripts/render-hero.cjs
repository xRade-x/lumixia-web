// Offline compositor: supplied logo videos on five identical raster poster bodies.
// Usage: node scripts/render-hero.cjs FRAMES_DIR FFMPEG_PATH [--preview]
// FRAMES_DIR contains portrait/ and wide/, each 336 PNGs at 24 fps (14 seconds),
// numbered 0001.png onward, scaled proportionally to 184x552 and 920x552.
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const { spawn } = require('node:child_process');
const { once } = require('node:events');
const fs = require('node:fs/promises');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const framesDir = path.resolve(process.argv[2]);
const ffmpeg = process.argv[3];
const W = 1536, H = 1024, FPS = 24, DURATION = 32;
const screen = { x: 22, y: 6, w: 184, h: 552 };
const unitY = 170, ground = 806;
const smooth = t => { const p = Math.max(0, Math.min(1, t)); return p * p * (3 - 2 * p); };
const gapAt = t => t < 14 ? 70 * (1 - smooth((t - 12) / 2)) : 70 * smooth((t - 28) / 2);
const wideAlpha = t => smooth((t - 14) / .6) * (1 - smooth((t - 27.4) / .6));
const phase = t => ((t % 14) + 14) % 14;

(async () => {
  const stage = await loadImage(path.join(root, 'media/hero/empty-stage.png'));
  const module = await loadImage(path.join(root, 'media/hero/led-module.png'));
  const base = createCanvas(228, 648), b = base.getContext('2d');
  // Same raster and baseline for every unit. Screen is exactly 1:3; 5 units = 5:3.
  b.drawImage(module, 114, 95, 497, 1801, 16.59, 2.59, 194.82, 557.25);
  b.drawImage(module, 87, 1896, 551, 208, 19, 559.84, 190, 76.25);
  b.fillStyle = '#000'; b.fillRect(screen.x, screen.y, screen.w, screen.h);
  const unit = createCanvas(228, 648), u = unit.getContext('2d');
  const foreground = createCanvas(W, H), f = foreground.getContext('2d');
  const reflection = createCanvas(W, H), r = reflection.getContext('2d');
  const canvas = createCanvas(W, H), c = canvas.getContext('2d');
  const cache = new Map();
  async function clipFrame(kind, seconds) {
    const index = Math.min(335, Math.floor(phase(seconds) * FPS)) + 1;
    const key = `${kind}/${String(index).padStart(4, '0')}.png`;
    if (!cache.has(key)) cache.set(key, await loadImage(path.join(framesDir, key)));
    if (cache.size > 8) cache.delete(cache.keys().next().value);
    return cache.get(key);
  }
  async function draw(t) {
    const solo = await clipFrame('portrait', t < 27.4 ? t + 7 : t - 25);
    u.clearRect(0, 0, 228, 648); u.drawImage(base, 0, 0);
    u.drawImage(solo, screen.x, screen.y, screen.w, screen.h);
    f.clearRect(0, 0, W, H);
    const gap = gapAt(t), origins = [];
    for (let i = 0; i < 5; i++) {
      const x = (W - screen.w * 5) / 2 + i * screen.w - screen.x + (i - 2) * gap;
      origins.push(x); f.drawImage(unit, x, unitY);
    }
    if (t >= 14 && t < 28) {
      const sx = (W - screen.w * 5) / 2, sy = unitY + screen.y;
      // Cover internal bezels only once the screens touch; no vertical seams.
      for (let i = 0; i < 5; i++) f.drawImage(solo, sx + i * screen.w, sy, screen.w, screen.h);
      const wide = await clipFrame('wide', t - 14);
      f.save(); f.globalAlpha = wideAlpha(t);
      f.drawImage(wide, sx, sy, screen.w * 5, screen.h); f.restore();
    }
    c.drawImage(stage, 0, 0, W, H);
    r.clearRect(0, 0, W, H);
    r.save(); r.translate(0, ground * 1.28); r.scale(1, -.28); r.filter = 'blur(3px)';
    r.drawImage(foreground, 0, 0); r.restore();
    r.globalCompositeOperation = 'destination-in';
    const fade = r.createLinearGradient(0, ground, 0, ground + 170);
    fade.addColorStop(0, 'rgba(255,255,255,.20)'); fade.addColorStop(1, 'rgba(255,255,255,0)');
    r.fillStyle = fade; r.fillRect(0, 0, W, H); r.globalCompositeOperation = 'source-over';
    c.drawImage(reflection, 0, 0);
    c.save(); c.filter = 'blur(6px)'; c.fillStyle = 'rgba(0,0,0,.48)';
    for (const x of origins) { c.beginPath(); c.ellipse(x + 114, ground, 97, 9, 0, 0, Math.PI * 2); c.fill(); }
    c.restore(); c.drawImage(foreground, 0, 0);
    return canvas;
  }
  for (const t of [0, 7, 13, 14.6, 19, 23, 27.6, 29, 31.958333, 32]) {
    await fs.writeFile(path.join(framesDir, `frame-${t}.png`), await (await draw(t)).encode('png'));
  }
  await fs.writeFile(path.join(root, 'assets/lumixia-posters-v2-poster.webp'), await (await draw(0)).encode('webp', 90));
  if (process.argv.includes('--preview')) { console.log('Preview frames ready'); return; }
  const output = path.join(root, 'assets/lumixia-posters-v2.mp4');
  const proc = spawn(ffmpeg, ['-hide_banner', '-loglevel', 'warning', '-y', '-f', 'rawvideo', '-pixel_format', 'rgba', '-video_size', `${W}x${H}`, '-framerate', `${FPS}`, '-i', 'pipe:0', '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '22', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', output], {stdio: ['pipe', 'inherit', 'inherit']});
  const finished = once(proc, 'exit');
  for (let frame = 0; frame < FPS * DURATION; frame++) {
    const data = (await draw(frame / FPS)).getContext('2d').getImageData(0, 0, W, H).data;
    if (!proc.stdin.write(data)) await once(proc.stdin, 'drain');
    if (frame % (FPS * 4) === 0) console.log(`Rendered ${frame / FPS}s / ${DURATION}s`);
  }
  proc.stdin.end(); const [code] = await finished;
  if (code !== 0) throw new Error(`Video encoding failed: ${code}`);
  console.log(output);
})().catch(error => { console.error(error); process.exitCode = 1; });
