<?php
// Basic, safer form handler (demo)
// - Handles both main + modal forms
// - Sanitizes inputs
// - Avoids undefined-index warnings
// - Uses Post/Redirect/Get so users don't resubmit on refresh

function clean($value) {
  return trim(filter_var($value ?? '', FILTER_SANITIZE_STRING));
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
  header("Location: index.html#contact");
  exit;
}

$name = clean($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$phone = clean($_POST['phone'] ?? '');
$message = clean($_POST['message'] ?? '');

if ($name === '' || $email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || $message === '') {
  header("Location: index.html#contact");
  exit;
}

// Change this to your inbox
$to = "drety9@gmail.com";

// Build email
$subject = "New lead: Timeshare consultation request";
$body  = "Name: {$name}\n";
$body .= "Email: {$email}\n";
if ($phone !== '') $body .= "Phone: {$phone}\n";
$body .= "\nMessage:\n{$message}\n";

$headers = "From: noreply@example.com\r\n";
$headers .= "Reply-To: {$email}\r\n";

// Send
@mail($to, $subject, $body, $headers);

// Redirect back with a simple flag
header("Location: index.html#contact");
exit;
?>
