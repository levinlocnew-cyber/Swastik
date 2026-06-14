import React, { useState, useEffect } from 'react';
import { MapPin, BedDouble, Bath, Square, Shield, Share2, Heart, Calendar, Phone, Mail, ChevronRight, ArrowLeft, MessageCircle, Star } from 'lucide-react';
import InquiryForm from '../components/InquiryForm';
import PropertyCard, { formatPriceInINR } from '../components/PropertyCard';
import { Property } from '../types';

interface PropertyDetailsPageProps {
  id: string;
  onNavigate: (path: string) => void;
  properties: Property[];
}

export default function PropertyDetailsPage({ id, onNavigate, properties }: PropertyDetailsPageProps) {
  const [property, setProperty] = useState<Property | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');
  const [isFavorited, setIsFavorited] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    // Locate target property in local array
    const target = properties.find(p => p.id === id);
    if (target) {
      setProperty(target);
      setActiveImage(target.featuredImage);
      
      const favorites = JSON.parse(localStorage.getItem('swastik_favorites') || '[]');
      setIsFavorited(favorites.includes(target.id));
    }
  }, [id, properties]);

  if (!property) {
    return (
      <div className="pt-32 pb-24 text-center">
        <h3 className="font-serif text-xl font-bold text-luxury-blue">Retrieving property details...</h3>
        <p className="text-xs text-gray-400 mt-2">Checking Lucknow registers or database records.</p>
        <button 
          onClick={() => onNavigate('#/properties')}
          className="mt-4 bg-luxury-blue text-white px-5 py-2 rounded-xl text-xs"
        >
          View Listings
        </button>
      </div>
    );
  }

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('swastik_favorites') || '[]');
    let updated: string[];
    
    if (favorites.includes(property.id)) {
      updated = favorites.filter((favId: string) => favId !== property.id);
      setIsFavorited(false);
    } else {
      updated = [...favorites, property.id];
      setIsFavorited(true);
    }
    
    localStorage.setItem('swastik_favorites', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  const handleShare = () => {
    const url = `${window.location.origin}/#/property/${property.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    });
  };

  const startWhatsAppChat = () => {
    const text = encodeURIComponent(`Hello Swastik Group, I am interested in property: "${property.title}" [Price: ${formatPriceInINR(property.price)}, Locality: ${property.locality}]. Please send more layout detail photos.`);
    window.open(`https://wa.me/919999999999?text=${text}`, '_blank');
  };

  // Find related properties under same category or locality in Lucknow
  const relatedProperties = properties
    .filter(p => p.id !== property.id && (p.type === property.type || p.locality === property.locality))
    .slice(0, 3);

  return (
    <div id="details-page-container" className="pt-24 pb-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back and Bookmark Action bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
          <button
            onClick={() => onNavigate('#/properties')}
            className="flex items-center space-x-1.5 text-xs text-gray-500 hover:text-luxury-blue font-bold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Property Listings</span>
          </button>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              onClick={toggleFavorite}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer border transition-colors ${
                isFavorited 
                  ? 'bg-red-50 border-red-200 text-red-600' 
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
              <span>{isFavorited ? 'Added to Saved' : 'Bookmark Property'}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer border bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              <Share2 className="w-4 h-4" />
              <span>{shareCopied ? 'Link Copied!' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Content Matrix Block */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
          
          {/* Left Column: Visual Carousel gallery, description, facilities, map */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Visual Carousel */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <div className="relative rounded-xl overflow-hidden h-[300px] sm:h-[450px] bg-gray-50">
                <img 
                  src={activeImage} 
                  alt={property.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                
                {/* Sale and Rera badge */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="text-[10px] uppercase font-extrabold tracking-widest bg-luxury-blue text-white px-3 py-1.5 rounded-md">
                    For {property.saleOrRent === 'Buy' ? 'Sale' : 'Rent'}
                  </span>
                  {property.status !== 'Available' && (
                    <span className="text-[10px] uppercase font-extrabold tracking-widest bg-red-600 text-white px-3 py-1.5 rounded-md">
                      {property.status}
                    </span>
                  )}
                  <span className="text-[10px] uppercase font-extrabold tracking-widest bg-emerald-600 text-white px-3 py-1.5 rounded-md">
                    LDA Vetted RERA
                  </span>
                </div>
              </div>

              {/* Thumbnails list */}
              {property.images && property.images.length > 1 && (
                <div className="flex space-x-2.5 overflow-x-auto pb-1">
                  {property.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(img)}
                      className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-transform cursor-pointer ${
                        activeImage === img ? 'border-luxury-gold scale-95' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Core Specs Grid Panel */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-luxury-gold">{property.type} in {property.locality}</span>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-luxury-blue mt-1">{property.title}</h1>
                <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                  <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                  <span>{property.address}, {property.locality}, Lucknow, Uttar Pradesh</span>
                </div>
              </div>

              {/* Major specs icons bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-t border-b border-gray-100 text-center">
                <div className="space-y-1 bg-gray-50/50 p-2.5 rounded-xl border border-gray-50">
                  <span className="text-[10px] text-gray-400 uppercase font-semibold">Budget (INR)</span>
                  <p className="font-mono text-base font-bold text-luxury-blue">{formatPriceInINR(property.price)}</p>
                </div>
                <div className="space-y-1 bg-gray-50/50 p-2.5 rounded-xl border border-gray-50">
                  <span className="text-[10px] text-gray-400 uppercase font-semibold">BHK Units</span>
                  <p className="font-mono text-base font-bold text-luxury-blue">{property.bedrooms || '—'}</p>
                </div>
                <div className="space-y-1 bg-gray-50/50 p-2.5 rounded-xl border border-gray-50">
                  <span className="text-[10px] text-gray-400 uppercase font-semibold">Washrooms</span>
                  <p className="font-mono text-base font-bold text-luxury-blue">{property.bathrooms || '—'}</p>
                </div>
                <div className="space-y-1 bg-gray-50/50 p-2.5 rounded-xl border border-gray-50">
                  <span className="text-[10px] text-gray-400 uppercase font-semibold">Builtup Area</span>
                  <p className="font-mono text-base font-bold text-luxury-blue">{property.area} <span className="text-[10px] text-gray-400 font-sans">sqft</span></p>
                </div>
              </div>

              {/* Specifications Matrix list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-600 pt-2">
                <div className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="font-medium text-gray-400">Listed Agency:</span>
                  <span className="font-semibold text-luxury-blue">Swastik Group</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="font-medium text-gray-400">Date Published:</span>
                  <div className="flex items-center space-x-1 font-mono font-semibold text-luxury-blue">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>{property.dateAdded}</span>
                  </div>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="font-medium text-gray-400">Parking Space:</span>
                  <span className="font-semibold text-luxury-blue">{property.parking ? 'Covered Parking Included' : 'Available on Layout'}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="font-medium text-gray-400">Property Status:</span>
                  <span className={`font-bold uppercase tracking-wider ${property.status === 'Available' ? 'text-emerald-600' : 'text-red-500'}`}>
                    {property.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h4 className="font-serif text-base font-bold text-luxury-blue">Exquisite Highlights & Description</h4>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light whitespace-pre-wrap">
                {property.description}
              </p>
            </div>

            {/* Amenities Section */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h4 className="font-serif text-base font-bold text-luxury-blue mb-4">Elite Amenities Included</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.amenities.map((amenity, index) => (
                    <div 
                      key={index}
                      className="flex items-center space-x-2 bg-luxury-cream p-2.5 rounded-xl border border-luxury-gold/10"
                    >
                      <div className="w-1.5 h-1.5 bg-luxury-gold rounded-full shrink-0"></div>
                      <span className="text-xs font-semibold text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Google map iframe box */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h4 className="font-serif text-base font-bold text-luxury-blue">Real-World Location Layout</h4>
              <div className="rounded-xl overflow-hidden h-[250px] border border-gray-100 bg-gray-50 relative">
                {property.googleMapUrl && property.googleMapUrl.includes('google.com/maps') ? (
                  <iframe 
                    src={property.googleMapUrl}
                    className="w-full h-full border-0"
                    allowFullScreen={false} 
                    loading="lazy" 
                    title="Location Pin Map"
                  ></iframe>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-2">
                    <MapPin className="w-8 h-8 text-luxury-gold" />
                    <span className="text-xs font-bold text-luxury-blue">Hazratganj District Corridor, Lucknow</span>
                    <p className="text-[10px] text-gray-400 max-w-xs">Map guidelines are provided on direct site visitation with Swastik Group engineers.</p>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Floating Inquiry Form and Agent Card */}
          <div className="space-y-6">
            
            {/* Agent Contact Details */}
            <div className="bg-[#0A1226] p-6 rounded-2xl border border-luxury-gold/30 text-white space-y-6 shadow-xl">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-luxury-gold-light">Exclusive Agency Profile</span>
                <h3 className="font-serif text-lg font-bold mt-1">Swastik Group Office</h3>
                <div className="pt-2 flex text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-current text-luxury-gold" />
                  <Star className="w-3.5 h-3.5 fill-current text-luxury-gold" />
                  <Star className="w-3.5 h-3.5 fill-current text-luxury-gold" />
                  <Star className="w-3.5 h-3.5 fill-current text-luxury-gold" />
                  <Star className="w-3.5 h-3.5 fill-current text-luxury-gold" />
                  <span className="text-[10px] text-gray-300 ml-1">(4.9 rating)</span>
                </div>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-luxury-gold" />
                  <a href="tel:+919999999999" className="hover:text-luxury-gold transition-colors">+91 99999 99999</a>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-luxury-gold" />
                  <a href="mailto:groupswastik8@gmail.com" className="hover:text-luxury-gold transition-colors">groupswastik8@gmail.com</a>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-luxury-gold shrink-0 mt-0.5" />
                  <span className="text-gray-300">Halwasiya House, Hazratganj, Lucknow, UP, 226001</span>
                </div>
              </div>

              <div className="flex gap-2 border-t border-white/10 pt-4">
                <a 
                  href="tel:+919999999999"
                  className="flex-1 bg-white hover:bg-gray-50 text-luxury-blue rounded-xl py-2.5 font-bold text-xs text-center transition-colors flex items-center justify-center space-x-1"
                >
                  <Phone className="w-3.5 h-3.5 text-luxury-blue" />
                  <span>Call Agent</span>
                </a>

                <button 
                  onClick={startWhatsAppChat}
                  className="flex-1 bg-[#25D366] hover:bg-[#128C7E] rounded-xl py-2.5 font-bold text-xs text-center text-white transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Detailed right hand Inquiry form */}
            <InquiryForm 
              propertyId={property.id} 
              propertyName={property.title} 
              compact={true} 
            />

          </div>

        </div>

        {/* Similar related listings beneath */}
        {relatedProperties.length > 0 && (
          <div className="mt-16 text-left border-t border-gray-200/50 pt-10">
            <span className="text-xs uppercase font-extrabold text-luxury-gold tracking-[0.2em]">Vicinity Matches</span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-luxury-blue mt-1 mb-8">Similar Properties in Lucknow</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProperties.map(prop => (
                <PropertyCard 
                  key={prop.id} 
                  property={prop} 
                  onNavigate={onNavigate} 
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
