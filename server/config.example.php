<?php
declare(strict_types=1);
// Copy to lumixia-private/config.php OUTSIDE the public www directory.
// Never commit credentials. Enable only after the live delivery test.
return [
    'enabled' => false,
    'origin' => 'https://lumixia.cz',
    'recipient' => 'poptavky@lumixia.cz',
    'smtp_user' => 'poptavky@lumixia.cz',
    'smtp_password' => '',
    'app_secret' => '', // At least 32 random bytes, e.g. bin2hex(random_bytes(32)).
    'state_file' => __DIR__ . '/runtime/rate-limit.json',
];
