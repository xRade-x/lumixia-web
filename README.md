# Lumixia

Prezentační web pro pronájem LED obrazovek a LED posterů. Navazuje na původní návrh z konverzace „Tvorba webových stránek“ a používá dodaná loga.

## Průběžné úpravy

Napište požadovanou změnu v úkolu Lumixia v Codexu. Úprava se provede ve zdrojových souborech, ověří a uloží do Gitu. Po dokončení nasazení na příslušný hosting stačí obnovit stejnou webovou adresu.

- `index.html` — texty, sekce, navigace a formulář.
- `styles.css` — barvy, rozložení a mobilní zobrazení.
- `script.js` — menu, výběr produktu a poptávkový formulář.
- `pixel-guide.js` — interaktivní srovnání rozteče pixelů a komfortní vzdálenosti.
- `hero-video.js` — přehrávání animace na posterech, pozastavení mimo záběr a respektování omezeného pohybu.
- `assets/lumixia-logo.png` — logo s názvem.
- `assets/lumixia-mark.png` — značka / ikona webu.

Čisté HTML/CSS/JS bez programových závislostí. Není potřeba instalace balíčků. Písma Inter a Barlow Condensed jsou součástí assets/fonts, včetně českých znaků a licencí. Na Google se návštěvník při načtení webu nepřipojuje.

## Veřejné spuštění

Cílová doména je **https://lumixia.cz**, webhosting WEDOS / VEDOS, pošta Seznam Email Profi. Kompletní postup a nezbytné kontroly jsou v [SPUSTENI.md](SPUSTENI.md). `npm run build:wedos` připraví `release-wedos/www` a neveřejnou složku `release-wedos/lumixia-private`. Výstup není uložený v Gitu a neobsahuje žádné skutečné heslo.

GitHub uchovává zdrojové verze. Samotné nahrání do větve main zatím **nenasazuje WEDOS**; po zřízení hostingu se připravený výstup nahraje přes FTPS. Existující Sites slouží jako samostatný soukromý náhled. GitHub Pages PHP formulář nespustí.

## Místní náhled

S Node.js 20 nebo novějším spusťte `npm run dev` a otevřete **http://127.0.0.1:8000**. Po uložení změny obnovte stránku. Náhled běží jen na tomto počítači a vypíná mezipaměť.

Pro rychlé prohlédnutí lze otevřít `index.html` přímo v prohlížeči.

## Náhled Sites

Konfigurace `.openai/hosting.json` patří stávajícímu náhledu v Codex Sites. `npm run build` zkopíruje aktuální web do `dist` pro publikování přes Sites. Ve složce `dist` nic ručně neupravujte; zdrojem jsou vždy soubory v kořeni. Nasazení Sites se aktualizuje samostatně. Náhled obsahuje noindex a neodesílá poptávky. Serverový kód ani konfigurace se do dist nekopírují.

## Poptávkový formulář

Ve veřejném WEDOS výstupu se odesílá přes `api/poptavka.php` a PHPMailer 7.1.1 na **poptavky@lumixia.cz**. TLS připojení na smtp.seznam.cz:465 ověřuje certifikát. Přihlášení a HMAC tajemství jsou pouze v neveřejném config.php. Bez aktivní konfigurace formulář selže bezpečně.

Token, origin a typ obsahu se ověřují na serveru; příjemce je pevný a zákazník se používá pouze jako Reply-To. Zprávy jsou prostý text, bez příloh a automatických kopií. Žádná osobní data se neukládají do prohlížeče. Starý zkušební záznam `lumixia:lastInquiry` se odstraní. Ochranné limity a pravidla údržby uvádí SPUSTENI.md.

## Kontrola před zveřejněním

`npm run check` ověří syntaxi a 5 testů chování formuláře. `php tests/inquiry.test.php` provede 37 kontrol backendu bez skutečného odeslání pošty (PHP 8.4/8.5). Zachovejte relativní cesty k souborům, aby fungoval i web na `/lumixia-web/`. Zachovejte video v úvodu, výběr produktu do formuláře, srovnání pixelů, krátkodobý i dlouhodobý pronájem a FAQ.

## Fotografie a srovnání pixelů

Úvod přehrává dvacetisekundovou smyčku `assets/lumixia-posters-join.mp4`: pět samostatných posterů s animovaným logem se plynule sjede do jedné obrazovky, na které běží jedno velké společné logo. Potom se opět rozdělí. Každý poster používá stejný podklad, rozměry a výšku podstavce; společný obraz neobsahuje dělicí čáry. Tichá smyčka se dá pozastavit; při omezeném pohybu se automaticky nespouští. V katalogu zůstává vizualizace s modrofialovou vlnou.

Produktové vizualizace vycházejí z fotografií uživatele. Galerie obsahuje původní snímek propojené sestavy a upravenou fotografii tří posterů v showroomovém prostředí. Úprava prostředí je označená. Podrobnosti jsou v `assets/SOURCES.md`.

Nabídka odpovídá interiérovým LED posterům P1.86: samostatně nebo pět kusů se společným obrazem 16:9. P2.5 a P3.9 v grafice slouží pouze ke srovnání, nikoliv jako nabídka další techniky.

Srovnání pixelů v samostatné sekci technologie používá stejný schematický motiv při třech roztečích. Nativní přepínače fungují i z klávesnice. Skript aktualizuje vzdálenost a polohu diváka na stupnici 0–8 m. Pro P1.86 se podle zadání Lumixia zobrazuje „od 2,5 m“. Srovnávací hodnoty P2.5 / P3.9 zůstávají přibližně 4,3 / 6,7 m. Odkaz na Planar byl na žádost uživatele z grafiky odstraněn; výchozí odborný podklad pro srovnávací hodnoty zůstává v `assets/SOURCES.md`.

## Výtvarný směr

Redesign z 10. září 2026 používá plakátovou typografii Barlow Condensed, velkou animovanou sestavu v úvodu, nestejně široké produktové sloupce zarovnané do stejné výšky a posunuté fotografie v galerii. Rovné hrany, jednoduché linky a jeden souvislý tyrkysový blok pronájmu nahrazují obalové karty, přechody a dekorativní efekty. Barvy a typografie jsou v proměnných na začátku `styles.css`.

Hlavní text na světlé ploše používá #08131f, vedlejší #54616b; na tmavé ploše #f2f4f5 a #b7c8d6. Základní textové kombinace mají kontrast alespoň 5,7 : 1. Pořadí sekcí: přímá nabídka pronájmu pro firmy → firemní využití → výběr obrazovky → fotografie → průběh pronájmu → technologie a pixely → FAQ → poptávka. Původní provedení je dostupné v historii Git.

## Zaměření na firemní akce

Úvod začíná srozumitelným nadpisem „Pronájem LED obrazovek pro firemní akce“. Světlý prostor pro hlavní nabídku doplňuje tmavá fotografie s animací. Namísto samotného velkého sloganu a technických parametrů následují tři konkrétní firemní scénáře: veletrhy, konference / eventy a showroomy / recepce. Sport je vedlejší využití a svatba je pouze krátce zmíněna. Největší fotografie v galerii ukazuje reklamní obsah.

Odkazy u scénářů předvyplní nové pole využití v existující poptávce. Výchozí volba techniky nechává návštěvníka požádat o radu. V náhledu formulář nic neodesílá; veřejný WEDOS výstup obsahuje připravený PHP backend.
