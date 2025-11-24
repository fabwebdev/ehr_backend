// Note: express-validator replaced with Fastify schema validation
import { db } from "../../config/db.drizzle.js";
import { 
  nursing_clinical_notes, 
  vital_signs, 
  pain_data, 
  painad_data, 
  flacc_data, 
  scale_tool_lab_data, 
  cardiovascular_data, 
  respiratory_data, 
  genitourinary_data, 
  gastrointestinal_data 
} from "../../db/schemas/index.js";
import { eq, and } from "drizzle-orm";

// Show nursing clinical note by ID
export const show = async (request, reply) => {
    try {
        const { id } = request.params;
        const noteResult = await db.select().from(nursing_clinical_notes)
            .where(eq(nursing_clinical_notes.id, parseInt(id)))
            .limit(1);
        const note = noteResult[0];

        if (!note) {
            reply.code(404);
            return { message: "Nursing clinical note not found" };
        }

        reply.code(200);
            return note;
    } catch (error) {
        console.error("Error in show:", error);
        reply.code(500);
            return { message: "Server error" };
    }
};

// Update nursing clinical note
export const update = async (request, reply) => {
    try {
        // Note: Validation should be done in route schema
        // Validation handled in route schema

        const { id } = request.params;
        const updatedData = request.body;

        const noteResult = await db.select().from(nursing_clinical_notes)
            .where(eq(nursing_clinical_notes.id, parseInt(id)))
            .limit(1);
        const note = noteResult[0];

        if (!note) {
            reply.code(404);
            return { message: "Nursing clinical note not found" };
        }

        const updatedNoteResult = await db.update(nursing_clinical_notes)
            .set(updatedData)
            .where(eq(nursing_clinical_notes.id, parseInt(id)))
            .returning();
        const updatedNote = updatedNoteResult[0];

        reply.code(200);
            return {
            message: "Nursing clinical note updated successfully",
            data: updatedNote,
        };
    } catch (error) {
        console.error("Error in update:", error);
        reply.code(500);
            return { message: "Server error" };
    }
};

// Generate PDF for nursing clinical note
export const generatePdf = async (request, reply) => {
    try {
        const { noteId } = request.params;
        
        // In a real implementation, we would generate a PDF using a library like pdfmake or puppeteer
        // For now, we'll return a simple success response
        
        reply.code(200);
            return {
            message: `PDF generation would be implemented here for note ID: ${noteId}`,
            note: 'In a real implementation, this would generate a PDF using a library like pdfmake or puppeteer'
        };
    } catch (error) {
        console.error("Error in generatePdf:", error);
        reply.code(500);
            return { message: "Server error" };
    }
};

// Start note for benefit period
export const startNote = async (request, reply) => {
    try {
        // Note: Validation should be done in route schema
        // Validation handled in route schema

        const { periodId } = request.params;
        const noteData = request.body;

        // Add benefit_period_id to the note data
        noteData.benefit_period_id = periodId;

        const noteResult = await db.insert(nursing_clinical_notes)
            .values(noteData)
            .returning();
        const note = noteResult[0];

        reply.code(201);
            return {
            message: "Nursing clinical note started successfully",
            data: note,
        };
    } catch (error) {
        console.error("Error in startNote:", error);
        reply.code(500);
            return { message: "Server error" };
    }
};

// Auto save vital signs
export const autoSaveVitalSigns = async (request, reply) => {
    try {
        // Note: Validation should be done in route schema
        // Validation handled in route schema

        const { noteId } = request.params;
        const validatedData = request.body;

        // Add note_id to the data
        validatedData.note_id = noteId;

        // Check if vital signs already exist for this note
        const existingVitalSigns = await db.select().from(vital_signs)
            .where(eq(vital_signs.note_id, parseInt(noteId)))
            .limit(1);
            
        let vitalSign;
        if (existingVitalSigns.length > 0) {
            // Update existing record
            const updatedVitalSigns = await db.update(vital_signs)
                .set(validatedData)
                .where(eq(vital_signs.note_id, parseInt(noteId)))
                .returning();
            vitalSign = updatedVitalSigns[0];
        } else {
            // Create new record
            const newVitalSigns = await db.insert(vital_signs)
                .values(validatedData)
                .returning();
            vitalSign = newVitalSigns[0];
        }

        reply.code(200);
            return vitalSign;
    } catch (error) {
        console.error("Error in autoSaveVitalSigns:", error);
        reply.code(500);
            return { message: "Server error" };
    }
};

// Get vital signs
export const getVitalSigns = async (request, reply) => {
    try {
        const { noteId } = request.params;
        const vitalSignsResult = await db.select().from(vital_signs)
            .where(eq(vital_signs.note_id, parseInt(noteId)))
            .limit(1);
        const vitalSigns = vitalSignsResult[0];

        if (vitalSigns) {
            reply.code(200);
            return vitalSigns;
        } else {
            reply.code(404);
            return {
                message: "No vital signs found for the given note ID.",
            };
        }
    } catch (error) {
        console.error("Error in getVitalSigns:", error);
        reply.code(500);
            return { message: "Server error" };
    }
};

// Index scale tool lab data
export const indexScaleToolLabData = async (request, reply) => {
    try {
        const { noteId } = request.params;
        const dataResult = await db.select().from(scale_tool_lab_data)
            .where(eq(scale_tool_lab_data.note_id, parseInt(noteId)))
            .limit(1);
        const data = dataResult[0];
        reply.code(200);
            return data;
    } catch (error) {
        console.error("Error in indexScaleToolLabData:", error);
        reply.code(500);
            return { message: "Server error" };
    }
};

// Auto save scale tool lab data
export const autoSaveScaleToolLabData = async (request, reply) => {
    try {
        // Note: Validation should be done in route schema
        // Validation handled in route schema

        const { noteId } = request.params;
        const validatedData = request.body;

        validatedData.note_id = noteId;

        // Check if scale tool lab data already exists for this note
        const existingData = await db.select().from(scale_tool_lab_data)
            .where(eq(scale_tool_lab_data.note_id, parseInt(noteId)))
            .limit(1);
            
        let scaleToolLabData;
        if (existingData.length > 0) {
            // Update existing record
            const updatedData = await db.update(scale_tool_lab_data)
                .set(validatedData)
                .where(eq(scale_tool_lab_data.note_id, parseInt(noteId)))
                .returning();
            scaleToolLabData = updatedData[0];
        } else {
            // Create new record
            const newData = await db.insert(scale_tool_lab_data)
                .values(validatedData)
                .returning();
            scaleToolLabData = newData[0];
        }

        reply.code(200);
            return scaleToolLabData;
    } catch (error) {
        console.error("Error in autoSaveScaleToolLabData:", error);
        reply.code(500);
            return { message: "Server error" };
    }
};

// Index pain data
export const indexPainData = async (request, reply) => {
    try {
        const { noteId } = request.params;
        const dataResult = await db.select().from(pain_data)
            .where(eq(pain_data.note_id, parseInt(noteId)))
            .limit(1);
        const data = dataResult[0];
        reply.code(200);
            return data;
    } catch (error) {
        console.error("Error in indexPainData:", error);
        reply.code(500);
            return { message: "Server error" };
    }
};

// Auto save pain data
export const autoSavePainData = async (request, reply) => {
    try {
        // Note: Validation should be done in route schema
        // Validation handled in route schema

        const { noteId } = request.params;
        const validatedData = request.body;

        validatedData.note_id = noteId;

        // Check if pain data already exists for this note
        const existingData = await db.select().from(pain_data)
            .where(eq(pain_data.note_id, parseInt(noteId)))
            .limit(1);
            
        let painData;
        if (existingData.length > 0) {
            // Update existing record
            const updatedData = await db.update(pain_data)
                .set(validatedData)
                .where(eq(pain_data.note_id, parseInt(noteId)))
                .returning();
            painData = updatedData[0];
        } else {
            // Create new record
            const newData = await db.insert(pain_data)
                .values(validatedData)
                .returning();
            painData = newData[0];
        }

        reply.code(200);
            return painData;
    } catch (error) {
        console.error("Error in autoSavePainData:", error);
        reply.code(500);
            return { message: "Server error" };
    }
};

// Index painad data
export const indexPainadData = async (request, reply) => {
    try {
        const { noteId } = request.params;
        const painadDataResult = await db.select().from(painad_data)
            .where(eq(painad_data.note_id, parseInt(noteId)))
            .limit(1);
        const painadData = painadDataResult[0];
        reply.code(200);
            return painadData;
    } catch (error) {
        console.error("Error in indexPainadData:", error);
        reply.code(500);
            return { message: "Server error" };
    }
};

// Auto save painad data
export const autoSavePainadData = async (request, reply) => {
    try {
        // Note: Validation should be done in route schema
        // Validation handled in route schema

        const { noteId } = request.params;
        const validatedData = request.body;

        validatedData.note_id = noteId;

        // Check if painad data already exists for this note
        const existingData = await db.select().from(painad_data)
            .where(eq(painad_data.note_id, parseInt(noteId)))
            .limit(1);
            
        let painadData;
        if (existingData.length > 0) {
            // Update existing record
            const updatedData = await db.update(painad_data)
                .set(validatedData)
                .where(eq(painad_data.note_id, parseInt(noteId)))
                .returning();
            painadData = updatedData[0];
        } else {
            // Create new record
            const newData = await db.insert(painad_data)
                .values(validatedData)
                .returning();
            painadData = newData[0];
        }

        reply.code(200);
            return painadData;
    } catch (error) {
        console.error("Error in autoSavePainadData:", error);
        reply.code(500);
            return { message: "Server error" };
    }
};

// Index flacc data
export const indexFlaccData = async (request, reply) => {
    try {
        const { noteId } = request.params;
        const flaccDataResult = await db.select().from(flacc_data)
            .where(eq(flacc_data.note_id, parseInt(noteId)))
            .limit(1);
        const flaccData = flaccDataResult[0];
        reply.code(200);
            return flaccData;
    } catch (error) {
        console.error("Error in indexFlaccData:", error);
        reply.code(500);
            return { message: "Server error" };
    }
};

// Auto save flacc data
export const autoSaveFlaccData = async (request, reply) => {
    try {
        // Note: Validation should be done in route schema
        // Validation handled in route schema

        const { noteId } = request.params;
        const validatedData = request.body;

        validatedData.note_id = noteId;

        // Check if flacc data already exists for this note
        const existingData = await db.select().from(flacc_data)
            .where(eq(flacc_data.note_id, parseInt(noteId)))
            .limit(1);
            
        let flaccData;
        if (existingData.length > 0) {
            // Update existing record
            const updatedData = await db.update(flacc_data)
                .set(validatedData)
                .where(eq(flacc_data.note_id, parseInt(noteId)))
                .returning();
            flaccData = updatedData[0];
        } else {
            // Create new record
            const newData = await db.insert(flacc_data)
                .values(validatedData)
                .returning();
            flaccData = newData[0];
        }

        reply.code(200);
            return flaccData;
    } catch (error) {
        console.error("Error in autoSaveFlaccData:", error);
        reply.code(500);
            return { message: "Server error" };
    }
};

// Index cardiovascular data
export const indexCardiovascularData = async (request, reply) => {
    try {
        const { noteId } = request.params;
        const dataResult = await db.select().from(cardiovascular_data)
            .where(eq(cardiovascular_data.note_id, parseInt(noteId)))
            .limit(1);
        const data = dataResult[0];
        reply.code(200);
            return data;
    } catch (error) {
        console.error("Error in indexCardiovascularData:", error);
        reply.code(500);
            return { message: "Server error" };
    }
};

// Auto save cardiovascular data
export const autoSaveCardiovascularData = async (request, reply) => {
    try {
        // Note: Validation should be done in route schema
        // Validation handled in route schema

        const { noteId } = request.params;
        const validatedData = request.body;

        validatedData.note_id = noteId;

        // Check if cardiovascular data already exists for this note
        const existingData = await db.select().from(cardiovascular_data)
            .where(eq(cardiovascular_data.note_id, parseInt(noteId)))
            .limit(1);
            
        let cardiovascularData;
        if (existingData.length > 0) {
            // Update existing record
            const updatedData = await db.update(cardiovascular_data)
                .set(validatedData)
                .where(eq(cardiovascular_data.note_id, parseInt(noteId)))
                .returning();
            cardiovascularData = updatedData[0];
        } else {
            // Create new record
            const newData = await db.insert(cardiovascular_data)
                .values(validatedData)
                .returning();
            cardiovascularData = newData[0];
        }

        reply.code(200);
            return cardiovascularData;
    } catch (error) {
        console.error("Error in autoSaveCardiovascularData:", error);
        reply.code(500);
            return { message: "Server error" };
    }
};

// Index respiratory data
export const indexRespiratoryData = async (request, reply) => {
    try {
        const { noteId } = request.params;
        const dataResult = await db.select().from(respiratory_data)
            .where(eq(respiratory_data.note_id, parseInt(noteId)))
            .limit(1);
        const data = dataResult[0];
        reply.code(200);
            return data;
    } catch (error) {
        console.error("Error in indexRespiratoryData:", error);
        reply.code(500);
            return { message: "Server error" };
    }
};

// Auto save respiratory data
export const autoSaveRespiratoryData = async (request, reply) => {
    try {
        // Note: Validation should be done in route schema
        // Validation handled in route schema

        const { noteId } = request.params;
        const validatedData = request.body;

        validatedData.note_id = noteId;

        // Check if respiratory data already exists for this note
        const existingData = await db.select().from(respiratory_data)
            .where(eq(respiratory_data.note_id, parseInt(noteId)))
            .limit(1);
            
        let respiratoryData;
        if (existingData.length > 0) {
            // Update existing record
            const updatedData = await db.update(respiratory_data)
                .set(validatedData)
                .where(eq(respiratory_data.note_id, parseInt(noteId)))
                .returning();
            respiratoryData = updatedData[0];
        } else {
            // Create new record
            const newData = await db.insert(respiratory_data)
                .values(validatedData)
                .returning();
            respiratoryData = newData[0];
        }

        reply.code(200);
            return respiratoryData;
    } catch (error) {
        console.error("Error in autoSaveRespiratoryData:", error);
        reply.code(500);
            return { message: "Server error" };
    }
};

// Index genitourinary data
export const indexGenitourinaryData = async (request, reply) => {
    try {
        const { noteId } = request.params;
        const dataResult = await db.select().from(genitourinary_data)
            .where(eq(genitourinary_data.note_id, parseInt(noteId)))
            .limit(1);
        const data = dataResult[0];
        reply.code(200);
            return data;
    } catch (error) {
        console.error("Error in indexGenitourinaryData:", error);
        reply.code(500);
            return { message: "Server error" };
    }
};

// Auto save genitourinary data
export const autoSaveGenitourinaryData = async (request, reply) => {
    try {
        // Note: Validation should be done in route schema
        // Validation handled in route schema

        const { noteId } = request.params;
        const validatedData = request.body;

        validatedData.note_id = noteId;

        // Check if genitourinary data already exists for this note
        const existingData = await db.select().from(genitourinary_data)
            .where(eq(genitourinary_data.note_id, parseInt(noteId)))
            .limit(1);
            
        let genitourinaryData;
        if (existingData.length > 0) {
            // Update existing record
            const updatedData = await db.update(genitourinary_data)
                .set(validatedData)
                .where(eq(genitourinary_data.note_id, parseInt(noteId)))
                .returning();
            genitourinaryData = updatedData[0];
        } else {
            // Create new record
            const newData = await db.insert(genitourinary_data)
                .values(validatedData)
                .returning();
            genitourinaryData = newData[0];
        }

        reply.code(200);
            return genitourinaryData;
    } catch (error) {
        console.error("Error in autoSaveGenitourinaryData:", error);
        reply.code(500);
            return { message: "Server error" };
    }
};

// Index gastrointestinal data
export const indexGastrointestinalData = async (request, reply) => {
    try {
        const { noteId } = request.params;
        const dataResult = await db.select().from(gastrointestinal_data)
            .where(eq(gastrointestinal_data.note_id, parseInt(noteId)))
            .limit(1);
        const data = dataResult[0];
        reply.code(200);
            return data;
    } catch (error) {
        console.error("Error in indexGastrointestinalData:", error);
        reply.code(500);
            return { message: "Server error" };
    }
};

// Auto save gastrointestinal data
export const autoSaveGastrointestinalData = async (request, reply) => {
    try {
        // Note: Validation should be done in route schema
        // Validation handled in route schema

        const { noteId } = request.params;
        const validatedData = request.body;

        validatedData.note_id = noteId;

        // Check if gastrointestinal data already exists for this note
        const existingData = await db.select().from(gastrointestinal_data)
            .where(eq(gastrointestinal_data.note_id, parseInt(noteId)))
            .limit(1);
            
        let gastrointestinalData;
        if (existingData.length > 0) {
            // Update existing record
            const updatedData = await db.update(gastrointestinal_data)
                .set(validatedData)
                .where(eq(gastrointestinal_data.note_id, parseInt(noteId)))
                .returning();
            gastrointestinalData = updatedData[0];
        } else {
            // Create new record
            const newData = await db.insert(gastrointestinal_data)
                .values(validatedData)
                .returning();
            gastrointestinalData = newData[0];
        }

        reply.code(200);
            return gastrointestinalData;
    } catch (error) {
        console.error("Error in autoSaveGastrointestinalData:", error);
        reply.code(500);
            return { message: "Server error" };
    }
};