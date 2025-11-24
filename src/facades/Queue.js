import QueueService from '../services/QueueService.js';

class Queue {
    /**
     * Push a job onto the queue
     * @param {string} queue - The queue name
     * @param {Function} job - The job function to execute
     * @param {Object} data - The job data
     * @returns {string} Job ID
     */
    static async push(queue, job, data = {}) {
        return await QueueService.push(queue, job, data);
    }
    
    /**
     * Process jobs in the queue
     */
    static async process() {
        return await QueueService.process();
    }
    
    /**
     * Get the number of pending jobs
     * @returns {number} Number of pending jobs
     */
    static pending() {
        return QueueService.pending();
    }
    
    /**
     * Get the number of failed jobs
     * @returns {number} Number of failed jobs
     */
    static failed() {
        return QueueService.failed();
    }
    
    /**
     * Get all jobs
     * @returns {Array} All jobs
     */
    static getJobs() {
        return QueueService.getJobs();
    }
    
    /**
     * Get all failed jobs
     * @returns {Array} All failed jobs
     */
    static getFailedJobs() {
        return QueueService.getFailedJobs();
    }
}

export default Queue;