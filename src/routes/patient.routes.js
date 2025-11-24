import { 
  getAllPatients, 
  createPatient, 
  getPatientById, 
  updatePatient, 
  deletePatient,
  patientValidation
} from '../controllers/Patient.controller.js';
import { 
  createPrognosis, 
  getAllPrognosis, 
  getPrognosisByPatientId,
  prognosisValidation
} from '../controllers/Prognosis.controller.js';
import validate from '../middleware/validation.middleware.js';

// Fastify plugin for patient routes
async function patientRoutes(fastify, options) {
  // Patient routes
  fastify.get('/patient', getAllPatients);
  fastify.post('/patient/store', {
    preHandler: [patientValidation, validate],
  }, createPatient);
  fastify.get('/patient/:id', getPatientById);
  fastify.put('/patient/:id', updatePatient);
  fastify.delete('/patient/:id', deletePatient);

  // Prognosis routes
  fastify.post('/prognosis/store', {
    preHandler: [prognosisValidation, validate],
  }, createPrognosis);
  fastify.get('/prognosis', getAllPrognosis);
  fastify.get('/prognosis/:id', getPrognosisByPatientId);
}

export default patientRoutes;
