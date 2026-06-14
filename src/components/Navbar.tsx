import React, { useState, useEffect } from 'react';
import { Home, Search, Heart, ShieldAlert, Phone, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  favoritesCount: number;
}

export default function Navbar({ currentPath, onNavigate, favoritesCount }: NavbarProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const checkAdmin = () => {
      const token = localStorage.getItem('swastik_admin_token');
      setIsAdmin(!!token);
    };
    checkAdmin();
    
    // Add event listener for shifts in localstorage to instantly change login states
    window.addEventListener('storage', checkAdmin);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('storage', checkAdmin);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [currentPath]);

  const handleLogout = () => {
    localStorage.removeItem('swastik_admin_token');
    setIsAdmin(false);
    onNavigate('#/');
    window.dispatchEvent(new Event('storage'));
  };

  const navLinks = [
    { label: 'Home', path: '#/' },
    { label: 'Browse Properties', path: '#/properties' },
    { label: 'Contact Us', path: '#/contact' },
  ];

  const cleanPath = currentPath.split('?')[0];
  const isHomepage = cleanPath === '#/' || cleanPath === '#' || cleanPath === '';

  const isLinkActive = (linkPath: string) => {
    if (linkPath === '#/') {
      return isHomepage;
    }
    return cleanPath === linkPath;
  };

  // Dynamic contrast configuration for the brand header elements
  // This automatically computes text, subtext, and logo container styles to guarantee maximum visibility
  // whether the underlying header background is dark or light.
  const isHeaderBgDark = true; // True for our current luxury theme (bg-luxury-dark / bg-transparent on dark hero)

  const logoContainerClass = isHeaderBgDark 
    ? 'bg-gradient-to-br from-[#162758] to-luxury-dark border-2 border-luxury-gold shadow-[0_0_12px_rgba(197,168,92,0.35)] text-luxury-gold-light' 
    : 'bg-white border-2 border-luxury-blue text-luxury-blue shadow-md';

  const logoSvgColorClass = isHeaderBgDark 
    ? 'text-luxury-gold-light group-hover:text-luxury-gold transition-colors' 
    : 'text-luxury-blue group-hover:text-luxury-gold transition-colors';

  const brandTitleClass = isHeaderBgDark 
    ? 'text-white font-serif text-xl sm:text-2xl font-extrabold tracking-wide leading-none group-hover:text-luxury-gold transition-colors drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]' 
    : 'text-luxury-blue font-serif text-xl sm:text-2xl font-extrabold tracking-wide leading-none group-hover:text-luxury-gold transition-colors drop-shadow-sm';

  const brandSubtextClass = isHeaderBgDark 
    ? 'text-luxury-gold-light font-sans text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.2em] mt-0.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]' 
    : 'text-gray-600 font-sans text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.18em] mt-0.5';

  return (
    <nav 
      id="main-navbar"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled || !isHomepage
          ? 'bg-gradient-to-r from-[#080E21] via-[#0D193A] to-[#0E1B3C] backdrop-blur-md shadow-[0_4px_25px_rgba(0,0,0,0.5)] border-b border-luxury-gold/30 py-3.5' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Brand Logo */}
          <div 
            id="brand-logo"
            onClick={() => onNavigate('#/')} 
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className={`w-10 h-10 ${logoContainerClass} rounded-xl flex items-center justify-center transform transition-all duration-300 group-hover:scale-105 shrink-0`}>
              <svg className={`w-6.5 h-6.5 ${logoSvgColorClass}`} viewBox="0 0 100 100" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                {/* Elegant outer diamond shield */}
                <path d="M50 15 L82 47 L50 85 L18 47 Z" strokeWidth="4.5" strokeLinejoin="round" />
                {/* Stylized monogram 'S' matching luxury typography */}
                <path d="M38 36 C38 29, 62 29, 62 38 C62 47, 38 47, 38 56 C38 65, 62 65, 62 58" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                {/* Real estate roof gable peak */}
                <path d="M32 22 L50 10 L68 22" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex flex-col justify-center">
              <h1 className={brandTitleClass}>
                Swastik Group
              </h1>
              <p className={brandSubtextClass}>
                Lucknow's Trusted Partner
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  onNavigate(link.path);
                  setIsMobileMenuOpen(false);
                }}
                className={`font-sans text-sm font-medium tracking-wide transition-colors duration-200 cursor-pointer ${
                  isLinkActive(link.path) 
                    ? 'text-luxury-gold border-b-2 border-luxury-gold pb-1' 
                    : 'text-gray-300 hover:text-luxury-gold-light'
                }`}
              >
                {link.label}
              </button>
            ))}

            {/* Public Saved Favorites Button */}
            <button 
              onClick={() => onNavigate('#/properties?favorites=true')}
              className="relative p-2 text-gray-300 hover:text-luxury-gold transition-colors"
              title="Saved Properties"
            >
              <Heart className={`w-5 h-5 ${favoritesCount > 0 ? 'fill-red-500 text-red-500' : ''}`} />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white font-mono text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Logged in Admin Actions or Login link */}
            {isAdmin ? (
              <div className="flex items-center space-x-4 border-l border-gray-700 pl-4">
                <button
                  onClick={() => onNavigate('#/admin/dashboard')}
                  className="flex items-center space-x-1 border border-luxury-gold px-3 py-1.5 rounded-lg text-xs font-semibold text-luxury-gold hover:bg-luxury-gold hover:text-luxury-blue transition-colors"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  title="Logout Admin"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onNavigate('#/admin/login')}
                className="text-xs text-gray-400 hover:text-luxury-gold transition-colors"
              >
                Admin Entrance
              </button>
            )}

            {/* Quick Contact buttons in Header */}
            <a 
              href="tel:+919999999999" 
              className="flex items-center space-x-2 bg-gradient-to-r from-luxury-gold to-luxury-gold-light hover:brightness-110 text-luxury-blue px-4 py-2 rounded-full text-xs font-bold transition-all shadow-md"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call +91-Swastik</span>
            </a>
          </div>

          {/* Mobile Hamburguer Trigger */}
          <div className="flex md:hidden items-center space-x-4">
            <button 
              onClick={() => onNavigate('#/properties?favorites=true')}
              className="relative p-2 text-gray-300"
            >
              <Heart className={`w-5.5 h-5.5 ${favoritesCount > 0 ? 'fill-red-500 text-red-500' : ''}`} />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white font-mono text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {favoritesCount}
                </span>
              )}
            </button>
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 text-gray-300 hover:text-luxury-gold focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gradient-to-b from-[#080E21] to-[#0E1B3C] border-b border-luxury-gold/35 shadow-2xl py-5 px-4 transition-all duration-300">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  onNavigate(link.path);
                  setIsMobileMenuOpen(false);
                }}
                className={`text-left font-sans text-base font-semibold py-2 border-b border-gray-800 transition-colors ${
                  isLinkActive(link.path) ? 'text-luxury-gold' : 'text-gray-300'
                }`}
              >
                {link.label}
              </button>
            ))}

            <button
              onClick={() => {
                onNavigate('#/properties?favorites=true');
                setIsMobileMenuOpen(false);
              }}
              className="text-left font-sans text-base font-semibold py-2 border-b border-gray-800 text-gray-300 flex items-center justify-between"
            >
              <span>Saved Favorites</span>
              <span className="bg-red-500 text-white px-2 py-0.5 text-xs rounded-full">{favoritesCount}</span>
            </button>

            {isAdmin ? (
              <>
                <button
                  onClick={() => {
                    onNavigate('#/admin/dashboard');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left font-sans text-base font-semibold py-2 border-b border-gray-800 text-luxury-gold"
                >
                  Admin Dashboard
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left font-sans text-base font-semibold py-2 border-b border-gray-800 text-red-400"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  onNavigate('#/admin/login');
                  setIsMobileMenuOpen(false);
                }}
                className="text-left font-sans text-base font-semibold py-2 border-b border-gray-800 text-gray-400"
              >
                Admin Login
              </button>
            )}

            <a 
              href="tel:+919999999999" 
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-luxury-gold to-luxury-gold-light text-luxury-blue py-3 rounded-xl font-bold shadow-md text-sm mt-2"
            >
              <Phone className="w-4 h-4" />
              <span>Call Us Now (+91-9999999999)</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
