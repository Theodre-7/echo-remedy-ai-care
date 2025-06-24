import React from 'react';
import { X, Linkedin, Twitter, CheckCircle, Shield, FileText } from 'lucide-react';
interface ModalProps {
  title: string;
  content: string;
  isOpen: boolean;
  onClose: () => void;
}
const Modal: React.FC<ModalProps> = ({
  title,
  content,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;
  const renderAboutUsContent = () => <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Developed by: Sanjeevi Ram</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Linkedin className="w-5 h-5 text-blue-600" />
            <a href="https://www.linkedin.com/in/sanjeevi-ram-274947298/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors text-sm">https://www.linkedin.com/sanjeeviram</a>
          </div>
          <div className="flex items-center gap-3">
            <Twitter className="w-5 h-5 text-gray-800" />
            <a href="https://x.com/sanjuxcoderx?s=21" target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-gray-600 transition-colors text-sm">https://x.com/sanjuxcoder</a>
          </div>
        </div>
      </div>
      
      <hr className="border-gray-200" />
      
      <div>
        <h4 className="text-md font-semibold text-gray-800 mb-4">🩺 Other Services Offered by EchoRemedy:</h4>
        <ul className="space-y-2">
          {['Upload photo & analyze visible disease or infection', 'AI-generated health summary', 'MedxoBot: Smart assistant for disorder queries & emergencies', 'Scan History with timestamp', 'Downloadable health reports', 'Home remedies tailored to symptoms', 'Interactive health journals', 'Daily wellness tips'].map((service, index) => <li key={index} className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">{service}</span>
            </li>)}
        </ul>
      </div>
    </div>;
  const renderPrivacyPolicyContent = () => <div className="space-y-4">
      <p className="text-gray-700 font-medium">EchoRemedy respects your privacy. Here's how we protect your data:</p>
      <ul className="space-y-3">
        {[{
        text: 'Uploaded images are securely stored and used only for AI analysis',
        highlight: 'securely'
      }, {
        text: 'Conversations with MedxoBot are anonymized to improve future accuracy',
        highlight: 'anonymized'
      }, {
        text: 'No personal data is ever shared or sold to third parties',
        highlight: 'personal data'
      }, {
        text: 'Cookies may be used to improve user session experience',
        highlight: null
      }, {
        text: 'Users may request deletion of their data at any time',
        highlight: null
      }, {
        text: 'By using EchoRemedy, users agree to this policy',
        highlight: null
      }].map((item, index) => <li key={index} className="flex items-start gap-2">
            <FileText className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-gray-700">
              {item.highlight ? <>
                  {item.text.split(item.highlight)[0]}
                  <span className="text-blue-600 font-medium">{item.highlight}</span>
                  {item.text.split(item.highlight)[1]}
                </> : item.text}
            </span>
          </li>)}
      </ul>
    </div>;
  const renderTermsContent = () => <div className="space-y-4">
      <p className="text-gray-700 font-medium">Please read these terms before using EchoRemedy.</p>
      <ul className="space-y-3">
        {[{
        text: 'AI-generated remedies are not a substitute for professional medical advice',
        warning: true
      }, {
        text: 'Users are responsible for decisions based on AI suggestions',
        warning: false
      }, {
        text: 'Misuse or offensive behavior results in account suspension',
        warning: false
      }, {
        text: 'EchoRemedy can update services or features without prior notice',
        warning: false
      }, {
        text: 'Users must be 13 years or older to use the platform',
        warning: false
      }, {
        text: 'For emergencies, always consult a licensed healthcare provider',
        warning: true
      }].map((item, index) => <li key={index} className="flex items-start gap-2">
            <Shield className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
            <span className={`text-sm ${item.warning ? 'text-red-600 font-semibold' : 'text-gray-700'}`}>
              {item.text}
            </span>
          </li>)}
      </ul>
    </div>;
  const renderContent = () => {
    if (title === 'About Us') {
      return renderAboutUsContent();
    } else if (title === 'Privacy Policy') {
      return renderPrivacyPolicyContent();
    } else if (title === 'Terms of Service') {
      return renderTermsContent();
    }
    return <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{content}</div>;
  };
  return <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] relative animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-110">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {renderContent()}
        </div>
      </div>
    </div>;
};
export default Modal;