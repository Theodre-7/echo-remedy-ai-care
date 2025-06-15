
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface ChatInputProps {
  inputMessage: string;
  setInputMessage: (val: string) => void;
  isTyping: boolean;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  inputMessage,
  setInputMessage,
  isTyping,
  onSend,
  onKeyPress
}) => (
  <div className="flex gap-2 mb-2">
    <Input
      value={inputMessage}
      onChange={(e) => setInputMessage(e.target.value)}
      onKeyPress={onKeyPress}
      placeholder="Describe your symptoms or ask any health question..."
      className="flex-1"
      disabled={isTyping}
    />
    <Button
      onClick={onSend}
      disabled={!inputMessage.trim() || isTyping}
      size="sm"
      className="flex-shrink-0"
    >
      <Send className="h-4 w-4" />
    </Button>
  </div>
);

export default ChatInput;
