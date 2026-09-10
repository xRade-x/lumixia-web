// Approximate comfortable distance: 1.72 m per mm of pitch, following
// Planar's published table. This is not a minimum or visual-acuity distance.
(() => {
  const guide = document.querySelector('#pixelGuide');
  if (!guide) return;
  const choices = [...guide.querySelectorAll('input[name="pixel-pitch"]')];
  const distance = guide.querySelector('#pitchDistance');
  const selected = guide.querySelector('#pitchSelected');
  const span = guide.querySelector('#distanceSpan');
  const pitches = new Set([1.86, 2.5, 3.9]);
  function update() {
    const choice = choices.find(input => input.checked);
    const pitch = Number(choice?.value);
    if (!pitches.has(pitch)) return;
    const meters = pitch * 1.72;
    distance.textContent = `cca ${meters.toLocaleString('cs-CZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} m`;
    selected.textContent = `pro P${choice.value}`;
    span.style.width = `${Math.min(100, meters / 8 * 100)}%`;
  }
  choices.forEach(choice => choice.addEventListener('change', update));
  update();
})();
