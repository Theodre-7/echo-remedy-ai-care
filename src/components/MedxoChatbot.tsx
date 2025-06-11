
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface MedxoChatbotProps {
  autoShow?: boolean;
}

const MedxoChatbot = ({ autoShow = false }: MedxoChatbotProps) => {
  const [isOpen, setIsOpen] = useState(autoShow);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (autoShow) {
      // Auto-show after login with a welcome message
      const welcomeMessage: Message = {
        id: '1',
        type: 'bot',
        content: "Hello! I'm Medxo, your AI medical assistant. I can help you describe symptoms, suggest possible causes, and recommend home remedies. How can I assist you today?",
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
      setIsOpen(true);
    }
  }, [autoShow]);

  const simulateBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('headache') || input.includes('head pain')) {
      return "For headaches, I recommend: 1) Stay hydrated - drink plenty of water 2) Apply a cold compress to your forehead 3) Try gentle neck stretches 4) Rest in a quiet, dark room 5) Consider ginger tea for natural pain relief. If headaches persist or are severe, please consult a doctor.";
    }
    
    if (input.includes('fever') || input.includes('temperature')) {
      return "For fever management: 1) Stay hydrated with water and clear fluids 2) Rest and avoid strenuous activity 3) Use cool compresses on forehead and wrists 4) Wear lightweight clothing 5) Try herbal teas like willow bark tea. Seek medical attention if fever exceeds 103°F (39.4°C) or persists for more than 3 days.";
    }
    
    if (input.includes('cough') || input.includes('cold')) {
      return "For cough and cold relief: 1) Honey and warm water can soothe throat irritation 2) Inhale steam from hot water 3) Stay hydrated 4) Use a humidifier 5) Try ginger and turmeric tea 6) Gargle with salt water. If symptoms worsen or persist beyond a week, consult a healthcare provider.";
    }
    
    if (input.includes('stomach') || input.includes('nausea') || input.includes('digestive')) {
      return "For digestive issues: 1) Try ginger tea or chewing fresh ginger 2) Stay hydrated with small, frequent sips 3) Eat bland foods like rice, bananas, toast 4) Avoid spicy, fatty, or dairy foods 5) Consider peppermint tea. If severe pain or symptoms persist, seek medical attention.";
    }
    
    if (input.includes('stress') || input.includes('anxiety') || input.includes('mental')) {
      return "For stress and anxiety management: 1) Practice deep breathing exercises 2) Try meditation or mindfulness 3) Get regular exercise 4) Maintain a sleep schedule 5) Connect with supportive friends/family 6) Consider herbal teas like chamomile. For persistent mental health concerns, please consult a mental health professional.";
    }
    
    return "I understand you're experiencing some health concerns. Could you provide more specific details about your symptoms? For example, describe the location, intensity, duration, and any triggers. This will help me give you more targeted advice. Remember, while I can suggest home remedies and general guidance, it's important to consult with a healthcare professional for proper diagnosis and treatment.";
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate bot response delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: simulateBotResponse(input),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg z-40"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[500px] z-50">
      <Card className="w-full h-full flex flex-col shadow-xl">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              <span>Medxo AI Assistant</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-4">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user' ? 'bg-primary text-white' : 'bg-gray-100'
                  }`}>
                    {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`rounded-lg p-3 ${
                    message.type === 'user' 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-2 justify-start">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe your symptoms or ask about health concerns..."
              rows={2}
              className="resize-none"
            />
            <Button onClick={handleSendMessage} size="sm" className="self-end">
              <Send className="w-4 h-4" />
            </Button>
          </div>

          <p className="text-xs text-gray-500 mt-2 text-center">
            This is AI-generated advice. Always consult healthcare professionals for serious concerns.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedxoChatbot;
