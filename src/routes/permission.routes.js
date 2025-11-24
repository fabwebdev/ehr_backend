import { 
  getAllPermissions, 
  getPermissionList,
  createPermission, 
  getPermissionById, 
  updatePermission, 
  deletePermission,
  permissionValidation
} from '../controllers/Permission.controller.js';
import validate from '../middleware/validation.middleware.js';

// Fastify plugin for permission routes
async function permissionRoutes(fastify, options) {
  // Permission routes
  fastify.get('/permissions', getAllPermissions);
  fastify.get('/permissions/list', getPermissionList);
  fastify.post('/permissions/store', {
    preHandler: [permissionValidation, validate],
  }, createPermission);
  fastify.get('/permissions/:id', getPermissionById);
  fastify.put('/permissions/:id', updatePermission);
  fastify.delete('/permissions/:id', deletePermission);
}

export default permissionRoutes;