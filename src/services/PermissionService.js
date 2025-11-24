import permissionConfig from "../config/permission.config.js";

class PermissionService {
  constructor() {
    this.config = permissionConfig;
    this.permissions = new Map();
    this.roles = new Map();
  }

  /**
   * Register a permission
   * @param {string} name - Permission name
   * @param {string} description - Permission description
   */
  registerPermission(name, description = "") {
    this.permissions.set(name, {
      name: name,
      description: description,
      createdAt: new Date(),
    });
  }

  /**
   * Register a role
   * @param {string} name - Role name
   * @param {Array} permissions - Array of permission names
   */
  registerRole(name, permissions = []) {
    this.roles.set(name, {
      name: name,
      permissions: permissions,
      createdAt: new Date(),
    });
  }

  /**
   * Check if a user has a permission
   * @param {Object} user - User object
   * @param {string} permission - Permission name
   * @returns {boolean} True if user has permission
   */
  hasPermission(user, permission) {
    // This is a simplified implementation
    // In practice, you would check the user's roles and permissions in the database
    if (!user || !user.roles) {
      return false;
    }

    // Check if user has the permission directly
    if (user.permissions && user.permissions.includes(permission)) {
      return true;
    }

    // Check if user's roles have the permission
    for (const roleName of user.roles) {
      const role = this.roles.get(roleName);
      if (role && role.permissions.includes(permission)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Check if a user has a role
   * @param {Object} user - User object
   * @param {string} role - Role name
   * @returns {boolean} True if user has role
   */
  hasRole(user, role) {
    if (!user || !user.roles) {
      return false;
    }

    return user.roles.includes(role);
  }

  /**
   * Get all permissions
   * @returns {Array} Array of permissions
   */
  getPermissions() {
    return Array.from(this.permissions.values());
  }

  /**
   * Get all roles
   * @returns {Array} Array of roles
   */
  getRoles() {
    return Array.from(this.roles.values());
  }

  /**
   * Get permissions for a role
   * @param {string} roleName - Role name
   * @returns {Array} Array of permission names
   */
  getRolePermissions(roleName) {
    const role = this.roles.get(roleName);
    return role ? role.permissions : [];
  }
}

export default new PermissionService();
