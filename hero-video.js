(() => {
  const video = document.getElementById('heroVideo');
  const toggle = document.querySelector('.hero-video-toggle');
  if (!video || !toggle) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let wantsPlayback = !reducedMotion.matches;
  let inView = false;
  video.muted = true;
  video.controls = false;
  toggle.hidden = false;

  const syncLabel = () => {
    toggle.textContent = video.paused ? 'Přehrát animaci' : 'Pozastavit animaci';
  };
  const updatePlayback = () => {
    if (wantsPlayback && inView && !document.hidden) {
      video.play().catch(() => {
        // Autoplay may be blocked by the browser or a power-saving setting.
        if (!inView || document.hidden || !wantsPlayback) return;
        wantsPlayback = false;
        syncLabel();
      });
    } else {
      video.pause();
    }
  };
  toggle.addEventListener('click', () => {
    wantsPlayback = video.paused;
    updatePlayback();
  });
  video.addEventListener('play', syncLabel);
  video.addEventListener('pause', syncLabel);
  video.addEventListener('error', () => {
    wantsPlayback = false;
    video.pause();
    toggle.hidden = true;
  });
  document.addEventListener('visibilitychange', updatePlayback);
  reducedMotion.addEventListener('change', event => {
    if (event.matches) {
      wantsPlayback = false;
      updatePlayback();
    }
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting && entry.intersectionRatio >= 0.15;
      updatePlayback();
    }, { threshold: [0, 0.15] }).observe(video);
  } else {
    inView = true;
    updatePlayback();
  }
})();
