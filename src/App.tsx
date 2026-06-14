import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import PropertyListingPage from './pages/PropertyListingPage';
import PropertyDetailsPage from './pages/PropertyDetailsPage';
import ContactPage from './pages/ContactPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import { Property } from './types';
import { SEED_PROPERTIES } from './seedData';
import { Phone, MessageCircle, ArrowUp } from 'lucide-react';

export default function App() {
  // Navigation Hash State
  const [currentPath, setCurrentPath] = useState<string>(window.location.hash || '#/');
  const [properties, setProperties] = useState<Property[]>([]);
  const [favoritesCount, setFavoritesCount] = useState<number>(0);
  const [isScrolledMajor, setIsScrolledMajor] = useState(false);

  // Sync route on hash events
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash || '#/');
      // Scroll to top on every change for a premium loading transition feel
      window.scrollTo({ top: 0, behavior: 'instant' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Fetch updated catalog on mount with robust static fallback for Netlify static deployments
  const fetchProperties = () => {
    fetch('/api/properties')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setProperties(data);
        } else {
          throw new Error('Fetched properties data is not an array');
        }
      })
      .catch(err => {
        console.warn('Failed to load properties catalog from Express API. Using local SEED fallback for static deployment.', err);
        setProperties(SEED_PROPERTIES);
      });
  };

  useEffect(() => {
    fetchProperties();
    syncFavoritesCount();

    // Catch bookmark updates
    window.addEventListener('storage', syncFavoritesCount);
    
    // Catch scroll position to show quick floating bottom triggers
    const handleScroll = () => {
      setIsScrolledMajor(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('storage', syncFavoritesCount);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const syncFavoritesCount = () => {
    const saved = JSON.parse(localStorage.getItem('swastik_favorites') || '[]');
    setFavoritesCount(saved.length);
  };

  const handleNavigate = (path: string) => {
    window.location.hash = path;
    setCurrentPath(path);
  };

  // Basic regex routing parser
  const renderPage = () => {
    const cleanPath = currentPath.split('?')[0];

    if (cleanPath === '#/' || cleanPath === '#' || cleanPath === '') {
      return <HomePage onNavigate={handleNavigate} properties={properties} />;
    }
    if (cleanPath === '#/properties') {
      return <PropertyListingPage onNavigate={handleNavigate} properties={properties} />;
    }
    if (cleanPath.startsWith('#/property/')) {
      const id = cleanPath.substring('#/property/'.length);
      return <PropertyDetailsPage id={id} onNavigate={handleNavigate} properties={properties} />;
    }
    if (cleanPath === '#/contact') {
      return <ContactPage onNavigate={handleNavigate} />;
    }
    if (cleanPath === '#/admin/login') {
      return <AdminLoginPage onNavigate={handleNavigate} />;
    }
    if (cleanPath === '#/admin/dashboard') {
      return (
        <AdminDashboardPage 
          onNavigate={handleNavigate} 
          properties={properties} 
          onRefreshProperties={fetchProperties} 
        />
      );
    }

    // Fallback error screen
    return (
      <div className="pt-32 pb-24 text-center">
        <h3 className="font-serif text-lg font-bold text-luxury-blue">Section Not Found</h3>
        <p className="text-xs text-gray-400 mt-1">Please return back to our primary home directory.</p>
        <button 
          onClick={() => handleNavigate('#/')}
          className="mt-4 bg-luxury-blue text-white text-xs px-5 py-2 rounded-xl"
        >
          Return Home
        </button>
      </div>
    );
  };

  const startWhatsAppGeneralChat = () => {
    const text = encodeURIComponent("Hello Swastik Group Lucknow, checking your premium property portfolio. Please register my inquiry.");
    window.open(`https://wa.me/919999999999?text=${text}`, '_blank');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="swastik-root-app" className="min-h-screen bg-gray-50 flex flex-col justify-between overflow-x-hidden font-sans">
      
      {/* Top Navigation */}
      <Navbar 
        currentPath={currentPath} 
        onNavigate={handleNavigate} 
        favoritesCount={favoritesCount} 
      />

      {/* Main Dynamic Viewport */}
      <main className="flex-1">
        {renderPage()}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Floating Action Triggers panel (WhatsApp Chat, Call Agent, Top link scroll) */}
      <div id="floating-actions-bar" className="fixed bottom-6 right-6 z-40 flex flex-col space-y-3 items-end">
        
        {/* Call Now Trigger */}
        <a 
          href="tel:+919999999999"
          className="flex items-center space-x-2 bg-gradient-to-r from-luxury-blue to-luxury-dark text-white border border-luxury-gold/45 pl-3 pr-4 py-2.5 rounded-full shadow-2xl transition-all scale-100 hover:scale-105 active:scale-95 group"
          title="Direct Dial Voice Agent"
        >
          <div className="w-5 h-5 bg-gradient-to-tr from-luxury-gold to-luxury-gold-light rounded-full flex items-center justify-center text-luxury-dark shrink-0">
            <Phone className="w-2.5 h-2.5" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-luxury-gold-light group-hover:text-white transition-colors">Call Agent</span>
        </a>

        {/* WhatsApp Trigger */}
        <button
          onClick={startWhatsAppGeneralChat}
          className="flex items-center space-x-2 bg-[#25D366] hover:bg-[#128C7E] text-white pl-3 pr-4 py-2.5 rounded-full shadow-2xl transition-all scale-100 hover:scale-105 active:scale-95 group cursor-pointer"
          title="Start Instant WhatsApp Chat"
        >
          <MessageCircle className="w-5 h-5 shrink-0" />
          <span className="text-[10px] font-bold uppercase tracking-wider">WhatsApp us</span>
        </button>

        {/* Smart Scroll To Top button */}
        {isScrolledMajor && (
          <button
            onClick={scrollToTop}
            className="p-3 bg-white/90 backdrop-blur hover:bg-white text-luxury-blue rounded-full shadow-lg border border-gray-100 transition-all cursor-pointer animate-fade-in"
            title="Scroll To Top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        )}

      </div>
    </div>
  );
}
