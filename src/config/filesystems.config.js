/**
 * Filesystem Configuration
 * 
 * This file defines the filesystem disks for your application.
 */

const filesystemsConfig = {
    /**
     * Default Filesystem Disk
     * 
     * Here you may specify the default filesystem disk that should be used
     * by the framework.
     */
    default: process.env.FILESYSTEM_DRIVER || 'local',

    /**
     * Filesystem Disks
     * 
     * Here you may configure as many filesystem "disks" as you wish, and you
     * may even configure multiple disks of the same driver.
     * 
     * Supported Drivers: "local", "s3"
     */
    disks: {
        local: {
            driver: 'local',
            root: './storage/app'
        },

        public: {
            driver: 'local',
            root: './storage/app/public',
            url: process.env.APP_URL + '/storage',
            visibility: 'public'
        },

        profiles: {
            driver: 'local',
            root: './storage/app/public/profiles',
            url: process.env.APP_URL + '/storage',
            visibility: 'public'
        },

        posts: {
            driver: 'local',
            root: './storage/app/public/posts',
            url: process.env.APP_URL + '/storage',
            visibility: 'public'
        },

        s3: {
            driver: 's3',
            key: process.env.AWS_ACCESS_KEY_ID,
            secret: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_DEFAULT_REGION,
            bucket: process.env.AWS_BUCKET,
            url: process.env.AWS_URL,
            endpoint: process.env.AWS_ENDPOINT
        }
    },

    /**
     * Symbolic Links
     * 
     * Here you may configure the symbolic links that will be created when the
     * storage:link command is executed.
     */
    links: {
        './public/storage': './storage/app/public'
    }
};

export default filesystemsConfig;