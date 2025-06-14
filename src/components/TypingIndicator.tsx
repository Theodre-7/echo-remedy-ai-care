
import React from "react";
import { Bot } from "lucide-react";

const TypingIndicator: React.FC = () => (
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
);

export default TypingIndicator;
