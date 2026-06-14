import React, { useState, useEffect } from 'react';
import { 
  Building, Mail, Users, Star, Plus, Edit, Trash2, CheckCircle, AlertCircle, 
  MapPin, BedDouble, Bath, Square, ToggleLeft, ToggleRight, LayoutDashboard, 
  Settings, FolderKanban, LogOut, Check, X, ShieldCheck, Image as ImageIcon, Sparkles
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { Property, Inquiry, Category } from '../types';

interface AdminDashboardPageProps {
  onNavigate: (path: string) => void;
  properties: Property[];
  onRefreshProperties: () => void;
}

export default function AdminDashboardPage({ onNavigate, properties, onRefreshProperties }: AdminDashboardPageProps) {
  const [token, setToken] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'analytics' | 'properties' | 'inquiries'>('analytics');
  
  // Stats Counters
  const [analytics, setAnalytics] = useState({
    total: 0,
    buy: 0,
    rent: 0,
    totalInquiries: 0,
    featured: 0,
    inquiriesChartData: [] as any[],
    typeChartData: [] as any[]
  });

  // Table lists
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Property Form Modal Status
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);
  const [propertyForm, setPropertyForm] = useState({
    title: '',
    type: 'Villa' as any,
    saleOrRent: 'Buy' as any,
    price: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
    parking: false,
    address: '',
    locality: '',
    description: '',
    amenitiesInput: '',
    googleMapUrl: '',
    status: 'Available' as any,
    featuredImage: '',
    additionalImagesInput: '',
    featured: false
  });

  // Check login authentication
  useEffect(() => {
    const activeToken = localStorage.getItem('swastik_admin_token');
    if (!activeToken) {
      onNavigate('#/admin/login');
      return;
    }
    setToken(activeToken);
    loadAnalytics(activeToken);
    loadInquiries(activeToken);
  }, [properties]);

  const loadAnalytics = (authToken: string) => {
    fetch('/api/analytics', {
      headers: { 'Authorization': `Bearer ${authToken}` }
    })
    .then(res => {
      if (res.status === 401 || res.status === 403) {
        handleLogout();
        throw new Error('Session expired');
      }
      return res.json();
    })
    .then(data => setAnalytics(data))
    .catch(err => console.error('Failed to load analytics', err));
  };

  const loadInquiries = (authToken: string) => {
    fetch('/api/inquiries', {
      headers: { 'Authorization': `Bearer ${authToken}` }
    })
    .then(res => res.json())
    .then(data => setInquiries(data))
    .catch(err => console.error('Failed to load inquiries', err));
  };

  const handleLogout = () => {
    localStorage.removeItem('swastik_admin_token');
    onNavigate('#/admin/login');
    window.dispatchEvent(new Event('storage'));
  };

  // Delete target listing
  const handleDeleteProperty = async (propId: string) => {
    if (!window.confirm('Are you absolutely certain you want to delete this property listing? This action is irreversible.')) {
      return;
    }

    try {
      const response = await fetch(`/api/properties/${propId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setSuccess('Property successfully deleted!');
        onRefreshProperties();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        const d = await response.json();
        setError(d.error || 'Failed to delete listing.');
      }
    } catch (err) {
      setError('Connection failure during property removal.');
    }
  };

  // Toggle Featured Check
  const handleToggleFeatured = async (property: Property) => {
    try {
      const response = await fetch(`/api/properties/${property.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ featured: !property.featured })
      });
      if (response.ok) {
        onRefreshProperties();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Change Inquiry Status
  const handleInquiryStatusChange = async (inqId: string, nextStatus: 'Contacted' | 'Closed') => {
    try {
      const response = await fetch(`/api/inquiries/${inqId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
      if (response.ok) {
        loadInquiries(token);
        setSuccess('Inquiry communication status updated.');
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError('Failed to update inquiry state.');
    }
  };

  // Delete Inquiry
  const handleDeleteInquiry = async (inqId: string) => {
    if (!window.confirm('Do you want to delete this inquiry record?')) return;
    try {
      const response = await fetch(`/api/inquiries/${inqId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        loadInquiries(token);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Populate form for Editing
  const handleOpenEdit = (prop: Property) => {
    setEditingPropertyId(prop.id);
    setPropertyForm({
      title: prop.title,
      type: prop.type,
      saleOrRent: prop.saleOrRent,
      price: String(prop.price),
      area: String(prop.area),
      bedrooms: prop.bedrooms ? String(prop.bedrooms) : '',
      bathrooms: prop.bathrooms ? String(prop.bathrooms) : '',
      parking: !!prop.parking,
      address: prop.address,
      locality: prop.locality,
      description: prop.description,
      amenitiesInput: prop.amenities.join(', '),
      googleMapUrl: prop.googleMapUrl || '',
      status: prop.status,
      featuredImage: prop.featuredImage,
      additionalImagesInput: prop.images ? prop.images.filter(x => x !== prop.featuredImage).join(', ') : '',
      featured: !!prop.featured
    });
    setIsFormOpen(true);
  };

  // Clear and open Form for Creating
  const handleOpenCreate = () => {
    setEditingPropertyId(null);
    setPropertyForm({
      title: '',
      type: 'Villa',
      saleOrRent: 'Buy',
      price: '',
      area: '',
      bedrooms: '3',
      bathrooms: '3',
      parking: true,
      address: '',
      locality: 'Gomti Nagar',
      description: '',
      amenitiesInput: 'Swimming Pool, Power Backup, 24x7 Security, Modular Kitchen',
      googleMapUrl: 'https://www.google.com/maps/embed?pb=!1m18',
      status: 'Available',
      featuredImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
      additionalImagesInput: '',
      featured: false
    });
    setIsFormOpen(true);
  };

  // Submit Listing form
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const priceNum = Number(propertyForm.price);
    const areaNum = Number(propertyForm.area);

    if (!propertyForm.title || !priceNum || !areaNum || !propertyForm.address || !propertyForm.locality) {
      setError('Please provide correct credentials for Title, Price, Area Size, Locality.');
      return;
    }

    // Split inputs
    const amenities = propertyForm.amenitiesInput.split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const extraImages = propertyForm.additionalImagesInput.split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const payload = {
      title: propertyForm.title,
      type: propertyForm.type,
      saleOrRent: propertyForm.saleOrRent,
      price: priceNum,
      area: areaNum,
      bedrooms: propertyForm.bedrooms ? Number(propertyForm.bedrooms) : undefined,
      bathrooms: propertyForm.bathrooms ? Number(propertyForm.bathrooms) : undefined,
      parking: !!propertyForm.parking,
      address: propertyForm.address,
      locality: propertyForm.locality,
      description: propertyForm.description,
      amenities,
      googleMapUrl: propertyForm.googleMapUrl,
      status: propertyForm.status,
      featuredImage: propertyForm.featuredImage || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
      images: [propertyForm.featuredImage, ...extraImages].filter(s => s.length > 0),
      featured: !!propertyForm.featured
    };

    try {
      let response;
      if (editingPropertyId) {
        response = await fetch(`/api/properties/${editingPropertyId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      } else {
        response = await fetch('/api/properties', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      }

      if (response.ok) {
        setSuccess(editingPropertyId ? 'Property configured!' : 'Property added!');
        setIsFormOpen(false);
        onRefreshProperties();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        const d = await response.json();
        setError(d.error || 'Server error saving listing.');
      }
    } catch (err) {
      setError('Connection failure on listing modification.');
    }
  };

  // Local Base64 compression helper for premium multiple image upload
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64 = reader.result as string;
      try {
        const response = await fetch('/api/uploads', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            base64Data: base64,
            fileName: file.name
          })
        });

        if (response.ok) {
          const d = await response.json();
          setPropertyForm(prev => ({
            ...prev,
            featuredImage: d.url
          }));
          setSuccess('Selected image uploaded successfully!');
          setTimeout(() => setSuccess(null), 3000);
        } else {
          const d = await response.json();
          setError(d.error || 'Image write failure.');
        }
      } catch (err) {
        setError('Upload gateway connection failed.');
      }
    };
  };

  // Pie chart colors
  const COLORS = ['#0F1C3F', '#C5A85C', '#1E3A8A', '#F59E0B', '#3B82F6', '#10B981', '#EC4899', '#8B5CF6'];

  return (
    <div id="dashboard-container" className="pt-24 pb-16 bg-gray-50 min-h-screen text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-b pb-6 mb-8 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 bg-luxury-blue border border-luxury-gold/40 rounded-xl flex items-center justify-center shadow shadow-luxury-gold/20 shrink-0">
              <svg className="w-6.5 h-6.5 text-luxury-gold-light" viewBox="0 0 100 100" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                {/* Elegant outer diamond shield */}
                <path d="M50 15 L82 47 L50 85 L18 47 Z" strokeWidth="4.5" strokeLinejoin="round" />
                {/* Stylized monogram 'S' matching luxury typography */}
                <path d="M38 36 C38 29, 62 29, 62 38 C62 47, 38 47, 38 56 C38 65, 62 65, 62 58" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                {/* Real estate roof gable peak */}
                <path d="M32 22 L50 10 L68 22" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-luxury-blue flex items-center space-x-2">
                <span>Swastik Group Control Center</span>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border border-emerald-200">Admin</span>
              </h2>
              <p className="text-xs text-gray-400">Manage Lucknow property listings, consumer inquiries, and metrics.</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 self-stretch sm:self-center justify-end">
            <button 
              onClick={() => onNavigate('#/properties')}
              className="px-4 py-2 font-semibold text-xs border rounded-xl hover:bg-gray-100 transition-all cursor-pointer text-gray-600 bg-white"
            >
              Live Website
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout Admin</span>
            </button>
          </div>
        </div>

        {/* Messaging Feedback */}
        {success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 text-xs flex items-center space-x-2">
            <CheckCircle className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
            <span className="font-semibold">{success}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/25 text-red-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4.5 h-4.5 text-red-600 shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {/* Stats Matrix Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Properties', value: analytics.total, icon: <Building className="w-5 h-5 text-luxury-gold" /> },
            { label: 'Listings for Sale', value: analytics.buy, icon: <Building className="w-5 h-5 text-emerald-600" /> },
            { label: 'Units for Rent', value: analytics.rent, icon: <Building className="w-5 h-5 text-blue-600" /> },
            { label: 'Inquiries Received', value: analytics.totalInquiries, icon: <Mail className="w-5 h-5 text-indigo-500" /> },
            { label: 'Featured Units', value: analytics.featured, icon: <Star className="w-5 h-5 text-amber-500 fill-current" /> }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wide">{item.label}</span>
                <p className="font-mono text-2xl font-bold text-luxury-blue">{item.value}</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                {item.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Tab Controllers */}
        <div className="border-b border-gray-200 mb-6 flex space-x-4">
          {[
            { id: 'analytics', label: 'Metrics Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
            { id: 'properties', label: 'Manage Properties', icon: <FolderKanban className="w-4 h-4" /> },
            { id: 'inquiries', label: `Manage Inquiries (${inquiries.filter(i=>i.status === 'Pending').length})`, icon: <Mail className="w-4 h-4" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3.5 px-3 font-semibold text-sm flex items-center space-x-2 border-b-2 transition-all cursor-pointer ${
                activeTab === tab.id 
                  ? 'border-luxury-gold text-luxury-blue' 
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* 1. Tab Views: Metrics Dashboard */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Line / Bar chart of Monthly inquiries */}
            <div className="md:col-span-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h4 className="font-serif text-sm font-bold text-luxury-blue uppercase tracking-wide">Monthly Customer Inquiries Trend</h4>
              <div className="h-72 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.inquiriesChartData || []}>
                    <XAxis dataKey="name" stroke="#888888" />
                    <YAxis allowDecimals={false} stroke="#888888" />
                    <Tooltip cursor={{fill: '#FDFBF7'}} />
                    <Legend />
                    <Bar dataKey="inquiries" name="Consumer Queries" fill="#0F1C3F" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart of property classifications */}
            <div className="md:col-span-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 flex flex-col justify-between">
              <h4 className="font-serif text-sm font-bold text-luxury-blue uppercase tracking-wide">Niches Classification</h4>
              <div className="h-56 w-full text-xs shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.typeChartData || []}
                      cx="55%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {(analytics.typeChartData || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legends list */}
              <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-gray-500 pt-3 border-t">
                {(analytics.typeChartData || []).map((entry, idx) => (
                  <div key={idx} className="flex items-center space-x-1.5 leading-none">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                    <span className="truncate">{entry.name} ({entry.value})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. Tab Views: Manage Properties */}
        {activeTab === 'properties' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden space-y-5 p-5">
            <div className="flex flex-col sm:flex-row items-center justify-between border-b pb-4 gap-4">
              <h3 className="font-serif text-base font-bold text-luxury-blue">Lucknow Listings Database ({properties.length} Active)</h3>
              <button
                onClick={handleOpenCreate}
                className="bg-gradient-to-r from-luxury-gold to-luxury-gold-light text-luxury-dark text-xs font-bold uppercase py-2.5 px-4 rounded-xl flex items-center space-x-1 justify-center transition-all cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Upload New Property</span>
              </button>
            </div>

            {/* Properties Listings Database Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-600 border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase text-[9px] tracking-widest">
                    <th className="p-4">Property info</th>
                    <th className="p-4">Vicinity</th>
                    <th className="p-4">Price Value</th>
                    <th className="p-4">Niche Type</th>
                    <th className="p-4">Featured</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {properties.map(p => (
                    <tr key={p.id} className="hover:bg-gray-55/30 transition-colors">
                      <td className="p-4 flex items-center space-x-3.5">
                        <img 
                          src={p.featuredImage} 
                          alt={p.title} 
                          className="w-11 h-11 object-cover rounded-lg shrink-0 border"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <span className="font-bold text-luxury-blue block max-w-[200px] truncate">{p.title}</span>
                          <span className="text-[10px] text-gray-400 font-mono font-medium lowercase">ID: {p.id}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-gray-600">{p.locality}</span>
                      </td>
                      <td className="p-4 font-mono font-bold text-luxury-blue">
                        {p.price >= 10000000 ? `₹ ${(p.price/10000000).toFixed(2)} Cr` : `₹ ${(p.price/100000).toFixed(2)} Lakh`}
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 bg-gray-100 rounded text-[10px] font-bold text-gray-500 uppercase">{p.type}</span>
                      </td>
                      <td className="p-4">
                        <button 
                          onClick={() => handleToggleFeatured(p)}
                          className="text-gray-400 hover:text-luxury-gold transition-colors cursor-pointer"
                        >
                          {p.featured ? (
                            <span className="bg-amber-50 text-amber-700 font-bold border border-amber-200 text-[10px] px-2.5 py-0.5 rounded">★ Featured</span>
                          ) : (
                            <span className="text-gray-400 border border-gray-250 text-[10px] px-2.5 py-0.5 rounded bg-gray-50">Standard</span>
                          )}
                        </button>
                      </td>
                      <td className="p-4">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${
                          p.status === 'Available' ? 'text-emerald-600' : 'text-amber-500'
                        }`}>{p.status}</span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button 
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 hover:bg-gray-150 rounded text-luxury-gold border hover:border-luxury-gold/50 cursor-pointer inline-block"
                          title="Edit Details"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteProperty(p.id)}
                          className="p-1.5 hover:bg-red-50 rounded text-red-500 border border-gray-100 hover:border-red-200 cursor-pointer inline-block"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. Tab Views: Manage Customer Inquiries */}
        {activeTab === 'inquiries' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-5">
            <h3 className="font-serif text-base font-bold text-luxury-blue mb-4 border-b pb-3">Active Customer Communication Inquiries ({inquiries.length})</h3>
            
            {inquiries.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase text-[9px] tracking-widest">
                      <th className="p-4">Customer info</th>
                      <th className="p-4">Selected property context</th>
                      <th className="p-4">Sent Date</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Inquiry Message</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-600">
                    {inquiries.map(inq => (
                      <tr key={inq.id} className="hover:bg-gray-55/35">
                        <td className="p-4 space-y-1">
                          <span className="font-bold text-luxury-blue block">{inq.customerName}</span>
                          <span className="text-[10px] text-gray-400 font-mono block">Tel: {inq.phone}</span>
                          <span className="text-[10px] text-gray-400 font-mono block">{inq.email}</span>
                        </td>
                        <td className="p-4">
                          {inq.propertyName ? (
                            <span className="font-semibold text-gray-600 line-clamp-2 max-w-[150px]">{inq.propertyName}</span>
                          ) : (
                            <span className="text-gray-400 italic">General Website Inquiry</span>
                          )}
                        </td>
                        <td className="p-4 font-mono text-[10px] font-medium">{inq.date}</td>
                        <td className="p-4">
                          <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                            inq.status === 'Pending' 
                              ? 'bg-amber-100 border border-amber-200 text-amber-700' 
                              : inq.status === 'Contacted' 
                              ? 'bg-blue-100 border border-blue-200 text-blue-700' 
                              : 'bg-gray-100 border border-gray-200 text-gray-400'
                          }`}>
                            {inq.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-[11px] font-light max-w-[250px] line-clamp-2 block leading-relaxed" title={inq.message}>
                            {inq.message}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-1.5 shrink-0 whitespace-nowrap">
                          {inq.status === 'Pending' && (
                            <button
                              onClick={() => handleInquiryStatusChange(inq.id, 'Contacted')}
                              className="text-[10px] border border-blue-200 bg-blue-50 text-blue-700 active:scale-95 px-2 py-1 rounded cursor-pointer"
                              title="Mark Contacted"
                            >
                              Contacted
                            </button>
                          )}
                          {inq.status !== 'Closed' && (
                            <button
                              onClick={() => handleInquiryStatusChange(inq.id, 'Closed')}
                              className="text-[10px] border border-gray-200 bg-gray-50 text-gray-500 active:scale-95 px-2 py-1 rounded cursor-pointer"
                              title="Close Ticket"
                            >
                              Close
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteInquiry(inq.id)}
                            className="p-1 hover:bg-red-50 text-red-500 rounded border border-transparent hover:border-red-100 cursor-pointer inline-block align-middle"
                            title="Delete Inquiry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <span>No customer inquiries received yet. We will log them on form submissions.</span>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Property form Modal (Create / Update) */}
      {isFormOpen && (
        <div id="property-form-modal" className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60">
          <div className="relative bg-white max-w-2xl w-full rounded-3xl overflow-hidden shadow-2xl border border-gray-100 text-left flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-luxury-blue p-5 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-luxury-gold" />
                <h3 className="font-serif text-base font-bold">
                  {editingPropertyId ? 'Modify Lucknow Property Listing' : 'Upload Lucknow Property Listing'}
                </h3>
              </div>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="text-gray-300 hover:text-white border border-white/20 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Container form */}
            <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Property Title */}
                <div className="sm:col-span-2">
                  <label className="block text-[10px] uppercase font-bold text-gray-700 tracking-wider mb-1">Property Listing Title *</label>
                  <input
                    type="text"
                    required
                    value={propertyForm.title}
                    onChange={(e) => setPropertyForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Luxury 4 BHK Gold Facing Villa"
                    className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-luxury-gold"
                  />
                </div>

                {/* 2. Property Niche Type */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-700 tracking-wider mb-1">Niche Category *</label>
                  <select
                    value={propertyForm.type}
                    onChange={(e) => setPropertyForm(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none"
                  >
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

                {/* 3. Sale Or Rent */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-700 tracking-wider mb-1">Acquisition Model *</label>
                  <select
                    value={propertyForm.saleOrRent}
                    onChange={(e) => setPropertyForm(prev => ({ ...prev, saleOrRent: e.target.value as any }))}
                    className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none"
                  >
                    <option value="Buy">For Sale (Buy)</option>
                    <option value="Rent">For Rent</option>
                  </select>
                </div>

                {/* 4. Price */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-700 tracking-wider mb-1">Price Value (INR) *</label>
                  <input
                    type="number"
                    required
                    value={propertyForm.price}
                    onChange={(e) => setPropertyForm(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="e.g. 8500000"
                    className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none"
                  />
                  <span className="text-[10px] text-gray-400 font-mono mt-0.5 block">
                    {propertyForm.price ? `₹ ${Number(propertyForm.price).toLocaleString('en-IN')}` : ''}
                  </span>
                </div>

                {/* 5. Area */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-700 tracking-wider mb-1">Total Builtup Area (SqFt) *</label>
                  <input
                    type="number"
                    required
                    value={propertyForm.area}
                    onChange={(e) => setPropertyForm(prev => ({ ...prev, area: e.target.value }))}
                    placeholder="e.g. 1500"
                    className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none"
                  />
                </div>

                {/* 6. BHK Bedrooms */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-700 tracking-wider mb-1">Bedrooms (BHK Optional)</label>
                  <input
                    type="number"
                    value={propertyForm.bedrooms}
                    onChange={(e) => setPropertyForm(prev => ({ ...prev, bedrooms: e.target.value }))}
                    placeholder="e.g. 3"
                    className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none"
                  />
                </div>

                {/* 7. Bathrooms */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-700 tracking-wider mb-1">Bathrooms (Optional)</label>
                  <input
                    type="number"
                    value={propertyForm.bathrooms}
                    onChange={(e) => setPropertyForm(prev => ({ ...prev, bathrooms: e.target.value }))}
                    placeholder="e.g. 3"
                    className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none"
                  />
                </div>

                {/* 8. Locality */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-700 tracking-wider mb-1">Lucknow Locality VICINITY *</label>
                  <select
                    value={propertyForm.locality}
                    onChange={(e) => setPropertyForm(prev => ({ ...prev, locality: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none"
                  >
                    <option value="Gomti Nagar">Gomti Nagar</option>
                    <option value="Hazratganj">Hazratganj</option>
                    <option value="Sushant Golf City">Sushant Golf City</option>
                    <option value="Vrindavan Yojna">Vrindavan Yojna</option>
                    <option value="Aliganj">Aliganj</option>
                    <option value="Indira Nagar">Indira Nagar</option>
                    <option value="Amar Shaheed Path">Amar Shaheed Path</option>
                  </select>
                </div>

                {/* 9. Status */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-700 tracking-wider mb-1">Listing Status *</label>
                  <select
                    value={propertyForm.status}
                    onChange={(e) => setPropertyForm(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none"
                  >
                    <option value="Available">Available</option>
                    <option value="Sold">Sold</option>
                    <option value="Rented">Rented</option>
                  </select>
                </div>

                {/* 10. Address */}
                <div className="sm:col-span-2">
                  <label className="block text-[10px] uppercase font-bold text-gray-700 tracking-wider mb-1">Zoning Street Address *</label>
                  <input
                    type="text"
                    required
                    value={propertyForm.address}
                    onChange={(e) => setPropertyForm(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="e.g. Block-D, Near Club House, Sushant Golf City"
                    className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none"
                  />
                </div>

                {/* 11. Description */}
                <div className="sm:col-span-2">
                  <label className="block text-[10px] uppercase font-bold text-gray-700 tracking-wider mb-1">Details specifications description *</label>
                  <textarea
                    rows={4}
                    value={propertyForm.description}
                    onChange={(e) => setPropertyForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe building foundations, modern wardrobes, sanitary fittings, layout plans..."
                    className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl px-3 py-2 resize-none focus:outline-none"
                  ></textarea>
                </div>

                {/* 12. Amenities */}
                <div className="sm:col-span-2">
                  <label className="block text-[10px] uppercase font-bold text-gray-700 tracking-wider mb-1">Amenities facilities (comma separated)</label>
                  <input
                    type="text"
                    value={propertyForm.amenitiesInput}
                    onChange={(e) => setPropertyForm(prev => ({ ...prev, amenitiesInput: e.target.value }))}
                    placeholder="Swimming Pool, Power Backup, Gym, 24x7 Security"
                    className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none"
                  />
                </div>

                {/* 13. Map Link */}
                <div className="sm:col-span-2">
                  <label className="block text-[10px] uppercase font-bold text-gray-700 tracking-wider mb-1">Google maps embed Src URL</label>
                  <input
                    type="text"
                    value={propertyForm.googleMapUrl}
                    onChange={(e) => setPropertyForm(prev => ({ ...prev, googleMapUrl: e.target.value }))}
                    placeholder="https://www.google.com/maps/embed?pb=..."
                    className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none"
                  />
                </div>

                {/* 14. Primary Photo - Local Upload integrated or Text Link */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-700 tracking-wider mb-1">Featured Photo Link</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={propertyForm.featuredImage}
                      onChange={(e) => setPropertyForm(prev => ({ ...prev, featuredImage: e.target.value }))}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Local Upload */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-700 tracking-wider mb-1">Or Upload From Disk</label>
                  <div className="relative border border-dashed border-gray-300 rounded-xl bg-gray-50 p-2 text-center hover:bg-gray-100 transition-all cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div className="flex items-center justify-center space-x-1 text-gray-500 py-1">
                      <ImageIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-[10px] font-semibold">Choose photo file</span>
                    </div>
                  </div>
                </div>

                {/* 15. Additional list of pictures */}
                <div className="sm:col-span-2">
                  <label className="block text-[10px] uppercase font-bold text-gray-700 tracking-wider mb-1">Additional Photos (comma-separated links)</label>
                  <input
                    type="text"
                    value={propertyForm.additionalImagesInput}
                    onChange={(e) => setPropertyForm(prev => ({ ...prev, additionalImagesInput: e.target.value }))}
                    placeholder="https://image1.jpg, https://image2.jpg"
                    className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none"
                  />
                </div>

                {/* Bools flags */}
                <div className="sm:col-span-2 flex items-center space-x-6 bg-gray-50 p-3.5 rounded-2xl border">
                  {/* Parking */}
                  <label className="flex items-center space-x-2 cursor-pointer text-xs font-semibold text-gray-700">
                    <input
                      type="checkbox"
                      checked={propertyForm.parking}
                      onChange={(e) => setPropertyForm(prev => ({ ...prev, parking: e.target.checked }))}
                      className="rounded text-luxury-gold focus:ring-luxury-gold"
                    />
                    <span>Parking Slot Included</span>
                  </label>

                  {/* Featured */}
                  <label className="flex items-center space-x-2 cursor-pointer text-xs font-semibold text-gray-700">
                    <input
                      type="checkbox"
                      checked={propertyForm.featured}
                      onChange={(e) => setPropertyForm(prev => ({ ...prev, featured: e.target.checked }))}
                      className="rounded text-luxury-gold focus:ring-luxury-gold"
                    />
                    <span>Mark as HOME Featured Listing</span>
                  </label>
                </div>

              </div>

              {/* Bottom save */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-luxury-gold to-luxury-gold-light hover:brightness-110 text-luxury-dark text-xs font-bold uppercase tracking-wider py-3 rounded-xl transition-all cursor-pointer shadow-lg mt-4 flex items-center justify-center space-x-1.5"
              >
                <Check className="w-4.5 h-4.5" />
                <span>Save Property Settings</span>
              </button>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
