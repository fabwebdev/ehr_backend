/**
 * Services Configuration
 * 
 * This file is for storing the credentials for third party services such
 * as Mailgun, Postmark, AWS and more.
 */

const servicesConfig = {
    mailgun: {
        domain: process.env.MAILGUN_DOMAIN,
        secret: process.env.MAILGUN_SECRET,
        endpoint: process.env.MAILGUN_ENDPOINT || 'api.mailgun.net'
    },

    postmark: {
        token: process.env.POSTMARK_TOKEN
    },

    ses: {
        key: process.env.AWS_ACCESS_KEY_ID,
        secret: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_DEFAULT_REGION || 'us-east-1'
    }
};

export default servicesConfig;