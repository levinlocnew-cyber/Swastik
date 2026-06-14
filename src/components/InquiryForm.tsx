import React, { useState } from 'react';
import { Send, Phone, User, Mail, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';

interface InquiryFormProps {
  propertyId?: string;
  propertyName?: string;
  compact?: boolean;
  onSuccess?: () => void;
}

export default function InquiryForm({ propertyId, propertyName, compact = false, onSuccess }: InquiryFormProps) {
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    message: propertyName 
      ? `Hello, I am interested in your property "${propertyName}" [ID: ${propertyId}]. Please call me back with more details.`
      : 'Hello, I would like to get in touch with Swastik Group regarding properties in Lucknow.'
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.phone || !formData.email || !formData.message) {
      setStatus({ type: 'error', message: 'All fields are strictly required.' });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          propertyId,
          propertyName
        })
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: data.message });
        setFormData({
          customerName: '',
          phone: '',
          email: '',
          message: propertyName 
            ? `Hello, I am interested in your property "${propertyName}" [ID: ${propertyId}]. Please call me back with more details.`
            : 'Hello, I would like to get in touch with Swastik Group regarding properties in Lucknow.'
        });
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setStatus({ type: 'error', message: data.error || 'Check input details and try again.' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to connect to Swastik network. Please verify connection.' });
    } finally {
      setLoading(false);
    }
  };

  const borderStyle = compact 
    ? 'border-gray-300 dark:border-gray-700 bg-white' 
    : 'border-luxury-gold/30 bg-luxury-blue/40 text-white';

  return (
    <div id="inquiry-form-container" className={`rounded-2xl p-6 ${compact ? 'bg-white shadow-xl border border-gray-100' : 'bg-gradient-to-br from-luxury-blue to-[#0B1226] border border-luxury-gold/30 shadow-2xl'}`}>
      <div className="mb-5">
        <h3 className={`font-serif text-lg font-bold ${compact ? 'text-luxury-blue' : 'text-white'}`}>
          {propertyName ? 'Inquire About This Property' : 'Get Personal Consultation'}
        </h3>
        <p className="text-xs text-gray-400 mt-1">
          {propertyName ? 'Get detailed catalog, plans, layouts & site inspection schedule.' : 'Inquire for direct verified listings and pricing models.'}
        </p>
      </div>

      {status && (
        <div id="form-alert" className={`mb-4 p-3.5 rounded-xl text-xs flex items-start space-x-2.5 ${status.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
          {status.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
          <span>{status.message}</span>
        </div>
      )}

      <form id="property-inquiry-form" onSubmit={handleSubmit} className="space-y-4">
        {/* Customer Name */}
        <div>
          <label className={`block text-xs font-semibold mb-1 cursor-pointer ${compact ? 'text-gray-700' : 'text-gray-300'}`}>Full Name *</label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-400">
              <User className="w-4 h-4" />
            </span>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              placeholder="e.g. Priyanshu Singh"
              className={`w-full text-xs rounded-xl pl-9 pr-3 py-2.5 border focus:outline-none focus:border-luxury-gold transition-colors ${borderStyle}`}
              required
            />
          </div>
        </div>

        {/* Customer Phone */}
        <div>
          <label className={`block text-xs font-semibold mb-1 cursor-pointer ${compact ? 'text-gray-700' : 'text-gray-300'}`}>Mobile Number *</label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-400">
              <Phone className="w-4 h-4" />
            </span>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. +91 94520 12345"
              className={`w-full text-xs rounded-xl pl-9 pr-3 py-2.5 border focus:outline-none focus:border-luxury-gold transition-colors ${borderStyle}`}
              required
            />
          </div>
        </div>

        {/* Customer Email */}
        <div>
          <label className={`block text-xs font-semibold mb-1 cursor-pointer ${compact ? 'text-gray-700' : 'text-gray-300'}`}>Email Address *</label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-400">
              <Mail className="w-4 h-4" />
            </span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. customercare@example.com"
              className={`w-full text-xs rounded-xl pl-9 pr-3 py-2.5 border focus:outline-none focus:border-luxury-gold transition-colors ${borderStyle}`}
              required
            />
          </div>
        </div>

        {/* Message */}
        <div>
          <label className={`block text-xs font-semibold mb-1 cursor-pointer ${compact ? 'text-gray-700' : 'text-gray-300'}`}>Your Message *</label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-400">
              <MessageSquare className="w-4 h-4" />
            </span>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              placeholder="Ask about payment schedules, registry guidelines, or location layout."
              className={`w-full text-xs rounded-xl pl-9 pr-3 py-2.5 border focus:outline-none focus:border-luxury-gold transition-colors resize-none ${borderStyle}`}
              required
            ></textarea>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-luxury-gold to-luxury-gold-light hover:brightness-110 active:scale-[0.98] text-luxury-dark text-xs font-bold uppercase tracking-wider py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2 shadow-lg"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-luxury-dark border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>Submit Inquiry</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
