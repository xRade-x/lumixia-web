<?php
declare(strict_types=1);

namespace Lumixia;

require_once __DIR__ . '/vendor/phpmailer/Exception.php';
require_once __DIR__ . '/vendor/phpmailer/PHPMailer.php';
require_once __DIR__ . '/vendor/phpmailer/SMTP.php';

function sendInquiry(array $config, string $replyTo, string $body): void
{
    $mail = new \PHPMailer\PHPMailer\PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = 'smtp.seznam.cz';
    $mail->Port = 465;
    $mail->SMTPSecure = \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS;
    $mail->SMTPAuth = true;
    $mail->Username = $config['smtp_user'];
    $mail->Password = $config['smtp_password'];
    $mail->Timeout = 15;
    $mail->Timelimit = 20;
    $mail->SMTPDebug = 0;
    $mail->SMTPOptions = ['ssl' => ['verify_peer' => true, 'verify_peer_name' => true, 'allow_self_signed' => false]];
    $mail->CharSet = 'UTF-8';
    $mail->setFrom($config['smtp_user'], 'Lumixia – web');
    $mail->addAddress($config['recipient']);
    $mail->addReplyTo($replyTo);
    $mail->Subject = 'Lumixia | Nová poptávka pronájmu';
    $mail->isHTML(false);
    $mail->Body = $body;
    $mail->send();
}
