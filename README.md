# Lumixia

Prezentační web pro pronájem LED obrazovek a LED posterů. Navazuje na původní návrh z konverzace „Tvorba webových stránek“ a používá dodaná loga.

## Průběžné úpravy

Napište požadovanou změnu v úkolu Lumixia v Codexu. Úprava se provede ve zdrojových souborech, ověří a nahraje do větve `main`. Po dokončení nasazení stačí obnovit stejnou webovou adresu.

- `index.html` — texty, sekce, navigace a formulář.
- `styles.css` — barvy, rozložení a mobilní zobrazení.
- `script.js` — menu, výběr produktu a ukázkový formulář.
- `pixel-guide.js` — interaktivní srovnání rozteče pixelů a komfortní vzdálenosti.
- `hero-video.js` — přehrávání animace na posterech, pozastavení mimo záběr a respektování omezeného pohybu.
- `assets/lumixia-logo.png` — logo s názvem.
- `assets/lumixia-mark.png` — značka / ikona webu.

Čisté HTML/CSS/JS bez programových závislostí. Není potřeba instalace balíčků. Písma Inter a Barlow Condensed se načítají z Google Fonts; při nedostupnosti se použije systémové písmo.

## GitHub Pages: automatické zveřejnění změn

Jednorázové zapnutí:

1. Otevřete [Settings → Pages](https://github.com/xRade-x/lumixia-web/settings/pages).
2. V **Build and deployment → Source** vyberte **Deploy from a branch**.
3. Vyberte **main**, složku **/ (root)** a klikněte na **Save**.
4. Vyčkejte na dokončení nasazení v záložce **Actions**.

Po aktivaci bude web na **https://xrade-x.github.io/lumixia-web/**.

Každá změna nahraná do `main` se následně publikuje automaticky. Aktualizace může několik minut trvat. Soubor `.nojekyll` umožňuje publikování statických souborů bez Jekyllu.

[Oficiální návod GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Místní náhled

S Node.js 20 nebo novějším spusťte `npm run dev` a otevřete **http://127.0.0.1:8000**. Po uložení změny obnovte stránku. Náhled běží jen na tomto počítači a vypíná mezipaměť.

Pro rychlé prohlédnutí lze otevřít `index.html` přímo v prohlížeči.

## Náhled Sites

Konfigurace `.openai/hosting.json` patří stávajícímu náhledu v Codex Sites. `npm run build` zkopíruje aktuální web do `dist` pro publikování přes Sites. Ve složce `dist` nic ručně neupravujte; zdrojem jsou vždy soubory v kořeni. Nasazení Sites se aktualizuje samostatně. Automatické zveřejnění změn z GitHubu zajišťuje GitHub Pages po jeho zapnutí.

## Poptávkový formulář

Formulář je zatím **ukázkový**. Nic neposílá na e-mail, server ani do CRM a nepočítá cenu. Poslední záznam ukládá pouze v tomto prohlížeči pod klíčem `lumixia:lastInquiry`. Stránka tuto skutečnost uvádí před potvrzením i po něm.

Pro příjem skutečných poptávek je potřeba doplnit cílový e-mail a zvolenou službu pro odesílání. Tajné klíče nepatří do HTML ani do veřejného repozitáře.

## Kontrola před zveřejněním

`npm run check` ověří syntaxi skriptů. Zachovejte relativní cesty k souborům, aby fungoval i web na `/lumixia-web/`. Zachovejte video v úvodu, výběr produktu do formuláře, srovnání pixelů, krátkodobý i dlouhodobý pronájem a FAQ.

## Fotografie a srovnání pixelů

Úvod přehrává desetisekundovou animaci loga na společné obrazové ploše pěti posterů, vloženou do čelní studiové vizualizace. Všech pět posterů má stejný nízký podstavec a obraz neobsahuje dělicí čáry. Rám a podstavce zůstávají statické. Tichá smyčka se dá pozastavit; při omezeném pohybu se automaticky nespouští. V katalogu zůstává vizualizace s modrofialovou vlnou, bez dělicích čar uvnitř obrazové plochy.

Produktové vizualizace vycházejí z fotografií uživatele. Galerie obsahuje původní snímek propojené sestavy a upravenou fotografii tří posterů v showroomovém prostředí. Úprava prostředí je označená. Podrobnosti jsou v `assets/SOURCES.md`.

Nabídka odpovídá interiérovým LED posterům P1.86: samostatně nebo pět kusů se společným obrazem 16:9. P2.5 a P3.9 v grafice slouží pouze ke srovnání, nikoliv jako nabídka další techniky.

Srovnání pixelů v samostatné sekci technologie používá stejný schematický motiv při třech roztečích. Nativní přepínače fungují i z klávesnice. Skript aktualizuje orientační komfortní vzdálenost a polohu diváka na stupnici 0–8 m. Použitý přepočet je rozteč v mm × 1,72 = vzdálenost v metrech; jde o aproximaci tabulky Average Comfortable Viewing Distance od Planar, nikoliv o minimální vzdálenost či hranici rozlišení jednotlivých pixelů. Zaokrouhlené hodnoty jsou 3,2 / 4,3 / 6,7 m. Zdroj je odkazován přímo v grafice.

## Výtvarný směr

Redesign z 10. září 2026 používá plakátovou typografii Barlow Condensed, velkou animovanou sestavu v úvodu, nestejně široké produktové sloupce a posunuté fotografie. Rovné hrany, jednoduché linky a jeden souvislý tyrkysový blok pronájmu nahrazují obalové karty, přechody a dekorativní efekty. Barvy a typografie jsou v proměnných na začátku `styles.css`.

Hlavní text na světlé ploše používá #08131f, vedlejší #54616b; na tmavé ploše #f2f4f5 a #b7c8d6. Základní textové kombinace mají kontrast alespoň 5,7 : 1. Pořadí sekcí: přímá nabídka pronájmu pro firmy → firemní využití → výběr obrazovky → fotografie → průběh pronájmu → technologie a pixely → FAQ → poptávka. Původní provedení je dostupné v historii Git.

## Zaměření na firemní akce

Úvod začíná srozumitelným nadpisem „Pronájem LED posterů pro firemní akce“. Světlý prostor pro hlavní nabídku doplňuje tmavá fotografie s animací. Namísto samotného velkého sloganu a technických parametrů následují tři konkrétní firemní scénáře: veletrhy, konference / eventy a showroomy / recepce. Sport je vedlejší využití a svatba je pouze krátce zmíněna. Největší fotografie v galerii ukazuje reklamní obsah.

Odkazy u scénářů předvyplní nové pole využití v existující poptávce. Výchozí volba techniky nechává návštěvníka požádat o radu. Formulář nadále zůstává ukázkový a nic neodesílá.
