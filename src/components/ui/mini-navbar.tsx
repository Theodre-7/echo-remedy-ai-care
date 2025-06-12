
"use client";

import React, { useState, useEffect, useRef } from 'react';

const AnimatedNavLink = ({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) => {
  const defaultTextColor = 'text-gray-300';
  const hoverTextColor = 'text-white';
  const textSizeClass = 'text-sm';

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) {
      onClick();
    }
  };

  return (
    <button onClick={handleClick} className={`group relative inline-block overflow-hidden h-5 flex items-center ${textSizeClass}`}>
      <div className="flex flex-col transition-transform duration-400 ease-out transform group-hover:-translate-y-1/2">
        <span className={defaultTextColor}>{children}</span>
        <span className={hoverTextColor}>{children}</span>
      </div>
    </button>
  );
};

interface NavbarProps {
  userType?: 'user' | 'admin' | 'guest';
  userName?: string;
  onNavigate?: (href: string) => void;
  onSignOut?: () => void;
}

export function MiniNavbar({ userType = 'guest', userName, onNavigate, onSignOut }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [headerShapeClass, setHeaderShapeClass] = useState('rounded-full');
  const shapeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (shapeTimeoutRef.current) {
      clearTimeout(shapeTimeoutRef.current);
    }

    if (isOpen) {
      setHeaderShapeClass('rounded-xl');
    } else {
      shapeTimeoutRef.current = setTimeout(() => {
        setHeaderShapeClass('rounded-full');
      }, 300);
    }

    return () => {
      if (shapeTimeoutRef.current) {
        clearTimeout(shapeTimeoutRef.current);
      }
    };
  }, [isOpen]);

  const logoElement = (
    <button onClick={() => onNavigate?.('/')} className="relative w-5 h-5 flex items-center justify-center">
      <span className="absolute w-1.5 h-1.5 rounded-full bg-gray-200 top-0 left-1/2 transform -translate-x-1/2 opacity-80"></span>
      <span className="absolute w-1.5 h-1.5 rounded-full bg-gray-200 left-0 top-1/2 transform -translate-y-1/2 opacity-80"></span>
      <span className="absolute w-1.5 h-1.5 rounded-full bg-gray-200 right-0 top-1/2 transform -translate-y-1/2 opacity-80"></span>
      <span className="absolute w-1.5 h-1.5 rounded-full bg-gray-200 bottom-0 left-1/2 transform -translate-x-1/2 opacity-80"></span>
    </button>
  );

  const getNavLinksData = () => {
    if (userType === 'admin') {
      return [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Submissions', href: '/admin/submissions' },
        { label: 'Remedies', href: '/admin/remedies' },
      ];
    }
    
    if (userType === 'user') {
      return [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Scan', href: '/scan' },
        { label: 'Journal', href: '/journal' },
        { label: 'Health Tips', href: '/health-tips' },
      ];
    }

    return [
      { label: 'Home', href: '/' },
    ];
  };

  const navLinksData = getNavLinksData();

  const authButtons = userType !== 'guest' ? (
    <div className="flex items-center gap-2 sm:gap-3">
      <div className="flex items-center gap-2 text-xs text-gray-300">
        <span>{userName || 'User'}</span>
      </div>
      <button 
        onClick={onSignOut}
        className="px-4 py-2 sm:px-3 text-xs sm:text-sm border border-[#333] bg-[rgba(31,31,31,0.62)] text-gray-300 rounded-full hover:border-white/50 hover:text-white transition-colors duration-200"
      >
        Logout
      </button>
    </div>
  ) : (
    <div className="flex items-center gap-2 sm:gap-3">
      <button 
        onClick={() => onNavigate?.('/auth')}
        className="px-4 py-2 sm:px-3 text-xs sm:text-sm border border-[#333] bg-[rgba(31,31,31,0.62)] text-gray-300 rounded-full hover:border-white/50 hover:text-white transition-colors duration-200"
      >
        Sign In
      </button>
      <div className="relative group">
        <div className="absolute inset-0 -m-2 rounded-full hidden sm:block bg-gray-100 opacity-40 filter blur-lg pointer-events-none transition-all duration-300 ease-out group-hover:opacity-60 group-hover:blur-xl group-hover:-m-3"></div>
        <button 
          onClick={() => onNavigate?.('/auth')}
          className="relative z-10 px-4 py-2 sm:px-3 text-xs sm:text-sm font-semibold text-black bg-gradient-to-br from-gray-100 to-gray-300 rounded-full hover:from-gray-200 hover:to-gray-400 transition-all duration-200"
        >
          Get Started
        </button>
      </div>
    </div>
  );

  return (
    <header className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-20
                       flex flex-col items-center
                       pl-6 pr-6 py-3 backdrop-blur-sm
                       ${headerShapeClass}
                       border border-[#333] bg-[#1f1f1f57]
                       w-[calc(100%-2rem)] sm:w-auto
                       transition-[border-radius] duration-0 ease-in-out`}>

      <div className="flex items-center justify-between w-full gap-x-6 sm:gap-x-8">
        <div className="flex items-center">
           {logoElement}
        </div>

        <nav className="hidden sm:flex items-center space-x-4 sm:space-x-6 text-sm">
          {navLinksData.map((link) => (
            <AnimatedNavLink key={link.href} href={link.href} onClick={() => onNavigate?.(link.href)}>
              {link.label}
            </AnimatedNavLink>
          ))}
        </nav>

        <div className="hidden sm:flex">
          {authButtons}
        </div>

        <button className="sm:hidden flex items-center justify-center w-8 h-8 text-gray-300 focus:outline-none" onClick={toggleMenu} aria-label={isOpen ? 'Close Menu' : 'Open Menu'}>
          {isOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          )}
        </button>
      </div>

      <div className={`sm:hidden flex flex-col items-center w-full transition-all ease-in-out duration-300 overflow-hidden
                       ${isOpen ? 'max-h-[1000px] opacity-100 pt-4' : 'max-h-0 opacity-0 pt-0 pointer-events-none'}`}>
        <nav className="flex flex-col items-center space-y-4 text-base w-full">
          {navLinksData.map((link) => (
            <button key={link.href} onClick={() => { onNavigate?.(link.href); setIsOpen(false); }} className="text-gray-300 hover:text-white transition-colors w-full text-center">
              {link.label}
            </button>
          ))}
        </nav>
        <div className="flex flex-col items-center space-y-4 mt-4 w-full">
          {userType !== 'guest' ? (
            <>
              <div className="text-xs text-gray-300">{userName || 'User'}</div>
              <button 
                onClick={onSignOut}
                className="px-4 py-2 text-xs border border-[#333] bg-[rgba(31,31,31,0.62)] text-gray-300 rounded-full hover:border-white/50 hover:text-white transition-colors duration-200 w-full"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => { onNavigate?.('/auth'); setIsOpen(false); }}
                className="px-4 py-2 text-xs border border-[#333] bg-[rgba(31,31,31,0.62)] text-gray-300 rounded-full hover:border-white/50 hover:text-white transition-colors duration-200 w-full"
              >
                Sign In
              </button>
              <button 
                onClick={() => { onNavigate?.('/auth'); setIsOpen(false); }}
                className="px-4 py-2 text-xs font-semibold text-black bg-gradient-to-br from-gray-100 to-gray-300 rounded-full hover:from-gray-200 hover:to-gray-400 transition-all duration-200 w-full"
              >
                Get Started
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
