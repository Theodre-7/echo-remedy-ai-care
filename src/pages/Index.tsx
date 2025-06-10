
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import LandingHero from '@/components/LandingHero';
import MedxoChatbot from '@/components/MedxoChatbot';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <Navigation userType={user ? "user" : "guest"} userName={user?.user_metadata?.full_name || user?.email} />
      <LandingHero />
      <MedxoChatbot />
    </div>
  );
};

export default Index;
