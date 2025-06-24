import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import LoaderOne from '@/components/ui/loader-one';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, MessageCircle, FileText, TrendingUp, Calendar, Clock, Target, History, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { scheduleWellnessReminder } from '@/services/wellnessReminderService';
import { exportHealthData, downloadHealthDataAsJSON, downloadHealthReportAsText } from '@/services/healthDataExportService';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalScans: 0,
    journalEntries: 0,
    recentActivity: 'No recent activity'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      try {
        // Fetch scan count
        const { count: scanCount } = await supabase
          .from('symptom_scans')
          .select('*', { count: 'exact', head: true });

        // Fetch journal entries count
        const { count: journalCount } = await supabase
          .from('journal_entries')
          .select('*', { count: 'exact', head: true });

        setStats({
          totalScans: scanCount || 0,
          journalEntries: journalCount || 0,
          recentActivity: scanCount || journalCount ? 'Recent health tracking activity detected' : 'No recent activity'
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  const toggleChatbot = () => {
    // This will trigger the MedxoChatbot to show
    const chatButton = document.querySelector('[data-medxo-chat-toggle]') as HTMLButtonElement;
    if (chatButton) {
      chatButton.click();
    } else {
      // Fallback: dispatch custom event
      window.dispatchEvent(new CustomEvent('medxo-chat-toggle'));
    }
  };

  const handleScheduleWellnessReminder = async () => {
    if (!user) return;

    try {
      const userEmail = user.email;
      const userName = user.user_metadata?.full_name || 'there';
      
      await scheduleWellnessReminder(userEmail!, userName);
      
      toast({
        title: "Wellness Reminder Scheduled",
        description: "You'll receive a daily wellness reminder via email!",
      });
    } catch (error) {
      console.error('Error scheduling wellness reminder:', error);
      toast({
        title: "Error",
        description: "Failed to schedule wellness reminder. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExportHealthData = async () => {
    if (!user) return;

    try {
      const healthData = await exportHealthData(user.id);
      
      // Download both JSON and text report
      downloadHealthDataAsJSON(healthData);
      downloadHealthReportAsText(healthData);
      
      toast({
        title: "Health Data Exported",
        description: "Your health data has been downloaded successfully!",
      });
    } catch (error) {
      console.error('Error exporting health data:', error);
      toast({
        title: "Error",
        description: "Failed to export health data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const quickActions = [
    {
      title: 'AI Symptom Scan',
      description: 'Advanced CNN analysis for wounds',
      icon: Camera,
      href: '/scan',
      color: 'bg-blue-500'
    },
    {
      title: 'Chat with Medxo',
      description: 'Get personalized health guidance',
      icon: MessageCircle,
      onClick: toggleChatbot,
      color: 'bg-green-500'
    },
    {
      title: 'Health Journal',
      description: 'Track symptoms and mood',
      icon: FileText,
      href: '/journal',
      color: 'bg-purple-500'
    },
    {
      title: 'Scan History',
      description: 'View past analyses & reports',
      icon: History,
      href: '/scan-history',
      color: 'bg-indigo-500'
    },
    {
      title: 'Health Tips',
      description: 'Discover wellness insights',
      icon: TrendingUp,
      href: '/health-tips',
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navigation userType="user" userName={user?.user_metadata?.full_name || user?.email} />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Welcome back, {user?.user_metadata?.full_name || 'there'}!
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your personal health dashboard with advanced AI-powered symptom analysis and comprehensive medical insights.
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="medical-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AI Scans Completed</CardTitle>
                <Camera className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? <LoaderOne /> : stats.totalScans}
                </div>
                <p className="text-xs text-muted-foreground">CNN-powered analyses</p>
              </CardContent>
            </Card>
            
            <Card className="medical-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Journal Entries</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? <LoaderOne /> : stats.journalEntries}
                </div>
                <p className="text-xs text-muted-foreground">Health records tracked</p>
              </CardContent>
            </Card>
            
            <Card className="medical-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Activity Status</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium text-green-600">Active</div>
                <p className="text-xs text-muted-foreground">{stats.recentActivity}</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {quickActions.map((action, index) => (
                <Card 
                  key={action.title} 
                  className="medical-card hover:shadow-lg transition-shadow cursor-pointer group"
                  onClick={action.onClick ? action.onClick : undefined}
                >
                  {action.href ? (
                    <a href={action.href} className="block">
                      <CardContent className="p-6 text-center">
                        <div className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                          <action.icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-semibold text-foreground mb-2">{action.title}</h3>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                      </CardContent>
                    </a>
                  ) : (
                    <CardContent className="p-6 text-center">
                      <div className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                        <action.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>

          {/* Enhanced Health Insights */}
          <Card className="medical-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                AI-Powered Health Insights & Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Today's AI Recommendations</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Monitor skin changes with regular AI scans
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Stay hydrated - aim for 8 glasses of water
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      Document symptoms in your health journal
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      Consider a 10-minute walk for mental clarity
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Quick Health Tools</h4>
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={handleScheduleWellnessReminder}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule wellness reminder
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Clock className="w-4 h-4 mr-2" />
                      Set medication alert
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={handleExportHealthData}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export health data
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
