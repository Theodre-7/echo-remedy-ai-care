
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Camera, FileImage, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AnalysisResult {
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

const Scan = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "File too large",
        description: "Please select an image smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    
    // Simulate AI analysis (replace with actual API call)
    setTimeout(() => {
      const mockResult: AnalysisResult = {
        symptomDescription: "Appears to be a minor skin irritation or rash with slight redness and inflammation",
        homeRemedies: [
          "Apply cool compress for 10-15 minutes",
          "Use aloe vera gel for soothing effect",
          "Keep the area clean and dry",
          "Avoid scratching or rubbing the area"
        ],
        medications: [
          {
            name: "Hydrocortisone Cream 1%",
            dosage: "Apply thin layer",
            frequency: "2-3 times daily",
            precautions: "For external use only. Discontinue if irritation worsens."
          },
          {
            name: "Oral Antihistamine (Benadryl)",
            dosage: "25mg",
            frequency: "As needed for itching",
            precautions: "May cause drowsiness. Consult doctor if pregnant."
          }
        ],
        urgencyLevel: 'low',
        aiSummary: "Based on the image analysis, this appears to be a minor skin condition that can typically be managed with over-the-counter treatments and home remedies. The affected area shows mild inflammation without signs of severe infection or concerning features. Monitor for any worsening symptoms such as increased redness, swelling, or pus formation."
      };

      setAnalysisResult(mockResult);
      setIsAnalyzing(false);
      
      toast({
        title: "Analysis Complete",
        description: "Your symptom has been analyzed successfully",
      });
    }, 3000);
  };

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-success text-success-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'high': return 'bg-danger text-danger-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getUrgencyIcon = (level: string) => {
    switch (level) {
      case 'low': return <CheckCircle className="w-4 h-4" />;
      case 'medium': return <Clock className="w-4 h-4" />;
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      default: return null;
    }
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation userType="user" userName={user?.user_metadata?.full_name || user?.email} />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Symptom Scanner
          </h1>
          <p className="text-gray-600">
            Upload a clear photo of your symptom for AI-powered analysis and remedy suggestions.
          </p>
        </div>

        {!analysisResult ? (
          <div className="space-y-6">
            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Upload Symptom Image
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!selectedFile ? (
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-primary transition-colors cursor-pointer"
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => document.getElementById('file-input')?.click()}
                  >
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">
                      Drag and drop an image here, or click to select
                    </p>
                    <p className="text-sm text-gray-500">
                      Supports JPG, PNG, WebP (max 10MB)
                    </p>
                    <input
                      id="file-input"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative">
                      <img
                        src={previewUrl!}
                        alt="Selected symptom"
                        className="max-h-64 mx-auto rounded-lg shadow-md"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setSelectedFile(null);
                          setPreviewUrl(null);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                    <div className="text-center">
                      <Button
                        onClick={analyzeImage}
                        disabled={isAnalyzing}
                        className="bg-primary hover:bg-primary/90"
                        size="lg"
                      >
                        {isAnalyzing ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <FileImage className="w-4 h-4 mr-2" />
                            Analyze Image
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Analysis Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Analysis Results
                  <Badge className={getUrgencyColor(analysisResult.urgencyLevel)}>
                    {getUrgencyIcon(analysisResult.urgencyLevel)}
                    {analysisResult.urgencyLevel.toUpperCase()} URGENCY
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Symptom Description */}
                <div>
                  <h3 className="font-semibold text-lg mb-2">Symptom Analysis</h3>
                  <p className="text-gray-700">{analysisResult.symptomDescription}</p>
                </div>

                {/* Home Remedies */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Home Remedies</h3>
                  <ul className="space-y-2">
                    {analysisResult.homeRemedies.map((remedy, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{remedy}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Medications */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Suggested Medications</h3>
                  <div className="space-y-4">
                    {analysisResult.medications.map((med, index) => (
                      <div key={index} className="border rounded-lg p-4 bg-gray-50">
                        <h4 className="font-medium text-primary mb-2">{med.name}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div><strong>Dosage:</strong> {med.dosage}</div>
                          <div><strong>Frequency:</strong> {med.frequency}</div>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                          <strong>Precautions:</strong> {med.precautions}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Summary */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">AI Analysis Summary</h3>
                  <p className="text-gray-700 leading-relaxed">{analysisResult.aiSummary}</p>
                </div>
              </CardContent>
            </Card>

            {/* Disclaimer */}
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Medical Disclaimer:</strong> This is just an AI-analyzed summary. Consult with a doctor in case of severe symptoms or if your condition worsens. This tool is for informational purposes only and should not replace professional medical advice.
              </AlertDescription>
            </Alert>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => window.location.reload()}>
                Scan Another Image
              </Button>
              <Button onClick={() => navigate('/dashboard')} className="bg-primary">
                Save to Dashboard
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Scan;
