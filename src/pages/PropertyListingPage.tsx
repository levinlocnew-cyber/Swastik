import React, { useState, useEffect } from 'react';
import { Filter, SlidersHorizontal, Grid3X3, Trash2, ShieldCheck, Heart, Search } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import { Property } from '../types';

interface PropertyListingPageProps {
  onNavigate: (path: string) => void;
  properties: Property[];
}

export default function PropertyListingPage({ onNavigate, properties }: PropertyListingPageProps) {
  // Read initial query params from window location hash
  const getQueryParams = () => {
    const hash = window.location.hash;
    const searchIdx = hash.indexOf('?');
    if (searchIdx === -1) return {};
    
    const queryStr = hash.substring(searchIdx + 1);
    const params: Record<string, string> = {};
    queryStr.split('&').forEach(pair => {
      const parts = pair.split('=');
      if (parts.length === 2) {
        params[parts[0]] = decodeURIComponent(parts[1]);
      }
    });
    return params;
  };

  const initialParams = getQueryParams();

  const [filters, setFilters] = useState({
    saleOrRent: initialParams.saleOrRent || '',
    type: initialParams.type || '',
    locality: initialParams.locality || '',
    minPrice: '',
    maxPrice: initialParams.maxPrice || '',
    minArea: '',
    maxArea: '',
    bedrooms: '',
    search: initialParams.search || '',
    showFavoritesOnly: initialParams.favorites === 'true'
  });

  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [favoritesList, setFavoritesList] = useState<string[]>([]);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Sync favorites on mount + storage changes
  const updateFavorites = () => {
    const saved = JSON.parse(localStorage.getItem('swastik_favorites') || '[]');
    setFavoritesList(saved);
  };

  useEffect(() => {
    updateFavorites();
    window.addEventListener('storage', updateFavorites);
    return () => window.removeEventListener('storage', updateFavorites);
  }, []);

  // Listen to hash changes specifically to update state if values like ?type=Villa or ?favorites=true change!
  useEffect(() => {
    const params = getQueryParams();
    setFilters(prev => ({
      ...prev,
      saleOrRent: params.saleOrRent || prev.saleOrRent,
      type: params.type || prev.type,
      locality: params.locality || prev.locality,
      maxPrice: params.maxPrice || prev.maxPrice,
      showFavoritesOnly: params.favorites === 'true' || prev.showFavoritesOnly
    }));
  }, [window.location.hash]);

  // Compute final filtered array
  useEffect(() => {
    let result = [...properties];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.locality.toLowerCase().includes(q)
      );
    }

    if (filters.saleOrRent) {
      result = result.filter(p => p.saleOrRent === filters.saleOrRent);
    }

    if (filters.type) {
      result = result.filter(p => p.type.toLowerCase() === filters.type.toLowerCase());
    }

    if (filters.locality) {
      result = result.filter(p => p.locality.toLowerCase() === filters.locality.toLowerCase());
    }

    if (filters.minPrice) {
      result = result.filter(p => p.price >= Number(filters.minPrice));
    }

    if (filters.maxPrice) {
      result = result.filter(p => p.price <= Number(filters.maxPrice));
    }

    if (filters.minArea) {
      result = result.filter(p => p.area >= Number(filters.minArea));
    }

    if (filters.maxArea) {
      result = result.filter(p => p.area <= Number(filters.maxArea));
    }

    if (filters.bedrooms) {
      result = result.filter(p => p.bedrooms === Number(filters.bedrooms));
    }

    if (filters.showFavoritesOnly) {
      result = result.filter(p => favoritesList.includes(p.id));
    }

    setFilteredProperties(result);
  }, [filters, properties, favoritesList]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFilters(prev => ({ ...prev, [name]: target.checked }));
    } else {
      setFilters(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleResetFilters = () => {
    setFilters({
      saleOrRent: '',
      type: '',
      locality: '',
      minPrice: '',
      maxPrice: '',
      minArea: '',
      maxArea: '',
      bedrooms: '',
      search: '',
      showFavoritesOnly: false
    });
    // Strip hash queries
    onNavigate('#/properties');
  };

  return (
    <div id="listing-page-container" className="pt-24 pb-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page title and top breadcrumb layout */}
        <div className="text-left mb-6">
          <div className="flex items-center space-x-1.5 text-xs text-gray-400 font-medium uppercase tracking-wider">
            <span className="hover:text-luxury-gold cursor-pointer" onClick={() => onNavigate('#/')}>Home</span>
            <span>/</span>
            <span className="text-gray-600 font-semibold">Lucknow Properties</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-luxury-blue mt-1">
            {filters.showFavoritesOnly ? 'My Bookmarked Properties' : 'Verified Real Estate in Lucknow'}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {filteredProperties.length} listings available for direct site visit and paper inspection.
          </p>
        </div>

        {/* Filters and Layout block */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Left aligned Filter bar */}
          <aside className="hidden lg:block bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit space-y-6 text-left">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="font-serif text-sm font-bold text-luxury-blue uppercase tracking-wider flex items-center space-x-2">
                <SlidersHorizontal className="w-4 h-4 text-luxury-gold" />
                <span>Advanced Search</span>
              </h3>
              <button 
                onClick={handleResetFilters}
                className="text-[10px] text-red-500 hover:text-red-600 font-bold uppercase cursor-pointer"
              >
                Reset All
              </button>
            </div>

            {/* Price Type */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">Acquisition Type</label>
              <select
                name="saleOrRent"
                value={filters.saleOrRent}
                onChange={handleFilterChange}
                className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-luxury-gold"
              >
                <option value="">Any Option (Buy/Rent)</option>
                <option value="Buy">For Sale (Buy)</option>
                <option value="Rent">For Rent</option>
              </select>
            </div>

            {/* Property Cat */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">Niche Type</label>
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-luxury-gold"
              >
                <option value="">Any Niche</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Plot/Land">Plot / Land</option>
                <option value="Villa">Villa</option>
                <option value="Apartment">Apartment</option>
                <option value="Independent House">Independent House</option>
                <option value="Office Space">Office Space</option>
                <option value="Shop">Shop</option>
              </select>
            </div>

            {/* Locality lookup */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">Lucknow Region</label>
              <select
                name="locality"
                value={filters.locality}
                onChange={handleFilterChange}
                className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-luxury-gold"
              >
                <option value="">Any Region</option>
                <option value="Gomti Nagar">Gomti Nagar</option>
                <option value="Hazratganj">Hazratganj</option>
                <option value="Sushant Golf City">Sushant Golf City</option>
                <option value="Vrindavan Yojna">Vrindavan Yojna</option>
                <option value="Aliganj">Aliganj</option>
                <option value="Indira Nagar">Indira Nagar</option>
                <option value="Amar Shaheed Path">Amar Shaheed Path</option>
              </select>
            </div>

            {/* Price Ranges */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">Budget range (INR)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  placeholder="Min "
                  className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-luxury-gold"
                />
                <input
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  placeholder="Max"
                  className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-luxury-gold"
                />
              </div>
            </div>

            {/* Area Ranges */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">Area Limit (SqFt)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  name="minArea"
                  value={filters.minArea}
                  onChange={handleFilterChange}
                  placeholder="Min sqft"
                  className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-luxury-gold"
                />
                <input
                  type="number"
                  name="maxArea"
                  value={filters.maxArea}
                  onChange={handleFilterChange}
                  placeholder="Max sqft"
                  className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-luxury-gold"
                />
              </div>
            </div>

            {/* Bedroom BHK units */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">Bedrooms (BHK)</label>
              <select
                name="bedrooms"
                value={filters.bedrooms}
                onChange={handleFilterChange}
                className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-luxury-gold"
              >
                <option value="">Any BHK</option>
                <option value="1">1 BHK</option>
                <option value="2">2 BHK</option>
                <option value="3">3 BHK</option>
                <option value="4">4 BHK</option>
                <option value="5">5 BHK</option>
              </select>
            </div>

            {/* Show Bookmarked Toggle */}
            <div className="border-t border-gray-100 pt-4">
              <label className="flex items-center space-x-2.5 cursor-pointer text-xs font-bold text-gray-700 uppercase">
                <input
                  type="checkbox"
                  name="showFavoritesOnly"
                  checked={filters.showFavoritesOnly}
                  onChange={handleFilterChange}
                  className="rounded border-gray-300 text-luxury-gold focus:ring-luxury-gold w-4.5 h-4.5"
                />
                <Heart className={`w-4 h-4 text-red-500 ${filters.showFavoritesOnly ? 'fill-current' : ''}`} />
                <span>Show Bookmarked Only</span>
              </label>
            </div>
          </aside>

          {/* Right aligned Listing section */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Top Text Search and Mobile toggle controls */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center gap-3 w-full">
              {/* Dynamic Text Box search query */}
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search Gomti Nagar villas, commercial plot, registry details..."
                  className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl pl-9 pr-3 py-3 focus:outline-none focus:border-luxury-gold"
                />
              </div>

              {/* Toggles */}
              <div className="flex items-center space-x-2.5 w-full sm:w-auto self-stretch sm:self-center">
                <button
                  type="button"
                  onClick={() => setIsMobileFiltersOpen(true)}
                  className="flex-1 lg:hidden bg-luxury-blue hover:bg-luxury-blue/90 text-white py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Filter className="w-4 h-4 text-luxury-gold" />
                  <span>Show Filters</span>
                </button>
                {filters.showFavoritesOnly && (
                  <span className="bg-red-100 border border-red-200 text-red-600 px-3 py-1.5 rounded-xl text-xs font-bold">
                    Favorites Filter Active
                  </span>
                )}
              </div>
            </div>

            {/* Property Display Cards Grid */}
            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map(property => (
                  <PropertyCard 
                    key={property.id} 
                    property={property} 
                    onNavigate={onNavigate}
                    onFavoritesChanged={updateFavorites}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-4 max-w-lg mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
                  <Grid3X3 className="w-7 h-7" />
                </div>
                <h4 className="font-serif text-lg font-bold text-luxury-blue">No Properties Matches Filters</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  We couldn't locate matching Lucknow listings. Try expanding your budget scale, switching neighborhoods, or releasing some constraints.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="bg-transparent hover:bg-luxury-gold border-2 border-luxury-gold hover:text-luxury-blue text-luxury-gold text-xs font-bold uppercase tracking-wider py-2.5 px-6 rounded-xl transition-all cursor-pointer"
                >
                  Reset all filters
                </button>
              </div>
            )}

            {/* LDA Assured badge section */}
            <div className="bg-emerald-500/5 rounded-2xl p-5 border border-emerald-500/20 text-left flex flex-col sm:flex-row items-center gap-4">
              <div className="w-11 h-11 bg-emerald-500/10 rounded-xl flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-serif text-sm font-bold text-emerald-800">100% Verified Sourcing Promise</h4>
                <p className="text-xs text-emerald-700 mt-0.5 leading-relaxed">
                  Every property listed on Swastik Group undergoes absolute layout mapping, Lucknow Development Authority (LDA) zoning validation, and RERA registration compliance confirmation.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Mobile Slider Overlay Filter drawer */}
      {isMobileFiltersOpen && (
        <div id="mobile-filter-drawer" className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setIsMobileFiltersOpen(false)}></div>
          <div className="absolute right-0 top-0 bottom-0 max-w-xs w-full bg-white shadow-xl flex flex-col h-full z-10 text-left p-6 space-y-6 overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="font-serif text-sm font-bold text-luxury-blue uppercase">Advanced Filters</h3>
              <button 
                onClick={() => setIsMobileFiltersOpen(false)}
                className="text-[10px] text-gray-400 hover:text-gray-900 border border-gray-200 px-2 py-1 rounded"
              >
                Close (X)
              </button>
            </div>

            {/* Sale / Rent */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase">Acquisition</label>
              <select
                name="saleOrRent"
                value={filters.saleOrRent}
                onChange={handleFilterChange}
                className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none"
              >
                <option value="">Any Option</option>
                <option value="Buy">For Sale</option>
                <option value="Rent">For Rent</option>
              </select>
            </div>

            {/* Type */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase">Property Type</label>
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none"
              >
                <option value="">Any Type</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Plot/Land">Plot/Land</option>
                <option value="Villa">Villa</option>
                <option value="Apartment">Apartment</option>
                <option value="Shop">Shop</option>
              </select>
            </div>

            {/* Price Ranges */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase">Budget (INR)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  placeholder="Min"
                  className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl px-2 py-2"
                />
                <input
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  placeholder="Max"
                  className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl px-2 py-2"
                />
              </div>
            </div>

            {/* Favorite check */}
            <div>
              <label className="flex items-center space-x-2.5 cursor-pointer text-xs font-bold text-gray-700 uppercase">
                <input
                  type="checkbox"
                  name="showFavoritesOnly"
                  checked={filters.showFavoritesOnly}
                  onChange={handleFilterChange}
                  className="rounded border-gray-300 text-luxury-gold focus:ring-luxury-gold"
                />
                <Heart className="w-4 h-4 text-red-500 fill-current" />
                <span>Show Bookmarked Only</span>
              </label>
            </div>

            <button
              onClick={() => setIsMobileFiltersOpen(false)}
              className="w-full bg-gradient-to-r from-luxury-gold to-luxury-gold-light hover:brightness-110 text-luxury-dark text-xs font-bold uppercase py-3 rounded-xl tracking-wider cursor-pointer"
            >
              Apply Filter Parameters
            </button>
            
            <button
              onClick={() => {
                handleResetFilters();
                setIsMobileFiltersOpen(false);
              }}
              className="w-full text-center text-xs text-red-500 hover:underline cursor-pointer"
            >
              Reset All Filters State
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
