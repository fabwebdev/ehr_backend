import {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/User.controller.js";

// Fastify plugin for user routes
async function userRoutes(fastify, options) {
  // User routes
  fastify.get("/users", getAllUsers);

  // Note: Add Fastify schema validation here if needed
  // Example: fastify.post('/users', { schema: { body: {...} } }, createUser);
  fastify.post("/users", createUser);

  fastify.get("/users/:id", getUserById);
  fastify.put("/users/:id", updateUser);
  fastify.delete("/users/:id", deleteUser);
}

export default userRoutes;
