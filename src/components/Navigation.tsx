
import React from 'react';
import { MiniNavbar } from '@/components/ui/mini-navbar';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface NavigationProps {
  userType?: 'user' | 'admin' | 'guest';
  userName?: string;
}

const Navigation = ({ userType = 'guest', userName }: NavigationProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleNavigation = (href: string) => {
    navigate(href);
  };

  return (
    <MiniNavbar 
      userType={userType}
      userName={userName}
      onNavigate={handleNavigation}
      onSignOut={handleSignOut}
    />
  );
};

export default Navigation;
