
import { supabase } from '@/integrations/supabase/client';

export interface MLAnalysisResult {
  woundClassification: string;
  confidenceScore: number;
  symptomDescription: string;
  homeRemedies: string[];
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    precautions: string;
  }[];
  urgencyLevel: 'low' | 'medium' | 'high';
  aiSummary: string;
}

// Simulated ML model classifications (replace with actual ML model)
const WOUND_CLASSIFICATIONS = [
  'Minor Cut/Laceration',
  'Bruise/Contusion',
  'Burn (1st/2nd degree)',
  'Skin Rash/Dermatitis',
  'Insect Bite/Sting',
  'Abrasion/Scrape',
  'Fungal Infection',
  'Bacterial Infection',
  'Allergic Reaction',
  'Acne/Pimple'
];

const REMEDIES_DATABASE = {
  'Minor Cut/Laceration': {
    homeRemedies: [
      'Clean the wound with clean water',
      'Apply pressure to stop bleeding',
      'Use aloe vera gel for healing',
      'Keep the wound covered with a clean bandage'
    ],
    medications: [
      {
        name: 'Antibiotic Ointment (Neosporin)',
        dosage: 'Apply thin layer',
        frequency: '2-3 times daily',
        precautions: 'Clean wound before application. Watch for allergic reactions.'
      }
    ],
    urgencyLevel: 'low' as const
  },
  'Skin Rash/Dermatitis': {
    homeRemedies: [
      'Apply cool compress for 10-15 minutes',
      'Use aloe vera gel for soothing effect',
      'Keep the area clean and dry',
      'Avoid scratching or rubbing the area'
    ],
    medications: [
      {
        name: 'Hydrocortisone Cream 1%',
        dosage: 'Apply thin layer',
        frequency: '2-3 times daily',
        precautions: 'For external use only. Discontinue if irritation worsens.'
      }
    ],
    urgencyLevel: 'low' as const
  },
  'Burn (1st/2nd degree)': {
    homeRemedies: [
      'Cool the burn with cold running water for 10-20 minutes',
      'Apply aloe vera gel',
      'Cover with sterile gauze',
      'Take over-the-counter pain relievers'
    ],
    medications: [
      {
        name: 'Ibuprofen',
        dosage: '200-400mg',
        frequency: 'Every 6-8 hours as needed',
        precautions: 'Take with food. Do not exceed maximum daily dose.'
      }
    ],
    urgencyLevel: 'medium' as const
  }
};

export const analyzeSymptomImage = async (file: File): Promise<MLAnalysisResult> => {
  // Simulate ML processing time
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Simulate CNN classification (replace with actual ML model API call)
  const randomClassification = WOUND_CLASSIFICATIONS[Math.floor(Math.random() * WOUND_CLASSIFICATIONS.length)];
  const confidenceScore = Math.random() * 0.3 + 0.7; // 70-100% confidence

  // Get remedy data or use default
  const remedyData = REMEDIES_DATABASE[randomClassification as keyof typeof REMEDIES_DATABASE] || {
    homeRemedies: ['Keep area clean', 'Monitor for changes', 'Consult healthcare provider if worsens'],
    medications: [{
      name: 'Over-the-counter pain reliever',
      dosage: 'As directed on package',
      frequency: 'As needed',
      precautions: 'Follow package instructions'
    }],
    urgencyLevel: 'low' as const
  };

  return {
    woundClassification: randomClassification,
    confidenceScore: Math.round(confidenceScore * 10000) / 10000,
    symptomDescription: `Analysis indicates a ${randomClassification.toLowerCase()} with ${Math.round(confidenceScore * 100)}% confidence. ${getSymptomDescription(randomClassification)}`,
    homeRemedies: remedyData.homeRemedies,
    medications: remedyData.medications,
    urgencyLevel: remedyData.urgencyLevel,
    aiSummary: generateAISummary(randomClassification, remedyData.urgencyLevel)
  };
};

const getSymptomDescription = (classification: string): string => {
  const descriptions = {
    'Minor Cut/Laceration': 'The image shows evidence of a small break in the skin with minimal bleeding.',
    'Skin Rash/Dermatitis': 'The affected area shows signs of inflammation and irritation consistent with dermatitis.',
    'Burn (1st/2nd degree)': 'The image indicates thermal damage to the skin with visible redness and possible blistering.',
    'Bruise/Contusion': 'Discoloration and swelling consistent with blunt force trauma.',
    'Insect Bite/Sting': 'Localized swelling and redness typical of an insect bite reaction.',
  };
  
  return descriptions[classification as keyof typeof descriptions] || 'The condition requires further evaluation.';
};

const generateAISummary = (classification: string, urgency: string): string => {
  const urgencyText = urgency === 'high' ? 'requires immediate attention' : 
                     urgency === 'medium' ? 'should be monitored closely' : 'can typically be managed at home';
  
  return `Based on image analysis, this appears to be a ${classification.toLowerCase()} that ${urgencyText}. The recommended treatment approach includes both home remedies and appropriate medications. Monitor for any worsening symptoms and seek professional medical advice if the condition does not improve or if you have concerns about your symptoms.`;
};

export const uploadImageToStorage = async (file: File, userId: string): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('symptom-images')
    .upload(fileName, file);

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('symptom-images')
    .getPublicUrl(fileName);

  return publicUrl;
};

export const saveScanToDatabase = async (
  userId: string,
  imageUrl: string,
  analysisResult: MLAnalysisResult
) => {
  const { data, error } = await supabase
    .from('symptom_scans')
    .insert({
      user_id: userId,
      image_url: imageUrl,
      symptom_description: analysisResult.symptomDescription,
      wound_classification: analysisResult.woundClassification,
      confidence_score: analysisResult.confidenceScore,
      home_remedies: analysisResult.homeRemedies,
      medications: analysisResult.medications,
      ai_analysis: {
        summary: analysisResult.aiSummary,
        classification: analysisResult.woundClassification,
        confidence: analysisResult.confidenceScore
      },
      remedy_suggestion: analysisResult.homeRemedies.join('. '),
      urgency_level: analysisResult.urgencyLevel
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};
