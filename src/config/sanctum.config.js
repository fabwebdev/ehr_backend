// Sanctum configuration that matches Laravel's config/sanctum.php
const sanctumConfig = {
  // Stateful Domains
  stateful: [
    'localhost',
    'localhost:3000',
    '127.0.0.1',
    '127.0.0.1:8000',
    '::1',
    process.env.SANCTUM_STATEFUL_DOMAINS || '',
  ],
  
  // Sanctum Middleware
  middleware: {
    verify_csrf_token: 'App\\Http\\Middleware\\VerifyCsrfToken',
    encrypt_cookies: 'App\\Http\\Middleware\\EncryptCookies',
  },
  
  // Expiration Minutes
  expiration: process.env.SANCTUM_EXPIRATION || null,
  
  // Sanctum Token Prefix
  token_prefix: process.env.SANCTUM_TOKEN_PREFIX || '',
};

export default sanctumConfig;