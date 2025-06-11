
interface ScanData {
  id: string;
  image_url: string;
  symptom_description: string | null;
  wound_classification: string | null;
  confidence_score: number | null;
  home_remedies: any;
  medications: any;
  ai_analysis: any;
  urgency_level: string | null;
  created_at: string;
}

export const generatePDFReport = (scanData: ScanData): void => {
  // Create a simple HTML content for PDF generation
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Medical Scan Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; color: #2563eb; margin-bottom: 30px; }
        .section { margin-bottom: 20px; }
        .urgency { padding: 10px; border-radius: 5px; font-weight: bold; }
        .urgency.low { background-color: #dcfce7; color: #166534; }
        .urgency.medium { background-color: #fef3c7; color: #92400e; }
        .urgency.high { background-color: #fee2e2; color: #dc2626; }
        .remedy-list { list-style-type: disc; margin-left: 20px; }
        .medication { background-color: #f8fafc; padding: 10px; margin: 10px 0; border-left: 4px solid #2563eb; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Medical Scan Analysis Report</h1>
        <p>Generated on: ${new Date().toLocaleDateString()}</p>
      </div>
      
      <div class="section">
        <h3>Scan Information</h3>
        <p><strong>Scan Date:</strong> ${new Date(scanData.created_at).toLocaleDateString()}</p>
        <p><strong>Classification:</strong> ${scanData.wound_classification || 'Not classified'}</p>
        <p><strong>Confidence Score:</strong> ${scanData.confidence_score ? Math.round(scanData.confidence_score * 100) + '%' : 'N/A'}</p>
        <div class="urgency ${scanData.urgency_level || 'low'}">
          Urgency Level: ${(scanData.urgency_level || 'low').toUpperCase()}
        </div>
      </div>

      <div class="section">
        <h3>Symptom Description</h3>
        <p>${scanData.symptom_description || 'No description available'}</p>
      </div>

      <div class="section">
        <h3>Home Remedies</h3>
        <ul class="remedy-list">
          ${scanData.home_remedies ? scanData.home_remedies.map((remedy: string) => `<li>${remedy}</li>`).join('') : '<li>No specific remedies suggested</li>'}
        </ul>
      </div>

      <div class="section">
        <h3>Suggested Medications</h3>
        ${scanData.medications ? scanData.medications.map((med: any) => `
          <div class="medication">
            <h4>${med.name}</h4>
            <p><strong>Dosage:</strong> ${med.dosage}</p>
            <p><strong>Frequency:</strong> ${med.frequency}</p>
            <p><strong>Precautions:</strong> ${med.precautions}</p>
          </div>
        `).join('') : '<p>No specific medications recommended</p>'}
      </div>

      <div class="section">
        <h3>AI Analysis Summary</h3>
        <p>${scanData.ai_analysis?.summary || 'No analysis summary available'}</p>
      </div>

      <div class="section">
        <p><strong>Disclaimer:</strong> This is an AI-generated analysis for informational purposes only. Always consult with healthcare professionals for proper medical advice and treatment.</p>
      </div>
    </body>
    </html>
  `;

  // Create a new window with the HTML content and trigger print
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  }
};
