import MailService from '../services/MailService.js';

class Mail {
    /**
     * Send an email
     * @param {Object} options - Email options
     * @returns {Promise} Promise that resolves when email is sent
     */
    static async send(options) {
        return await MailService.send(options);
    }
    
    /**
     * Send a plain text email
     * @param {string} to - Recipient email address
     * @param {string} subject - Email subject
     * @param {string} text - Plain text content
     * @returns {Promise} Promise that resolves when email is sent
     */
    static async sendText(to, subject, text) {
        return await MailService.sendText(to, subject, text);
    }
    
    /**
     * Send an HTML email
     * @param {string} to - Recipient email address
     * @param {string} subject - Email subject
     * @param {string} html - HTML content
     * @returns {Promise} Promise that resolves when email is sent
     */
    static async sendHtml(to, subject, html) {
        return await MailService.sendHtml(to, subject, html);
    }
    
    /**
     * Verify the transporter configuration
     * @returns {Promise} Promise that resolves when transporter is verified
     */
    static async verify() {
        return await MailService.verify();
    }
}

export default Mail;