import { db } from '../config/db.drizzle.js';
import { users } from '../db/schemas/user.schema.js';
import { eq } from 'drizzle-orm';
// Note: express-validator replaced with Fastify schema validation
import auth from '../config/betterAuth.js';
import { fromNodeHeaders } from 'better-auth/node';

// Get user details (using Better Auth session)
export const getUser = async (request, reply) => {
  try {
    // Get session from Better Auth
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
      cookies: request.cookies
    });
    
    if (!session) {
      reply.code(401);
            return {
        status: 401,
        message: 'Access denied. No valid session found.'
      };
    }
    
    // Fetch full user details from database using Drizzle
    const userRecords = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);
    const user = userRecords[0];
    
    if (!user) {
      reply.code(404);
            return {
        status: 404,
        message: 'User not found'
      };
    }
    
    // Remove password from response
    const userResponse = { ...user };
    delete userResponse.password;
    
    return {
      status: 200,
      data: {
        user: userResponse
      }
    };
  } catch (error) {
    console.error('Get user error:', error);
    reply.code(500);
    return {
      status: 500,
      message: 'Server error while fetching user details'
    };
  }
};

// Validation rules for registration
// Note: In Fastify, validation should be done using schema in route definitions
export const registerValidation = async (request, reply) => {
  // Basic validation - should be done in route schema
  if (!request.body.name || !request.body.email || !request.body.password) {
    reply.code(400);
    return {
      status: 400,
      message: 'Validation failed',
      errors: [
        ...(!request.body.name ? [{ field: 'name', message: 'Name is required' }] : []),
        ...(!request.body.email ? [{ field: 'email', message: 'Valid email is required' }] : []),
        ...(!request.body.password ? [{ field: 'password', message: 'Password must be at least 6 characters long' }] : []),
      ],
    };
  }
};

// Validation rules for login
// Note: In Fastify, validation should be done using schema in route definitions
export const loginValidation = async (request, reply) => {
  // Basic validation - should be done in route schema
  if (!request.body.email || !request.body.password) {
    reply.code(400);
    return {
      status: 400,
      message: 'Validation failed',
      errors: [
        ...(!request.body.email ? [{ field: 'email', message: 'Valid email is required' }] : []),
        ...(!request.body.password ? [{ field: 'password', message: 'Password is required' }] : []),
      ],
    };
  }
};