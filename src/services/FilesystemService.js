import fs from 'fs';
import path from 'path';
import filesystemsConfig from '../config/filesystems.config.js';

class FilesystemService {
    constructor() {
        this.config = filesystemsConfig;
        this.disks = new Map();
        this.initializeDisks();
    }
    
    /**
     * Initialize the filesystem disks
     */
    initializeDisks() {
        for (const [name, config] of Object.entries(this.config.disks)) {
            this.disks.set(name, {
                driver: config.driver,
                root: config.root,
                url: config.url,
                visibility: config.visibility
            });
        }
    }
    
    /**
     * Get a disk instance
     * @param {string} name - Disk name
     * @returns {Object} Disk configuration
     */
    disk(name = this.config.default) {
        return this.disks.get(name);
    }
    
    /**
     * Get the full path for a file
     * @param {string} filePath - File path
     * @param {string} diskName - Disk name
     * @returns {string} Full path
     */
    path(filePath, diskName = this.config.default) {
        const disk = this.disk(diskName);
        if (!disk) {
            throw new Error(`Disk ${diskName} not found`);
        }
        
        return path.join(disk.root, filePath);
    }
    
    /**
     * Check if a file exists
     * @param {string} filePath - File path
     * @param {string} diskName - Disk name
     * @returns {boolean} True if file exists
     */
    exists(filePath, diskName = this.config.default) {
        const fullPath = this.path(filePath, diskName);
        return fs.existsSync(fullPath);
    }
    
    /**
     * Read a file
     * @param {string} filePath - File path
     * @param {string} diskName - Disk name
     * @returns {Buffer|string} File content
     */
    read(filePath, diskName = this.config.default) {
        const fullPath = this.path(filePath, diskName);
        return fs.readFileSync(fullPath);
    }
    
    /**
     * Write a file
     * @param {string} filePath - File path
     * @param {string|Buffer} content - File content
     * @param {string} diskName - Disk name
     * @returns {boolean} True if successful
     */
    write(filePath, content, diskName = this.config.default) {
        const fullPath = this.path(filePath, diskName);
        
        // Create directory if it doesn't exist
        const dir = path.dirname(fullPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.writeFileSync(fullPath, content);
        return true;
    }
    
    /**
     * Delete a file
     * @param {string} filePath - File path
     * @param {string} diskName - Disk name
     * @returns {boolean} True if successful
     */
    delete(filePath, diskName = this.config.default) {
        const fullPath = this.path(filePath, diskName);
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
            return true;
        }
        return false;
    }
    
    /**
     * Get file URL
     * @param {string} filePath - File path
     * @param {string} diskName - Disk name
     * @returns {string} File URL
     */
    url(filePath, diskName = this.config.default) {
        const disk = this.disk(diskName);
        if (!disk || !disk.url) {
            return null;
        }
        
        return `${disk.url}/${filePath}`;
    }
    
    /**
     * Get file size
     * @param {string} filePath - File path
     * @param {string} diskName - Disk name
     * @returns {number} File size in bytes
     */
    size(filePath, diskName = this.config.default) {
        const fullPath = this.path(filePath, diskName);
        const stats = fs.statSync(fullPath);
        return stats.size;
    }
    
    /**
     * Get file last modified time
     * @param {string} filePath - File path
     * @param {string} diskName - Disk name
     * @returns {Date} Last modified time
     */
    lastModified(filePath, diskName = this.config.default) {
        const fullPath = this.path(filePath, diskName);
        const stats = fs.statSync(fullPath);
        return stats.mtime;
    }
}

export default new FilesystemService();