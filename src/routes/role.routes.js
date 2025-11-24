import { 
  getAllRoles, 
  createRole, 
  getRoleById, 
  updateRole, 
  deleteRole,
  roleValidation
} from '../controllers/Role.controller.js';
import validate from '../middleware/validation.middleware.js';

// Fastify plugin for role routes
async function roleRoutes(fastify, options) {
  // Role routes
  fastify.get('/roles', getAllRoles);
  fastify.post('/role/store', {
    preHandler: [roleValidation, validate],
  }, createRole);
  fastify.get('/role/:id', getRoleById);
  fastify.put('/role/:id', updateRole);
  fastify.delete('/roles/:id', deleteRole);
}

export default roleRoutes;
