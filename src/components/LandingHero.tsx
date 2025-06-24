import React, { useState } from 'react';
import { Camera, MessageCircle, History, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Modal from '@/components/Modal';
const LandingHero = () => {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    content: string;
  }>({
    isOpen: false,
    title: '',
    content: ''
  });
  const handleGetStarted = () => {
    if (user) {
      navigate('/scan');
    } else {
      navigate('/auth');
    }
  };
  const handleLearnMore = () => {
    // Scroll to features section or navigate to about page
    const featuresSection = document.querySelector('#features');
    if (featuresSection) {
      featuresSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  const openModal = (title: string, content: string) => {
    setModalState({
      isOpen: true,
      title,
      content
    });
  };
  const closeModal = () => {
    setModalState({
      isOpen: false,
      title: '',
      content: ''
    });
  };
  const aboutUsContent = `Developed by: **Sanjeevi Ram**

🔗 LinkedIn: https://www.linkedin.com/in/sanjeevi-ram-274947298/
🔗 Twitter: https://x.com/sanjuxcoderx?s=21

---

🩺 **Other Services Offered by EchoRemedy**:
- Upload photo & analyze the disease/infection
- AI-generated summary of the condition
- MedxoBot: Chat assistant for disorder queries & emergency guidance
- Scan history tracking with timestamps
- Downloadable health reports
- Personalized home remedies for symptoms
- Interactive health journals
- Daily health & wellness tips`;
  const privacyPolicyContent = `EchoRemedy respects your privacy. This page outlines how we handle your data:

- Uploaded photos are stored securely and used only for analysis purposes.
- Your chat interactions with MedxoBot are stored anonymously to improve service.
- We do not share or sell your personal data to third parties.
- Cookies may be used to enhance your experience and retain login/session info.
- You can delete your data anytime by contacting support.

By using EchoRemedy, you agree to the collection and usage of your data in accordance with this policy.`;
  const termsOfServiceContent = `By using EchoRemedy, you agree to the following terms:

- The AI-generated outputs (remedies, suggestions, urgency levels) are mock and **not a substitute for professional medical advice**.
- Users are solely responsible for their health decisions based on app insights.
- Misuse of the platform, including offensive queries or malicious uploads, will result in account suspension.
- EchoRemedy reserves the right to modify or discontinue any part of the service without prior notice.
- Users must be 13 years or older to use the platform.

For medical emergencies, consult a licensed healthcare provider immediately.`;
  const features = [{
    icon: Camera,
    title: 'AI Image Analysis',
    description: 'Upload photos of symptoms and get instant AI-powered analysis with remedy suggestions.'
  }, {
    icon: MessageCircle,
    title: 'Medxo Chatbot',
    description: 'Chat with our medical assistant for personalized advice and symptom guidance.'
  }, {
    icon: History,
    title: 'Symptom History',
    description: 'Track your health journey with detailed records of past symptoms and treatments.'
  }, {
    icon: Shield,
    title: 'Safe & Secure',
    description: 'Your health data is protected with enterprise-grade security and privacy.'
  }];
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Find Remedies for
              <span className="text-primary block">Minor Symptoms Instantly</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Upload photos of visible symptoms like rashes, cuts, or swelling, and get AI-powered 
              remedy suggestions, urgency ratings, and professional guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-3 animate-scale-in" onClick={handleGetStarted}>
                {user ? 'Start Scanning' : 'Get Started Free'}
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-3 animate-scale-in" onClick={handleLearnMore}>
                Learn More
              </Button>
            </div>
          </div>

          {/* Medical Illustration */}
          <div className="mt-16 flex justify-center animate-slide-up">
            <div className="relative">
              <div className="w-96 h-64 bg-gradient-to-r from-primary/10 to-success/10 rounded-3xl flex items-center justify-center border border-primary/20">
                <div className="text-center">
                  <Camera className="w-16 h-16 text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground font-medium">Upload • Analyze • Heal</p>
                </div>
              </div>
              {/* Floating elements */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-success rounded-full flex items-center justify-center animate-pulse">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-warning rounded-full flex items-center justify-center animate-pulse">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Your Health, Our Technology
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the future of healthcare with our comprehensive suite of AI-powered tools
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => <div key={feature.title} className="medical-card text-center animate-fade-in" style={{
            animationDelay: `${index * 0.1}s`
          }}>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>)}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-primary to-success">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust EchoRemedy for quick, reliable health guidance
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-3 bg-white text-primary hover:bg-white/90" onClick={handleGetStarted}>
            {user ? 'Go to Dashboard' : 'Start Your Health Journey'}
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold text-primary mb-4">EchoRemedy</h3>
              <p className="text-gray-300 mb-4 max-w-md">
                Empowering individuals with AI-driven health insights for minor symptoms and injuries.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Quick Links</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <button onClick={() => openModal('About Us', aboutUsContent)} className="hover:text-primary transition-colors cursor-pointer">
                    About Us
                  </button>
                </li>
                <li>
                  <button onClick={() => openModal('Privacy Policy', privacyPolicyContent)} className="hover:text-primary transition-colors cursor-pointer">
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button onClick={() => openModal('Terms of Service', termsOfServiceContent)} className="hover:text-primary transition-colors cursor-pointer">
                    Terms of Service
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Contact</h4>
              <ul className="space-y-2 text-gray-300">
                <li>sanjeeviram@gmail.com</li>
                <li>Made with Care</li>
                <li>24/7 Support</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 EchoRemedy. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <Modal title={modalState.title} content={modalState.content} isOpen={modalState.isOpen} onClose={closeModal} />
    </div>;
};
export default LandingHero;