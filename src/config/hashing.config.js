/**
 * Hashing Configuration
 * 
 * This file defines the hashing configurations for your application.
 */

const hashingConfig = {
    /**
     * Default Hash Driver
     * 
     * This option controls the default hash driver that will be used to hash
     * passwords for your application.
     * 
     * Supported: "bcrypt", "argon2"
     */
    driver: process.env.HASH_DRIVER || 'bcrypt',

    /**
     * Bcrypt Options
     * 
     * Here you may specify the configuration options that should be used when
     * passwords are hashed using the Bcrypt algorithm.
     */
    bcrypt: {
        rounds: process.env.BCRYPT_ROUNDS || 10
    },

    /**
     * Argon2 Options
     * 
     * Here you may specify the configuration options that should be used when
     * passwords are hashed using the Argon2 algorithm.
     */
    argon2: {
        memory: 65536,
        parallelism: 1,
        time: 4
    }
};

export default hashingConfig;