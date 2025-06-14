
import React from "react";
import { Bot, User, AlertTriangle } from "lucide-react";

interface ChatMessageProps {
  message: {
    id: string;
    content: string;
    sender: "user" | "bot";
    timestamp: Date;
    type?: "info" | "warning" | "symptom-track" | "error";
  };
  formatTime: (date: Date) => string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, formatTime }) => {
  return (
    <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
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
            <p
              className={`text-xs mt-2 ${
                message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
              }`}
            >
              {formatTime(message.timestamp)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
