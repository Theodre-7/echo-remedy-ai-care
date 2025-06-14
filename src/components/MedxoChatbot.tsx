import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'info' | 'warning' | 'symptom-track';
}

interface MedxoChatbotProps {
  autoShow?: boolean;
}

interface SymptomData {
  symptom: string;
  severity: string;
  duration: string;
  timestamp: Date;
}

const MedxoChatbot = ({ autoShow = false }: MedxoChatbotProps) => {
  const [isOpen, setIsOpen] = useState(autoShow);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm Medxo, your AI health assistant. I'm here to help you track symptoms, suggest over-the-counter remedies for wounds and common ailments, and provide health guidance. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [trackedSymptoms, setTrackedSymptoms] = useState<SymptomData[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const analyzeUserIntent = (message: string): 'symptom-track' | 'wound-care' | 'allergy' | 'medication' | 'general' | 'emergency' => {
    const lowercaseMessage = message.toLowerCase();
    
    if (lowercaseMessage.includes('track') || lowercaseMessage.includes('symptom') || lowercaseMessage.includes('feeling')) {
      return 'symptom-track';
    }
    if (lowercaseMessage.includes('cut') || lowercaseMessage.includes('wound') || lowercaseMessage.includes('burn') || lowercaseMessage.includes('scrape')) {
      return 'wound-care';
    }
    if (lowercaseMessage.includes('allergy') || lowercaseMessage.includes('allergic') || lowercaseMessage.includes('reaction') || lowercaseMessage.includes('itchy')) {
      return 'allergy';
    }
    if (lowercaseMessage.includes('medicine') || lowercaseMessage.includes('medication') || lowercaseMessage.includes('take') || lowercaseMessage.includes('dose')) {
      return 'medication';
    }
    if (lowercaseMessage.includes('emergency') || lowercaseMessage.includes('urgent') || lowercaseMessage.includes('911') || lowercaseMessage.includes('severe pain')) {
      return 'emergency';
    }
    
    return 'general';
  };

  const generateMedxoResponse = (userMessage: string): { content: string; type?: 'info' | 'warning' | 'symptom-track' } => {
    const intent = analyzeUserIntent(userMessage);
    const lowercaseMessage = userMessage.toLowerCase();
    
    // Emergency situations
    if (intent === 'emergency') {
      return {
        content: "⚠️ If this is a medical emergency, please call 911 or go to your nearest emergency room immediately. I'm designed to help with general health information and cannot handle emergency situations. Your safety is the top priority.\n\n**Disclaimer:** This information is for educational purposes only and is not a substitute for professional medical advice.",
        type: 'warning'
      };
    }

    // Symptom tracking
    if (intent === 'symptom-track' || lowercaseMessage.includes('track')) {
      return {
        content: "I can help you track your symptoms! To provide the best guidance, could you please tell me:\n\n1. **What symptoms are you experiencing?** (e.g., headache, fever, cough)\n2. **How severe are they?** (mild, moderate, severe)\n3. **How long have you had them?** (hours, days, weeks)\n4. **Any triggers or recent changes?**\n\nThis will help me provide more personalized recommendations and track patterns in your health.\n\n**Disclaimer:** This information is for educational and support purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Please consult a doctor for medical concerns.",
        type: 'symptom-track'
      };
    }

    // Wound care
    if (intent === 'wound-care') {
      if (lowercaseMessage.includes('cut') || lowercaseMessage.includes('finger')) {
        return {
          content: "🩹 **For a small cut on your finger:**\n\n**Immediate Care:**\n1. Clean your hands thoroughly\n2. Apply gentle pressure to stop bleeding\n3. Rinse the cut with clean water\n4. Pat dry with a clean cloth\n\n**Treatment:**\n• Apply antibiotic ointment (like Neosporin)\n• Cover with a sterile bandage\n• Change bandage daily\n\n**OTC Medications:**\n• Ibuprofen (200-400mg) for pain if needed\n• Topical antibiotic cream\n\n**See a doctor if:** The cut is deep, won't stop bleeding, shows signs of infection (redness, warmth, pus), or if you're unsure about tetanus vaccination.\n\n**Disclaimer:** This information is for educational and support purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Please consult a doctor for medical concerns."
        };
      }
      
      if (lowercaseMessage.includes('burn')) {
        return {
          content: "🔥 **For minor burns:**\n\n**Immediate Care:**\n1. Cool the burn with cool (not ice cold) water for 10-20 minutes\n2. Remove jewelry/tight items before swelling\n3. Don't break blisters if they form\n\n**Treatment:**\n• Apply aloe vera gel or cool moisturizer\n• Cover loosely with sterile gauze\n• Take pain relievers if needed\n\n**OTC Options:**\n• Ibuprofen (200-400mg) for pain and inflammation\n• Acetaminophen for pain relief\n• Aloe vera gel for cooling relief\n\n**Seek immediate medical help if:** The burn is larger than 3 inches, on face/hands/feet/genitals, looks infected, or if you have fever.\n\n**Disclaimer:** This information is for educational and support purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Please consult a doctor for medical concerns."
        };
      }
    }

    // Allergy responses
    if (lowercaseMessage.includes('eyes') || lowercaseMessage.includes('itchy')) {
      return {
        content: "👁️ **For itchy, watery eyes (likely allergies):**\n\n**Immediate Relief:**\n• Rinse eyes with cool, clean water\n• Apply cool compress for 10-15 minutes\n• Avoid rubbing your eyes\n• Remove/avoid known allergens\n\n**OTC Medications:**\n• **Antihistamine eye drops:** Ketotifen (Zaditor) - 1 drop twice daily\n• **Oral antihistamines:** \n  - Loratadine (Claritin) 10mg once daily\n  - Cetirizine (Zyrtec) 10mg once daily\n  - Diphenhydramine (Benadryl) 25-50mg every 6 hours (may cause drowsiness)\n\n**Additional Tips:**\n• Use preservative-free artificial tears\n• Keep windows closed during high pollen days\n• Wash hands frequently\n\n**See a doctor if:** Symptoms worsen, vision changes, severe swelling, or no improvement after 2-3 days.\n\n**Disclaimer:** This information is for educational and support purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Please consult a doctor for medical concerns."
      };
    }

    if (lowercaseMessage.includes('skin') || lowercaseMessage.includes('rash')) {
      return {
        content: "🧴 **For allergic skin reactions:**\n\n**Immediate Care:**\n• Identify and remove the trigger if possible\n• Rinse affected area with cool water\n• Pat dry gently - don't rub\n• Avoid scratching\n\n**Home Remedies:**\n• Cool compresses for 15-20 minutes\n• Oatmeal baths (colloidal oatmeal)\n• Aloe vera gel (pure, no additives)\n• Calamine lotion for drying effect\n\n**OTC Medications:**\n• **Topical:** Hydrocortisone cream 1% (apply thin layer 2-3 times daily)\n• **Oral antihistamines:**\n  - Cetirizine 10mg daily\n  - Loratadine 10mg daily\n  - Diphenhydramine 25-50mg every 6 hours\n\n**See a doctor if:** Rash spreads rapidly, severe swelling, difficulty breathing, fever, or signs of infection.\n\n**Disclaimer:** This information is for educational and support purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Please consult a doctor for medical concerns."
      };
    }
    
    if (lowercaseMessage.includes('headache')) {
      return {
        content: "🤕 **For headaches:**\n\n**Common Causes:**\n• Tension, stress, dehydration\n• Eye strain, poor posture\n• Lack of sleep, hunger\n• Sinus congestion\n\n**Home Remedies:**\n• Rest in a quiet, dark room\n• Apply cold or warm compress\n• Stay hydrated (8+ glasses water)\n• Gentle neck and shoulder massage\n• Practice relaxation techniques\n\n**OTC Medications:**\n• **Acetaminophen:** 650-1000mg every 6 hours (max 3000mg/day)\n• **Ibuprofen:** 400-600mg every 6-8 hours (max 1200mg/day)\n• **Aspirin:** 650-1000mg every 4 hours\n\n**See a doctor if:** Sudden severe headache, headache with fever/stiff neck, vision changes, or headaches becoming more frequent/severe.\n\n**Disclaimer:** This information is for educational and support purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Please consult a doctor for medical concerns."
      };
    }

    if (lowercaseMessage.includes('fever')) {
      return {
        content: "🌡️ **For fever management:**\n\n**Home Care:**\n• Rest and stay hydrated\n• Dress in light, breathable clothing\n• Room temperature baths or cool washcloths\n• Monitor temperature regularly\n\n**OTC Medications:**\n• **Acetaminophen:** 650-1000mg every 6 hours\n• **Ibuprofen:** 400-600mg every 6-8 hours\n• **Note:** Don't alternate medications without consulting a healthcare provider\n\n**Hydration:**\n• Water, clear broths, electrolyte solutions\n• Avoid alcohol and caffeine\n\n**Seek immediate medical care if:**\n• Fever over 103°F (39.4°C)\n• Fever with severe headache, stiff neck, confusion\n• Difficulty breathing or chest pain\n• Persistent vomiting\n• Signs of dehydration\n\n**Disclaimer:** This information is for educational and support purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Please consult a doctor for medical concerns."
      };
    }

    if (lowercaseMessage.includes('cough')) {
      return {
        content: "😷 **For cough relief:**\n\n**Types & Care:**\n• **Dry cough:** Honey, throat lozenges, humidifier\n• **Productive cough:** Stay hydrated, don't suppress completely\n\n**Home Remedies:**\n• Honey (1-2 teaspoons) - not for children under 1 year\n• Warm saltwater gargles\n• Herbal teas with honey\n• Use a humidifier or breathe steam\n\n**OTC Options:**\n• **Dextromethorphan** (Robitussin DM) for dry cough\n• **Guaifenesin** (Mucinex) for productive cough\n• **Throat lozenges** with menthol\n• **Honey-based cough drops**\n\n**See a doctor if:**\n• Cough lasts more than 2-3 weeks\n• Coughing up blood\n• High fever, difficulty breathing\n• Chest pain or wheezing\n\n**Disclaimer:** This information is for educational and support purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Please consult a doctor for medical concerns."
      };
    }

    // Default response
    return {
      content: "I'm here to help with your health concerns! I can assist with:\n\n🩹 **Wound care** - cuts, burns, scrapes\n🤧 **Common symptoms** - headaches, fever, cough\n💊 **OTC medication guidance** - safe usage and dosages\n👁️ **Allergy support** - skin reactions, seasonal allergies\n📝 **Symptom tracking** - monitoring your health patterns\n\nCould you tell me more about your specific concern? For example:\n• \"I have a small cut on my finger\"\n• \"Track my symptoms: sore throat and headache\"\n• \"My eyes are itchy - what can I take?\"\n\nThis will help me provide more targeted guidance.\n\n**Disclaimer:** This information is for educational and support purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Please consult a doctor for medical concerns.",
      type: 'info'
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate thinking time for more realistic interaction
    setTimeout(() => {
      const response = generateMedxoResponse(inputMessage);
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        sender: 'bot',
        timestamp: new Date(),
        type: response.type
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500 + Math.random() * 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Listen for toggle events from dashboard
  useEffect(() => {
    const handleToggle = () => {
      setIsOpen(prev => !prev);
    };

    window.addEventListener('medxo-chat-toggle', handleToggle);
    return () => window.removeEventListener('medxo-chat-toggle', handleToggle);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
        data-medxo-chat-toggle
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-h-[80vh] flex flex-col">
      <Card className="flex flex-col shadow-2xl h-full max-h-[600px]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-primary text-white rounded-t-lg flex-shrink-0">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Medxo Assistant
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 p-0 text-white hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="flex flex-col p-0 flex-1 min-h-0">
          {/* Messages Container - Scrollable area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 max-h-[400px]">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-primary text-white'
                      : message.type === 'warning'
                      ? 'bg-red-50 border border-red-200 text-red-900'
                      : message.type === 'symptom-track'
                      ? 'bg-blue-50 border border-blue-200 text-blue-900'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.sender === 'bot' && (
                      <Bot className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                        message.type === 'warning' ? 'text-red-500' : 
                        message.type === 'symptom-track' ? 'text-blue-500' : 'text-primary'
                      }`} />
                    )}
                    {message.sender === 'user' && (
                      <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      {message.type === 'warning' && (
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
                          <span className="text-sm font-semibold text-red-700">Important Safety Notice</span>
                        </div>
                      )}
                      <div className="text-sm whitespace-pre-line break-words">{message.content}</div>
                      <p className={`text-xs mt-2 ${
                        message.sender === 'user' ? 'text-white/70' : 
                        message.type === 'warning' ? 'text-red-600' :
                        message.type === 'symptom-track' ? 'text-blue-600' : 'text-gray-500'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4 text-primary flex-shrink-0" />
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-gray-600">Medxo is thinking</span>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input Container - Always visible at bottom */}
          <div className="border-t bg-white p-4 flex-shrink-0">
            <div className="flex gap-2 mb-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe your symptoms or health concern..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                size="sm"
                className="flex-shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                For emergencies, call 911. This is not a substitute for professional medical advice.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedxoChatbot;
