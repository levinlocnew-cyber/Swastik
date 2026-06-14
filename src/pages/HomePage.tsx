import React, { useState, useEffect } from 'react';
import { Search, House, Phone, Award, Compass, Sparkles, Star, Quote, ArrowRight, MapPin, Building, LandPlot, ShieldAlert } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import InquiryForm from '../components/InquiryForm';
import { Property, Testimonial, Category } from '../types';
import { SEED_CATEGORIES, SEED_TESTIMONIALS } from '../seedData';

interface HomePageProps {
  onNavigate: (path: string) => void;
  properties: Property[];
}

export default function HomePage({ onNavigate, properties }: HomePageProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [searchParams, setSearchParams] = useState({
    saleOrRent: 'Buy',
    type: '',
    locality: '',
    maxPrice: ''
  });

  // Fetch Categories & Testimonials on load with secure static backups for platform transitions
  useEffect(() => {
    fetch('/api/categories')
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) setCategories(data);
        else throw new Error();
      })
      .catch(err => {
        console.warn('Unable to reach /api/categories, adopting local SEED fallback values', err);
        setCategories(SEED_CATEGORIES);
      });

    fetch('/api/testimonials')
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) setTestimonials(data);
        else throw new Error();
      })
      .catch(err => {
        console.warn('Unable to reach /api/testimonials, adopting local SEED fallback values', err);
        setTestimonials(SEED_TESTIMONIALS);
      });
  }, []);

  const featuredProperties = properties.filter(p => p.featured).slice(0, 3);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let queryStr = `#/properties?saleOrRent=${searchParams.saleOrRent}`;
    if (searchParams.type) queryStr += `&type=${searchParams.type}`;
    if (searchParams.locality) queryStr += `&locality=${searchParams.locality}`;
    if (searchParams.maxPrice) queryStr += `&maxPrice=${searchParams.maxPrice}`;
    onNavigate(queryStr);
  };

  // Luxury icon selector for custom sections
  const getCategoryIcon = (name: string) => {
    switch (name) {
      case 'Residential': return <House className="w-5 h-5 text-luxury-gold" />;
      case 'Commercial': return <Building className="w-5 h-5 text-luxury-gold" />;
      case 'Plot/Land': return <LandPlot className="w-5 h-5 text-luxury-gold" />;
      default: return <Building className="w-5 h-5 text-luxury-gold" />;
    }
  };

  return (
    <div id="homepage-container" className="">
      
      {/* 1. Hero Section - Majestic Lucknow backdrop with quick listing filters */}
      <section 
        id="hero-banner"
        className="relative bg-luxury-blue min-h-[85vh] flex items-center justify-center px-4 py-20 overflow-hidden"
      >
        {/* Background Unsplash of modern luxury estate */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1920&q=80" 
            alt="Lucknow Luxury Real Estate" 
            className="w-full h-full object-cover opacity-35"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-dark/95 via-luxury-blue/45 to-luxury-dark"></div>
        </div>

        {/* Hero Central Layout */}
        <div className="relative z-10 max-w-5xl mx-auto w-full text-center space-y-8">
          
          <div className="space-y-4">
            <span className="inline-flex items-center space-x-2 bg-luxury-gold/15 border border-luxury-gold/40 text-luxury-gold px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-[0.15em] mb-2 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Lucknow's Luxury Real Estate Leader</span>
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-white tracking-wide leading-tight max-w-4xl mx-auto drop-shadow-xl text-shadow-gold">
              Your Trusted Property Partner <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-luxury-gold via-luxury-gold-light to-white">
                In Lucknow, Uttar Pradesh
              </span>
            </h2>
            <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-sans font-light">
              We find and deliver premium LDA-approved plots, modern residential villas, premium apartments, and corporate office layouts across central Lucknow markets.
            </p>
          </div>

          {/* Quick Search Filtering Hub (Buy/Rent) */}
          <div 
            id="search-filter-hub"
            className="bg-luxury-blue/80 backdrop-blur-md p-5 rounded-3xl border border-luxury-gold/30 shadow-2xl max-w-4xl mx-auto"
          >
            <form onSubmit={handleSearchSubmit} className="space-y-4">
              
              {/* Buy/Rent Toggle Controls */}
              <div className="flex justify-center md:justify-start">
                <div className="bg-luxury-dark/60 p-1.5 rounded-xl border border-white/5 flex space-x-1">
                  {['Buy', 'Rent'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setSearchParams(prev => ({ ...prev, saleOrRent: option }))}
                      className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                        searchParams.saleOrRent === option 
                          ? 'bg-gradient-to-r from-luxury-gold to-luxury-gold-light text-luxury-blue shadow-md' 
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {option === 'Buy' ? 'Buy Property' : 'Rent Property'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Input Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-luxury-dark/40 p-3 rounded-2xl border border-white/5 text-left">
                {/* 1. Property Type Selector */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-luxury-gold mb-1">Property Type</label>
                  <select
                    name="type"
                    value={searchParams.type}
                    onChange={(e) => setSearchParams(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full bg-luxury-blue border border-luxury-gold/20 text-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-luxury-gold"
                  >
                    <option value="">Any Type</option>
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Plot/Land">Plot/Land</option>
                    <option value="Villa">Villa</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Independent House">Independent house</option>
                    <option value="Office Space">Office Space</option>
                    <option value="Shop">Shop</option>
                  </select>
                </div>

                {/* 2. Locality Dropdown / Text */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-luxury-gold mb-1">Lucknow Locality</label>
                  <select
                    name="locality"
                    value={searchParams.locality}
                    onChange={(e) => setSearchParams(prev => ({ ...prev, locality: e.target.value }))}
                    className="w-full bg-luxury-blue border border-luxury-gold/20 text-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-luxury-gold"
                  >
                    <option value="">Any Locality</option>
                    <option value="Gomti Nagar">Gomti Nagar</option>
                    <option value="Hazratganj">Hazratganj</option>
                    <option value="Sushant Golf City">Sushant Golf City</option>
                    <option value="Vrindavan Yojna">Vrindavan Yojna</option>
                    <option value="Aliganj">Aliganj</option>
                    <option value="Indira Nagar">Indira Nagar</option>
                    <option value="Amar Shaheed Path">Amar Shaheed Path</option>
                  </select>
                </div>

                {/* 3. Price Budget Filter */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-luxury-gold mb-1">Max Budget (INR)</label>
                  <select
                    name="maxPrice"
                    value={searchParams.maxPrice}
                    onChange={(e) => setSearchParams(prev => ({ ...prev, maxPrice: e.target.value }))}
                    className="w-full bg-luxury-blue border border-luxury-gold/20 text-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-luxury-gold"
                  >
                    <option value="">No Limit</option>
                    {searchParams.saleOrRent === 'Buy' ? (
                      <>
                        <option value="4000000">Under ₹ 40 Lakhs</option>
                        <option value="6000000">Under ₹ 60 Lakhs</option>
                        <option value="10000000">Under ₹ 1 Crore</option>
                        <option value="20000000">Under ₹ 2 Crores</option>
                        <option value="30000000">Under ₹ 3 Crores</option>
                      </>
                    ) : (
                      <>
                        <option value="15000">Under ₹ 15k / mo</option>
                        <option value="25000">Under ₹ 25k / mo</option>
                        <option value="50000">Under ₹ 50k / mo</option>
                        <option value="100000">Under ₹ 1 Lakh / mo</option>
                      </>
                    )}
                  </select>
                </div>

                {/* 4. Action Button */}
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-luxury-gold to-luxury-gold-light hover:brightness-110 text-luxury-dark text-xs font-bold uppercase tracking-wider py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2 shadow-lg"
                  >
                    <Search className="w-4 h-4" />
                    <span>Search Now</span>
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      </section>

      {/* 2. Premium Category Grid */}
      <section id="property-categories" className="py-20 bg-luxury-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs uppercase font-extrabold text-luxury-gold tracking-[0.2em] block">Locate Your Preference</span>
            <h3 className="font-serif text-2xl sm:text-4xl font-bold text-luxury-blue">Browse Lucknow Niches</h3>
            <div className="w-16 h-1 bg-luxury-gold mx-auto rounded-full"></div>
            <p className="text-xs text-gray-500 max-w-xl mx-auto">
              Find customized properties catering to your lifestyle or commercial business requirements.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <div 
                id={`category-item-${cat.id}`}
                key={cat.id}
                onClick={() => onNavigate(`#/properties?type=${cat.name}`)}
                className="group relative h-40 sm:h-48 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                {/* Overlay gradients for high contrast title */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10"></div>
                <div className="absolute bottom-4 left-4 text-left">
                  <span className="p-1.5 bg-luxury-gold/20 backdrop-blur-md rounded-lg inline-block mb-2">
                    {getCategoryIcon(cat.name)}
                  </span>
                  <h4 className="font-serif text-sm font-bold text-white tracking-wide group-hover:text-luxury-gold transition-colors">
                    {cat.name}
                  </h4>
                  <span className="text-[10px] text-gray-300 font-mono">
                    {cat.count !== undefined ? `${cat.count} Listings` : 'Browse'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured Premium Listings */}
      <section id="featured-listings" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs uppercase font-extrabold text-luxury-gold tracking-[0.2em] block">Handpicked Handouts</span>
              <h3 className="font-serif text-2xl sm:text-4xl font-bold text-luxury-blue mt-1">Featured Prime Collections</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-lg">
                The most sought-after developments including premium corner villa units, LDA-allotted plots, and central Hazratganj boutique complexes.
              </p>
            </div>
            <button
              onClick={() => onNavigate('#/properties')}
              className="bg-transparent hover:bg-luxury-blue border border-luxury-blue text-luxury-blue hover:text-white font-bold text-xs uppercase tracking-wider py-2.5 px-6 rounded-xl transition-all self-start md:self-end flex items-center space-x-1.5 group cursor-pointer"
            >
              <span>Browse All Properties</span>
              <ArrowRight className="w-3.5 h-3.5 transform transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {featuredProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map(property => (
                <PropertyCard 
                  key={property.id} 
                  property={property} 
                  onNavigate={onNavigate} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <span className="text-sm text-gray-400">No featured properties active. Browse our full gallery.</span>
            </div>
          )}

        </div>
      </section>

      {/* 4. About Swastik Group Profile */}
      <section id="about-us" className="py-20 bg-gradient-to-br from-[#070F1B] via-luxury-blue to-[#070F1B] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Decorative visual mosaic */}
          <div className="relative h-96 sm:h-[450px]">
            <img 
              src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80" 
              alt="Swastik Highrise Residences" 
              className="w-full h-full object-cover rounded-3xl opacity-80"
              referrerPolicy="no-referrer"
            />
            {/* Visual Glass floating badge */}
            <div className="absolute bottom-6 right-6 glass-dark p-5 rounded-2xl max-w-xs border border-white/15 text-left text-xs-shadow">
              <h4 className="font-serif text-sm font-bold text-luxury-gold">Legacy of Transparency</h4>
              <p className="text-gray-300 text-[11px] mt-1">
                For over a decade, Swastik Group has been synonym of registry guarantees, RERA legal approvals, and secure property agreements in Lucknow.
              </p>
            </div>
          </div>

          {/* Core Brand Narrative */}
          <div className="space-y-6 text-left">
            <span className="text-xs uppercase font-extrabold text-luxury-gold tracking-[0.2em]">The Swastik Legacy</span>
            <h3 className="font-serif text-2xl sm:text-4xl font-bold leading-tight">
              Crafting Real Estate Journeys <br />
              <span className="text-luxury-gold">In the City of Nawabs</span>
            </h3>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed font-light">
              Lucknow represents a historic fusion of royal heritage and rapid modern development. At **Swastik Group**, we bridge this spectrum. As the single-point consulting and brokerage powerhouse, we have successfully assisted families, professionals, and corporate blocks in locating and establishing active asset nodes.
            </p>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed font-light">
              Our business values rest on zero-margin legal documentation, strict client verification, and handpicked property sourcing. From buying premium plots in fast-appreciating Vrindavan Yojna blocks to luxury golf-facing villas, we are Lucknow's favorite choice.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
              <div>
                <dt className="text-2xl sm:text-3xl font-bold text-luxury-gold font-mono">15+</dt>
                <dd className="text-[10px] text-gray-400 capitalize">Years Local Experience</dd>
              </div>
              <div>
                <dt className="text-2xl sm:text-3xl font-bold text-luxury-gold font-mono">1400+</dt>
                <dd className="text-[10px] text-gray-400 capitalize">Satisfied Families</dd>
              </div>
              <div>
                <dt className="text-2xl sm:text-3xl font-bold text-luxury-gold font-mono">100%</dt>
                <dd className="text-[10px] text-gray-400 capitalize">Verified Documents</dd>
              </div>
            </div>

            <button
              onClick={() => onNavigate('#/contact')}
              className="mt-4 bg-gradient-to-r from-luxury-gold to-luxury-gold-light text-luxury-blue font-bold text-xs uppercase tracking-wider py-3 px-8 rounded-xl transition-all inline-flex items-center space-x-2"
            >
              <span>Partner with Swastik</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* 5. Why Choose Us Pillar Section */}
      <section id="why-choose-us" className="py-20 bg-luxury-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs uppercase font-extrabold text-luxury-gold tracking-[0.2em] block">Our Distinctive DNA</span>
            <h3 className="font-serif text-2xl sm:text-4xl font-bold text-luxury-blue">Why Swastik Group?</h3>
            <div className="w-16 h-1 bg-luxury-gold mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              {
                icon: <Award className="w-6 h-6 text-luxury-blue" />,
                title: "Trusted Service",
                desc: "RERA registered, legal checking, zero litigation properties only."
              },
              {
                icon: <Compass className="w-6 h-6 text-luxury-blue" />,
                title: "Verified Properties",
                desc: "Physical inspection of layouts, LDA stamp verification, registry-ready titles."
              },
              {
                icon: <Sparkles className="w-6 h-6 text-luxury-blue" />,
                title: "Best Deals Only",
                desc: "Strongest direct-builder negotiations yielding unmatched price benefits."
              },
              {
                icon: <MapPin className="w-6 h-6 text-luxury-blue" />,
                title: "Local Market Expertise",
                desc: "Deep granular knowledge of Hazratganj corridors, newly upcoming Shaheed Path blocks."
              },
              {
                icon: <ArrowRight className="w-6 h-6 text-luxury-blue" />,
                title: "End-to-End Assistance",
                desc: "Smooth banking loan linkages, agreement drafts, and final registry facilitation."
              }
            ].map((pillar, index) => (
              <div 
                key={index}
                className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all text-left flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-11 h-11 bg-luxury-gold/15 rounded-xl flex items-center justify-center">
                    {pillar.icon}
                  </div>
                  <h4 className="font-serif text-sm font-bold text-luxury-blue">{pillar.title}</h4>
                  <p className="text-[11px] text-gray-500 leading-relaxed font-sans">{pillar.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. Customer Testimonials */}
      <section id="testimonials-section" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs uppercase font-extrabold text-luxury-gold tracking-[0.2em] block">Client Voices</span>
            <h3 className="font-serif text-2xl sm:text-4xl font-bold text-luxury-blue">What Lucknowites Say About Us</h3>
            <div className="w-16 h-1 bg-luxury-gold mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test) => (
              <div 
                id={`testimonial-item-${test.id}`}
                key={test.id}
                className="bg-luxury-cream p-6 rounded-2xl border border-gray-100 shadow-sm text-left flex flex-col justify-between"
              >
                <div>
                  {/* Rating Stars */}
                  <div className="flex text-amber-500 space-x-0.5 mb-4">
                    {Array.from({ length: test.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current text-luxury-gold" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed italic mb-6 relative">
                    <Quote className="w-8 h-8 text-luxury-gold/20 absolute -top-4 -left-3 -z-0" />
                    <span className="relative z-10">"{test.feedback}"</span>
                  </p>
                </div>

                <div className="flex items-center space-x-3 border-t border-gray-200/50 pt-4 mt-auto">
                  {test.avatar && (
                    <img 
                      src={test.avatar} 
                      alt={test.name} 
                      className="w-10 h-10 rounded-full object-cover shadow-inner"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <div>
                    <h5 className="font-serif text-xs font-bold text-luxury-blue">{test.name}</h5>
                    <p className="text-[10px] text-gray-400 font-sans">{test.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. Bottom General Contact Hero Panel */}
      <section id="banner-consultation" className="py-16 bg-[#061125] text-white px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="text-left space-y-4">
            <h3 className="font-serif text-2xl sm:text-4xl font-bold leading-tight">
              Looking for Immediate Property Buy or Joint Venture?
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-light">
              Submit your detailed requirements (BHK demand, budget range, selected vicinity areas). Swastik Group's premium Lucknow agents will prepare a filtered, ready-to-negotiate list within 2 hours.
            </p>
            <div className="flex items-center space-x-3 pt-2 text-xs">
              <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider">
                ● Connected Agents Active
              </span>
            </div>
          </div>

          <div>
            {/* General inquiry submission */}
            <InquiryForm compact={false} />
          </div>
        </div>
      </section>

    </div>
  );
}
