import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'info' | 'warning' | 'symptom-track' | 'error';
}

interface MedxoChatbotProps {
  autoShow?: boolean;
}

const EDGE_FUNCTION_URL = `https://ltipykptfpyxremksjgo.functions.supabase.co/openrouter-medical-assistant`;

const MedxoChatbot = ({ autoShow = false }: MedxoChatbotProps) => {
  const [isOpen, setIsOpen] = useState(autoShow);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm Medxo, your AI medical assistant. You can upload a photo of your wound, skin issue, or symptom—or just type your concern, and I'll analyze your input.",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async () => {
    const text = inputMessage.trim();
    if (!text) return;

    // 1. Add user message to local chat
    const userMessage: Message = {
      id: Date.now().toString(),
      content: text,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // ---- NEW: get current access token
      const session = await supabase.auth.getSession();
      const accessToken =
        typeof session.data?.session?.access_token === 'string'
        ? session.data?.session?.access_token
        : null;

      // 2. Call OpenRouter Edge Function with user's message, using Authorization header
      const resp = await fetch(EDGE_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {})
        },
        body: JSON.stringify({
          image_url: null,
          user_text: text
        })
      });
      const data = await resp.json();

      let botContent = '';

      if (data?.result) {
        botContent = data.result;
      } else if (data?.error) {
        botContent = `Sorry, I couldn't process your request: ${data.error}`;
      } else {
        botContent = "Sorry, I didn't get a valid response from the medical assistant.";
      }
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botContent,
        sender: 'bot',
        timestamp: new Date(),
        type: data?.error ? 'error' : undefined
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (e: any) {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          content: "Sorry, I ran into a technical issue. Please try again in a moment.",
          sender: 'bot',
          timestamp: new Date(),
          type: 'error'
        }
      ]);
    } finally {
      setIsTyping(false);
    }
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
                      : message.type === 'error'
                      ? 'bg-red-50 border border-red-200 text-red-900'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.sender === 'bot' && (
                      <Bot className={`h-4 w-4 mt-0.5 flex-shrink-0 text-primary`} />
                    )}
                    {message.sender === 'user' && (
                      <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      {message.type === 'error' && (
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
                          <span className="text-sm font-semibold text-red-700">Error</span>
                        </div>
                      )}
                      <div className="text-sm whitespace-pre-line break-words">{message.content}</div>
                      <p className={`text-xs mt-2 ${
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
                placeholder="Describe your symptoms, upload a photo (coming soon!), or ask any health question..."
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
