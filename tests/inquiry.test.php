<?php
declare(strict_types=1);
require __DIR__ . '/../server/inquiry.php';
require __DIR__ . '/../server/mail.php';

$count = 0;
function check(bool $condition, string $name): void {
    global $count;
    if (!$condition) throw new RuntimeException('FAIL: ' . $name);
    $count++;
}
$now = 1789588800;
$path = sys_get_temp_dir() . '/lumixia-test-' . bin2hex(random_bytes(8)) . '/rate.json';
$config = ['enabled' => true, 'origin' => 'https://lumixia.cz', 'recipient' => 'poptavky@lumixia.cz', 'smtp_user' => 'poptavky@lumixia.cz', 'smtp_password' => 'TEST-NOT-A-REAL-PASSWORD', 'app_secret' => str_repeat('test', 16), 'state_file' => $path];
$server = ['REQUEST_METHOD' => 'POST', 'HTTP_ORIGIN' => 'https://lumixia.cz', 'HTTP_SEC_FETCH_SITE' => 'same-origin', 'REMOTE_ADDR' => '192.0.2.10', 'CONTENT_TYPE' => 'application/json'];
$sent = [];
$send = function($cfg, $reply, $text) use (&$sent) { $sent[] = [$cfg['recipient'], $reply, $text]; };
function data(array $overrides = []): array {
    global $now, $config, $server;
    return array_replace(['email' => 'customer@example.com', 'occasion' => 'Konference / firemní event', 'type' => 'Pronájem sestavy 5× LED Poster', 'message' => "Česká zpráva: příliš žluťoučký kůň.\nDruhý řádek.", 'website' => '', 'token' => \Lumixia\createToken($now - 5, $server['REMOTE_ADDR'], $config['app_secret'])], $overrides);
}
function request(array $fields, array $overrides = [], ?array $settings = null): array {
    global $server, $config, $send, $now;
    return \Lumixia\handle(array_replace($server, $overrides), json_encode($fields, JSON_UNESCAPED_UNICODE), $settings ?? $config, $send, $now);
}

check(request(data(), [], array_replace($config, ['enabled' => false]))[0] === 503, 'disabled configuration fails closed');
check(request(data(), [], array_replace($config, ['app_secret' => 'short']))[0] === 503, 'weak secret rejected');
check(request(data(), ['HTTP_ORIGIN' => 'https://attacker.example'])[0] === 403, 'cross-origin rejected');
check(request(data(), ['HTTP_ORIGIN' => ''])[0] === 403, 'missing origin rejected on POST');
check(request(data(), ['HTTP_SEC_FETCH_SITE' => 'cross-site'])[0] === 403, 'cross-site header rejected');
check(request(data(), ['CONTENT_TYPE' => 'application/x-www-form-urlencoded'])[0] === 415, 'simple cross-site form cannot submit');
check(request(data(), ['REQUEST_METHOD' => 'PUT'])[0] === 405, 'unsupported method');
check(request(data(), ['CONTENT_LENGTH' => 17000])[0] === 413, 'oversized request');
check(request(data(['email' => "x@example.com\r\nBcc: other@example.com"]))[0] === 422, 'mail header injection rejected');
check(request(data(['email' => ['customer@example.com']]))[0] === 422, 'array input rejected');
check(request(data(['email' => 'bad-address']))[0] === 422, 'invalid email rejected');
check(request(data(['recipient' => 'other@example.com']))[0] === 422, 'visitor cannot override recipient');
check(request(data(['occasion' => 'arbitrary']))[0] === 422, 'invalid option rejected');
check(request(data(['message' => str_repeat('ř', 3001)]))[0] === 422, 'unicode length checked');
check(request(data(['website' => 'spam.example']))[0] === 422, 'honeypot rejected');
check(request(data(['token' => '']))[0] === 403, 'missing token rejected');
check(request(data(['token' => \Lumixia\createToken($now - 3601, $server['REMOTE_ADDR'], $config['app_secret'])]))[0] === 403, 'expired token rejected');
check(request(data(['token' => \Lumixia\createToken($now, $server['REMOTE_ADDR'], $config['app_secret'])]))[0] === 403, 'instant bot submission rejected');
check(request(data(['token' => \Lumixia\createToken($now - 5, '192.0.2.20', $config['app_secret'])]))[0] === 403, 'token bound to client IP');
check(count($sent) === 0, 'invalid requests never invoke mail');
$valid = data();
check(request($valid)[0] === 200 && count($sent) === 1, 'valid submission invokes transport once');
check($sent[0][0] === 'poptavky@lumixia.cz' && $sent[0][1] === 'customer@example.com', 'fixed recipient and customer Reply-To');
check(str_contains($sent[0][2], 'příliš žluťoučký kůň'), 'Czech content preserved');
check(request($valid)[0] === 409 && count($sent) === 1, 'same token cannot duplicate email');
for ($i = 0; $i < 4; $i++) check(request(data())[0] === 200, 'hourly allowance');
check(request(data())[0] === 429 && count($sent) === 5, 'per-IP rate limit');
$stored = file_get_contents($path);
check(!str_contains($stored, 'customer@example.com') && !str_contains($stored, '192.0.2.10') && !str_contains($stored, 'žluťoučký'), 'rate storage has no plain IP or inquiry content');
\Lumixia\reserve($path, '', '', $now + 86401, false);
check(json_decode(file_get_contents($path), true) === [], 'expired entries purged');
$rows = [];
for ($i = 0; $i < 100; $i++) $rows[] = ['time' => $now, 'ip' => hash('sha256', (string)$i), 'token' => hash('sha256', 'token' . $i)];
file_put_contents($path, json_encode($rows));
check(request(data())[0] === 429, 'global daily bound');
file_put_contents($path, 'corrupted');
try { request(data()); check(false, 'corrupt storage must fail closed'); }
catch (JsonException $error) { check(true, 'corrupt storage fails closed'); }
file_put_contents($path, '[]');
try {
    \Lumixia\handle($server, json_encode(data()), $config, function() { throw new RuntimeException('transport unavailable'); }, $now);
    check(false, 'mail failure must not report success');
} catch (RuntimeException $error) { check($error->getMessage() === 'transport unavailable', 'SMTP failure propagates to safe error response'); }
$mail = new \PHPMailer\PHPMailer\PHPMailer(true);
$mail->CharSet = 'UTF-8'; $mail->setFrom('poptavky@lumixia.cz', 'Lumixia');
$mail->addAddress('poptavky@lumixia.cz'); $mail->addReplyTo('customer@example.com');
$mail->Subject = 'Lumixia | Nová poptávka pronájmu'; $mail->Body = $sent[0][2];
check($mail->preSend(), 'PHPMailer renders valid MIME without sending');
$mime = $mail->getSentMIMEMessage();
check(str_contains($mime, 'Reply-To: customer@example.com') && str_contains($mime, 'text/plain; charset=UTF-8'), 'UTF8 plaintext MIME and Reply-To');
try { $mail->addReplyTo("x@example.com\r\nBcc: other@example.com"); check(false, 'PHPMailer must reject injected address'); }
catch (\PHPMailer\PHPMailer\Exception $error) { check(true, 'PHPMailer defense in depth'); }
unlink($path); rmdir(dirname($path));
echo "$count backend checks passed; no real email sent.\n";
