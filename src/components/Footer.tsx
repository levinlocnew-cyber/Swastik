import React from 'react';
import { Mail, Phone, MapPin, Shield, Star } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer id="app-footer" className="bg-[#060D1E] text-gray-400 font-sans border-t border-luxury-gold/20">
      
      {/* Top Banner Accent */}
      <div className="bg-gradient-to-r from-luxury-blue via-luxury-dark to-luxury-blue py-6 px-4 border-b border-luxury-gold/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-4">
          <div>
            <h4 className="text-white font-serif text-lg font-semibold tracking-wide">
              Swastik Group — Lucknow's Premier Real Estate Agency
            </h4>
            <p className="text-xs text-luxury-gold-light mt-1">
              Providing modern architectural properties, plots, and offices across Hazratganj, Gomti Nagar & Sushant Golf City.
            </p>
          </div>
          <button
            onClick={() => onNavigate('#/properties')}
            className="bg-transparent hover:bg-luxury-gold border-2 border-luxury-gold hover:text-luxury-blue text-luxury-gold text-xs font-bold uppercase tracking-wider py-2 px-6 rounded-lg transition-all duration-300"
          >
            Explore Active Properties
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Information */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => onNavigate('#/')}>
            <div className="w-9 h-9 bg-luxury-blue border border-luxury-gold/40 rounded-lg flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-105 shrink-0">
              <svg className="w-5.5 h-5.5 text-luxury-gold-light group-hover:text-luxury-gold transition-colors" viewBox="0 0 100 100" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                {/* Elegant outer diamond shield */}
                <path d="M50 15 L82 47 L50 85 L18 47 Z" strokeWidth="4.5" strokeLinejoin="round" />
                {/* Stylized monogram 'S' matching luxury typography */}
                <path d="M38 36 C38 29, 62 29, 62 38 C62 47, 38 47, 38 56 C38 65, 62 65, 62 58" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                {/* Real estate roof gable peak */}
                <path d="M32 22 L50 10 L68 22" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="font-serif text-lg font-bold text-white tracking-widest group-hover:text-luxury-gold transition-colors">Swastik Group</span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            Your trusted property partner in Lucknow, Uttar Pradesh. Specializing in high-value properties, verified commercial spaces, luxury villas, and LDA-approved residential plot deals.
          </p>
          <div className="flex items-center space-x-1.5 text-luxury-gold text-xs">
            <Shield className="w-4.5 h-4.5" />
            <span className="font-semibold">LDA Approved & RERA Registered</span>
          </div>
        </div>

        {/* Categories Quick Links */}
        <div>
          <h5 className="font-serif text-white text-sm font-semibold tracking-widest uppercase mb-4 text-shadow-gold">Property Types</h5>
          <ul className="space-y-2 text-xs">
            {['Residential', 'Commercial', 'Plot/Land', 'Villa', 'Apartment', 'Shop', 'Independent House'].map((category) => (
              <li key={category}>
                <button 
                  onClick={() => onNavigate(`#/properties?type=${category}`)}
                  className="hover:text-luxury-gold transition-colors text-left"
                >
                  Properties for {category}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Site Links */}
        <div>
          <h5 className="font-serif text-white text-sm font-semibold tracking-widest uppercase mb-4 text-shadow-gold">Useful Links</h5>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => onNavigate('#/')} className="hover:text-luxury-gold transition-colors">Homepage</button>
            </li>
            <li>
              <button onClick={() => onNavigate('#/properties')} className="hover:text-luxury-gold transition-colors">Browse Lucknow Properties</button>
            </li>
            <li>
              <button onClick={() => onNavigate('#/properties?saleOrRent=Buy')} className="hover:text-luxury-gold transition-colors">Properties for Sale</button>
            </li>
            <li>
              <button onClick={() => onNavigate('#/properties?saleOrRent=Rent')} className="hover:text-luxury-gold transition-colors">Affordable Rents</button>
            </li>
            <li>
              <button onClick={() => onNavigate('#/contact')} className="hover:text-luxury-gold transition-colors">Make an Inquiry</button>
            </li>
            <li>
              <button onClick={() => onNavigate('#/admin/login')} className="hover:text-luxury-gold transition-colors">Staff Entrance Only</button>
            </li>
          </ul>
        </div>

        {/* Office Contact Info */}
        <div className="space-y-3">
          <h5 className="font-serif text-white text-sm font-semibold tracking-widest uppercase mb-4 text-shadow-gold">Head Office</h5>
          
          <div className="flex items-start space-x-2.5 text-xs">
            <MapPin className="w-4 h-4 text-luxury-gold shrink-0 mt-0.5" />
            <span>Halwasiya House, Hazratganj, Lucknow, Uttar Pradesh, 226001</span>
          </div>

          <div className="flex items-center space-x-2.5 text-xs">
            <Phone className="w-4 h-4 text-luxury-gold shrink-0" />
            <a href="tel:+919999999999" className="hover:text-luxury-gold transition-colors">+91 99999 99999</a>
          </div>

          <div className="flex items-center space-x-2.5 text-xs border-b border-gray-800 pb-2">
            <Mail className="w-4 h-4 text-luxury-gold shrink-0" />
            <a href="mailto:groupswastik8@gmail.com" className="hover:text-luxury-gold transition-colors">groupswastik8@gmail.com</a>
          </div>

          <div className="pt-1 flex space-x-1 text-amber-500">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-3.5 h-3.5 fill-current" />
            ))}
            <span className="text-[10px] text-gray-400 font-semibold ml-1">4.9 Lucknow Choice</span>
          </div>
        </div>

      </div>

      <div className="bg-[#040813] py-6 text-center text-xs text-gray-500 border-t border-gray-900 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-center gap-3">
          <p>© {new Date().getFullYear()} Swastik Group. All rights reserved.</p>
          <p className="text-[10px]">Your Trusted Property Partner in Lucknow, Uttar Pradesh, India.</p>
        </div>
      </div>

    </footer>
  );
}
