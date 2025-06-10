
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Upload, History, MessageCircle, Camera } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation userType="user" userName={user?.user_metadata?.full_name || user?.email} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || 'User'}!
          </h1>
          <p className="text-gray-600">
            Upload a photo of your symptoms to get instant remedy suggestions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Camera className="w-6 h-6 text-primary mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Scan Symptom</h2>
            </div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">
                Drag and drop an image here, or click to select
              </p>
              <Button className="bg-primary hover:bg-primary/90">
                Select Image
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start" size="lg">
                <History className="w-5 h-5 mr-3" />
                View Scan History
              </Button>
              
              <Button variant="outline" className="w-full justify-start" size="lg">
                <MessageCircle className="w-5 h-5 mr-3" />
                Chat with Medxo
              </Button>
            </div>
          </div>
        </div>

        {/* Recent Scans */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Scans</h2>
          <div className="text-center py-8 text-gray-500">
            <History className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No scans yet. Upload your first symptom photo to get started!</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
