import React, { useState, useEffect } from 'react';
import { Heart, MapPin, BedDouble, Bath, Square, ChevronRight, MessageCircle } from 'lucide-react';
import { Property } from '../types';

interface PropertyCardProps {
  key?: string;
  property: Property;
  onNavigate: (path: string) => void;
  onFavoritesChanged?: () => void;
}

export const formatPriceInINR = (price: number) => {
  if (price >= 10000000) {
    return `₹ ${(price / 10000000).toFixed(2)} Cr`;
  } else if (price >= 100000) {
    return `₹ ${(price / 100000).toFixed(2)} Lakh`;
  }
  return `₹ ${price.toLocaleString('en-IN')}`;
};

export default function PropertyCard({ property, onNavigate, onFavoritesChanged }: PropertyCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('swastik_favorites') || '[]');
    setIsFavorited(favorites.includes(property.id));
  }, [property.id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    const favorites = JSON.parse(localStorage.getItem('swastik_favorites') || '[]');
    let updated: string[];
    
    if (favorites.includes(property.id)) {
      updated = favorites.filter((id: string) => id !== property.id);
      setIsFavorited(false);
    } else {
      updated = [...favorites, property.id];
      setIsFavorited(true);
    }
    
    localStorage.setItem('swastik_favorites', JSON.stringify(updated));
    
    // Dispatch standard event to trigger nav change
    window.dispatchEvent(new Event('storage'));
    if (onFavoritesChanged) {
      onFavoritesChanged();
    }
  };

  const startWhatsAppChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = encodeURIComponent(`Hello Swastik Group, I am interested in your property in Lucknow: "${property.title}" [Price: ${formatPriceInINR(property.price)}, Located in: ${property.locality}]. Please share more details.`);
    window.open(`https://wa.me/919999999999?text=${text}`, '_blank');
  };

  return (
    <div 
      id={`property-card-${property.id}`}
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col h-full hover:-translate-y-1 cursor-pointer"
      onClick={() => onNavigate(`#/property/${property.id}`)}
    >
      {/* Property Image Container */}
      <div className="relative overflow-hidden h-52 sm:h-56 bg-gray-100 shrink-0">
        <img 
          src={property.featuredImage} 
          alt={property.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        
        {/* Dark overlay gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

        {/* Status badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-md text-white ${
            property.saleOrRent === 'Buy' ? 'bg-luxury-blue' : 'bg-luxury-gold'
          }`}>
            For {property.saleOrRent === 'Buy' ? 'Sale' : 'Rent'}
          </span>
          {property.featured && (
            <span className="text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-md bg-amber-500 text-luxury-dark shadow-sm">
              ★ Featured
            </span>
          )}
        </div>

        {/* Favorite circle */}
        <button
          onClick={toggleFavorite}
          className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full shadow-md text-gray-500 hover:text-red-500 transition-colors z-10 cursor-pointer"
          aria-label="Add to Favorites"
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </button>

        {/* Price tag over gradient */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="font-mono text-lg font-bold text-white tracking-wide drop-shadow-md">
            {formatPriceInINR(property.price)}
            {property.saleOrRent === 'Rent' && <span className="text-xs font-sans text-gray-200"> / month</span>}
          </span>
        </div>
        
        {/* Status indicator (Available, Sold, Rented) */}
        {property.status !== 'Available' && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-13">
            <span className="border-2 border-white text-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest rotate-[-12deg]">
              {property.status}
            </span>
          </div>
        )}
      </div>

      {/* Property Details content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category & Locality */}
        <div className="flex items-center justify-between text-[11px] text-gray-500 font-semibold mb-1">
          <span className="text-luxury-gold uppercase tracking-wider">{property.type}</span>
          <div className="flex items-center space-x-0.5 text-gray-400">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate max-w-[120px]">{property.locality}</span>
          </div>
        </div>

        {/* Title */}
        <h4 className="font-serif text-sm font-bold text-luxury-blue line-clamp-1 group-hover:text-luxury-gold transition-colors mb-2">
          {property.title}
        </h4>

        {/* Quick Specs Icons */}
        <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-gray-50 bg-gray-50/50 rounded-xl px-2 mb-4 mt-auto">
          <div className="flex items-center space-x-1 text-gray-500 justify-center">
            <BedDouble className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-mono font-medium">{property.bedrooms || '—'} <span className="text-[10px] text-gray-400 font-sans">BHK</span></span>
          </div>
          <div className="flex items-center space-x-1 text-gray-500 justify-center">
            <Bath className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-mono font-medium">{property.bathrooms || '—'} <span className="text-[10px] text-gray-400 font-sans">Bath</span></span>
          </div>
          <div className="flex items-center space-x-1 text-gray-500 justify-center">
            <Square className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs font-mono font-medium">{property.area} <span className="text-[9px] text-gray-400 font-sans">sqft</span></span>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex items-center space-x-2 pt-1 mt-auto">
          <button 
            onClick={() => onNavigate(`#/property/${property.id}`)}
            className="flex-1 bg-gray-100 hover:bg-luxury-blue hover:text-white text-luxury-blue py-2 px-3 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center space-x-1 cursor-pointer group/btn"
          >
            <span>View details</span>
            <ChevronRight className="w-3 h-3 transform transition-transform group-hover/btn:translate-x-0.5" />
          </button>
          
          <button
            onClick={startWhatsAppChat}
            className="p-2.5 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl transition-all shadow-md flex items-center justify-center cursor-pointer"
            title="Chat on WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
