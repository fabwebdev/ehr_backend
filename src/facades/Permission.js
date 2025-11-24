import PermissionService from '../services/PermissionService.js';

class Permission {
    /**
     * Register a permission
     * @param {string} name - Permission name
     * @param {string} description - Permission description
     */
    static registerPermission(name, description = '') {
        PermissionService.registerPermission(name, description);
    }
    
    /**
     * Register a role
     * @param {string} name - Role name
     * @param {Array} permissions - Array of permission names
     */
    static registerRole(name, permissions = []) {
        PermissionService.registerRole(name, permissions);
    }
    
    /**
     * Check if a user has a permission
     * @param {Object} user - User object
     * @param {string} permission - Permission name
     * @returns {boolean} True if user has permission
     */
    static hasPermission(user, permission) {
        return PermissionService.hasPermission(user, permission);
    }
    
    /**
     * Check if a user has a role
     * @param {Object} user - User object
     * @param {string} role - Role name
     * @returns {boolean} True if user has role
     */
    static hasRole(user, role) {
        return PermissionService.hasRole(user, role);
    }
    
    /**
     * Get all permissions
     * @returns {Array} Array of permissions
     */
    static getPermissions() {
        return PermissionService.getPermissions();
    }
    
    /**
     * Get all roles
     * @returns {Array} Array of roles
     */
    static getRoles() {
        return PermissionService.getRoles();
    }
    
    /**
     * Get permissions for a role
     * @param {string} roleName - Role name
     * @returns {Array} Array of permission names
     */
    static getRolePermissions(roleName) {
        return PermissionService.getRolePermissions(roleName);
    }
}

export default Permission;