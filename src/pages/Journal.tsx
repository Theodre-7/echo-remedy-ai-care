import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import LoaderOne from '@/components/ui/loader-one';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Plus, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface JournalEntry {
  id: string;
  symptoms: string;
  severity: number;
  notes: string | null;
  mood: string;
  created_at: string;
}

const Journal = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [symptoms, setSymptoms] = useState('');
  const [severity, setSeverity] = useState([5]);
  const [notes, setNotes] = useState('');
  const [mood, setMood] = useState('');

  const fetchEntries = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching entries:', error);
      toast({
        title: "Error",
        description: "Failed to load journal entries",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !symptoms.trim() || !mood) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user.id,
          symptoms: symptoms.trim(),
          severity: severity[0],
          notes: notes.trim() || null,
          mood: mood
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Journal entry saved successfully"
      });

      // Reset form
      setSymptoms('');
      setSeverity([5]);
      setNotes('');
      setMood('');

      // Refresh entries
      fetchEntries();
    } catch (error) {
      console.error('Error saving entry:', error);
      toast({
        title: "Error",
        description: "Failed to save journal entry",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Journal entry deleted"
      });

      fetchEntries();
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast({
        title: "Error",
        description: "Failed to delete entry",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navigation userType={user ? "user" : "guest"} userName={user?.user_metadata?.full_name || user?.email} />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Health Journal
            </h1>
            <p className="text-lg text-muted-foreground">
              Track your symptoms and mood to better understand your health patterns
            </p>
          </div>

          {/* New Entry Form */}
          <Card className="mb-8 medical-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                New Journal Entry
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Symptoms *
                  </label>
                  <Textarea
                    placeholder="Describe your symptoms..."
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    required
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Severity Level: {severity[0]}/10
                  </label>
                  <Slider
                    value={severity}
                    onValueChange={setSeverity}
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Mild</span>
                    <span>Moderate</span>
                    <span>Severe</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Mood *
                  </label>
                  <Select value={mood} onValueChange={setMood} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your mood" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">😊 Excellent</SelectItem>
                      <SelectItem value="good">🙂 Good</SelectItem>
                      <SelectItem value="okay">😐 Okay</SelectItem>
                      <SelectItem value="poor">😔 Poor</SelectItem>
                      <SelectItem value="terrible">😩 Terrible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Additional Notes
                  </label>
                  <Textarea
                    placeholder="Any additional observations or notes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={submitting || !symptoms.trim() || !mood}
                >
                  {submitting ? 'Saving...' : 'Save Entry'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Entries List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Previous Entries</h2>
            
            {loading ? (
              <div className="text-center py-8">
                <LoaderOne />
                <p className="text-muted-foreground mt-4">Loading entries...</p>
              </div>
            ) : entries.length === 0 ? (
              <Card className="medical-card">
                <CardContent className="text-center py-8">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No journal entries yet. Create your first entry above!</p>
                </CardContent>
              </Card>
            ) : (
              entries.map((entry) => (
                <Card key={entry.id} className="medical-card">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{formatDate(entry.created_at)}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Severity: {entry.severity}/10 • Mood: {entry.mood}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteEntry(entry.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-foreground mb-1">Symptoms:</h4>
                        <p className="text-muted-foreground">{entry.symptoms}</p>
                      </div>
                      {entry.notes && (
                        <div>
                          <h4 className="font-medium text-foreground mb-1">Notes:</h4>
                          <p className="text-muted-foreground">{entry.notes}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Journal;
