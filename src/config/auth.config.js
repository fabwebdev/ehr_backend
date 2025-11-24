// Auth configuration that matches Laravel's config/auth.php
const authConfig = {
  // Authentication Defaults
  defaults: {
    guard: 'web',
    passwords: 'users',
  },
  
  // Authentication Guards
  guards: {
    web: {
      driver: 'session',
      provider: 'users',
    },
    
    api: {
      driver: 'token',
      provider: 'users',
      hash: false,
    },
  },
  
  // User Providers
  providers: {
    users: {
      driver: 'eloquent',
      model: 'App\\Models\\User',
    },
    
    // users: {
    //   driver: 'database',
    //   table: 'users',
    // },
  },
  
  // Resetting Passwords
  passwords: {
    users: {
      provider: 'users',
      table: 'password_resets',
      expire: 60,
      throttle: 60,
    },
  },
  
  // Password Confirmation Timeout
  password_timeout: 10800,
};

export default authConfig;