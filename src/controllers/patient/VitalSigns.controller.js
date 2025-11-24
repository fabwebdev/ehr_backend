import { db } from '../../config/db.drizzle.js';
import { vital_signs } from '../../db/schemas/index.js';
import { eq } from 'drizzle-orm';

// Get all vital signs
export const index = async (request, reply) => {
  try {
    const vitalSigns = await db.select().from(vital_signs);
    reply.code(200);
    return {
      status: 200,
      data: vitalSigns
    };
  } catch (error) {
    console.error('Error fetching vital signs:', error);
    reply.code(500);
    return {
      status: 500,
      message: 'Server error while fetching vital signs'
    };
  }
};

// Store new vital signs
export const store = async (request, reply) => {
  try {
    const newVitalSign = await db.insert(vital_signs).values(request.body).returning();
    const vitalSign = newVitalSign[0];
    reply.code(201);
    return {
      status: 201,
      data: vitalSign
    };
  } catch (error) {
    console.error('Error creating vital signs:', error);
    reply.code(500);
    return {
      status: 500,
      message: 'Server error while creating vital signs'
    };
  }
};

// Show specific vital signs
export const show = async (request, reply) => {
  try {
    const vitalSignResult = await db.select().from(vital_signs)
      .where(eq(vital_signs.id, parseInt(request.params.id)))
      .limit(1);
    const vitalSign = vitalSignResult[0];
    
    if (!vitalSign) {
      reply.code(404);
            return {
        status: 404,
        message: 'Vital signs not found'
      };
    }
    reply.code(200);
    return {
      status: 200,
      data: vitalSign
    };
  } catch (error) {
    console.error('Error fetching vital signs:', error);
    reply.code(500);
    return {
      status: 500,
      message: 'Server error while fetching vital signs'
    };
  }
};