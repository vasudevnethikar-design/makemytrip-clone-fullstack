import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { X, Mail, Lock, User as UserIcon, Shield, Sparkles, Check, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { loginAction, signupAction } = useBooking();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'USER' | 'ADMIN'>('USER');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Password assessment
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  if (!isOpen) return null;

  // Real-time client-side evaluation
  const assessPassword = (val: string) => {
    setPassword(val);
    const errors: string[] = [];
    if (val.length < 6) {
      errors.push('Password must be at least 6 characters in length.');
    }
    if (!/[A-Z]/.test(val)) {
      errors.push('Include at least one uppercase letter.');
    }
    if (!/[0-9]/.test(val)) {
      errors.push('Include at least one numeric digit.');
    }
    setValidationErrors(errors);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Field-level validations
    if (!email || !email.includes('@')) {
      setError('Please provide a fully-qualified email address (containing @).');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        await loginAction(email, role, name || undefined);
        setSuccess('Authentication successful! Initializing elite traveler profile...');
        setTimeout(() => {
          onClose();
          setIsLoading(false);
        }, 1200);
      } else {
        if (!name) {
          setError('Full name is required for registering an elite voyager account.');
          setIsLoading(false);
          return;
        }
        await signupAction(name, email, role);
        setSuccess('Account provisioned successfully! Enrolling in Gold benefits...');
        setTimeout(() => {
          onClose();
          setIsLoading(false);
        }, 1200);
      }
    } catch (err: any) {
      setError(err?.message || 'Server did not respond. Check your database connections.');
      setIsLoading(false);
    }
  };

  const loadPresetCredentials = (presetRole: 'USER' | 'ADMIN') => {
    if (presetRole === 'ADMIN') {
      setEmail('admin@govoyage.com');
      setName('System Administration Manager');
      setRole('ADMIN');
      setPassword('AdminSecure12!');
    } else {
      setEmail('vasudevnethikar@gmail.com');
      setName('Vasudev Nethikar');
      setRole('USER');
      setPassword('VoyagerElite76*');
    }
    setValidationErrors([]);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in" id="auth-modal-overlay">
      <div className="relative w-full max-w-md overflow-hidden bg-white rounded-xl border border-slate-205 shadow-2xl flex flex-col font-sans" id="auth-modal-card">
        {/* Decorative Top header element */}
        <div className="h-1.5 bg-gradient-to-r from-orange-500 to-brand-coral" />

        {/* Modal Close */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer text-slate-400 hover:text-slate-700 transition-colors"
          title="Dismiss"
        >
          <X className="h-4.5 w-4.5" />
        </button>

        <div className="p-6">
          <div className="text-center mb-6">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-orange-50 text-brand-coral font-bold text-lg shadow-inner mb-2.5">
              V
            </div>
            <h3 className="font-display font-black text-xl text-slate-900 uppercase tracking-tight">
              {isLogin ? 'Voyager Access Portal' : 'Create Elite Account'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {isLogin ? 'Access your dynamic bookings, schedules, and admin features' : 'Unlock premium custom schedules, travel benefits, and loyalty points'}
            </p>
          </div>

          {/* Quick Preset Sandbox Tags for ease of testing */}
          <div className="mb-5 bg-slate-50 rounded-lg border border-slate-200/80 p-3">
            <span className="block text-[9px] uppercase font-black text-slate-400 tracking-wider mb-2 text-center">
              ⚡ Sandbox Credentials (No manual typing required)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => loadPresetCredentials('USER')}
                className="py-1.5 px-2 bg-white hover:bg-orange-50/50 border border-slate-200 hover:border-brand-coral rounded text-[10px] font-bold text-slate-700 uppercase tracking-wider text-center cursor-pointer transition-all"
              >
                👤 VIP Voyager
              </button>
              <button
                type="button"
                onClick={() => loadPresetCredentials('ADMIN')}
                className="py-1.5 px-2 bg-white hover:bg-orange-50/50 border border-slate-200 hover:border-brand-coral rounded text-[10px] font-bold text-slate-700 uppercase tracking-wider text-center cursor-pointer transition-all"
              >
                ⚙️ Admin Mode
              </button>
            </div>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {error && (
              <div className="flex items-start space-x-2 rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span className="font-semibold">{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-start space-x-2 rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-700 animate-pulse">
                <Check className="h-4 w-4 shrink-0 mt-0.5 animate-bounce" />
                <span className="font-bold">{success}</span>
              </div>
            )}

            {/* FULL NAME - signup only */}
            {!isLogin && (
              <div>
                <label className="block text-[10px] uppercase font-black text-slate-450 tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Vasudev Nethikar"
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:bg-white focus:ring-1 focus:ring-brand-coral focus:border-brand-coral outline-none text-slate-800 placeholder:text-slate-400"
                  />
                </div>
              </div>
            )}

            {/* EMAIL */}
            <div>
              <label className="block text-[10px] uppercase font-black text-slate-450 tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:bg-white focus:ring-1 focus:ring-brand-coral focus:border-brand-coral outline-none text-slate-800 placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* SECURE PASSWORD */}
            <div>
              <label className="block text-[10px] uppercase font-black text-slate-450 tracking-wider mb-1 flex items-center justify-between">
                <span>Secure Password</span>
                {!isLogin && password && (
                  <span className={`text-[9px] font-black uppercase ${validationErrors.length === 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {validationErrors.length === 0 ? 'Strong Password' : 'Weak Password'}
                  </span>
                )}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => assessPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:bg-white focus:ring-1 focus:ring-brand-coral focus:border-brand-coral outline-none text-slate-800 placeholder:text-slate-400"
                />
              </div>

              {/* Password complexity checklist helper */}
              {!isLogin && password && validationErrors.length > 0 && (
                <div className="mt-2 bg-slate-50 border border-slate-150 p-2 rounded-lg text-[9px] text-slate-500 font-medium space-y-1">
                  <span className="block font-black text-slate-400 uppercase tracking-widest mb-1">Requirements:</span>
                  {validationErrors.map((err, idx) => (
                    <div key={idx} className="flex items-center space-x-1.5 text-amber-650">
                      <div className="h-1 w-1 rounded-full bg-amber-500" />
                      <span>{err}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* INTENT SELECTION (ADMIN OR USER) */}
            <div>
              <label className="block text-[10px] uppercase font-black text-slate-450 tracking-wider mb-1 flex items-center space-x-1">
                <Shield className="h-3 w-3 text-slate-400" />
                <span>Security Access Group Role</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className={`flex items-center justify-center space-x-2 border rounded-lg py-2 px-3 text-xs font-bold cursor-pointer transition-all ${
                  role === 'USER' 
                    ? 'border-brand-coral bg-orange-50/40 text-brand-coral' 
                    : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}>
                  <input
                    type="radio"
                    name="roleGroup"
                    value="USER"
                    checked={role === 'USER'}
                    onChange={() => setRole('USER')}
                    className="hidden"
                  />
                  <span>User Privilege</span>
                </label>
                <label className={`flex items-center justify-center space-x-2 border rounded-lg py-2 px-3 text-xs font-bold cursor-pointer transition-all ${
                  role === 'ADMIN' 
                    ? 'border-slate-800 bg-slate-905 text-slate-900 border-2 font-black' 
                    : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}>
                  <input
                    type="radio"
                    name="roleGroup"
                    value="ADMIN"
                    checked={role === 'ADMIN'}
                    onChange={() => setRole('ADMIN')}
                    className="hidden"
                  />
                  <div className="flex items-center space-x-1">
                    <Shield className="h-3.5 w-3.5 text-orange-500 fill-orange-500/10" />
                    <span>Administrator</span>
                  </div>
                </label>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isLoading || success.length > 0}
              className="w-full py-2.5 text-center rounded-lg bg-[#0a223d] hover:bg-brand-coral text-white font-black text-xs uppercase tracking-widest transition-all shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{isLogin ? 'Authenticates Access' : 'Create Account'}</span>
                </>
              )}
            </button>
          </form>

          {/* TOGGLE PANEL METHOD */}
          <div className="mt-5 text-center text-xs text-slate-500">
            {isLogin ? "Don't have an elite member credentials?" : 'Already registered an elite account?'}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setSuccess('');
              }}
              className="ml-1 text-brand-coral font-bold hover:underline cursor-pointer bg-transparent border-none p-0"
            >
              {isLogin ? 'Join Gold Club' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
