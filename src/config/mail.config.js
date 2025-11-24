/**
 * Mail Configuration
 * 
 * This file defines the mail configurations for your application.
 */

const mailConfig = {
    /**
     * Default Mailer
     * 
     * This option controls the default mailer that is used to send any email
     * messages sent by your application.
     */
    default: process.env.MAIL_MAILER || 'smtp',

    /**
     * Mailer Configurations
     * 
     * Here you may configure all of the mailers used by your application plus
     * their respective settings.
     * 
     * Supported: "smtp", "sendmail", "log", "null"
     */
    mailers: {
        smtp: {
            transport: 'smtp',
            host: process.env.MAIL_HOST || 'smtp.mailgun.org',
            port: process.env.MAIL_PORT || 587,
            encryption: process.env.MAIL_ENCRYPTION || 'tls',
            username: process.env.MAIL_USERNAME,
            password: process.env.MAIL_PASSWORD,
            timeout: null
        },

        sendmail: {
            transport: 'sendmail',
            path: process.env.MAIL_SENDMAIL_PATH || '/usr/sbin/sendmail -t -i'
        },

        log: {
            transport: 'log',
            channel: process.env.MAIL_LOG_CHANNEL
        },

        null: {
            transport: 'null'
        }
    },

    /**
     * Global "From" Address
     * 
     * You may wish for all e-mails sent by your application to be sent from
     * the same address.
     */
    from: {
        address: process.env.MAIL_FROM_ADDRESS || 'hello@example.com',
        name: process.env.MAIL_FROM_NAME || 'Example'
    },

    /**
     * Markdown Mail Settings
     * 
     * If you are using Markdown based email rendering, you may configure your
     * theme and component paths here.
     */
    markdown: {
        theme: 'default',
        paths: [
            './resources/views/vendor/mail'
        ]
    }
};

export default mailConfig;