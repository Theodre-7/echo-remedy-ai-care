
import { supabase } from '@/integrations/supabase/client';

export interface HealthDataExport {
  scanHistory: any[];
  journalEntries: any[];
  userProfile: any;
  exportDate: string;
}

export const exportHealthData = async (userId: string) => {
  try {
    // Fetch scan history
    const { data: scanHistory, error: scanError } = await supabase
      .from('symptom_scans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (scanError) throw scanError;

    // Fetch journal entries
    const { data: journalEntries, error: journalError } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (journalError) throw journalError;

    // Fetch user profile
    const { data: userProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) throw profileError;

    const healthData: HealthDataExport = {
      scanHistory: scanHistory || [],
      journalEntries: journalEntries || [],
      userProfile: userProfile || {},
      exportDate: new Date().toISOString()
    };

    return healthData;
  } catch (error) {
    console.error('Error exporting health data:', error);
    throw error;
  }
};

export const downloadHealthDataAsJSON = (healthData: HealthDataExport, fileName?: string) => {
  const dataStr = JSON.stringify(healthData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName || `health-data-export-${new Date().toISOString().split('T')[0]}.json`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

export const generateHealthReport = (healthData: HealthDataExport): string => {
  const { scanHistory, journalEntries, userProfile, exportDate } = healthData;
  
  let report = `
# EchoRemedy Health Data Report
**Export Date:** ${new Date(exportDate).toLocaleDateString()}
**User:** ${userProfile.full_name || userProfile.email || 'Unknown'}

## Summary
- **Total Scans:** ${scanHistory.length}
- **Journal Entries:** ${journalEntries.length}
- **Account Created:** ${new Date(userProfile.created_at).toLocaleDateString()}

## Scan History (${scanHistory.length} records)
`;

  scanHistory.forEach((scan, index) => {
    report += `
### Scan #${index + 1} - ${new Date(scan.created_at).toLocaleDateString()}
- **Classification:** ${scan.wound_classification || 'Not classified'}
- **Confidence Score:** ${scan.confidence_score ? Math.round(scan.confidence_score * 100) + '%' : 'N/A'}
- **Urgency Level:** ${scan.urgency_level || 'Unknown'}
- **Description:** ${scan.symptom_description || 'No description'}
`;

    if (scan.home_remedies && scan.home_remedies.length > 0) {
      report += `- **Home Remedies:**\n`;
      scan.home_remedies.forEach((remedy: string) => {
        report += `  - ${remedy}\n`;
      });
    }

    if (scan.medications && scan.medications.length > 0) {
      report += `- **Medications:**\n`;
      scan.medications.forEach((med: any) => {
        report += `  - ${med.name}: ${med.dosage} (${med.frequency})\n`;
      });
    }
  });

  report += `
## Journal Entries (${journalEntries.length} records)
`;

  journalEntries.forEach((entry, index) => {
    report += `
### Entry #${index + 1} - ${new Date(entry.created_at).toLocaleDateString()}
- **Mood:** ${entry.mood}
- **Severity:** ${entry.severity}/10
- **Symptoms:** ${entry.symptoms}
- **Notes:** ${entry.notes || 'None'}
`;
  });

  return report;
};

export const downloadHealthReportAsText = (healthData: HealthDataExport, fileName?: string) => {
  const report = generateHealthReport(healthData);
  const dataBlob = new Blob([report], { type: 'text/plain' });
  
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName || `health-report-${new Date().toISOString().split('T')[0]}.txt`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};
