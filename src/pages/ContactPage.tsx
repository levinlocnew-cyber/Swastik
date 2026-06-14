import React from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, Star, Sparkles } from 'lucide-react';
import InquiryForm from '../components/InquiryForm';

interface ContactPageProps {
  onNavigate: (path: string) => void;
}

export default function ContactPage({ onNavigate }: ContactPageProps) {
  const startWhatsAppChat = () => {
    const text = encodeURIComponent("Hello Swastik Group Lucknow, checking your premium plot and apartment offerings. Please call me back.");
    window.open(`https://wa.me/919999999999?text=${text}`, '_blank');
  };

  return (
    <div id="contact-page-container" className="pt-24 pb-16 bg-gray-50 min-h-screen text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top title */}
        <div className="mb-10 text-center">
          <span className="text-xs uppercase font-extrabold text-luxury-gold tracking-[0.2em] block">Connect with Lucknow's Best</span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-luxury-blue mt-1">Get In Touch With Swastik Group</h2>
          <div className="w-16 h-1 bg-luxury-gold mx-auto rounded-full mt-3"></div>
          <p className="text-xs text-gray-500 mt-2 max-w-lg mx-auto">
            Schedule direct site layouts mapping inspections, verified LDA property evaluations, or secure payment plans consultations.
          </p>
        </div>

        {/* Info Grid block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Location Details & Contacts info cards */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Contact info card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
              <h3 className="font-serif text-lg font-bold text-luxury-blue border-b border-gray-50 pb-3 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-luxury-gold" />
                <span>Headquarters Office</span>
              </h3>

              <div className="space-y-4">
                <div className="flex items-start space-x-3.5 text-xs">
                  <div className="w-8 h-8 rounded-full bg-luxury-gold/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-4.5 h-4.5 text-luxury-gold" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-luxury-blue">Physical Mall Address</h4>
                    <span className="text-gray-500 mt-0.5 block leading-relaxed">
                      Halwasiya House, Mahatma Gandhi Marg, Hazratganj, Lucknow, Uttar Pradesh, 226001
                    </span>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5 text-xs">
                  <div className="w-8 h-8 rounded-full bg-luxury-gold/10 flex items-center justify-center shrink-0">
                    <Phone className="w-4.5 h-4.5 text-luxury-gold" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-luxury-blue">Phone Numbers</h4>
                    <a href="tel:+919999999999" className="text-gray-500 hover:text-luxury-gold transition-colors mt-0.5 block font-mono font-medium">
                      +91 99999 99999 (General Inquiries)
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5 text-xs">
                  <div className="w-8 h-8 rounded-full bg-luxury-gold/10 flex items-center justify-center shrink-0">
                    <Mail className="w-4.5 h-4.5 text-luxury-gold" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-luxury-blue">Office Email Address</h4>
                    <a href="mailto:groupswastik8@gmail.com" className="text-gray-500 hover:text-luxury-gold transition-colors mt-0.5 block font-mono">
                      groupswastik8@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5 text-xs">
                  <div className="w-8 h-8 rounded-full bg-luxury-gold/10 flex items-center justify-center shrink-0">
                    <Clock className="w-4.5 h-4.5 text-luxury-gold" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-luxury-blue">Consultation Hours</h4>
                    <span className="text-gray-500 mt-0.5 block">
                      Monday to Saturday: 10:00 AM – 7:30 PM (IST) <br />
                      Sunday: Site Inspections by Prior Booking Only
                    </span>
                  </div>
                </div>
              </div>

              {/* Instant WhatsApp buttons */}
              <div className="pt-4 border-t border-gray-100 flex gap-2">
                <button
                  type="button"
                  onClick={startWhatsAppChat}
                  className="flex-1 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl py-3 text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Interactive WhatsApp</span>
                </button>
                
                <a
                  href="tel:+919999999999"
                  className="bg-luxury-blue hover:bg-luxury-blue/90 text-white p-3 rounded-xl transition-all shadow-md flex items-center justify-center shrink-0"
                  title="Call Staff"
                >
                  <Phone className="w-4.5 h-4.5" />
                </a>
              </div>
            </div>

            {/* Corporate Star Trust Factor */}
            <div className="bg-gradient-to-r from-luxury-blue to-luxury-dark text-white p-6 rounded-2xl border border-luxury-gold/20 flex items-center space-x-4">
              <div className="w-12 h-12 bg-luxury-gold/15 rounded-xl flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-luxury-gold" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif text-sm font-semibold text-luxury-gold-light">Rapid Response Guarantee</h4>
                <p className="text-[11px] text-gray-300 leading-normal">
                  Our professional team answers all email queries and portal submissions within 2 hours. Physical site layout inspections can be booked within 24 hours.
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Dynamic Inquiry Submission */}
          <div className="lg:col-span-7">
            <InquiryForm compact={true} />
            
            {/* Embedded maps location preview */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mt-6">
              <div className="rounded-xl overflow-hidden h-[250px] bg-gray-50 border relative">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14239.51614798781!2d80.9388344!3d26.8465487!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399bfd0a8fffffff%3A0x868c2d2cf05d691e!2sHazratganj%2C%20Lucknow%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                  className="w-full h-full border-0"
                  allowFullScreen={false} 
                  loading="lazy"
                  title="Swastik Group Office Map"
                ></iframe>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
