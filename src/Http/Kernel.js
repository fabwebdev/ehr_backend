class Kernel {
  constructor() {
    /**
     * The application's global HTTP middleware stack.
     *
     * These middleware are run during every request to your application.
     *
     * @var {Array}
     */
    this.middleware = [
      // TrustHosts,
      'TrustProxies',
      'HandleCors',
      'PreventRequestsDuringMaintenance',
      'ValidatePostSize',
      'TrimStrings',
      'ConvertEmptyStringsToNull',
    ];

    /**
     * The application's route middleware groups.
     *
     * @var {Object}
     */
    this.middlewareGroups = {
      web: [
        'EncryptCookies',
        'AddQueuedCookiesToResponse',
        'StartSession',
        // 'AuthenticateSession',
        'ShareErrorsFromSession',
        'VerifyCsrfToken',
        'SubstituteBindings',
      ],

      api: [
        // 'EnsureFrontendRequestsAreStateful',
        'throttle:api',
        'SubstituteBindings',
      ],
    };

    /**
     * The application's route middleware.
     *
     * These middleware may be assigned to groups or used individually.
     *
     * @var {Object}
     */
    this.routeMiddleware = {
      auth: 'Authenticate',
      'auth.basic': 'AuthenticateWithBasicAuth',
      'cache.headers': 'SetCacheHeaders',
      can: 'Authorize',
      guest: 'RedirectIfAuthenticated',
      'password.confirm': 'RequirePassword',
      signed: 'ValidateSignature',
      throttle: 'ThrottleRequests',
      verified: 'EnsureEmailIsVerified',

    };
  }
}

export default new Kernel();