import queueConfig from '../config/queue.config.js';

class QueueService {
    constructor() {
        this.connection = queueConfig.default;
        this.config = queueConfig.connections[this.connection];
        this.jobs = [];
        this.failedJobs = [];
    }
    
    /**
     * Push a job onto the queue
     * @param {string} queue - The queue name
     * @param {Function} job - The job function to execute
     * @param {Object} data - The job data
     * @returns {string} Job ID
     */
    async push(queue, job, data = {}) {
        const jobId = this.generateJobId();
        
        const jobData = {
            id: jobId,
            queue: queue,
            job: job.toString(),
            data: data,
            attempts: 0,
            createdAt: new Date()
        };
        
        // For sync driver, execute immediately
        if (this.connection === 'sync') {
            try {
                await job(data);
                return jobId;
            } catch (error) {
                this.handleFailedJob(jobData, error);
                throw error;
            }
        }
        
        // For other drivers, store the job
        this.jobs.push(jobData);
        return jobId;
    }
    
    /**
     * Process jobs in the queue
     */
    async process() {
        // For sync driver, there's nothing to process
        if (this.connection === 'sync') {
            return;
        }
        
        // Process jobs
        for (let i = 0; i < this.jobs.length; i++) {
            const jobData = this.jobs[i];
            
            try {
                // Reconstruct the job function
                const jobFunction = eval(`(${jobData.job})`);
                await jobFunction(jobData.data);
                
                // Remove successful job
                this.jobs.splice(i, 1);
                i--;
            } catch (error) {
                this.handleFailedJob(jobData, error);
                
                // Remove failed job
                this.jobs.splice(i, 1);
                i--;
            }
        }
    }
    
    /**
     * Handle a failed job
     * @param {Object} jobData - The job data
     * @param {Error} error - The error that occurred
     */
    handleFailedJob(jobData, error) {
        const failedJob = {
            ...jobData,
            failedAt: new Date(),
            exception: error.message,
            trace: error.stack
        };
        
        this.failedJobs.push(failedJob);
        console.error(`Job ${jobData.id} failed:`, error);
    }
    
    /**
     * Generate a unique job ID
     * @returns {string} Job ID
     */
    generateJobId() {
        return 'job_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    /**
     * Get the number of pending jobs
     * @returns {number} Number of pending jobs
     */
    pending() {
        return this.jobs.length;
    }
    
    /**
     * Get the number of failed jobs
     * @returns {number} Number of failed jobs
     */
    failed() {
        return this.failedJobs.length;
    }
    
    /**
     * Get all jobs
     * @returns {Array} All jobs
     */
    getJobs() {
        return this.jobs;
    }
    
    /**
     * Get all failed jobs
     * @returns {Array} All failed jobs
     */
    getFailedJobs() {
        return this.failedJobs;
    }
}

export default new QueueService();