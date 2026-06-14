import React, { useState, useEffect } from 'react';
import { ShieldCheck, Mail, Lock, ShieldAlert, CheckCircle, ArrowRight } from 'lucide-react';

interface AdminLoginPageProps {
  onNavigate: (path: string) => void;
}

export default function AdminLoginPage({ onNavigate }: AdminLoginPageProps) {
  const [email, setEmail] = useState('groupswastik8@gmail.com');
  const [password, setPassword] = useState('swastik123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // If already logged in, skip login page
    const token = localStorage.getItem('swastik_admin_token');
    if (token) {
      onNavigate('#/admin/dashboard');
    }
  }, [onNavigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide correct username credentials.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        localStorage.setItem('swastik_admin_token', data.token);
        
        // Dispatch storage state refresh
        window.dispatchEvent(new Event('storage'));
        
        setTimeout(() => {
          onNavigate('#/admin/dashboard');
        }, 1200);
      } else {
        setError(data.error || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('Failed to establish connection with Swastik auth server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="admin-login-container" className="pt-24 pb-16 min-h-screen bg-[#070F1C] flex items-center justify-center px-4">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80" 
          alt="Swastik Office Banner" 
          className="w-full h-full object-cover opacity-10"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1128] via-transparent to-[#0A1128]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md bg-luxury-blue/85 backdrop-blur-md p-8 rounded-3xl border border-luxury-gold/30 shadow-2xl text-left space-y-6">
        
        {/* Brand identity */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-luxury-blue border border-luxury-gold/40 rounded-2xl flex items-center justify-center mx-auto shadow-lg shrink-0">
            <svg className="w-7 h-7 text-luxury-gold-light" viewBox="0 0 100 100" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
              {/* Elegant outer diamond shield */}
              <path d="M50 15 L82 47 L50 85 L18 47 Z" strokeWidth="4.5" strokeLinejoin="round" />
              {/* Stylized monogram 'S' matching luxury typography */}
              <path d="M38 36 C38 29, 62 29, 62 38 C62 47, 38 47, 38 56 C38 65, 62 65, 62 58" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              {/* Real estate roof gable peak */}
              <path d="M32 22 L50 10 L68 22" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="font-serif text-xl font-bold text-white tracking-widest uppercase">Swastik Group</h2>
          <p className="text-[10px] text-luxury-gold-light font-sans uppercase tracking-[0.15em] font-semibold">
            Administrative Access Portal
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start space-x-2.5">
            <ShieldAlert className="w-4.5 h-4.5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center space-x-2.5">
            <CheckCircle className="w-4.5 h-4.5 shrink-0" />
            <span>Core authenticated! Launching dashboard...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-300 tracking-wider mb-1 cursor-pointer">Admin Email Id *</label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-gray-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="groupswastik8@gmail.com"
                className="w-full bg-[#070E1A] border border-luxury-gold/20 text-white text-xs rounded-xl pl-10 pr-3 py-3 focus:outline-none focus:border-luxury-gold font-mono"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-300 tracking-wider mb-1 cursor-pointer">Security Password *</label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-gray-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#070E1A] border border-luxury-gold/20 text-white text-xs rounded-xl pl-10 pr-3 py-3 focus:outline-none focus:border-luxury-gold font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-gradient-to-r from-luxury-gold to-luxury-gold-light hover:brightness-110 active:scale-[0.98] text-luxury-dark text-xs font-bold uppercase tracking-wider py-3.5 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2 shadow-lg"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-luxury-dark border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Access Dashboard</span>
                <ArrowRight className="w-4 h-4 text-luxury-dark" />
              </>
            )}
          </button>
        </form>

        {/* Credentials reminder */}
        <div className="bg-white/5 border border-white/5 p-4 rounded-2xl text-left space-y-1 text-[11px] text-gray-400">
          <p className="font-semibold text-luxury-gold-light uppercase tracking-wider text-[9px]">Developer Testing Credentials</p>
          <p>Login with the pre-seeded credentials specified in rules:</p>
          <div className="font-mono bg-black/40 p-1.5 rounded border border-white/5 mt-1 text-[10px] text-gray-300 space-y-0.5">
            <div>Email: <span className="text-white">groupswastik8@gmail.com</span></div>
            <div>Pass: <span className="text-white">swastik123</span></div>
          </div>
        </div>

      </div>
    </div>
  );
}
