<?php
declare(strict_types=1);

ini_set('display_errors', '0');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, max-age=0');
header('X-Content-Type-Options: nosniff');
header('X-Robots-Tag: noindex, nofollow');
header('Content-Security-Policy: default-src \'none\'; frame-ancestors \'none\'');
header('Referrer-Policy: no-referrer');

try {
    // Installed as www/api/poptavka.php; all configuration and PHP libraries are above www.
    $private = dirname(__DIR__, 2) . '/lumixia-private';
    if (!is_file($private . '/config.php')) {
        http_response_code(503);
        echo json_encode(['ok' => false, 'message' => 'Formulář připravujeme. Napište na poptavky@lumixia.cz.']);
        exit;
    }
    require $private . '/inquiry.php';
    $config = require $private . '/config.php';
    // Read at most 16 KiB + one byte; never place form contents or credentials in error logs.
    $body = file_get_contents('php://input', false, null, 0, 16385);
    [$status, $payload] = \Lumixia\handle($_SERVER, $body === false ? '' : $body, $config,
        static function (array $settings, string $replyTo, string $text) use ($private): void {
            require_once $private . '/mail.php';
            \Lumixia\sendInquiry($settings, $replyTo, $text);
        });
    http_response_code($status);
    if ($status === 405) header('Allow: GET, POST');
    if ($status === 429) header('Retry-After: 3600');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
} catch (\Throwable $error) {
    // Exception messages can contain SMTP credentials, addresses or personal data: do not log them.
    error_log('Lumixia inquiry: transport or storage failure');
    http_response_code(503);
    echo json_encode(['ok' => false, 'message' => 'Nepodařilo se potvrdit odeslání. Kontaktujte nás na poptavky@lumixia.cz.'], JSON_UNESCAPED_UNICODE);
}
