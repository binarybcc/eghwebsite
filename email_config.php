<?php
/**
 * Edwards Group Holdings - Email Configuration
 * 
 * This file loads configuration from environment variables (.env file)
 * 
 * Setup Instructions:
 * 1. Copy .env.example to .env
 * 2. Fill in your actual credentials in .env
 * 3. Never commit the .env file to git
 */

// Load environment variables
require_once 'load_env.php';

return [
    // SMTP Configuration
    'smtp' => [
        'host' => 'smtp.gmail.com',
        'port' => 587,
        'username' => $_ENV['SMTP_USERNAME'] ?? 'your-email@domain.com',
        'password' => $_ENV['SMTP_PASSWORD'] ?? 'your-app-password-here',
        'from_email' => 'noreply@edwards-group.com',
        'from_name' => 'Edwards Group Holdings',
        'timeout' => 10
    ],
    
    // Email Recipients
    'recipients' => [
        'contact' => $_ENV['CONTACT_EMAIL'] ?? 'contact@your-domain.com',
        'careers' => $_ENV['CAREERS_EMAIL'] ?? 'careers@your-domain.com',
        'support' => $_ENV['SUPPORT_EMAIL'] ?? 'support@your-domain.com',
        'admin' => $_ENV['ADMIN_EMAIL'] ?? 'admin@your-domain.com'
    ],
    
    // Security Settings
    'security' => [
        'allowed_domains' => explode(',', $_ENV['ALLOWED_DOMAINS'] ?? 'edwards-group.com,localhost,127.0.0.1'),
        'rate_limit_per_hour' => 10,
        'max_message_length' => 2000,
        'enable_spam_filter' => true
    ],
    
    // Features
    'features' => [
        'newsletter_signup' => true,
        'career_applications' => true,
        'email_logging' => true,
        'auto_reply' => false
    ]
];
?>