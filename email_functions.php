<?php
/**
 * Edwards Group Holdings - Email Functions Library
 * Reusable email functions for website features
 */

class EGHEmailer {
    private $smtp_config;
    private $default_templates;
    
    public function __construct($config = null) {
        if ($config === null) {
            // Load from config file if no config provided
            $config_file = __DIR__ . '/email_config.php';
            if (file_exists($config_file)) {
                $file_config = include $config_file;
                $config = $file_config['smtp'] ?? $this->getDefaultConfig();
            } else {
                $config = $this->getDefaultConfig();
            }
        }
        $this->smtp_config = $config;
        $this->default_templates = $this->loadEmailTemplates();
    }
    
    /**
     * Get default SMTP configuration
     */
    private function getDefaultConfig() {
        return [
            'host' => 'smtp.gmail.com',
            'port' => 587,
            'username' => 'YOUR_WORKSPACE_EMAIL@edwardsgroup.com',
            'password' => 'YOUR_APP_PASSWORD',
            'from_email' => 'YOUR_WORKSPACE_EMAIL@edwardsgroup.com',
            'from_name' => 'Edwards Group Holdings',
            'timeout' => 10
        ];
    }
    
    /**
     * Load email templates
     */
    private function loadEmailTemplates() {
        return [
            'contact_form' => [
                'subject' => 'Website Contact: {subject}',
                'body' => "
New contact form submission from Edwards Group Holdings website

Contact Information:
- Name: {name}
- Email: {email}
- Phone: {phone}
- Preferred Location: {location}
- Newsletter Signup: {newsletter}

Inquiry Details:
- Subject: {subject}
- Message:
{message}

---
Submitted: {timestamp}
IP Address: {ip}
User Agent: {user_agent}
"
            ],
            'newsletter_signup' => [
                'subject' => 'Newsletter Signup Confirmation',
                'body' => "
Thank you for subscribing to Edwards Group Holdings newsletter!

You will receive updates about:
- Company news and announcements
- Local news highlights
- Community events
- New services and offerings

To unsubscribe, please reply to this email with 'UNSUBSCRIBE' in the subject line.

Best regards,
Edwards Group Holdings Team
"
            ],
            'career_application' => [
                'subject' => 'Career Application: {position}',
                'body' => "
New career application received:

Position: {position}
Applicant: {name}
Email: {email}
Phone: {phone}
Location Preference: {location}

Cover Letter:
{cover_letter}

Resume: {resume_attached}

---
Submitted: {timestamp}
IP Address: {ip}
"
            ]
        ];
    }
    
    /**
     * Send contact form email
     */
    public function sendContactForm($data) {
        $template = $this->default_templates['contact_form'];
        
        // Load recipient from config file
        $config_file = __DIR__ . '/email_config.php';
        $recipient = 'contact@edwardsgroup.com'; // default
        
        if (file_exists($config_file)) {
            $file_config = include $config_file;
            $recipient = $file_config['recipients']['contact'] ?? $recipient;
        }
        
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
        
        // Location mapping
        $location_mapping = [
            'corporate' => 'Corporate Office',
            'sc' => 'South Carolina',
            'wy' => 'Wyoming',
            'mi' => 'Michigan'
        ];
        
        $variables = [
            'name' => $data['firstName'] . ' ' . $data['lastName'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?: 'Not provided',
            'location' => $location_mapping[$data['location']] ?? 'Any Location',
            'newsletter' => isset($data['newsletter']) ? 'Yes' : 'No',
            'subject' => $subject_mapping[$data['subject']] ?? 'Other',
            'message' => $data['message'],
            'timestamp' => date('Y-m-d H:i:s T'),
            'ip' => $_SERVER['REMOTE_ADDR'] ?? 'Unknown',
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown'
        ];
        
        $subject = $this->replaceVariables($template['subject'], $variables);
        $body = $this->replaceVariables($template['body'], $variables);
        
        return $this->sendEmail([
            'to' => $recipient,
            'to_name' => 'Edwards Group Holdings',
            'subject' => $subject,
            'body' => $body,
            'reply_to' => $data['email']
        ]);
    }
    
    /**
     * Send newsletter signup confirmation
     */
    public function sendNewsletterConfirmation($email, $name = null) {
        $template = $this->default_templates['newsletter_signup'];
        
        return $this->sendEmail([
            'to' => $email,
            'to_name' => $name ?: 'Subscriber',
            'subject' => $template['subject'],
            'body' => $template['body']
        ]);
    }
    
    /**
     * Send career application notification
     */
    public function sendCareerApplication($data) {
        $template = $this->default_templates['career_application'];
        
        $variables = [
            'position' => $data['position'],
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?: 'Not provided',
            'location' => $data['location'] ?: 'Any Location',
            'cover_letter' => $data['cover_letter'],
            'resume_attached' => isset($data['resume']) ? 'Yes' : 'No',
            'timestamp' => date('Y-m-d H:i:s T'),
            'ip' => $_SERVER['REMOTE_ADDR'] ?? 'Unknown'
        ];
        
        $subject = $this->replaceVariables($template['subject'], $variables);
        $body = $this->replaceVariables($template['body'], $variables);
        
        return $this->sendEmail([
            'to' => 'careers@edwardsgroup.com',
            'to_name' => 'Edwards Group Holdings HR',
            'subject' => $subject,
            'body' => $body,
            'reply_to' => $data['email']
        ]);
    }
    
    /**
     * Send custom email
     */
    public function sendCustomEmail($to, $subject, $body, $options = []) {
        return $this->sendEmail([
            'to' => $to,
            'to_name' => $options['to_name'] ?? '',
            'subject' => $subject,
            'body' => $body,
            'reply_to' => $options['reply_to'] ?? null,
            'cc' => $options['cc'] ?? null,
            'bcc' => $options['bcc'] ?? null,
            'attachments' => $options['attachments'] ?? []
        ]);
    }
    
    /**
     * Replace variables in template
     */
    private function replaceVariables($template, $variables) {
        foreach ($variables as $key => $value) {
            $template = str_replace('{' . $key . '}', $value, $template);
        }
        return $template;
    }
    
    /**
     * Core email sending function
     */
    private function sendEmail($params) {
        $config = $this->smtp_config;
        
        try {
            // Try SMTP first
            $result = $this->sendViaSMTP($params);
            
            if ($result['success']) {
                $this->logEmail($params['to'], $params['subject'], true);
                return $result;
            }
            
            // If SMTP fails, try PHP mail() function as fallback
            error_log('SMTP failed, trying PHP mail() fallback: ' . $result['error']);
            $fallback_result = $this->sendViaPHPMail($params);
            
            $this->logEmail($params['to'], $params['subject'], $fallback_result['success']);
            return $fallback_result;
            
        } catch (Exception $e) {
            $this->logEmail($params['to'] ?? 'unknown', $params['subject'] ?? 'unknown', false);
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    /**
     * Send email via PHP's mail() function (fallback)
     */
    private function sendViaPHPMail($params) {
        $config = $this->smtp_config;
        
        // Build headers
        $headers = [
            'MIME-Version: 1.0',
            'Content-Type: text/plain; charset=UTF-8',
            'From: ' . $config['from_name'] . ' <' . $config['from_email'] . '>',
            'Reply-To: ' . ($params['reply_to'] ?? $config['from_email']),
            'X-Mailer: EGH-Emailer/1.0 (Fallback)',
            'X-Priority: 3',
            'Date: ' . date('r')
        ];
        
        // Add CC/BCC if specified
        if (!empty($params['cc'])) {
            $headers[] = 'Cc: ' . $params['cc'];
        }
        if (!empty($params['bcc'])) {
            $headers[] = 'Bcc: ' . $params['bcc'];
        }
        
        $header_string = implode("\r\n", $headers);
        
        // Send email
        $success = mail($params['to'], $params['subject'], $params['body'], $header_string);
        
        if ($success) {
            return ['success' => true, 'method' => 'php_mail'];
        } else {
            return ['success' => false, 'error' => 'PHP mail() function failed'];
        }
    }
    
    /**
     * Send email via SMTP
     */
    private function sendViaSMTP($params) {
        $config = $this->smtp_config;
        
        // Build message content
        $boundary = md5(uniqid(time()));
        $headers = [
            'MIME-Version: 1.0',
            'Content-Type: multipart/mixed; boundary="' . $boundary . '"',
            'From: ' . $config['from_name'] . ' <' . $config['from_email'] . '>',
            'Reply-To: ' . ($params['reply_to'] ?? $config['from_email']),
            'X-Mailer: EGH-Emailer/1.0',
            'X-Priority: 3',
            'Date: ' . date('r')
        ];
        
        // Build message body
        $message = "--{$boundary}\r\n";
        $message .= "Content-Type: text/plain; charset=UTF-8\r\n";
        $message .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
        $message .= $params['body'] . "\r\n";
        $message .= "--{$boundary}--\r\n";
        
        // Connect to SMTP server
        $smtp = fsockopen($config['host'], $config['port'], $errno, $errstr, $config['timeout']);
        
        if (!$smtp) {
            return ['success' => false, 'error' => "Connection failed: $errstr ($errno)"];
        }
        
        // Read initial response
        $response = fgets($smtp, 515);
        if (substr($response, 0, 3) != '220') {
            fclose($smtp);
            return ['success' => false, 'error' => 'SMTP connection failed: ' . trim($response)];
        }
        
        // Send EHLO
        fputs($smtp, "EHLO " . ($_SERVER['SERVER_NAME'] ?? 'localhost') . "\r\n");
        $response = fgets($smtp, 515);
        
        // Start TLS
        fputs($smtp, "STARTTLS\r\n");
        $response = fgets($smtp, 515);
        
        if (substr($response, 0, 3) != '220') {
            fclose($smtp);
            return ['success' => false, 'error' => 'STARTTLS failed: ' . trim($response)];
        }
        
        // Enable TLS encryption with fallback methods
        $crypto_methods = [
            STREAM_CRYPTO_METHOD_TLS_CLIENT,
            STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT,
            STREAM_CRYPTO_METHOD_TLSv1_1_CLIENT
        ];
        
        $tls_enabled = false;
        foreach ($crypto_methods as $method) {
            if (stream_socket_enable_crypto($smtp, true, $method)) {
                $tls_enabled = true;
                break;
            }
        }
        
        if (!$tls_enabled) {
            fclose($smtp);
            return ['success' => false, 'error' => 'TLS encryption failed with all methods'];
        }
        
        // Send EHLO again after TLS
        fputs($smtp, "EHLO " . ($_SERVER['SERVER_NAME'] ?? 'localhost') . "\r\n");
        $response = fgets($smtp, 515);
        
        // Authenticate
        fputs($smtp, "AUTH LOGIN\r\n");
        $response = fgets($smtp, 515);
        
        if (substr($response, 0, 3) != '334') {
            fclose($smtp);
            return ['success' => false, 'error' => 'AUTH LOGIN failed: ' . trim($response)];
        }
        
        fputs($smtp, base64_encode($config['username']) . "\r\n");
        $response = fgets($smtp, 515);
        
        fputs($smtp, base64_encode($config['password']) . "\r\n");
        $response = fgets($smtp, 515);
        
        if (substr($response, 0, 3) != '235') {
            fclose($smtp);
            return ['success' => false, 'error' => 'Authentication failed: ' . trim($response)];
        }
        
        // Send email
        fputs($smtp, "MAIL FROM: <" . $config['from_email'] . ">\r\n");
        $response = fgets($smtp, 515);
        
        fputs($smtp, "RCPT TO: <" . $params['to'] . ">\r\n");
        $response = fgets($smtp, 515);
        
        fputs($smtp, "DATA\r\n");
        $response = fgets($smtp, 515);
        
        fputs($smtp, "To: " . $params['to'] . "\r\n");
        fputs($smtp, "Subject: " . $params['subject'] . "\r\n");
        fputs($smtp, implode("\r\n", $headers) . "\r\n\r\n");
        fputs($smtp, $message . "\r\n.\r\n");
        
        $response = fgets($smtp, 515);
        
        fputs($smtp, "QUIT\r\n");
        fclose($smtp);
        
        if (substr($response, 0, 3) == '250') {
            return ['success' => true, 'method' => 'smtp'];
        } else {
            return ['success' => false, 'error' => 'Email sending failed: ' . trim($response)];
        }
    }
    
    /**
     * Test email configuration
     */
    public function testConnection() {
        return $this->sendEmail([
            'to' => $this->smtp_config['from_email'],
            'subject' => 'EGH Email Test',
            'body' => 'This is a test email to verify the email configuration is working properly.'
        ]);
    }
    
    /**
     * Get email statistics (basic logging)
     */
    public function getEmailStats() {
        $log_file = sys_get_temp_dir() . '/egh_email_stats.log';
        
        if (!file_exists($log_file)) {
            return ['total_sent' => 0, 'last_sent' => null];
        }
        
        $lines = file($log_file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        $total = count($lines);
        $last_sent = $total > 0 ? end($lines) : null;
        
        return [
            'total_sent' => $total,
            'last_sent' => $last_sent
        ];
    }
    
    /**
     * Log email sending
     */
    private function logEmail($to, $subject, $success) {
        $log_file = sys_get_temp_dir() . '/egh_email_stats.log';
        $entry = date('Y-m-d H:i:s') . " | " . ($success ? 'SUCCESS' : 'FAILED') . " | $to | $subject\n";
        file_put_contents($log_file, $entry, FILE_APPEND | LOCK_EX);
    }
}

/**
 * Convenience function for quick email sending
 */
function sendEGHEmail($type, $data) {
    $mailer = new EGHEmailer();
    
    switch ($type) {
        case 'contact':
            return $mailer->sendContactForm($data);
        case 'newsletter':
            return $mailer->sendNewsletterConfirmation($data['email'], $data['name'] ?? null);
        case 'career':
            return $mailer->sendCareerApplication($data);
        default:
            return ['success' => false, 'error' => 'Unknown email type'];
    }
}

/**
 * Rate limiting helper
 */
function checkRateLimit($ip, $limit_per_hour = 5) {
    $rate_limit_file = sys_get_temp_dir() . '/egh_rate_limit_' . md5($ip);
    $current_time = time();
    $one_hour_ago = $current_time - 3600;
    
    $attempts = [];
    
    if (file_exists($rate_limit_file)) {
        $attempts = json_decode(file_get_contents($rate_limit_file), true) ?: [];
        // Remove attempts older than 1 hour
        $attempts = array_filter($attempts, function($time) use ($one_hour_ago) {
            return $time > $one_hour_ago;
        });
    }
    
    if (count($attempts) >= $limit_per_hour) {
        return false;
    }
    
    $attempts[] = $current_time;
    file_put_contents($rate_limit_file, json_encode($attempts));
    
    return true;
}

/**
 * Validate email addresses
 */
function validateEmailAddress($email) {
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return false;
    }
    
    // Additional checks for common typos
    $common_domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com'];
    $domain = strtolower(substr(strrchr($email, "@"), 1));
    
    // Check for common typos
    $typos = [
        'gmial.com' => 'gmail.com',
        'gmai.com' => 'gmail.com',
        'yahooo.com' => 'yahoo.com',
        'hotmial.com' => 'hotmail.com'
    ];
    
    if (isset($typos[$domain])) {
        return ['valid' => false, 'suggestion' => str_replace($domain, $typos[$domain], $email)];
    }
    
    return ['valid' => true];
}
?>