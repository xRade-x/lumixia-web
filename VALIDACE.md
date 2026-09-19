# Ověření přípravy ke spuštění — 16. 9. 2026

Provedené kontroly:

- 37 kontrol PHP backendu (PHP 8.4.25 ve WebAssembly): validace, původ požadavku, časová platnost a vazba tokenu, hlavičková injekce, délka českých textů, změna příjemce, honeypot, opakované použití tokenu, limity IP i celku, mazání expirovaných záznamů a bezpečné selhání při poškození úložiště / výpadku transportu. PHPMailer vytvořil MIME v UTF-8 s odpovídajícím Reply-To. Žádná pošta odeslána nebyla.
- 5 testů klienta: náhled neodesílá ani neukládá údaje, úspěch smaže formulář až po potvrzení, chyba ponechá rozepsaný obsah, výpadek nevyvolá automatické opakování, dvojí kliknutí odešle jediný požadavek.
- 4 integrační scénáře veřejného PHP vstupu: chybějící konfigurace, vypnutá konfigurace, vydání tokenu bez Set-Cookie, odmítnutí cizího Origin. Výstup chyby neobsahoval PHP varování.
- Apache 2.4.67 přijal produkční konfiguraci .htaccess bez syntaktických chyb. Skutečné hlavičky a přesměrování musí být ověřeny na WEDOSu s aktivním HTTPS.
- Statická kontrola všech čtyř HTML stránek v obou výstupech: místní odkazy a kotvy, unikátní ID, jeden H1, obrázky s rozměry a alt texty, lokální písma WOFF2, absence externích skriptů a Google Fonts, platný JSON-LD a XML sitemap, odpovídající CSP hash.
- Oddělení výstupů: Sites náhled má noindex a neobsahuje PHP; WEDOS má indexovatelné stránky a backend oddělený od www. Balíček neobsahuje skutečnou konfiguraci SMTP ani tajný klíč.
- Fotografie použité na webu neobsahují GPS souřadnice v EXIF. Původní soubory v pracovním adresáři nejsou součástí balíčku.
- Místní náhled odpovídal HTTP 200.

Zbývá na skutečném hostingu: pořízení domény/hostingu, zřízení Email Profi, DNS, HTTPS, zapnutí a kontrola bezpečnostních hlaviček, ověření dostupnosti souborů a PHP, skutečné doručení a odpověď na testovací poptávku, kontrola mobilního zobrazení, ověření vlastnictví v Search Console a odeslání sitemapy. Podrobný postup je v SPUSTENI.md.

Jde o ověření implementace, nikoli o nezávislý penetrační test nebo záruku absolutního zabezpečení. Průběžná aktualizace, zálohy a kontrola doručování zůstávají součástí provozu.


## Úvodní animace – 19. 9. 2026

- Nové dodané logo v2 pro jeden poster i pět spojených posterů zapracováno do stejné scény.
- MP4 H.264 yuv420p, 1536 × 1024 px, 24 fps, 32 sekund, bez zvuku. Dekódováno všech 768 snímků bez chyby.
- MP4 má metadata před obrazovými daty (faststart). Oba exporty webu obsahují totožné finální video a platné odkazy.
- Ověřeny samostatné postery, fáze spojení a společný obraz. Všech pět používá totožný podstavec a společnou spodní hranu.
- Poměr ploch 1:3 a 5:3 odpovídá zdrojům, bez ořezu a deformace loga. Texty s dřívějším 16:9 opraveny.
- Vykreslený stav v čase 0 a 32 s je shodný; průměrný rozdíl posledního a prvního snímku je 0,68/255.
- Přehrávání, pauza, reakce na omezený pohyb a zastavování mimo záběr zůstaly beze změny.
