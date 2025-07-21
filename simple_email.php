<?php
/**
 * Edwards Group Holdings - Simple Email Handler
 * Uses PHP's built-in mail() function for reliable email sending on shared hosting
 */

// Include for fallback, but use simple approach
require_once 'email_functions.php';

// Security headers
header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// CSRF protection - check referer
$allowed_domains = ['edwards-group.com', 'localhost', '127.0.0.1'];
$referer = $_SERVER['HTTP_REFERER'] ?? '';
$referer_domain = parse_url($referer, PHP_URL_HOST);

if (!in_array($referer_domain, $allowed_domains)) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Forbidden']);
    exit;
}

// Rate limiting
$ip = $_SERVER['REMOTE_ADDR'];
if (!checkRateLimit($ip, 10)) {
    http_response_code(429);
    echo json_encode(['success' => false, 'message' => 'Too many requests. Please wait before sending another message.']);
    exit;
}

// Get and validate form data
$firstName = trim($_POST['firstName'] ?? '');
$lastName = trim($_POST['lastName'] ?? '');
$email = trim($_POST['email'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$subject = trim($_POST['subject'] ?? '');
$location = trim($_POST['location'] ?? '');
$message = trim($_POST['message'] ?? '');
$newsletter = isset($_POST['newsletter']) ? 'Yes' : 'No';

// Validation
$errors = [];

if (empty($firstName) || strlen($firstName) > 50) {
    $errors[] = 'Valid first name is required';
}

if (empty($lastName) || strlen($lastName) > 50) {
    $errors[] = 'Valid last name is required';
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Valid email address is required';
}

if (empty($subject)) {
    $errors[] = 'Subject is required';
}

if (empty($message) || strlen($message) > 2000) {
    $errors[] = 'Message is required and must be under 2000 characters';
}

if (!empty($phone) && !preg_match('/^[\+]?[0-9\s\-\(\)]{10,20}$/', $phone)) {
    $errors[] = 'Invalid phone number format';
}

// Check for spam patterns
$spam_patterns = [
    '/\b(viagra|cialis|casino|lottery|winner|prize|urgent|act now)\b/i',
    '/\b(click here|free money|make money|work from home)\b/i',
    '/(http|https|www\.)[^\s]+\.(tk|ml|ga|cf)/i',
];

foreach ($spam_patterns as $pattern) {
    if (preg_match($pattern, $message . ' ' . $subject)) {
        $errors[] = 'Message contains prohibited content';
        break;
    }
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => implode(', ', $errors)]);
    exit;
}

// Email configuration - route based on subject and location
$from_email = 'noreply@edwards-group.com';
$from_name = 'Edwards Group Holdings';

// Email routing based on subject and location
function getDestinationEmail($subject, $location) {
    // Subject-based routing (primary)
    $subject_emails = [
        'general' => 'jcorbin@upstatetoday.com',
        'advertising' => 'jcorbin@upstatetoday.com', 
        'news' => 'jcorbin@upstatetoday.com',
        'printing' => 'jcorbin@upstatetoday.com',
        'radio' => 'jcorbin@upstatetoday.com',
        'careers' => 'jcorbin@upstatetoday.com',
        'technical' => 'jcorbin@upstatetoday.com',
        'other' => 'jcorbin@upstatetoday.com'
    ];
    
    // Location-based routing (secondary)
    $location_emails = [
        'corporate' => 'jcorbin@upstatetoday.com',
        'sc' => 'jcorbin@upstatetoday.com',
        'wy' => 'jcorbin@upstatetoday.com', 
        'mi' => 'jcorbin@upstatetoday.com',
        '' => 'jcorbin@upstatetoday.com' // default for no location specified
    ];
    
    // Use subject-based routing primarily, fall back to location
    return $subject_emails[$subject] ?? $location_emails[$location] ?? 'jcorbin@upstatetoday.com';
}

$to_email = getDestinationEmail($subject, $location);

// Subject mapping
$subject_mapping = [
    'general' => 'General Inquiry',
    'advertising' => 'Advertising Opportunities',
    'news' => 'News Tips / Editorial',
    'printing' => 'Printing Services',
    'radio' => 'Radio Programming',
    'careers' => 'Career Opportunities',
    'technical' => 'Technical Support',
    'other' => 'Other Inquiry'
];

$email_subject = 'Website Contact: ' . ($subject_mapping[$subject] ?? 'General Inquiry');

// Location mapping
$location_mapping = [
    'corporate' => 'Corporate Office',
    'sc' => 'South Carolina',
    'wy' => 'Wyoming',
    'mi' => 'Michigan'
];

$preferred_location = $location_mapping[$location] ?? 'Any Location';

// Create email content
$email_body = "New contact form submission from Edwards Group Holdings website

Contact Information:
- Name: {$firstName} {$lastName}
- Email: {$email}
- Phone: " . ($phone ?: 'Not provided') . "
- Preferred Location: {$preferred_location}
- Newsletter Signup: {$newsletter}

Inquiry Details:
- Subject: " . ($subject_mapping[$subject] ?? 'Other') . "
- Message:
{$message}

---
Submitted: " . date('Y-m-d H:i:s T') . "
IP Address: {$ip}
User Agent: " . ($_SERVER['HTTP_USER_AGENT'] ?? 'Unknown') . "
";

// Email headers
$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: ' . $from_name . ' <' . $from_email . '>',
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . phpversion(),
    'X-Priority: 3',
    'Date: ' . date('r')
];

$header_string = implode("\r\n", $headers);

// Send email using PHP's mail() function
try {
    $success = mail($to_email, $email_subject, $email_body, $header_string);
    
    if ($success) {
        // Log success
        $log_entry = date('Y-m-d H:i:s') . " | SUCCESS | $to_email | $email_subject | From: $email\n";
        file_put_contents(sys_get_temp_dir() . '/egh_email_simple.log', $log_entry, FILE_APPEND | LOCK_EX);
        
        echo json_encode([
            'success' => true, 
            'message' => 'Thank you for your message! We will respond within one business day.'
        ]);
    } else {
        // Log failure
        $log_entry = date('Y-m-d H:i:s') . " | FAILED | $to_email | $email_subject | From: $email\n";
        file_put_contents(sys_get_temp_dir() . '/egh_email_simple.log', $log_entry, FILE_APPEND | LOCK_EX);
        
        error_log('PHP mail() function failed for contact form');
        http_response_code(500);
        echo json_encode([
            'success' => false, 
            'message' => 'Unable to send message. Please try again or contact us directly at jcorbin@upstatetoday.com'
        ]);
    }
} catch (Exception $e) {
    error_log('Email exception: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Unable to send message. Please try again or contact us directly at jcorbin@upstatetoday.com'
    ]);
}
?>