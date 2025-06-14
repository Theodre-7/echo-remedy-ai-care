import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Shield, Utensils, Moon, Dumbbell, Brain } from 'lucide-react';

const getDailyTip = () => {
  // Flatten all tips with category references
  const allTips: { category: string; tip: string }[] = [];
  tipCategories.forEach((cat) => {
    cat.tips.forEach((tip) => {
      allTips.push({ category: cat.title, tip });
    });
  });

  // Use today date (YYYY-MM-DD) as seed & index
  const now = new Date();
  const dayOfYear =
    Math.floor(
      (Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) -
        Date.UTC(now.getFullYear(), 0, 0)) /
        24 / 60 / 60 / 1000
    );
  const index = dayOfYear % allTips.length;
  const selected = allTips[index];

  return {
    title: "Today's Featured Tip",
    content: selected.tip,
    category: selected.category,
  };
};

const HealthTips = () => {
  const { user } = useAuth();

  const tipCategories = [
    {
      icon: Shield,
      title: "Immunity Boosters",
      tips: [
        "Drink warm water with lemon and honey first thing in the morning",
        "Include vitamin C rich foods like oranges, guavas, and bell peppers",
        "Practice deep breathing exercises for 10 minutes daily",
        "Get adequate sunlight for natural vitamin D"
      ]
    },
    {
      icon: Utensils,
      title: "Nutrition Tips",
      tips: [
        "Eat a rainbow of fruits and vegetables daily",
        "Include probiotics like yogurt and fermented foods",
        "Stay hydrated with 8-10 glasses of water daily",
        "Limit processed foods and excess sugar intake"
      ]
    },
    {
      icon: Moon,
      title: "Sleep & Rest",
      tips: [
        "Maintain a consistent sleep schedule of 7-9 hours",
        "Create a relaxing bedtime routine",
        "Keep your bedroom cool, dark, and quiet",
        "Avoid screens 1 hour before bedtime"
      ]
    },
    {
      icon: Dumbbell,
      title: "Physical Activity",
      tips: [
        "Aim for at least 30 minutes of moderate exercise daily",
        "Take the stairs instead of elevators when possible",
        "Practice yoga or stretching for flexibility",
        "Go for a 10-minute walk after meals"
      ]
    },
    {
      icon: Brain,
      title: "Mental Wellness",
      tips: [
        "Practice mindfulness meditation for 5-10 minutes daily",
        "Connect with friends and family regularly",
        "Engage in hobbies that bring you joy",
        "Practice gratitude by writing 3 things you're thankful for daily"
      ]
    },
    {
      icon: Heart,
      title: "Seasonal Prevention",
      tips: [
        "Wash hands frequently, especially during flu season",
        "Keep your living space well-ventilated",
        "Boost immunity with seasonal fruits and vegetables",
        "Stay updated with preventive healthcare checkups"
      ]
    }
  ];

  const dailyTip = getDailyTip();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation userType="user" userName={user?.user_metadata?.full_name || user?.email} />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Heart className="w-8 h-8 text-red-500" />
            Health Tips & Wellness
          </h1>
          <p className="text-gray-600">
            Daily tips on immunity, lifestyle, and seasonal illness prevention to keep you healthy.
          </p>
        </div>

        {/* Daily Featured Tip */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Heart className="w-6 h-6" />
              {dailyTip.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-700 text-lg leading-relaxed">{dailyTip.content}</p>
            <span className="inline-block mt-3 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {dailyTip.category}
            </span>
          </CardContent>
        </Card>

        {/* Health Tips Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tipCategories.map((category, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <category.icon className="w-6 h-6 text-primary" />
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {category.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 text-sm">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Health Resources */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Emergency Health Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2 text-red-600">When to Seek Immediate Medical Attention:</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Difficulty breathing or shortness of breath</li>
                  <li>• Chest pain or pressure</li>
                  <li>• Severe headache with fever</li>
                  <li>• Persistent high fever (above 103°F/39.4°C)</li>
                  <li>• Signs of severe dehydration</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-green-600">Home Remedy Essentials to Keep:</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Honey (for coughs and sore throat)</li>
                  <li>• Ginger (for nausea and inflammation)</li>
                  <li>• Turmeric (natural anti-inflammatory)</li>
                  <li>• Aloe vera (for skin irritations)</li>
                  <li>• Chamomile tea (for relaxation and digestion)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default HealthTips;
