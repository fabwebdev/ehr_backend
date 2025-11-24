import PdfService from '../../services/PdfService.js';

export const generatePdf = async (request, reply) => {
    try {
        console.log('API generate-pdf called');
        
        // Generate HIS PDF using our PDF service
        const hisData = {
            visitDate: new Date().toISOString().split('T')[0],
            visitTimeIn: '',
            visitTimeOut: '',
            travelTimeIn: '',
            travelTimeOut: '',
            documentationTime: '',
            associatedMileage: '',
            surcharge: '',
            firstName: '',
            mi: '',
            lastName: '',
            suffix: '',
            dateOfBirth: '',
            gender: '',
            maritalStatus: '',
            raceEthnicity: '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            zipCode: '',
            primaryPhone: '',
            alternatePhone: ''
        };
        
        const pdfBuffer = await PdfService.generateHisPdf(hisData);
        
        // Set headers for PDF download
        reply.header('Content-Type', 'application/pdf');
        reply.header('Content-Disposition', 'attachment; filename=his-report.pdf');
        
        // Send PDF buffer
        reply.code(200);
        return pdfBuffer;
    } catch (error) {
        console.error('Error generating PDF:', error);
        reply.code(500);
            return { error: 'Error generating PDF', message: error.message };
    }
};