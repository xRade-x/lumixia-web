# Fotografie a vizualizace Lumixia

Aktualizováno 10. září 2026. Fotografie dodal uživatel v konverzaci „Tvorba webových stránek“ a požádal o úpravu pro web.

## Původní snímek

- `lumixia-five-posters-original.jpeg` — nezměněný soubor `IMG_7873(1).jpeg`, pět posterů se společným sportovním přenosem. Záběr pod zastřešením není tvrzením o venkovním určení výrobku; uživatel potvrdil interiérové provedení P1.86.

## Upravené fotografie a studiové vizualizace

- `lumixia-led-poster-studio.webp` — levý poster z `IMG_7881(1).jpeg`, izolovaný na tmavém studiovém pozadí; 1122 × 1402 px.
- `lumixia-led-wall-seamless.webp` — navazuje na vizualizaci sestavy z `IMG_7873(1).jpeg`. Podle upřesnění uživatele byly odstraněny čtyři umělé dělicí čáry uvnitř aktivního obrazu. Vnější rám, pět nízkých podstavců a souvislá modrofialová vlna zůstávají; 1536 × 1024 px. Použito v úvodu a produktové kartě.
- `lumixia-posters-showroom.webp` — tři původní postery ze snímku `IMG_7881(1).jpeg` v upraveném neutrálním showroomovém prostředí; 1448 × 1086 px. Nejde o fotografii konkrétní zákaznické realizace. Nejmenší text a obrazové detaily displejů mohou být retuší pozměněné.

Úpravy vytvořil vestavěný nástroj image_gen. Pro web byly pouze zakódovány do WebP při zachování rozměrů. Generativní retuš není konstrukčním nebo rozměrovým podkladem. Všech osm původních fotografií zůstává uložených mimo publikované soubory projektu. Nahrazené verze zůstávají v historii Git.

Loga `lumixia-logo.png` a `lumixia-mark.png` dodal uživatel a zůstávají beze změny.

## Animace na společné obrazové ploše

- `lumixia-led-wall-animation.mp4` — uživatelovo video `LOGO ANIMACE_LEDPOSTER.mp4` promítnuté do perspektivy aktivního displeje vizualizace `lumixia-led-wall-seamless.webp`. Animuje se jeden společný obraz; rám, podstavce a studiové pozadí zůstávají statické. Z portrétního zdroje je použit středový výřez 720 × 960 px, doplněný černou po stranách do 16:9 bez deformace loga. Výsledná kompozice má 1536 × 1024 px, 24 snímků/s a délku 10 sekund. MP4/H.264 s hlavičkou na začátku souboru, bez zvukové stopy pro tichou smyčku v úvodu webu.
- `lumixia-led-wall-animation-poster.webp` — náhled ze stejné kompozice v čase 8,8 s. Zobrazuje se před přehráním a při vypnutých animacích.

Video bylo sestaveno pomocí FFmpeg; logo ani samotná animace nebyly generativně překresleny. Původní MP4 zůstává uložené mimo publikovaný projekt. Produktová karta nadále používá statický obrázek s modrofialovou vlnou.

## Podklady ke grafice rozteče pixelů

Zdroj: [Planar — What is Pixel Pitch and Why Does It Matter?](https://www.planar.com/blog/2025/what-is-pixel-pitch-and-why-does-it-matter/), ověřeno 10. září 2026.

Tři schematické náhledy používají stejnou velikost motivu a rozteče bodů v poměru 1,86 : 2,5 : 3,9. Nejde o skutečnou velikost LED na zařízení návštěvníka. Přepočet vzdálenosti rozteč × 1,72 vychází z publikované tabulky průměrné komfortní vzdálenosti; hodnoty pro P1.86 a P3.9 jsou interpolovaným odhadem. P2.5 a P3.9 jsou pouze srovnávací příklady. Volba konkrétního umístění závisí také na zraku a obsahu.
