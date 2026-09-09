# Lumixia

Prezentační web pro pronájem LED obrazovek a LED posterů. Navazuje na původní návrh z konverzace „Tvorba webových stránek“ a používá dodaná loga.

## Průběžné úpravy

Napište požadovanou změnu v úkolu Lumixia v Codexu. Úprava se provede ve zdrojových souborech, ověří a nahraje do větve `main`. Po dokončení nasazení stačí obnovit stejnou webovou adresu.

- `index.html` — texty, sekce, navigace a formulář.
- `styles.css` — barvy, rozložení a mobilní zobrazení.
- `script.js` — menu, výběr produktu a ukázkový formulář.
- `led-display.js` — animovaná bodová LED matice v úvodu.
- `assets/lumixia-logo.png` — logo s názvem.
- `assets/lumixia-mark.png` — značka / ikona webu.

Čisté HTML/CSS/JS bez programových závislostí. Není potřeba instalace balíčků. Písma Inter a Manrope se načítají z Google Fonts; při nedostupnosti se použije systémové písmo.

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

## Soukromý náhled Sites

Konfigurace `.openai/hosting.json` patří soukromému náhledu v Codex Sites. `npm run build` zkopíruje aktuální web do `dist` pro publikování přes Sites. Ve složce `dist` nic ručně neupravujte; zdrojem jsou vždy soubory v kořeni. Nasazení Sites se aktualizuje samostatně. Automatické zveřejnění změn z GitHubu zajišťuje GitHub Pages po jeho zapnutí.

## Poptávkový formulář

Formulář je zatím **ukázkový**. Nic neposílá na e-mail, server ani do CRM a nepočítá cenu. Poslední záznam ukládá pouze v tomto prohlížeči pod klíčem `lumixia:lastInquiry`. Stránka tuto skutečnost uvádí před potvrzením i po něm.

Pro příjem skutečných poptávek je potřeba doplnit cílový e-mail a zvolenou službu pro odesílání. Tajné klíče nepatří do HTML ani do veřejného repozitáře.

## Kontrola před zveřejněním

`npm run check` ověří syntaxi skriptů. Zachovejte relativní cesty k souborům, aby fungoval i web na `/lumixia-web/`. Původní vzhled, LED vizualizace, produkty, krátkodobý i dlouhodobý pronájem, využití a FAQ zůstávají zachovány.

## Fotografie a LED animace

Úvodní LED panel vykresluje nadpis skutečnou maticí světelných bodů. Jedna sekvence trvá 11 sekund: rozsvícení nadpisu, přechod do fotografie LED stěny a návrat k nadpisu. Tlačítko umožňuje animaci zastavit nebo zopakovat. Mimo viditelnou část stránky a při skrytí okna se animace zastaví. Při nastavení omezeného pohybu zůstává úvod statický.

Fotografie v produktových kartách slouží jako ilustrace formátu produktu; nejsou prezentovány jako vlastní realizace Lumixia. Zdrojové odkazy jsou uvedeny přímo u fotografií a v `assets/SOURCES.md`.
