/**
 * Session Configuration
 * 
 * This file defines the session configuration for your application.
 */

const sessionConfig = {
    /**
     * Default Session Driver
     * 
     * This option controls the default session "driver" that will be used on
     * requests.
     * 
     * Supported: "memory", "file", "database", "redis"
     */
    driver: process.env.SESSION_DRIVER || 'memory',

    /**
     * Session Lifetime
     * 
     * Here you may specify the number of minutes that you wish the session
     * to be allowed to remain idle before it expires.
     */
    lifetime: process.env.SESSION_LIFETIME || 120,

    expire_on_close: false,

    /**
     * Session Encryption
     * 
     * This option allows you to easily specify that all of your session data
     * should be encrypted before it is stored.
     */
    encrypt: false,

    /**
     * Session File Location
     * 
     * When using the file session driver, we need a location where session
     * files may be stored.
     */
    files: './storage/framework/sessions',

    /**
     * Session Database Connection
     * 
     * When using the "database" or "redis" session drivers, you may specify a
     * connection that should be used to manage these sessions.
     */
    connection: process.env.SESSION_CONNECTION || null,

    /**
     * Session Database Table
     * 
     * When using the "database" session driver, you may specify the table we
     * should use to manage the sessions.
     */
    table: 'sessions',

    /**
     * Session Cache Store
     * 
     * While using one of the framework's cache driven session backends you may
     * list a cache store that should be used for these sessions.
     */
    store: process.env.SESSION_STORE || null,

    /**
     * Session Sweeping Lottery
     * 
     * Some session drivers must manually sweep their storage location to get
     * rid of old sessions from storage.
     */
    lottery: [2, 100],

    /**
     * Session Cookie Name
     * 
     * Here you may change the name of the cookie used to identify a session
     * instance by ID.
     */
    cookie: process.env.SESSION_COOKIE || 'express_session',

    /**
     * Session Cookie Path
     * 
     * The session cookie path determines the path for which the cookie will
     * be regarded as available.
     */
    path: '/',

    /**
     * Session Cookie Domain
     * 
     * Here you may change the domain of the cookie used to identify a session
     * in your application.
     */
    domain: process.env.SESSION_DOMAIN || null,

    /**
     * HTTPS Only Cookies
     * 
     * By setting this option to true, session cookies will only be sent back
     * to the server if the browser has a HTTPS connection.
     */
    secure: process.env.SESSION_SECURE_COOKIE || false,

    /**
     * HTTP Access Only
     * 
     * Setting this value to true will prevent JavaScript from accessing the
     * value of the cookie and the cookie will only be accessible through
     * the HTTP protocol.
     */
    http_only: true,

    /**
     * Same-Site Cookies
     * 
     * This option determines how your cookies behave when cross-site requests
     * take place, and can be used to mitigate CSRF attacks.
     * 
     * Supported: "lax", "strict", "none", null
     */
    same_site: 'lax'
};

export default sessionConfig;