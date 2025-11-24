// Note: express-validator replaced with Fastify schema validation
// Validation should be done in route definitions using Fastify's schema
import Helper from '../../helpers/Helper.js';

class LoginRequest {
  /**
   * Get the validation schema for Fastify
   * This replaces express-validator rules
   *
   * @return {Object} Fastify schema
   */
  static schema() {
    return {
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            errorMessage: 'The email field is required and must be a valid email.'
          },
          password: {
            type: 'string',
            minLength: 6,
            maxLength: 50,
            errorMessage: 'The password must contain at least 6 characters and not exceed 50 characters.'
          }
        }
      }
    };
  }

  /**
   * Fastify pre-handler for validation
   * Note: Fastify schema validation happens automatically, this is for custom validation
   * @param {Object} request - Fastify request object
   * @param {Object} reply - Fastify reply object
   */
  static async validate(request, reply) {
    const { email, password } = request.body;
    const errors = [];

    if (!email) {
      errors.push({ field: 'email', message: 'The email field is required.' });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push({ field: 'email', message: 'Invalid email format' });
    }

    if (!password) {
      errors.push({ field: 'password', message: 'The password field is required.' });
    } else if (password.length < 6) {
      errors.push({ field: 'password', message: 'The password must contain at least 6 characters.' });
    } else if (password.length > 50) {
      errors.push({ field: 'password', message: 'The password must not exceed 50 characters.' });
    }

    if (errors.length > 0) {
      reply.code(400);
      return Helper.sendError('Invalid email or password', errors);
    }
  }
}

export default LoginRequest;