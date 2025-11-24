// App configuration that matches Laravel's config/app.php
const appConfig = {
  // Application Name
  name: process.env.APP_NAME || "Charts Backend Express",

  // Application Environment
  env: process.env.APP_ENV || "production",

  // Application Debug Mode
  debug: process.env.APP_DEBUG === "true" || false,

  // Application URL
  url: process.env.APP_URL || "http://localhost",

  asset_url: process.env.ASSET_URL || null,

  // Application Timezone
  timezone: process.env.APP_TIMEZONE || "UTC",

  // Application Locale Configuration
  locale: process.env.APP_LOCALE || "en",

  // Application Fallback Locale
  fallback_locale: process.env.APP_FALLBACK_LOCALE || "en",

  // Faker Locale
  faker_locale: process.env.FAKER_LOCALE || "en_US",

  // Encryption Key
  key: process.env.APP_KEY || null,

  cipher: process.env.APP_CIPHER || "AES-256-CBC",

  // Autoloaded Service Providers
  providers: [
    // Core service providers
    "AppServiceProvider",
    "AuthServiceProvider",
    "BroadcastServiceProvider",
    "EventServiceProvider",
    "RouteServiceProvider",
  ],

  // Class Aliases
  aliases: {
    App: "IlluminateSupportFacadesApp",
    Arr: "IlluminateSupportArr",
    Artisan: "IlluminateSupportFacadesArtisan",
    Auth: "IlluminateSupportFacadesAuth",
    Blade: "IlluminateSupportFacadesBlade",
    Broadcast: "IlluminateSupportFacadesBroadcast",
    Bus: "IlluminateSupportFacadesBus",
    Cache: "IlluminateSupportFacadesCache",
    Config: "IlluminateSupportFacadesConfig",
    Cookie: "IlluminateSupportFacadesCookie",
    Crypt: "IlluminateSupportFacadesCrypt",
    Date: "IlluminateSupportFacadesDate",
    DB: "IlluminateSupportFacadesDB",
    Eloquent: "IlluminateDatabaseEloquentModel",
    Event: "IlluminateSupportFacadesEvent",
    File: "IlluminateSupportFacadesFile",
    Gate: "IlluminateSupportFacadesGate",
    Hash: "IlluminateSupportFacadesHash",
    Http: "IlluminateSupportFacadesHttp",
    Js: "IlluminateSupportJs",
    Lang: "IlluminateSupportFacadesLang",
    Log: "IlluminateSupportFacadesLog",
    Mail: "IlluminateSupportFacadesMail",
    Notification: "IlluminateSupportFacadesNotification",
    Password: "IlluminateSupportFacadesPassword",
    Queue: "IlluminateSupportFacadesQueue",
    RateLimiter: "IlluminateSupportFacadesRateLimiter",
    Redirect: "IlluminateSupportFacadesRedirect",
    Request: "IlluminateSupportFacadesRequest",
    Response: "IlluminateSupportFacadesResponse",
    Route: "IlluminateSupportFacadesRoute",
    Schema: "IlluminateSupportFacadesSchema",
    Session: "IlluminateSupportFacadesSession",
    Storage: "IlluminateSupportFacadesStorage",
    Str: "IlluminateSupportStr",
    URL: "IlluminateSupportFacadesURL",
    Validator: "IlluminateSupportFacadesValidator",
    View: "IlluminateSupportFacadesView",
  },
};

export default appConfig;
