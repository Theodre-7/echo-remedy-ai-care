
import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  title: string;
  content: string;
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ title, content, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-2xl w-full max-h-[90vh] relative">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
          <button 
            onClick={onClose} 
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
