# Lumixia — spuštění na WEDOSu

Nasazeno **23. 9. 2026 na https://lumixia.cz**, provozovatel Auto Odolka s.r.o., IČO 10952179. Poptávky: **poptavky@lumixia.cz**, schránka u Seznam Email Profi. Doména, WEDOS LowCost s PHP 8.4 i schránka jsou aktivní. Tento balíček neobsahuje přístupová hesla.

## Stav prvního nasazení

- Certifikát Let's Encrypt aktivní pro hlavní doménu i www. HTTPS, přesměrování, bezpečnostní hlavičky, chráněné cesty a vlastní 404 ověřeny na přiděleném serveru s platným certifikátem.
- Jedna označená testovací poptávka skutečně dorazila do doručené pošty Email Profi ve 20:04 CEST. Obsah i české znaky byly zkontrolovány. Interní doručení u Seznamu samo neprokazuje DKIM pro externí poštu.
- Všech 31 veřejných souborů odpovídá vydání; FTP změnilo u textů pouze konce řádků. Hash strukturovaných dat zůstává kompatibilní s CSP. Neplatný původ, chybějící token, neplatný e-mail, honeypot a příliš velký požadavek byly odmítnuty bez odesílání pošty.
- WEDOS nepovoluje `Options -MultiViews`; veřejný soubor používá podporované `Options -Indexes`. Při aktualizaci tuto volbu nevracet.
- Konfigurace i SMTP heslo jsou mimo `www`, soubory mají práva 600 a neveřejné složky 700. Heslo uživatel zadal přímo na hostingu do `lumixia-private/smtp-password.txt`; `config.php` ho čte odtud. Tyto dva soubory při dalších nasazeních nepřepisovat.
- Původní obsah hostingu je zachovaný mimo veřejnou složku jako `www-puvodni-20260923` a v místní záloze. Hostitelské složky `tmp` a `session` zůstaly beze změny.
- Veřejné resolvery Google a Cloudflare už doménu překládají správně. Místní resolver a prohlížeč při závěrečné kontrole stále vracely staré nenalezení domény. Síťové kontroly proto použily explicitní mapování na přidělenou IP při zachování ověřování HTTPS. Vizuální kontrolu ostré URL na počítači a mobilu dokončit po aktualizaci místní DNS cache.
- Google Search Console, dvoufázové ověření účtů, obnova domény a provozní úklid schránky nebyly tímto nasazením nastavovány; zůstávají body pro provozovatele podle seznamu níže.

## Co zařídit před nahráním

1. Zaregistrovat lumixia.cz u WEDOS/ VEDOS. Při kontrole CZ.NIC 16. 9. 2026 nebyl nalezen záznam; dostupnost se ověřuje znovu při objednávce. Zvolit běžný webhosting s PHP 8.4/8.5 a možností šifrovaného připojení na smtp.seznam.cz:465. Pro tento malý web není potřeba WordPress ani databáze; stačí základní tarif. Cenu a obnovování ověřit v objednávce.
2. V Email Profi přidat doménu a vytvořit poptavky@lumixia.cz. V DNS WEDOSu zadat přesné ověřovací a MX záznamy z administrace Seznamu. A/AAAA záznamy patří WEDOSu, MX Seznamu — nenahrazovat MX záznamy poštou WEDOSu.
3. Nastavit SPF, DKIM a DMARC podle Email Profi. Nedávat dva samostatné SPF záznamy. DMARC zpřísnit až po úspěšných testech všech legitimních odesílatelů. Web bude poštu odesílat přes Seznam SMTP, nikoli přes PHP mail() WEDOSu.
4. Zapnout HTTPS certifikát pro lumixia.cz i www.lumixia.cz a ověřit jeho platnost před zapnutím přesměrování v .htaccess. Zapnout automatické obnovování domény/certifikátu a dvoufázové ověření účtů WEDOS i Seznam.

## Co se nahraje

Přihlásit se hlavním FTP účtem přes FTPS, který vidí složku **www** a její nadřazený adresář. Před první změnou stáhnout zálohu existujícího obsahu. Nemazat hostitelské složky tmp a session.

- Obsah **www/** z balíčku → veřejná složka **www/** hostingu. Zobrazit také skryté soubory (.htaccess, .user.ini).
- **lumixia-private/** → vedle www, nikoli dovnitř. Obsahuje PHP knihovnu, logiku a vzor neveřejné konfigurace.
- **SPUSTENI.md** není součástí veřejného webu. Zdrojový repozitář, .git, testy, poznámky ani původní fotografie na hosting nenahrávat.

Web má .htaccess s přesměrováním na https://lumixia.cz, bezpečnostními hlavičkami a vlastní stránkou 404. Cache se při obnovení ověřuje, takže běžné obnovení URL načte nové soubory. Při jiném document rootu je nutné upravit cestu k lumixia-private v api/poptavka.php a ověřit open_basedir hostingu.

## Aktivace formuláře

V neveřejné složce zkopírovat config.example.php na config.php. Přes zabezpečený přístup vyplnit smtp_password (heslo pro poštovní aplikaci, pokud je v účtu dostupné/vyžadované) a app_secret vytvořený kryptograficky, např. výstupem bin2hex(random_bytes(32)). Hesla neposílat do chatu ani ukládat do GitHubu. Uživatelské jméno SMTP a příjemce jsou předvyplněné poptavky@lumixia.cz.

Nastavit práva config.php na 600 a neveřejným složkám na 700, pokud to nastavení hostingu dovolí. PHP musí umět číst konfiguraci a zapisovat pouze do lumixia-private/runtime. Veřejné statické soubory mají být bez práva zápisu pro návštěvníky. Nikdy nepoužívat oprávnění 777.

Nastavit enabled na true až při řízeném spuštění a provést test. Bez konfigurace nebo při chybě SMTP formulář vrací chybu a netvrdí, že poptávku odeslal. Při prvním nasazení byla odeslána a doručena jedna výslovně označená testovací zpráva.

SMTP: smtp.seznam.cz, port 465, TLS s ověřováním certifikátu, přihlášení celou e-mailovou adresou. Zákaznický e-mail je jen Reply-To; příjemce a odesílatel jsou pevné. Neposílá automatické kopie zákazníkům ani přílohy.

## Kontrola při spuštění

- HTTPS na hlavní i www doméně, jediné přesměrování na adresu bez www. Ověřit i mobil a menu, přehrání animace, čitelnost písma, kontakty a odkazy.
- Bezpečnostní hlavičky opravdu vrací hosting: CSP, HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy. Bez chyb CSP v konzoli.
- Neexistující cesta vrací HTTP 404. /.git/config, /.user.ini, /server/config.php a /lumixia-private/config.php jsou nepřístupné. /api/poptavka.php nikdy nevydává zdrojový PHP kód.
- Odeslat jednu označenou testovací poptávku, ověřit doručení v Email Profi, složku spam, české znaky a funkční Odpovědět zákazníkovi. Zkontrolovat SPF/DKIM/DMARC v hlavičkách zprávy. Pak testovací zprávu odstranit.
- Ověřit chybný e-mail, chybějící token, cizí Origin, příliš velkou zprávu, limit požadavků a skutečné selhání SMTP. Při chybě musí zůstat text ve formuláři. Síťový výpadek nesmí vést k automatickému opakování odeslání.
- Prověřit délku uchování provozních logů hostingu a smluvní podmínky zpracování u poskytovatelů. Zásady soukromí počítají s mazáním neuzavřených poptávek do 6 měsíců od posledního jednání — nastavit pravidelný úklid schránky.
- Ověřit, že veřejné stránky obsahují index, follow, správnou canonical a sitemap.xml. Soukromý Sites náhled zůstává noindex a bez odesílání.
- Ověřit vlastnictví domény v Google Search Console a odeslat sitemap https://lumixia.cz/sitemap.xml. Pro Seznam lze přidat web do nástrojů pro webmastery; firemní profily spravuje provozovatel. Vytvoření účtů a ověření vlastnictví není součástí přípravy souborů.

## Zabezpečení a údržba

Web nemá redakční administraci, přihlašování, uploady ani databázi. Formulář používá časově omezený HMAC token v paměti stránky, kontrolu původu a formátu, honeypot, validaci vstupů a pevného příjemce. Ochranný soubor má atomický zámek, nejvýše 100 rezervací za 24 hodin a 5 za hodinu na IP. Překročení limitu nabídne kontakt e-mailem. Platnost starých záznamů je 24 hodin, fyzické promazání proběhne při dalším použití formuláře. V logu aplikace nejsou obsahy formulářů ani hesla.

Tato ochrana omezuje běžný spam; distribuovaný útok musí řešit ochrana hostingu. Po spuštění je třeba hlídat doručování, kapacitu schránky a chybové logy. PHPMailer kontrolovat na bezpečnostní aktualizace nejméně měsíčně a při změnách webu, PHP udržovat v podporované verzi. Hesla/klíče vyměnit při podezření na únik.

Před každou změnou uložit verzi do Gitu a zálohu hostingu; zálohu soukromé konfigurace uchovávat šifrovaně mimo veřejný web. Ověřit jednou obnovu ze zálohy. Aktualizace nahrávat přes FTPS, napřed assets a skripty, poté HTML. Při návratu obnovit předchozí celý balíček, config.php nepřepisovat prázdným vzorem.

Bez analytických nebo marketingových cookies web nepotřebuje souhlasovou lištu. Před přidáním Google Analytics, Meta Pixelu, Skliku či jiné reklamy je nutné doplnit souhlas, blokování před souhlasem a možnost odvolání. Měření ani reklamní účty nyní zapnuté nejsou.

## Ověřené podklady

- ÚOOÚ: https://uoou.gov.cz/verejnost/qa-otazky-a-odpovedi/cookies
- Google SEO: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Email Profi a SMTP: https://o-seznam.cz/napoveda/email/mohlo-by-se-hodit/postovni-programy-a-aplikace/
- Autentifikace pošty: https://o-seznam.cz/napoveda/email/profi/zaznamy-pro-autentifikaci-posty/
- WEDOS / VEDOS webhosting: https://kb.vedos.cz/webhosting-manual/
- Provozovatel ověřen v ARES a obchodním rejstříku dne 16. 9. 2026: https://ares.gov.cz/ekonomicke-subjekty?ico=10952179
- Dostupnost domény: https://www.nic.cz/whois/object/lumixia.cz/
