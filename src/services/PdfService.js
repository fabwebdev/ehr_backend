import pdfMake from 'pdfmake/build/pdfmake.js';
import vfsFonts from 'pdfmake/build/vfs_fonts.js';

// Initialize pdfMake with fonts
const { vfs } = vfsFonts;
pdfMake.vfs = vfs;

class PdfService {
    /**
     * Generate a PDF document
     * @param {Object} docDefinition - PDF document definition
     * @param {String} filename - Name of the file to generate
     * @return {Promise<Buffer>} - PDF as buffer
     */
    async generatePdf(docDefinition, filename = 'document.pdf') {
        try {
            // Create PDF document
            const pdfDoc = pdfMake.createPdf(docDefinition);
            
            // Return promise that resolves with PDF buffer
            return new Promise((resolve, reject) => {
                pdfDoc.getBuffer((buffer) => {
                    if (buffer) {
                        resolve(buffer);
                    } else {
                        reject(new Error('Failed to generate PDF'));
                    }
                });
            });
        } catch (error) {
            throw new Error(`PDF generation failed: ${error.message}`);
        }
    }

    /**
     * Generate a patient chart PDF
     * @param {Object} patientData - Patient data to include in PDF
     * @return {Promise<Buffer>} - PDF as buffer
     */
    async generatePatientChartPdf(patientData) {
        const docDefinition = {
            content: [
                {
                    text: 'Patient Chart',
                    style: 'header'
                },
                {
                    text: `Patient: ${patientData.firstName} ${patientData.lastName}`,
                    style: 'subheader'
                },
                {
                    text: `DOB: ${patientData.dateOfBirth}`,
                    style: 'subheader'
                },
                // Add more patient information here
                {
                    text: 'Benefit Periods:',
                    style: 'subheader'
                },
                // Add benefit periods data
                {
                    text: 'Clinical Notes:',
                    style: 'subheader'
                }
                // Add clinical notes data
            ],
            styles: {
                header: {
                    fontSize: 22,
                    bold: true,
                    margin: [0, 0, 0, 10]
                },
                subheader: {
                    fontSize: 16,
                    bold: true,
                    margin: [0, 10, 0, 5]
                },
                tableHeader: {
                    bold: true,
                    fontSize: 13,
                    color: 'black'
                }
            },
            defaultStyle: {
                fontSize: 12
            }
        };

        return await this.generatePdf(docDefinition, `patient-chart-${patientData.id}.pdf`);
    }

    /**
     * Generate a HIS (Health Information System) PDF
     * @param {Object} hisData - HIS data to include in PDF
     * @return {Promise<Buffer>} - PDF as buffer
     */
    async generateHisPdf(hisData) {
        const docDefinition = {
            content: [
                {
                    text: 'Health Information System Report',
                    style: 'header'
                },
                {
                    text: 'Visit Information',
                    style: 'subheader'
                },
                {
                    table: {
                        headerRows: 1,
                        widths: ['*', '*'],
                        body: [
                            ['Field', 'Value'],
                            ['Visit Date', hisData.visitDate || ''],
                            ['Visit Time In', hisData.visitTimeIn || ''],
                            ['Visit Time Out', hisData.visitTimeOut || ''],
                            ['Travel Time In', hisData.travelTimeIn || ''],
                            ['Travel Time Out', hisData.travelTimeOut || ''],
                            ['Documentation Time', hisData.documentationTime || ''],
                            ['Associated Mileage', hisData.associatedMileage || ''],
                            ['Surcharge', hisData.surcharge || '']
                        ]
                    }
                },
                {
                    text: 'Demographics',
                    style: 'subheader',
                    pageBreak: 'before'
                },
                {
                    table: {
                        headerRows: 1,
                        widths: ['*', '*'],
                        body: [
                            ['Field', 'Value'],
                            ['First Name', hisData.firstName || ''],
                            ['MI', hisData.mi || ''],
                            ['Last Name', hisData.lastName || ''],
                            ['Suffix', hisData.suffix || ''],
                            ['Date of Birth', hisData.dateOfBirth || ''],
                            ['Gender', hisData.gender || ''],
                            ['Marital Status', hisData.maritalStatus || ''],
                            ['Race/Ethnicity', hisData.raceEthnicity || ''],
                            ['Address Line 1', hisData.addressLine1 || ''],
                            ['Address Line 2', hisData.addressLine2 || ''],
                            ['City', hisData.city || ''],
                            ['State', hisData.state || ''],
                            ['ZIP Code', hisData.zipCode || ''],
                            ['Primary Phone', hisData.primaryPhone || ''],
                            ['Alternate Phone', hisData.alternatePhone || '']
                        ]
                    }
                }
                // Add more sections as needed
            ],
            styles: {
                header: {
                    fontSize: 22,
                    bold: true,
                    margin: [0, 0, 0, 10]
                },
                subheader: {
                    fontSize: 18,
                    bold: true,
                    margin: [0, 20, 0, 10]
                },
                tableHeader: {
                    bold: true,
                    fontSize: 13,
                    color: 'black'
                }
            },
            defaultStyle: {
                fontSize: 12
            }
        };

        return await this.generatePdf(docDefinition, 'his-report.pdf');
    }
}

export default new PdfService();