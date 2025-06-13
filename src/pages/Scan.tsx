import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import LoaderOne from '@/components/ui/loader-one';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Camera, FileImage, AlertTriangle, CheckCircle, Clock, Brain } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { analyzeSymptomImage, uploadImageToStorage, saveScanToDatabase, type MLAnalysisResult } from '@/services/mlAnalysisService';

const Scan = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<MLAnalysisResult | null>(null);
  const [isSaving, setIsSaving] = useState(false);

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
    if (!selectedFile || !user) return;

    setIsAnalyzing(true);
    
    try {
      // Perform ML analysis
      const result = await analyzeSymptomImage(selectedFile);
      setAnalysisResult(result);
      
      toast({
        title: "Analysis Complete",
        description: `Detected: ${result.woundClassification} (${Math.round(result.confidenceScore * 100)}% confidence)`,
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const saveToDashboard = async () => {
    if (!selectedFile || !analysisResult || !user) return;

    setIsSaving(true);
    
    try {
      // Upload image to storage
      const imageUrl = await uploadImageToStorage(selectedFile, user.id);
      
      // Save scan results to database
      await saveScanToDatabase(user.id, imageUrl, analysisResult);
      
      toast({
        title: "Scan Saved",
        description: "Your scan has been saved to your dashboard successfully!",
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Save Failed", 
        description: "Unable to save scan results. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Brain className="w-8 h-8 text-primary" />
            AI-Powered Symptom Scanner
          </h1>
          <p className="text-gray-600">
            Upload a clear photo of your symptom for AI-powered analysis using advanced machine learning models.
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
                            <LoaderOne />
                            <span className="ml-2">Analyzing with AI...</span>
                          </>
                        ) : (
                          <>
                            <Brain className="w-4 h-4 mr-2" />
                            Analyze with AI
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
                  AI Analysis Results
                  <Badge className={`${getUrgencyColor(analysisResult.urgencyLevel)} border`}>
                    {getUrgencyIcon(analysisResult.urgencyLevel)}
                    {analysisResult.urgencyLevel.toUpperCase()} URGENCY
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <img
                      src={previewUrl!}
                      alt="Analyzed symptom"
                      className="w-full rounded-lg shadow-md"
                    />
                  </div>

                  <div className="space-y-4">
                    {/* Classification */}
                    <div>
                      <h3 className="font-semibold text-lg mb-2">ML Classification</h3>
                      <p className="text-primary font-medium">{analysisResult.woundClassification}</p>
                      <p className="text-sm text-gray-600">
                        Confidence: {Math.round(analysisResult.confidenceScore * 100)}%
                      </p>
                    </div>

                    {/* Symptom Description */}
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Analysis</h3>
                      <p className="text-gray-700">{analysisResult.symptomDescription}</p>
                    </div>
                  </div>
                </div>

                {/* Home Remedies */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Home Remedies</h3>
                  <ul className="space-y-2">
                    {analysisResult.homeRemedies.map((remedy, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
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
                <strong>Medical Disclaimer:</strong> This AI analysis is for informational purposes only and should not replace professional medical advice. Consult with a healthcare provider for proper diagnosis and treatment, especially if symptoms worsen or persist.
              </AlertDescription>
            </Alert>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => window.location.reload()}>
                Scan Another Image
              </Button>
              <Button 
                onClick={saveToDashboard} 
                className="bg-primary"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <LoaderOne />
                    <span className="ml-2">Saving...</span>
                  </>
                ) : (
                  'Save to Dashboard'
                )}
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Scan;
