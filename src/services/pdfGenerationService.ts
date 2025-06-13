
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
  // Create a comprehensive HTML content for PDF generation
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>AI Medical Analysis Report</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          margin: 20px; 
          color: #333;
          line-height: 1.6;
        }
        .header { 
          text-align: center; 
          color: #2563eb; 
          margin-bottom: 30px; 
          border-bottom: 3px solid #2563eb;
          padding-bottom: 20px;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
        }
        .header p {
          margin: 5px 0;
          font-size: 14px;
          color: #666;
        }
        .section { 
          margin-bottom: 25px; 
          padding: 15px;
          border-left: 4px solid #2563eb;
          background-color: #f8fafc;
        }
        .section h3 {
          margin-top: 0;
          color: #1e40af;
          font-size: 18px;
        }
        .urgency { 
          padding: 12px; 
          border-radius: 8px; 
          font-weight: bold; 
          margin: 15px 0;
          text-align: center;
        }
        .urgency.low { 
          background-color: #dcfce7; 
          color: #166534; 
          border: 2px solid #22c55e;
        }
        .urgency.medium { 
          background-color: #fef3c7; 
          color: #92400e; 
          border: 2px solid #f59e0b;
        }
        .urgency.high { 
          background-color: #fee2e2; 
          color: #dc2626; 
          border: 2px solid #ef4444;
        }
        .remedy-list { 
          list-style-type: none; 
          padding-left: 0;
        }
        .remedy-list li {
          margin: 8px 0;
          padding: 8px;
          background-color: #f0f9ff;
          border-left: 3px solid #0ea5e9;
          border-radius: 4px;
        }
        .remedy-list li:before {
          content: "✓ ";
          color: #059669;
          font-weight: bold;
          margin-right: 8px;
        }
        .medication { 
          background-color: #fff7ed; 
          padding: 15px; 
          margin: 12px 0; 
          border-left: 4px solid #ea580c;
          border-radius: 6px;
        }
        .medication h4 {
          margin: 0 0 10px 0;
          color: #ea580c;
          font-size: 16px;
        }
        .medication-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 10px;
        }
        .confidence-score {
          background-color: #eff6ff;
          padding: 10px;
          border-radius: 6px;
          text-align: center;
          font-size: 18px;
          font-weight: bold;
          color: #1d4ed8;
        }
        .analysis-summary {
          background-color: #f0fdf4;
          padding: 15px;
          border-radius: 8px;
          border: 1px solid #bbf7d0;
        }
        .disclaimer {
          background-color: #fef2f2;
          padding: 15px;
          border-radius: 8px;
          border: 1px solid #fecaca;
          margin-top: 20px;
        }
        .disclaimer strong {
          color: #dc2626;
        }
        .image-analysis {
          text-align: center;
          margin: 20px 0;
          padding: 15px;
          background-color: #f8fafc;
          border-radius: 8px;
        }
        .detailed-analysis {
          background-color: #fefce8;
          padding: 15px;
          border-radius: 8px;
          border: 1px solid #fde047;
        }
        .detailed-analysis h4 {
          color: #a16207;
          margin-top: 0;
        }
        .warning-signs {
          background-color: #fef2f2;
          padding: 12px;
          border-radius: 6px;
          border-left: 4px solid #ef4444;
          margin-top: 10px;
        }
        .warning-signs ul {
          margin: 5px 0;
          padding-left: 20px;
        }
        .warning-signs li {
          color: #dc2626;
          margin: 5px 0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>AI Medical Analysis Report</h1>
        <p>Advanced CNN-Based Wound Classification & Analysis</p>
        <p>Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
        <p>Report ID: ${scanData.id}</p>
      </div>
      
      <div class="section">
        <h3>Scan Information</h3>
        <p><strong>Analysis Date:</strong> ${new Date(scanData.created_at).toLocaleDateString()}</p>
        <p><strong>ML Classification:</strong> ${scanData.wound_classification || 'Not classified'}</p>
        <div class="confidence-score">
          AI Confidence Score: ${scanData.confidence_score ? Math.round(scanData.confidence_score * 100) + '%' : 'N/A'}
        </div>
        <div class="urgency ${scanData.urgency_level || 'low'}">
          Urgency Level: ${(scanData.urgency_level || 'low').toUpperCase()}
        </div>
      </div>

      <div class="section">
        <h3>CNN Analysis Results</h3>
        <div class="analysis-summary">
          <p>${scanData.symptom_description || 'No description available'}</p>
        </div>
      </div>

      ${scanData.ai_analysis?.detailedAnalysis ? `
        <div class="section">
          <h3>Detailed Medical Analysis</h3>
          <div class="detailed-analysis">
            <h4>Skin Condition Assessment</h4>
            <p>${scanData.ai_analysis.detailedAnalysis.skinCondition}</p>
            
            <h4>Possible Causes</h4>
            <ul>
              ${scanData.ai_analysis.detailedAnalysis.possibleCauses?.map((cause: string) => `<li>${cause}</li>`).join('') || '<li>Various factors may contribute</li>'}
            </ul>
            
            <h4>Expected Healing Timeline</h4>
            <p>${scanData.ai_analysis.detailedAnalysis.expectedHealingTime}</p>
          </div>
          
          <div class="warning-signs">
            <h4>⚠️ Warning Signs to Watch For</h4>
            <ul>
              ${scanData.ai_analysis.detailedAnalysis.warningSignsNotes?.map((sign: string) => `<li>${sign}</li>`).join('') || '<li>Monitor for worsening symptoms</li>'}
            </ul>
          </div>
        </div>
      ` : ''}

      <div class="section">
        <h3>Evidence-Based Home Remedies</h3>
        <ul class="remedy-list">
          ${scanData.home_remedies ? scanData.home_remedies.map((remedy: string) => `<li>${remedy}</li>`).join('') : '<li>No specific remedies suggested</li>'}
        </ul>
      </div>

      <div class="section">
        <h3>Recommended Medications</h3>
        ${scanData.medications ? scanData.medications.map((med: any) => `
          <div class="medication">
            <h4>${med.name}</h4>
            <div class="medication-details">
              <div><strong>Dosage:</strong> ${med.dosage}</div>
              <div><strong>Frequency:</strong> ${med.frequency}</div>
            </div>
            <p><strong>Important Precautions:</strong> ${med.precautions}</p>
          </div>
        `).join('') : '<p>No specific medications recommended at this time</p>'}
      </div>

      <div class="section">
        <h3>AI Analysis Summary</h3>
        <div class="analysis-summary">
          <p>${scanData.ai_analysis?.summary || 'No analysis summary available'}</p>
        </div>
      </div>

      <div class="disclaimer">
        <p><strong>⚠️ Important Medical Disclaimer:</strong></p>
        <p>This report is generated by an AI system using advanced computer vision and machine learning algorithms. While our CNN models are trained on extensive medical datasets, this analysis is for <strong>informational purposes only</strong> and should not replace professional medical diagnosis or treatment.</p>
        <ul>
          <li>Always consult with qualified healthcare professionals for proper medical advice</li>
          <li>Seek immediate medical attention if you experience severe symptoms</li>
          <li>This AI analysis has a confidence score of ${scanData.confidence_score ? Math.round(scanData.confidence_score * 100) + '%' : 'N/A'} and may not be 100% accurate</li>
          <li>Individual cases may vary significantly from AI predictions</li>
        </ul>
      </div>

      <div style="margin-top: 30px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #e5e7eb; padding-top: 15px;">
        <p>This report was generated by MedxoAI Advanced Diagnostic System</p>
        <p>For medical emergencies, call your local emergency services immediately</p>
      </div>
    </body>
    </html>
  `;

  // Create a new window with the HTML content and trigger print
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load before printing
    printWindow.onload = () => {
      printWindow.print();
    };
  }
};
