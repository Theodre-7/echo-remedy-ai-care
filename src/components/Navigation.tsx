
import React, { useState } from 'react';
import { Menu, X, User, LogOut, Home, LayoutDashboard, Camera, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface NavigationProps {
  userType?: 'user' | 'admin' | 'guest';
  userName?: string;
}

const Navigation = ({ userType = 'guest', userName }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleNavigation = (href: string) => {
    navigate(href);
    setIsMobileMenuOpen(false);
  };

  const getUserNavItems = () => {
    if (userType === 'admin') {
      return [
        { name: 'Submissions', href: '/admin/submissions', icon: LayoutDashboard },
        { name: 'Remedies', href: '/admin/remedies', icon: MessageCircle },
      ];
    }
    
    if (userType === 'user') {
      return [
        { name: 'Home', href: '/', icon: Home },
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Scan', href: '/scan', icon: Camera },
        { name: 'Chat with Medxo', href: '/chat', icon: MessageCircle },
      ];
    }

    return [
      { name: 'Home', href: '/', icon: Home },
    ];
  };

  const navItems = getUserNavItems();

  return (
    <nav className="crystal-nav transition-all duration-300 hover:bg-white/20 hover:backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => handleNavigation('/')}>
            <h1 className="text-2xl font-bold text-primary">
              EchoRemedy
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2"
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* User Profile / Auth */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {userType !== 'guest' ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="font-medium">{userName || 'User'}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-foreground hover:text-red-600" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleNavigation('/auth')}>
                    Sign In
                  </Button>
                  <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={() => handleNavigation('/auth')}>
                    Get Started
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="text-foreground hover:text-primary"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass border-t border-border">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href)}
                className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors flex items-center gap-2 w-full text-left"
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </button>
            ))}
            
            {userType !== 'guest' ? (
              <div className="border-t border-border pt-4 mt-4">
                <div className="flex items-center px-3 py-2">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mr-3">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="font-medium">{userName || 'User'}</span>
                </div>
                <Button variant="ghost" size="sm" className="w-full justify-start text-red-600 hover:text-red-700" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="border-t border-border pt-4 mt-4 space-y-2">
                <Button variant="ghost" size="sm" className="w-full" onClick={() => handleNavigation('/auth')}>
                  Sign In
                </Button>
                <Button size="sm" className="w-full bg-primary hover:bg-primary/90" onClick={() => handleNavigation('/auth')}>
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
