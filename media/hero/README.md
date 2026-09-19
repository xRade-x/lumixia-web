# Hero animace – 19. 9. 2026

Web přehrává jeden hotový MP4, proto se obsah na obrazovkách a pohyb posterů nemohou rozcházet. Přehrávání, pauza, omezený pohyb a zastavení mimo záběr zachovávají `hero-video.js`.

## Dodané animace

Z projektu LUMIXIA, verze 2 schválená v úkolu „Vytvořit grafiku na ledpostery“:

- `outputs/LUMIXIA-logo-animace-v2/LUMIXIA-logo-v2-344x1032-14s.mp4` – SHA-256 `74a1402d5ac19ec2731f9e320a0e731693282ae7e8c57e3acaa6927af80530a3`
- `outputs/LUMIXIA-logo-5-posteru-v2/LUMIXIA-logo-v2-5-posteru-1720x1032-14s.mp4` – SHA-256 `ec5ad7f476545f7ddc7f85287da32fdd63dc3dcab1fdb3cafe6c5714055f7cfc`

Původní MP4 jsou v sousední složce projektu `../outputs/`, nepřepisují se. Dodaný obraz pro jeden poster má 344 × 1032 px (1:3), společný 1720 × 1032 px (5:3). Na webu jsou plochy 184 × 552 a 920 × 552 px, oba přesně proporcionální bez ořezu. Dřívější označení 16:9 bylo proto v aktuálním popisu opraveno na 5:3.

## Časová osa

- 0–12 s: pět samostatných posterů přehrává animaci v2.
- 12–14 s: postery se plynule spojí, obsah stále běží.
- 14–28 s: široká verze animace na jedné souvislé ploše; krátké prolínání na začátku a konci.
- 28–30 s: postery se opět oddělí.
- 30–32 s: samostatná animace naváže na začátek smyčky.

Všech pět používá shodný raster a stejnou výšku podstavce. V celé spojené ploše se překryjí vnitřní rámečky. Podklady `empty-stage.png` a `led-module.png` jsou zachované z původní hero animace ze 16. září.

## Obnova výsledného MP4

Potřeba Node.js, `@napi-rs/canvas` a FFmpeg s libx264. Nejsou potřeba pro běžné úpravy ani nasazení webu.

1. Z obou originálů vyexportovat 14 sekund při 24 fps do `FRAMES_DIR/portrait/%04d.png` a `FRAMES_DIR/wide/%04d.png`, začínat 0001. Použít filtry `fps=24,scale=184:552:flags=lanczos`, respektive `fps=24,scale=920:552:flags=lanczos`.
2. Spustit `node scripts/render-hero.cjs FRAMES_DIR FFMPEG_PATH`. Přepínač `--preview` vytvoří jen kontrolní snímky a statický poster.
3. Výstup `assets/lumixia-posters-v2.mp4`: 1536 × 1024, 24 fps, 32 s, H.264 yuv420p, bez zvuku, faststart. Statický poster ukazuje pět samostatných obrazovek s logem.
