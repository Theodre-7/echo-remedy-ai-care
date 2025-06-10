
import React from 'react';
import Navigation from '@/components/Navigation';
import LandingHero from '@/components/LandingHero';
import MedxoChatbot from '@/components/MedxoChatbot';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation userType="guest" />
      <LandingHero />
      <MedxoChatbot />
    </div>
  );
};

export default Index;
