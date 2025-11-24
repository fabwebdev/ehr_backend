import ExcelJS from 'exceljs';

class ExcelService {
    /**
     * Generate an Excel workbook
     * @param {Array} worksheets - Array of worksheet configurations
     * @param {String} filename - Name of the file to generate
     * @return {Promise<Buffer>} - Excel file as buffer
     */
    async generateExcel(worksheets, filename = 'document.xlsx') {
        try {
            // Create a new workbook
            const workbook = new ExcelJS.Workbook();
            
            // Add worksheets
            worksheets.forEach(wsConfig => {
                const worksheet = workbook.addWorksheet(wsConfig.name || 'Sheet1');
                
                // Add columns if provided
                if (wsConfig.columns) {
                    worksheet.columns = wsConfig.columns;
                }
                
                // Add rows if provided
                if (wsConfig.rows) {
                    wsConfig.rows.forEach(row => {
                        worksheet.addRow(row);
                    });
                }
                
                // Add data if provided
                if (wsConfig.data) {
                    worksheet.addRows(wsConfig.data);
                }
                
                // Apply styles if provided
                if (wsConfig.styles) {
                    Object.keys(wsConfig.styles).forEach(cellRef => {
                        const cell = worksheet.getCell(cellRef);
                        Object.assign(cell, wsConfig.styles[cellRef]);
                    });
                }
            });
            
            // Generate buffer
            const buffer = await workbook.xlsx.writeBuffer();
            return buffer;
        } catch (error) {
            throw new Error(`Excel generation failed: ${error.message}`);
        }
    }

    /**
     * Generate a patient data Excel report
     * @param {Array} patients - Array of patient data
     * @return {Promise<Buffer>} - Excel file as buffer
     */
    async generatePatientReport(patients) {
        const worksheets = [
            {
                name: 'Patients',
                columns: [
                    { header: 'ID', key: 'id', width: 10 },
                    { header: 'First Name', key: 'firstName', width: 20 },
                    { header: 'Last Name', key: 'lastName', width: 20 },
                    { header: 'Date of Birth', key: 'dateOfBirth', width: 15 },
                    { header: 'Gender', key: 'gender', width: 10 },
                    { header: 'Email', key: 'email', width: 30 }
                ],
                data: patients.map(patient => [
                    patient.id,
                    patient.firstName,
                    patient.lastName,
                    patient.dateOfBirth,
                    patient.gender,
                    patient.email
                ])
            }
        ];

        return await this.generateExcel(worksheets, 'patient-report.xlsx');
    }
    

    /**
     * Generate a clinical notes Excel report
     * @param {Array} notes - Array of clinical note data
     * @return {Promise<Buffer>} - Excel file as buffer
     */
    async generateClinicalNotesReport(notes) {
        const worksheets = [
            {
                name: 'Clinical Notes',
                columns: [
                    { header: 'ID', key: 'id', width: 10 },
                    { header: 'Patient ID', key: 'patientId', width: 15 },
                    { header: 'Date', key: 'date', width: 15 },
                    { header: 'Note', key: 'note', width: 50 },
                    { header: 'Created At', key: 'createdAt', width: 20 }
                ],
                data: notes.map(note => [
                    note.id,
                    note.patientId,
                    note.date,
                    note.note,
                    note.createdAt
                ])
            }
        ];

        return await this.generateExcel(worksheets, 'clinical-notes-report.xlsx');
    }
}

export default new ExcelService();