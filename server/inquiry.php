<?php
declare(strict_types=1);

namespace Lumixia;

function result(int $status, string $message, array $extra = []): array
{
    return [$status, ['ok' => $status === 200, 'message' => $message] + $extra];
}

function ipKey(string $ip, string $secret): string
{
    return hash_hmac('sha256', $ip, $secret);
}

function createToken(int $now, string $ip, string $secret): string
{
    $payload = $now . '.' . bin2hex(random_bytes(16));
    return $payload . '.' . hash_hmac('sha256', $payload . '|' . $ip, $secret);
}

function validToken(string $token, int $now, string $ip, string $secret): bool
{
    if (!preg_match('/\A(\d{10})\.([a-f0-9]{32})\.([a-f0-9]{64})\z/', $token, $m)) return false;
    $age = $now - (int) $m[1];
    return $age >= 3 && $age <= 3600 && hash_equals(
        hash_hmac('sha256', $m[1] . '.' . $m[2] . '|' . $ip, $secret), $m[3]
    );
}

// The only persistent application data are expiry times and salted identifiers.
// A single locked, bounded file makes reservations atomic across PHP processes.
function reserve(string $path, string $ip, string $token, int $now, bool $submit): string
{
    $dir = dirname($path);
    if (!is_dir($dir) && !mkdir($dir, 0700, true) && !is_dir($dir)) throw new \RuntimeException('storage');
    $handle = fopen($path, 'c+');
    if ($handle === false) throw new \RuntimeException('storage');
    try {
        if (!flock($handle, LOCK_EX)) throw new \RuntimeException('lock');
        $raw = stream_get_contents($handle, 131073);
        if ($raw === false || strlen($raw) > 131072) throw new \RuntimeException('storage');
        $entries = $raw === '' ? [] : json_decode($raw, true, 8, JSON_THROW_ON_ERROR);
        if (!is_array($entries)) throw new \RuntimeException('storage');
        $entries = array_values(array_filter($entries, fn($row) => is_array($row) && ($row['time'] ?? 0) > $now - 86400));
        $outcome = 'ok';
        if ($submit) {
            foreach ($entries as $row) {
                if (($row['token'] ?? '') === $token) { $outcome = 'duplicate'; break; }
            }
            $recent = array_filter($entries, fn($row) => ($row['ip'] ?? '') === $ip && $row['time'] > $now - 3600);
            if ($outcome === 'ok' && (count($recent) >= 5 || count($entries) >= 100)) $outcome = 'limited';
            if ($outcome === 'ok') $entries[] = ['time' => $now, 'ip' => $ip, 'token' => $token];
        }
        $encoded = json_encode($entries, JSON_THROW_ON_ERROR);
        rewind($handle);
        if (fwrite($handle, $encoded) !== strlen($encoded) || !ftruncate($handle, strlen($encoded)) || !fflush($handle)) throw new \RuntimeException('storage');
        return $outcome;
    } finally {
        flock($handle, LOCK_UN);
        fclose($handle);
    }
}

function validateFields(array $data): ?array
{
    $limits = ['email' => 254, 'occasion' => 80, 'type' => 80, 'size' => 120, 'date' => 120, 'location' => 160, 'message' => 3000, 'website' => 200, 'token' => 120];
    foreach ($data as $key => $value) if (!array_key_exists($key, $limits)) return null;
    $clean = [];
    foreach ($limits as $key => $max) {
        $value = $data[$key] ?? '';
        if (!is_string($value) || strlen($value) > $max * 4 || preg_match_all('/./us', $value) > $max) return null;
        if (preg_match('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', $value)) return null;
        if ($key !== 'message' && preg_match('/[\r\n]/', $value)) return null;
        $clean[$key] = trim($value);
    }
    if (!filter_var($clean['email'], FILTER_VALIDATE_EMAIL)) return null;
    if (!in_array($clean['occasion'], ['', 'Veletrh / výstavní stánek', 'Konference / firemní event', 'Showroom / recepce', 'Sportovní přenos', 'Jiné využití'], true)) return null;
    if (!in_array($clean['type'], ['Nevím — potřebuji poradit', 'Pronájem sestavy 5× LED Poster', 'Pronájem samostatného LED Posteru', 'Dlouhodobý pronájem'], true)) return null;
    return $clean;
}

function handle(array $server, string $body, array $config, callable $send, ?int $clock = null): array
{
    $now = $clock ?? time();
    $method = $server['REQUEST_METHOD'] ?? '';
    if (!in_array($method, ['GET', 'POST'], true)) return result(405, 'Tento způsob požadavku není podporován.');
    if (strlen($body) > 16384 || (int) ($server['CONTENT_LENGTH'] ?? 0) > 16384) return result(413, 'Poptávka je příliš dlouhá. Zkraťte prosím poznámku.');
    $origin = $server['HTTP_ORIGIN'] ?? '';
    if (($origin !== '' && $origin !== ($config['origin'] ?? '')) || ($server['HTTP_SEC_FETCH_SITE'] ?? '') === 'cross-site') return result(403, 'Formulář otevřete přímo na lumixia.cz.');
    if (($config['enabled'] ?? false) !== true || strlen($config['app_secret'] ?? '') < 64 || empty($config['smtp_password'])) return result(503, 'Formulář připravujeme. Napište nám prosím přímo na poptavky@lumixia.cz.');
    $ip = $server['REMOTE_ADDR'] ?? '';
    if (filter_var($ip, FILTER_VALIDATE_IP) === false) return result(503, 'Formulář je dočasně nedostupný. Kontaktujte nás e-mailem.');
    $secret = $config['app_secret'];
    if ($method === 'GET') {
        reserve($config['state_file'], '', '', $now, false);
        return result(200, '', ['token' => createToken($now, $ip, $secret)]);
    }
    if ($origin !== $config['origin']) return result(403, 'Formulář otevřete přímo na lumixia.cz.');
    if (strtolower(trim(explode(';', $server['CONTENT_TYPE'] ?? '')[0])) !== 'application/json') return result(415, 'Nepodporovaný formát požadavku.');
    try { $data = json_decode($body, true, 8, JSON_THROW_ON_ERROR); }
    catch (\JsonException $e) { return result(400, 'Údaje formuláře nejsou správně vyplněné.'); }
    if (!is_array($data) || ($clean = validateFields($data)) === null) return result(422, 'Zkontrolujte e-mail a délku vyplněných údajů.');
    if ($clean['website'] !== '') return result(422, 'Formulář se nepodařilo ověřit. Kontaktujte nás e-mailem.');
    if (!validToken($clean['token'], $now, $ip, $secret)) return result(403, 'Platnost formuláře vypršela nebo byl odeslán příliš rychle. Vyčkejte chvíli a odešlete jej znovu.');
    $reservation = reserve($config['state_file'], ipKey($ip, $secret), hash('sha256', $clean['token']), $now, true);
    if ($reservation === 'duplicate') return result(409, 'Tuto poptávku jsme již zpracovávali. Případné doručení prosím ověřte e-mailem.');
    if ($reservation === 'limited') return result(429, 'Odeslali jste více poptávek v krátké době. Zkuste to později nebo nás kontaktujte e-mailem.');
    $labels = ['email' => 'E-mail zákazníka', 'occasion' => 'Typ akce', 'type' => 'Technika', 'size' => 'Počet', 'date' => 'Termín / délka', 'location' => 'Místo', 'message' => 'Poznámka'];
    $text = "Nová nezávazná poptávka z lumixia.cz\n\n";
    foreach ($labels as $key => $label) $text .= $label . ': ' . ($clean[$key] === '' ? 'Neuvedeno' : $clean[$key]) . "\n\n";
    $text .= "Údaje jsou vyplněné návštěvníkem webu. Odpověď odešlete na uvedený kontakt.\n";
    // Recipient, sender and subject never come from a visitor. No auto-reply to arbitrary recipients.
    $send($config, $clean['email'], $text);
    return result(200, 'Poptávka byla předána poštovnímu serveru.');
}
