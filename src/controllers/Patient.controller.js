import Patient from '../models/Patient.model.js';
// Note: express-validator replaced with Fastify schema validation

// Get all patients
export const getAllPatients = async (request, reply) => {
  try {
    const patients = await Patient.findAll();
    return patients;
  } catch (error) {
    console.error('Error fetching patients:', error);
    reply.code(500);
            return {
      status: 500,
      message: 'Server error while fetching patients'
    };
  }
};

// Create a new patient
export const createPatient = async (request, reply) => {
  try {
    // Note: Validation should be done in route definition using Fastify schema
    const patientData = request.body;
    
    // Create patient
    const patient = await Patient.create(patientData);
    
    reply.code(201);
            return {
      message: 'Patient created successfully.',
      data: patient
    };
  } catch (error) {
    console.error('Error creating patient:', error);
    reply.code(500);
            return {
      status: 500,
      message: 'Server error while creating patient'
    };
  }
};

// Get patient by ID
export const getPatientById = async (request, reply) => {
  try {
    const { id } = request.params;
    const patient = await Patient.findByPk(id);
    
    if (!patient) {
      reply.code(404);
            return {
        status: 404,
        message: 'Patient not found'
      };
    }
    
    return patient;
  } catch (error) {
    console.error('Error fetching patient:', error);
    reply.code(500);
            return {
      status: 500,
      message: 'Server error while fetching patient'
    };
  }
};

// Update patient by ID
export const updatePatient = async (request, reply) => {
  try {
    const { id } = request.params;
    const patientData = request.body;
    
    // Find patient
    const patient = await Patient.findByPk(id);
    
    if (!patient) {
      reply.code(404);
            return {
        status: 404,
        message: 'Patient not found'
      };
    }
    
    // Update patient
    await patient.update(patientData);
    
    return {
      message: 'Patient updated successfully.',
      data: patient
    };
  } catch (error) {
    console.error('Error updating patient:', error);
    reply.code(500);
            return {
      status: 500,
      message: 'Server error while updating patient'
    };
  }
};

// Delete patient by ID
export const deletePatient = async (request, reply) => {
  try {
    const { id } = request.params;
    
    // Find patient
    const patient = await Patient.findByPk(id);
    
    if (!patient) {
      reply.code(404);
            return {
        status: 404,
        message: 'Patient not found'
      };
    }
    
    // Delete patient
    await patient.destroy();
    
    return {
      message: 'Patient deleted successfully.'
    };
  } catch (error) {
    console.error('Error deleting patient:', error);
    reply.code(500);
            return {
      status: 500,
      message: 'Server error while deleting patient'
    };
  }
};

// Validation rules for creating/updating patient
// Note: In Fastify, validation should be done using schema in route definitions
export const patientValidation = async (request, reply) => {
  // Basic validation - should be done in route schema
  // This is kept for compatibility
};
