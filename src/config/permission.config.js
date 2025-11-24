/**
 * Permission Configuration
 * 
 * This file defines the permission configurations for your application.
 */

const permissionConfig = {
    models: {
        /**
         * When using the permission system, we need to know which
         * model should be used to retrieve your permissions.
         */
        permission: 'Permission',

        /**
         * When using the role system, we need to know which
         * model should be used to retrieve your roles.
         */
        role: 'Role'
    },

    table_names: {
        /**
         * Table names for the permission system
         */
        roles: 'roles',
        permissions: 'permissions',
        model_has_permissions: 'model_has_permissions',
        model_has_roles: 'model_has_roles',
        role_has_permissions: 'role_has_permissions'
    },

    column_names: {
        /**
         * Column names for the permission system
         */
        role_pivot_key: null, // default 'role_id'
        permission_pivot_key: null, // default 'permission_id'
        model_morph_key: 'model_id',
        team_foreign_key: 'team_id'
    },

    /**
     * When set to true, the method for checking permissions will be registered.
     */
    register_permission_check_method: true,

    /**
     * Teams Feature
     */
    teams: false,

    /**
     * When set to true, the required permission names are added to exception messages.
     */
    display_permission_in_exception: false,

    /**
     * When set to true, the required role names are added to exception messages.
     */
    display_role_in_exception: false,

    /**
     * By default wildcard permission lookups are disabled.
     */
    enable_wildcard_permission: false,

    /**
     * Cache-specific settings
     */
    cache: {
        /**
         * By default all permissions are cached for 24 hours to speed up performance.
         */
        expiration_time: '24 hours',

        /**
         * The cache key used to store all permissions.
         */
        key: 'permission.cache',

        /**
         * You may optionally indicate a specific cache driver to use.
         */
        store: 'default'
    }
};

export default permissionConfig;