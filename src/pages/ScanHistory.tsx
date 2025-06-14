import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import LoaderOne from '@/components/ui/loader-one';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Eye, Calendar, Target, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { generatePDFReport } from '@/services/pdfGenerationService';
import { useToast } from '@/hooks/use-toast';

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

const ScanHistory = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [scans, setScans] = useState<ScanData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedScan, setSelectedScan] = useState<ScanData | null>(null);

  useEffect(() => {
    const fetchScans = async () => {
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
        toast({
          title: "Error",
          description: "Failed to fetch scan history",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchScans();
  }, [user, toast]);

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

  const handleDownloadReport = (scan: ScanData) => {
    generatePDFReport(scan);
    toast({
      title: "Report Downloaded",
      description: "Your analysis report has been generated",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation userType="user" userName={user?.user_metadata?.full_name || user?.email} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <LoaderOne />
            <p className="text-muted-foreground mt-4">Loading scan history...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation userType="user" userName={user?.user_metadata?.full_name || user?.email} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Target className="w-8 h-8 text-primary" />
            Scan History & Reports
          </h1>
          <p className="text-gray-600">
            View your previous AI symptom analyses and download detailed reports.
          </p>
        </div>

        {scans.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No scans yet</h3>
              <p className="text-gray-600 mb-4">Start by scanning your first symptom to see analysis history here.</p>
              <Button onClick={() => window.location.href = '/scan'}>
                Start First Scan
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scans.map((scan) => (
              <Card key={scan.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge className={`${getUrgencyColor(scan.urgency_level || 'low')} border`}>
                      {getUrgencyIcon(scan.urgency_level || 'low')}
                      {(scan.urgency_level || 'low').toUpperCase()}
                    </Badge>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(scan.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <CardTitle className="text-lg">
                    {scan.wound_classification || 'Unknown Classification'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video relative overflow-hidden rounded-lg">
                    <img
                      src={scan.image_url}
                      alt="Symptom scan"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Confidence: </span>
                      {scan.confidence_score ? Math.round(scan.confidence_score * 100) + '%' : 'N/A'}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {scan.symptom_description || 'No description available'}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedScan(scan)}
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleDownloadReport(scan)}
                      className="flex-1 min-w-0 px-2"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Detailed View Modal */}
        {selectedScan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    Analysis Details
                    <Badge className={`${getUrgencyColor(selectedScan.urgency_level || 'low')} border`}>
                      {getUrgencyIcon(selectedScan.urgency_level || 'low')}
                      {(selectedScan.urgency_level || 'low').toUpperCase()} URGENCY
                    </Badge>
                  </CardTitle>
                  <Button variant="outline" onClick={() => setSelectedScan(null)}>
                    Close
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <img
                      src={selectedScan.image_url}
                      alt="Symptom analysis"
                      className="w-full rounded-lg shadow-md"
                    />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">ML Classification</h3>
                      <p className="text-primary font-medium">{selectedScan.wound_classification}</p>
                      <p className="text-sm text-gray-600">
                        Confidence: {selectedScan.confidence_score ? Math.round(selectedScan.confidence_score * 100) + '%' : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Analysis</h3>
                      <p className="text-gray-700">{selectedScan.symptom_description}</p>
                    </div>
                  </div>
                </div>

                {selectedScan.home_remedies && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Home Remedies</h3>
                    <ul className="space-y-2">
                      {selectedScan.home_remedies.map((remedy: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{remedy}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedScan.medications && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Suggested Medications</h3>
                    <div className="space-y-4">
                      {selectedScan.medications.map((med: any, index: number) => (
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
                )}

                {selectedScan.ai_analysis?.summary && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">AI Analysis Summary</h3>
                    <p className="text-gray-700 leading-relaxed">{selectedScan.ai_analysis.summary}</p>
                  </div>
                )}

                <div className="flex gap-4 justify-center pt-4">
                  <Button onClick={() => handleDownloadReport(selectedScan)}>
                    <Download className="w-4 h-4 mr-2" />
                    Download Full Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default ScanHistory;
