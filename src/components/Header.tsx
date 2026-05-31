import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { 
  Plane, Hotel, Briefcase, Sparkles, Shield, LogIn, LogOut, 
  Bell, BellOff, X, CheckSquare, Flame, ShieldAlert, BadgeInfo 
} from 'lucide-react';
import AuthModal from './AuthModal';

export default function Header() {
  const { 
    activeTab, 
    changeTab, 
    bookingsHistory, 
    user, 
    logoutAction,
    notifications,
    markNotificationAsRead,
    clearNotifications,
    isPeakSeason,
    togglePeakSeason
  } = useBooking();
  
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const activeCount = bookingsHistory.filter(b => b.status === 'upcoming').length;
  const unreadCount = notifications.filter(n => !n.read).length;

  // Initials converter helper
  const getInitials = (nameStr: string) => {
    return nameStr
      .split(' ')
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'V';
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0a223d] text-white shadow-md shadow-[#0a223d]/5 h-16 flex items-center" id="app-header">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 md:px-8 h-full relative">
        {/* Brand Logo with Orange Circle icon */}
        <div 
          onClick={() => changeTab('flights')} 
          className="flex cursor-pointer items-center space-x-2.5 group shrink-0"
          id="brand-logo"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-coral font-bold text-white text-base shadow-sm group-hover:scale-105 transition-transform duration-200">
            V
          </div>
          <div>
            <span className="font-display text-lg sm:text-xl font-black tracking-tight text-white">
              Go<span className="text-brand-coral">Voyage</span>
            </span>
            <div className="hidden sm:block text-[8px] font-bold text-brand-coral uppercase tracking-widest leading-none">
              VoyageFlow Elite
            </div>
          </div>
        </div>

        {/* Global Travel Module Tabs Selector */}
        <nav className="flex items-center space-x-1 sm:space-x-2 h-full" role="tablist">
          <button
            onClick={() => changeTab('flights')}
            className={`flex items-center space-x-1.5 px-2.5 sm:px-4 h-full text-xs font-bold transition-all duration-200 uppercase tracking-wider cursor-pointer border-t-2 border-b-2 border-transparent ${
              activeTab === 'flights'
                ? 'border-b-brand-coral text-brand-coral bg-white/5 opacity-100'
                : 'text-slate-300 hover:text-white hover:bg-white/5 opacity-85'
            }`}
            id="tab-flights"
            role="tab"
          >
            <Plane className="h-4 w-4 -rotate-45 text-brand-coral" />
            <span className="hidden sm:inline">Flights</span>
          </button>

          <button
            onClick={() => changeTab('hotels')}
            className={`flex items-center space-x-1.5 px-2.5 sm:px-4 h-full text-xs font-bold transition-all duration-200 uppercase tracking-wider cursor-pointer border-t-2 border-b-2 border-transparent ${
              activeTab === 'hotels'
                ? 'border-b-brand-coral text-brand-coral bg-white/5 opacity-100'
                : 'text-slate-300 hover:text-white hover:bg-white/5 opacity-85'
            }`}
            id="tab-hotels"
            role="tab"
          >
            <Hotel className="h-4 w-4" />
            <span className="hidden sm:inline">Hotels</span>
          </button>

          {user && (
            <button
              onClick={() => changeTab('profile')}
              className={`relative flex items-center space-x-1.5 px-2.5 sm:px-4 h-full text-xs font-bold transition-all duration-200 uppercase tracking-wider cursor-pointer border-t-2 border-b-2 border-transparent ${
                activeTab === 'profile'
                  ? 'border-b-brand-coral text-brand-coral bg-white/5 opacity-100'
                  : 'text-slate-300 hover:text-white hover:bg-white/5 opacity-85'
              }`}
              id="tab-profile"
              role="tab"
            >
              <Briefcase className="h-4 w-4" />
              <span>My Trips</span>
              {activeCount > 0 && (
                <span className="absolute top-2.5 right-1 sm:right-2 flex h-4 w-4 items-center justify-center rounded-full bg-brand-coral text-[9px] font-black text-white leading-none">
                  {activeCount}
                </span>
              )}
            </button>
          )}

          {/* Secure Admin Operations Link - rendering ONLY for admin profiles */}
          {user?.role === 'ADMIN' && (
            <button
              onClick={() => changeTab('admin')}
              className={`flex items-center space-x-1.5 px-2.5 sm:px-4 h-full text-xs font-bold text-amber-300 transition-all duration-200 uppercase tracking-wider cursor-pointer border-t-2 border-b-2 border-transparent ${
                activeTab === 'admin'
                  ? 'border-b-amber-400 bg-white/5 opacity-100'
                  : 'hover:text-amber-200 hover:bg-white/5'
              }`}
              id="tab-admin"
              role="tab"
            >
              <Shield className="h-3.5 w-3.5 fill-amber-300/10" />
              <span>Admin Desk</span>
            </button>
          )}
        </nav>

        {/* Right side controllers */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0" id="header-right-controls">
          
          {/* Dynamic surge controller / indicator */}
          <button
            onClick={togglePeakSeason}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer transition-all duration-200 ${
              isPeakSeason 
                ? 'bg-amber-500/10 border border-amber-405 text-amber-400 font-black animate-pulse' 
                : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
            }`}
            title="Toggle Surcharge Season (+20% surge rate)"
          >
            <Flame className={`h-3 w-3 ${isPeakSeason ? 'animate-bounce text-amber-500' : ''}`} />
            <span className="hidden lg:inline">{isPeakSeason ? 'Peak Season Surcharge Applied' : 'Value Mode Active'}</span>
            <span className="inline lg:hidden">{isPeakSeason ? '+20% Surge' : 'Base Price'}</span>
          </button>

          {/* Real-time Push Notification Hub Bell */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2 hover:bg-white/10 rounded-full text-slate-300 hover:text-white cursor-pointer relative transition-all"
              id="bell-notif"
              title="Show interactive alerts"
            >
              <Bell className="h-4.5 w-4.5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-red-500 animate-ping" />
              )}
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 block h-1.5 w-1.5 rounded-full bg-red-600 scale-100" />
              )}
            </button>

            {/* Notification drop-down panel with actions */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-3 w-80 bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 z-50 p-3 text-xs font-sans animate-fade-in-down">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-2">
                  <span className="font-extrabold text-slate-905 uppercase tracking-wider text-[10px] flex items-center space-x-1">
                    <CheckSquare className="h-3 w-3 text-brand-coral" />
                    <span>Voyager Live Logs</span>
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        notifications.forEach(n => markNotificationAsRead(n.id));
                        setIsNotifOpen(false);
                      }}
                      className="text-blue-600 hover:underline font-bold text-[9px] cursor-pointer"
                    >
                      Read All
                    </button>
                    <button
                      onClick={clearNotifications}
                      className="text-red-500 hover:underline font-bold text-[9px] cursor-pointer"
                    >
                      Clear Log
                    </button>
                  </div>
                </div>

                <div className="max-h-60 overflow-y-auto space-y-2.5 divide-y divide-slate-100 pr-1 pb-1">
                  {notifications.length === 0 ? (
                    <div className="text-center py-6 text-slate-400">
                      <BellOff className="h-6 w-6 mx-auto opacity-40 mb-1.5" />
                      <p className="font-semibold text-[10px] uppercase tracking-wider">All cleared up!</p>
                      <p className="text-[9px] text-slate-400 mt-0.5">No critical notifications logged.</p>
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div 
                        key={n.id} 
                        onClick={() => {
                          markNotificationAsRead(n.id);
                          changeTab('profile');
                          setIsNotifOpen(false);
                        }}
                        className={`pt-2 flex items-start space-x-2.5 cursor-pointer hover:bg-slate-50 p-1.5 rounded-lg transition-all ${
                          !n.read ? 'bg-orange-50/50' : ''
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {n.type === 'status' && <BadgeInfo className="h-4 w-4 text-blue-500" />}
                          {n.type === 'refund' && <Flame className="h-4 w-4 text-red-500" />}
                          {n.type === 'upgrade' && <Sparkles className="h-4 w-4 text-amber-500" />}
                          {n.type === 'price' && <Flame className="h-4 w-4 text-emerald-500" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-baseline">
                            <span className={`font-bold text-slate-800 ${!n.read ? 'text-[#0a223d]' : ''}`}>
                              {n.title}
                            </span>
                            <span className="text-[8px] font-mono text-slate-400 shrink-0">{n.timestamp}</span>
                          </div>
                          <p className="text-[10px] text-slate-550 leading-relaxed mt-0.5">{n.body}</p>
                          {!n.read && (
                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-coral mt-1" />
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="border-t border-slate-150 pt-2 mt-2 text-center text-[9px] text-slate-40缩 shadow-3xs text-slate-400 font-bold block">
                  Click on an alert to jump to Trips Manager
                </div>
              </div>
            )}
          </div>

          <div className="h-5 w-px bg-white/20 shrink-0" />

          {/* Premium Profile HUD Widget */}
          <div className="flex items-center space-x-3 shrink-0" id="profile-hud">
            {user ? (
              <>
                {/* Dynamic Loyalty tier representation based on role */}
                <div className="hidden md:flex items-center space-x-1 rounded-md bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 mt-0.5 text-[9px] font-bold text-amber-300 uppercase tracking-wider">
                  <Sparkles className="h-3 w-3 text-amber-400 fill-amber-400 animate-pulse" />
                  <span>{user.role === 'ADMIN' ? 'SYSOP ADMIN' : 'GOLD CLUB VIP'}</span>
                </div>

                {/* Account and Logout segment */}
                <div className="flex items-center space-x-2 rounded-lg border border-white/10 bg-white/5 p-1 px-2 font-sans">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-coral text-white font-black text-xs uppercase shadow-xs">
                    {getInitials(user.name)}
                  </div>
                  <div className="hidden md:block text-left max-w-28 overflow-hidden">
                    <div className="text-[11px] font-black text-white leading-tight truncate">{user.name}</div>
                    <div className="text-[8px] text-slate-350 leading-none truncate">{user.email}</div>
                  </div>
                  
                  {/* Logout controller */}
                  <button
                    type="button"
                    onClick={logoutAction}
                    className="p-1 hover:bg-white/10 rounded-md text-red-400 hover:text-red-300 cursor-pointer transition-all shrink-0"
                    title="Sign Out Session"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                  </button>
                </div>
              </>
            ) : (
              /* Guest action button to call auth popup */
              <button
                onClick={() => setIsAuthOpen(true)}
                className="inline-flex items-center space-x-1.5 bg-brand-coral hover:bg-brand-coral-hover text-white text-xs font-black uppercase tracking-widest py-1.5 px-3.5 rounded-lg cursor-pointer transition-all shadow-md mt-0.5"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic Pop-up Container */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </header>
  );
}
