
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface MedxoChatbotProps {
  autoShow?: boolean;
}

const MedxoChatbot = ({ autoShow = false }: MedxoChatbotProps) => {
  const [isOpen, setIsOpen] = useState(autoShow);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm Medxo, your AI health assistant. How can I help you today? Please note that I'm here for informational purposes only and not a replacement for professional medical advice.",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Listen for toggle events from dashboard
  useEffect(() => {
    const handleToggle = () => {
      setIsOpen(prev => !prev);
    };

    window.addEventListener('medxo-chat-toggle', handleToggle);
    return () => window.removeEventListener('medxo-chat-toggle', handleToggle);
  }, []);

  const generateBotResponse = (userMessage: string): string => {
    const lowercaseMessage = userMessage.toLowerCase();
    
    if (lowercaseMessage.includes('headache') || lowercaseMessage.includes('head pain')) {
      return "For headaches, consider these remedies: Stay hydrated, rest in a quiet dark room, apply a cold compress, and consider over-the-counter pain relievers if appropriate. If headaches persist or worsen, please consult a healthcare provider.";
    }
    
    if (lowercaseMessage.includes('fever') || lowercaseMessage.includes('temperature')) {
      return "For fever management: Rest, stay hydrated, dress lightly, and monitor your temperature. Consider acetaminophen or ibuprofen if appropriate. Seek medical attention if fever exceeds 103°F (39.4°C) or persists for more than 3 days.";
    }
    
    if (lowercaseMessage.includes('cough')) {
      return "For cough relief: Stay hydrated, use honey (for ages 1+), try warm saltwater gargles, use a humidifier, and avoid irritants. If cough persists more than 2 weeks or includes blood, consult a healthcare provider.";
    }
    
    if (lowercaseMessage.includes('rash') || lowercaseMessage.includes('skin')) {
      return "For skin irritation: Keep the area clean and dry, avoid scratching, apply cool compresses, and consider using unscented moisturizers. If rash spreads, is accompanied by fever, or doesn't improve in a few days, seek medical attention.";
    }
    
    if (lowercaseMessage.includes('nausea') || lowercaseMessage.includes('sick')) {
      return "For nausea: Try small sips of clear fluids, eat bland foods like crackers or toast, rest, and avoid strong odors. Ginger tea or peppermint may help. If vomiting persists or you show signs of dehydration, consult a healthcare provider.";
    }
    
    if (lowercaseMessage.includes('pain') || lowercaseMessage.includes('hurt')) {
      return "For general pain management: Rest the affected area, apply ice for acute injuries or heat for muscle tension, consider over-the-counter pain relievers if appropriate, and gentle stretching may help. For severe or persistent pain, please consult a healthcare provider.";
    }
    
    if (lowercaseMessage.includes('emergency') || lowercaseMessage.includes('urgent')) {
      return "If this is a medical emergency, please call 911 or go to your nearest emergency room immediately. I'm here for general health information only and cannot handle emergency situations.";
    }
    
    return "I understand you're looking for health guidance. While I can provide general wellness information, I recommend consulting with a healthcare provider for personalized medical advice. Can you tell me more about your specific symptoms or concerns?";
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

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateBotResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
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
    <div className="fixed bottom-6 right-6 z-50 w-96 h-[500px] flex flex-col">
      <Card className="flex-1 flex flex-col shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-primary text-white rounded-t-lg">
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
        
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.sender === 'bot' && (
                      <Bot className="h-4 w-4 mt-0.5 text-primary" />
                    )}
                    {message.sender === 'user' && (
                      <User className="h-4 w-4 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
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
                    <Bot className="h-4 w-4 text-primary" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input Container */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              For emergencies, call 911. This is not a substitute for professional medical advice.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedxoChatbot;
