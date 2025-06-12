
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { BookOpen, Plus, Calendar } from 'lucide-react';
import { BeamsBackground } from '@/components/ui/beams-background';

interface JournalEntry {
  id: string;
  date: string;
  symptoms: string;
  severity: number;
  notes: string;
  mood: string;
}

const Journal = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEntry, setNewEntry] = useState({
    symptoms: '',
    severity: 5,
    notes: '',
    mood: 'neutral'
  });

  const handleAddEntry = () => {
    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      ...newEntry
    };
    setEntries([entry, ...entries]);
    setNewEntry({ symptoms: '', severity: 5, notes: '', mood: 'neutral' });
    setShowAddForm(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getSeverityColor = (severity: number) => {
    if (severity <= 3) return 'text-green-600 bg-green-50';
    if (severity <= 6) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <BeamsBackground intensity="subtle">
      <Navigation userType="user" userName={user?.user_metadata?.full_name || user?.email} />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <BookOpen className="w-8 h-8" />
            Health Journal
          </h1>
          <p className="text-gray-300">
            Track your symptoms, progress, and reflect on your health journey.
          </p>
        </div>

        <div className="mb-6">
          <Button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white border border-white/30"
          >
            <Plus className="w-4 h-4" />
            Add New Entry
          </Button>
        </div>

        {showAddForm && (
          <Card className="mb-6 bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">New Journal Entry</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Symptoms
                </label>
                <Input
                  value={newEntry.symptoms}
                  onChange={(e) => setNewEntry({...newEntry, symptoms: e.target.value})}
                  placeholder="Describe your symptoms..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Severity (1-10)
                </label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={newEntry.severity}
                  onChange={(e) => setNewEntry({...newEntry, severity: parseInt(e.target.value)})}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Mood
                </label>
                <select 
                  value={newEntry.mood}
                  onChange={(e) => setNewEntry({...newEntry, mood: e.target.value})}
                  className="w-full p-2 border border-white/20 rounded-md bg-white/10 text-white"
                >
                  <option value="great">Great</option>
                  <option value="good">Good</option>
                  <option value="neutral">Neutral</option>
                  <option value="poor">Poor</option>
                  <option value="terrible">Terrible</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Notes
                </label>
                <Textarea
                  value={newEntry.notes}
                  onChange={(e) => setNewEntry({...newEntry, notes: e.target.value})}
                  placeholder="Additional notes about your health today..."
                  rows={4}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAddEntry} className="bg-white/20 hover:bg-white/30 text-white border border-white/30">Save Entry</Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)} className="border-white/30 text-white hover:bg-white/10">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {entries.length === 0 ? (
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="text-center py-12">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-white mb-2">No entries yet</h3>
                <p className="text-gray-300">Start tracking your health journey by adding your first entry.</p>
              </CardContent>
            </Card>
          ) : (
            entries.map((entry) => (
              <Card key={entry.id} className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <span className="font-medium text-white">{formatDate(entry.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(entry.severity)}`}>
                        Severity: {entry.severity}/10
                      </span>
                      <span className="px-2 py-1 bg-blue-50/20 text-blue-300 rounded-full text-xs font-medium">
                        Mood: {entry.mood}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-white mb-1">Symptoms</h4>
                      <p className="text-gray-300">{entry.symptoms}</p>
                    </div>

                    {entry.notes && (
                      <div>
                        <h4 className="font-medium text-white mb-1">Notes</h4>
                        <p className="text-gray-300">{entry.notes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </BeamsBackground>
  );
};

export default Journal;
