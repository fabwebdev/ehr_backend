/**
 * Queue Configuration
 * 
 * This file defines the queue connections for your application.
 */

const queueConfig = {
    /**
     * Default Queue Connection Name
     * 
     * Laravel's queue API supports an assortment of back-ends via a single
     * API, giving you convenient access to each back-end using the same
     * syntax for every one. Here you may define a default connection.
     */
    default: process.env.QUEUE_CONNECTION || 'sync',

    /**
     * Queue Connections
     * 
     * Here you may configure the connection information for each server that
     * is used by your application.
     * 
     * Drivers: "sync", "database", "redis", "null"
     */
    connections: {
        sync: {
            driver: 'sync'
        },

        database: {
            driver: 'database',
            table: 'jobs',
            queue: 'default',
            retry_after: 90
        },

        redis: {
            driver: 'redis',
            connection: 'default',
            queue: process.env.REDIS_QUEUE || 'default',
            retry_after: 90
        },

        null: {
            driver: 'null'
        }
    },

    /**
     * Failed Queue Jobs
     * 
     * These options configure the behavior of failed queue job logging so you
     * can control which database and table are used to store the jobs that
     * have failed.
     */
    failed: {
        driver: process.env.QUEUE_FAILED_DRIVER || 'database',
        database: process.env.DB_CONNECTION || 'postgres',
        table: 'failed_jobs'
    }
};

export default queueConfig;