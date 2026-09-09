// Render a real dot matrix once, then animate the cached frames.
// No per-frame pixel sampling; motion stops after one sequence or off screen.
(() => {
  const canvas = document.querySelector('#ledCanvas');
  const replay = document.querySelector('#ledReplay');
  if (!canvas || !replay) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const W = canvas.width, H = canvas.height;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0, started = 0, lastDraw = 0, running = false;
  let visible = true, hasPlayed = false, photoBoard = null;
  const createSurface = () => {
    const surface = document.createElement('canvas');
    surface.width = W; surface.height = H;
    return surface;
  };
  const content = createSurface();
  const ink = content.getContext('2d', { willReadFrequently: true });
  if (!ink) return;

  function fitText(text, y, size, color) {
    ink.fillStyle = color;
    ink.font = `800 ${size}px Manrope, Arial, sans-serif`;
    while (ink.measureText(text).width > W - 128 && size > 20) {
      size -= 1;
      ink.font = `800 ${size}px Manrope, Arial, sans-serif`;
    }
    ink.fillText(text, 64, y);
  }

  function pixelate(source) {
    const surface = createSurface();
    const dots = surface.getContext('2d');
    const pixels = source.getImageData(0, 0, W, H).data;
    dots.fillStyle = '#020810';
    dots.fillRect(0, 0, W, H);
    const step = 6;
    for (let y = 3; y < H; y += step) {
      for (let x = 3; x < W; x += step) {
        const i = (y * W + x) * 4;
        const alpha = pixels[i + 3] / 255;
        const r = Math.max(7, Math.round(pixels[i] * alpha));
        const g = Math.max(17, Math.round(pixels[i + 1] * alpha));
        const b = Math.max(28, Math.round(pixels[i + 2] * alpha));
        dots.fillStyle = `rgb(${r},${g},${b})`;
        dots.beginPath();
        dots.arc(x, y, 2.2, 0, Math.PI * 2);
        dots.fill();
      }
    }
    return surface;
  }

  function makeWelcome() {
    ink.clearRect(0, 0, W, H);
    const halo = ink.createRadialGradient(740, 130, 10, 740, 130, 700);
    halo.addColorStop(0, '#342a65'); halo.addColorStop(1, '#04121f');
    ink.fillStyle = halo; ink.fillRect(0, 0, W, H);
    fitText('LUMIXIA', 104, 35, '#a58bff');
    fitText('OBRAZ, KTERÝ', 270, 88, '#f0fcff');
    fitText('NEPŘEHLÉDNETE.', 368, 84, '#82e8ff');
    fitText('LED POSTER P1.86  /  5x = 16:9', 494, 25, '#b2bdd2');
    return pixelate(ink);
  }

  let welcome = makeWelcome();
  function staticFrame() { ctx.drawImage(welcome, 0, 0); }
  function stop() {
    cancelAnimationFrame(frame); running = false;
    replay.innerHTML = 'Přehrát animaci <span aria-hidden="true">↻</span>';
    staticFrame();
  }
  function wipe(from, to, progress) {
    ctx.drawImage(from, 0, 0);
    const width = Math.floor(W * Math.max(0, Math.min(1, progress)));
    if (width) ctx.drawImage(to, 0, 0, width, H, 0, 0, width, H);
    if (width > 0 && width < W) {
      const glow = ctx.createLinearGradient(width - 35, 0, width + 18, 0);
      glow.addColorStop(0, 'rgba(130,232,255,0)');
      glow.addColorStop(0.65, 'rgba(130,232,255,.22)');
      glow.addColorStop(1, 'rgba(130,232,255,0)');
      ctx.fillStyle = glow; ctx.fillRect(width - 35, 0, 53, H);
    }
  }
  const dark = createSurface();
  const darkInk = dark.getContext('2d');
  darkInk.fillStyle = '#020810'; darkInk.fillRect(0, 0, W, H);

  function tick(time) {
    if (!running) return;
    if (!started) started = time;
    const seconds = (time - started) / 1000;
    if (seconds >= 11 || motion.matches || !visible || document.hidden) { stop(); return; }
    if (time - lastDraw >= 1000 / 30) {
      lastDraw = time;
      if (seconds < 1.7) wipe(dark, welcome, seconds / 1.7);
      else if (photoBoard && seconds >= 4 && seconds < 5.5) wipe(welcome, photoBoard, (seconds - 4) / 1.5);
      else if (photoBoard && seconds >= 5.5 && seconds < 8) ctx.drawImage(photoBoard, 0, 0);
      else if (photoBoard && seconds >= 8 && seconds < 9.5) wipe(photoBoard, welcome, (seconds - 8) / 1.5);
      else staticFrame();
    }
    frame = requestAnimationFrame(tick);
  }
  function play() {
    if (motion.matches) { staticFrame(); return; }
    cancelAnimationFrame(frame);
    started = 0; lastDraw = 0; running = true; hasPlayed = true;
    replay.innerHTML = 'Zastavit animaci <span aria-hidden="true">Ⅱ</span>';
    frame = requestAnimationFrame(tick);
  }

  staticFrame();
  canvas.parentElement.dataset.ready = 'true';
  replay.hidden = motion.matches;
  replay.addEventListener('click', () => running ? stop() : play());
  motion.addEventListener('change', () => { stop(); replay.hidden = motion.matches; });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (!visible) stop();
      else if (!hasPlayed) play();
    }, { threshold: 0.15 }).observe(canvas);
  } else play();

  const photo = new Image();
  photo.onload = () => {
    ink.clearRect(0, 0, W, H);
    const scale = Math.max(W / photo.naturalWidth, H / photo.naturalHeight);
    const width = photo.naturalWidth * scale, height = photo.naturalHeight * scale;
    ink.drawImage(photo, (W - width) / 2, (H - height) / 2, width, height);
    photoBoard = pixelate(ink);
  };
  photo.src = 'assets/lumixia-led-wall-studio.webp';
  document.fonts?.ready.then(() => { welcome = makeWelcome(); if (!running) staticFrame(); });
})();
