/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BookingProvider, useBooking } from './context/BookingContext';
import Header from './components/Header';
import SearchWidget from './components/SearchWidget';
import FilterSidebar from './components/FilterSidebar';
import FlightListings from './components/FlightListings';
import HotelListings from './components/HotelListings';
import CheckoutFlow from './components/CheckoutFlow';
import ProfileDashboard from './components/ProfileDashboard';
import AdminDashboard from './components/AdminDashboard';
import { motion, AnimatePresence } from 'motion/react';

function TravelAppInner() {
  const { activeTab } = useBooking();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans" id="app-root-workflow">
      {/* Dynamic Header Nav Bar */}
      <Header />

      {/* Hero widget search is visible only during active listings search views */}
      <AnimatePresence mode="popLayout">
        {(activeTab === 'flights' || activeTab === 'hotels') && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            key="common-search-engine"
          >
            <SearchWidget />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main interactive screen workspace blocks */}
      <main className="flex-1 pb-16">
        <AnimatePresence mode="wait">
          {activeTab === 'flights' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              key="flights-main-screen"
              className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              {/* Left filter sidebars */}
              <div className="lg:col-span-3">
                <FilterSidebar />
              </div>
              
              {/* Right core listings */}
              <div className="lg:col-span-9">
                <FlightListings />
              </div>
            </motion.div>
          )}

          {activeTab === 'hotels' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              key="hotels-main-screen"
              className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              {/* Left filters sidebars */}
              <div className="lg:col-span-3">
                <FilterSidebar />
              </div>

              {/* Right core listings */}
              <div className="lg:col-span-9">
                <HotelListings />
              </div>
            </motion.div>
          )}

          {activeTab === 'checkout' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              key="checkout-active-page"
            >
              <CheckoutFlow />
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              key="profile-active-page"
            >
              <ProfileDashboard />
            </motion.div>
          )}

          {activeTab === 'admin' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              key="admin-active-page"
            >
              <AdminDashboard />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Minimal Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 text-center border-t border-slate-800 text-xs mt-auto">
        <p className="font-display font-medium">© 2026 GoVoyage Booking Portals. Inspired by MakeMyTrip.</p>
        <p className="text-slate-500 font-mono text-[10px] uppercase mt-2 select-none tracking-widest">
          PLATFORM NODE STATUS: ONLINE • ALL FLIGHT SYSTEMS OPTIMIZED
        </p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BookingProvider>
      <TravelAppInner />
    </BookingProvider>
  );
}
