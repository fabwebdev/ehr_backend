import FilesystemService from '../services/FilesystemService.js';

class Storage {
    /**
     * Get a disk instance
     * @param {string} name - Disk name
     * @returns {Object} Disk configuration
     */
    static disk(name) {
        return FilesystemService.disk(name);
    }
    
    /**
     * Get the full path for a file
     * @param {string} filePath - File path
     * @param {string} diskName - Disk name
     * @returns {string} Full path
     */
    static path(filePath, diskName) {
        return FilesystemService.path(filePath, diskName);
    }
    
    /**
     * Check if a file exists
     * @param {string} filePath - File path
     * @param {string} diskName - Disk name
     * @returns {boolean} True if file exists
     */
    static exists(filePath, diskName) {
        return FilesystemService.exists(filePath, diskName);
    }
    
    /**
     * Read a file
     * @param {string} filePath - File path
     * @param {string} diskName - Disk name
     * @returns {Buffer|string} File content
     */
    static read(filePath, diskName) {
        return FilesystemService.read(filePath, diskName);
    }
    
    /**
     * Write a file
     * @param {string} filePath - File path
     * @param {string|Buffer} content - File content
     * @param {string} diskName - Disk name
     * @returns {boolean} True if successful
     */
    static write(filePath, content, diskName) {
        return FilesystemService.write(filePath, content, diskName);
    }
    
    /**
     * Delete a file
     * @param {string} filePath - File path
     * @param {string} diskName - Disk name
     * @returns {boolean} True if successful
     */
    static delete(filePath, diskName) {
        return FilesystemService.delete(filePath, diskName);
    }
    
    /**
     * Get file URL
     * @param {string} filePath - File path
     * @param {string} diskName - Disk name
     * @returns {string} File URL
     */
    static url(filePath, diskName) {
        return FilesystemService.url(filePath, diskName);
    }
    
    /**
     * Get file size
     * @param {string} filePath - File path
     * @param {string} diskName - Disk name
     * @returns {number} File size in bytes
     */
    static size(filePath, diskName) {
        return FilesystemService.size(filePath, diskName);
    }
    
    /**
     * Get file last modified time
     * @param {string} filePath - File path
     * @param {string} diskName - Disk name
     * @returns {Date} Last modified time
     */
    static lastModified(filePath, diskName) {
        return FilesystemService.lastModified(filePath, diskName);
    }
}

export default Storage;