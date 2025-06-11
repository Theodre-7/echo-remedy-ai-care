import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, History, MessageCircle, Camera, Eye, Download, Calendar, Brain } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { generatePDFReport } from '@/services/pdfGenerationService';

interface ScanResult {
  id: string;
  image_url: string;
  symptom_description: string | null;
  wound_classification: string | null;
  confidence_score: number | null;
  home_remedies: any;
  medications: any;
  ai_analysis: any;
  remedy_suggestion: string | null;
  urgency_level: string | null;
  created_at: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [scans, setScans] = useState<ScanResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedScan, setSelectedScan] = useState<ScanResult | null>(null);

  useEffect(() => {
    fetchUserScans();
  }, [user]);

  const fetchUserScans = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('symptom_scans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setScans(data || []);
    } catch (error) {
      console.error('Error fetching scans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (scan: ScanResult) => {
    setSelectedScan(scan);
  };

  const handleDownloadPDF = (scan: ScanResult) => {
    generatePDFReport(scan);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUrgencyColor = (level: string | null) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation userType="user" userName={user?.user_metadata?.full_name || user?.email} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || 'User'}!
          </h1>
          <p className="text-gray-600">
            Track your health journey and view your AI-powered symptom analysis history.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full justify-start" 
                  onClick={() => navigate('/scan')}
                >
                  <Brain className="w-4 h-4 mr-2" />
                  AI Symptom Scan
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/journal')}
                >
                  <History className="w-4 h-4 mr-2" />
                  Health Journal
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat with Medxo
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Scan History */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Recent AI Scans ({scans.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
                  </div>
                ) : scans.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Brain className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No scans yet. Upload your first symptom photo for AI analysis!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {scans.map((scan) => (
                      <div key={scan.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <img 
                              src={scan.image_url} 
                              alt="Scan" 
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div>
                              <h3 className="font-medium text-gray-900">
                                {scan.wound_classification || scan.symptom_description || 'Symptom Analysis'}
                              </h3>
                              {scan.confidence_score && (
                                <p className="text-sm text-blue-600">
                                  AI Confidence: {Math.round(scan.confidence_score * 100)}%
                                </p>
                              )}
                              <div className="flex items-center gap-2 mt-1">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-500">
                                  {formatDate(scan.created_at)}
                                </span>
                                {scan.urgency_level && (
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(scan.urgency_level)}`}>
                                    {scan.urgency_level?.toUpperCase()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewDetails(scan)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View Details
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDownloadPDF(scan)}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Scan Details Modal */}
        {selectedScan && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">AI Scan Analysis</h2>
                  <Button 
                    variant="ghost" 
                    onClick={() => setSelectedScan(null)}
                  >
                    ×
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <img 
                      src={selectedScan.image_url} 
                      alt="Scan" 
                      className="w-full rounded-lg"
                    />
                    {selectedScan.wound_classification && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-blue-900">AI Classification</h4>
                        <p className="text-blue-700">{selectedScan.wound_classification}</p>
                        {selectedScan.confidence_score && (
                          <p className="text-sm text-blue-600">
                            Confidence: {Math.round(selectedScan.confidence_score * 100)}%
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Home Remedies</h3>
                      {selectedScan.home_remedies ? (
                        <ul className="space-y-1">
                          {selectedScan.home_remedies.map((remedy: string, index: number) => (
                            <li key={index} className="text-gray-700 text-sm">• {remedy}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-700">{selectedScan.remedy_suggestion || 'No specific remedies suggested for this scan.'}</p>
                      )}
                    </div>

                    {selectedScan.medications && (
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Suggested Medications</h3>
                        <div className="space-y-3">
                          {selectedScan.medications.map((med: any, index: number) => (
                            <div key={index} className="border rounded-lg p-3 bg-gray-50">
                              <h4 className="font-medium text-primary">{med.name}</h4>
                              <p className="text-sm"><strong>Dosage:</strong> {med.dosage}</p>
                              <p className="text-sm"><strong>Frequency:</strong> {med.frequency}</p>
                              <p className="text-sm text-gray-600">{med.precautions}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="font-semibold text-lg mb-2">AI Analysis Summary</h3>
                      <p className="text-gray-700">
                        {selectedScan.ai_analysis?.summary || selectedScan.symptom_description || 'Analysis data not available.'}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleDownloadPDF(selectedScan)}
                        className="flex-1"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF Report
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
