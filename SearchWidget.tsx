import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { CITIES } from '../data/mockData';
import { Plane, Hotel, Calendar, Users, ArrowRightLeft, Search, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function SearchWidget() {
  const { searchParams, searchFlightsAction, searchHotelsAction, activeTab, changeTab } = useBooking();

  // Flights internal form
  const [flightFrom, setFlightFrom] = useState(searchParams.flights.from);
  const [flightTo, setFlightTo] = useState(searchParams.flights.to);
  const [flightDate, setFlightDate] = useState(searchParams.flights.departureDate);
  const [flightPassengers, setFlightPassengers] = useState(searchParams.flights.passengers);
  const [flightClass, setFlightClass] = useState(searchParams.flights.cabinClass);

  // Hotels internal form
  const [hotelDest, setHotelDest] = useState(searchParams.hotels.destination);
  const [hotelIn, setHotelIn] = useState(searchParams.hotels.checkIn);
  const [hotelOut, setHotelOut] = useState(searchParams.hotels.checkOut);
  const [hotelGuests, setHotelGuests] = useState(searchParams.hotels.guests);
  const [hotelRooms, setHotelRooms] = useState(searchParams.hotels.rooms);

  const swapRoute = () => {
    const temp = flightFrom;
    setFlightFrom(flightTo);
    setFlightTo(temp);
  };

  const handleFlightSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchFlightsAction(flightFrom, flightTo, flightDate, undefined, flightPassengers, flightClass);
  };

  const handleHotelSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchHotelsAction(hotelDest, hotelIn, hotelOut, hotelGuests, hotelRooms);
  };

  return (
    <div className="w-full bg-gradient-to-b from-[#0a223d] to-[#041221] py-8 pb-12 px-4 text-white shadow-inner relative overflow-hidden" id="hero-widget-container">
      {/* Visual Background Gradients/Glows */}
      <div className="absolute top-0 left-1/4 h-64 w-64 rounded-full bg-brand-coral/10 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="mx-auto max-w-7xl relative z-10 px-2 sm:px-4 md:px-6">
        {/* Dynamic Marketing Tagline */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-1.5 rounded-full bg-white/10 px-3 py-0.5 text-[10px] font-bold text-brand-coral border border-white/10 uppercase tracking-widest"
          >
            <span>✨ DIRECT CO-OP ROUTES ACTIVE: PARIS, LONDON & DELHI</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2.5 font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-tight"
          >
            Explore with Absolute Precision, <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-brand-coral to-red-400">Book with Elite Status</span>
          </motion.h1>
          <p className="mt-1.5 text-xs text-slate-300 max-w-xl mx-auto leading-relaxed">
            Instantly compare premium aviator classes and verified corporate-rate boutique retreats with non-stop filter routing systems.
          </p>
        </div>

        {/* Centralized Search Card Panel */}
        <div className="rounded-xl bg-white text-slate-900 shadow-xl overflow-hidden border border-slate-200">
          {/* Quick tab toggle */}
          <div className="flex border-b border-slate-150 bg-slate-50/80 p-1">
            <button
              onClick={() => changeTab('flights')}
              className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'flights'
                  ? 'bg-white text-brand-coral shadow-sm border border-slate-205/40'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              id="widget-tab-flights"
            >
              <Plane className="h-3.5 w-3.5 -rotate-45" />
              <span>Flights</span>
            </button>
            <button
              onClick={() => changeTab('hotels')}
              className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'hotels'
                  ? 'bg-white text-brand-coral shadow-sm border border-slate-205/40'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              id="widget-tab-hotels"
            >
              <Hotel className="h-3.5 w-3.5" />
              <span>Hotels</span>
            </button>
          </div>

          {/* Form Area */}
          <div className="p-4 sm:p-6 md:p-8">
            <AnimatePresence mode="wait">
              {activeTab === 'flights' ? (
                <motion.form
                  key="flights-form"
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 5 }}
                  onSubmit={handleFlightSearch}
                  className="space-y-6"
                  id="flights-search-form"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    {/* Origin select */}
                    <div className="md:col-span-5 relative">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        <span>From Airport</span>
                      </label>
                      <select
                        value={flightFrom}
                        onChange={(e) => setFlightFrom(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-slate-800 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500/20 shadow-xs appearance-none cursor-pointer outline-none"
                        id="flight-from-select"
                      >
                        {CITIES.map((city) => (
                          <option key={`from-${city.code}`} value={city.code}>
                            {city.name} ({city.code}) — {city.country}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Swap button */}
                    <div className="md:col-span-2 flex justify-center -my-2 md:my-0 md:pt-4">
                      <button
                        type="button"
                        onClick={swapRoute}
                        className="rounded-full bg-slate-50 hover:bg-slate-100 p-2.5 border border-slate-200 text-blue-600 hover:text-blue-700 shadow-sm hover:scale-105 transition-all"
                        title="Swap route"
                        id="route-swap-btn"
                      >
                        <ArrowRightLeft className="h-4 w-4 rotate-90 md:rotate-0" />
                      </button>
                    </div>

                    {/* Destination select */}
                    <div className="md:col-span-5 relative">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                        <MapPin className="h-3 w-3 text-red-400" />
                        <span>To Airport</span>
                      </label>
                      <select
                        value={flightTo}
                        onChange={(e) => setFlightTo(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-slate-800 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500/20 shadow-xs appearance-none cursor-pointer outline-none"
                        id="flight-to-select"
                      >
                        {CITIES.map((city) => (
                          <option key={`to-${city.code}`} value={city.code} disabled={city.code === flightFrom}>
                            {city.name} ({city.code}) — {city.country}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Departure Date */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                        <Calendar className="h-3 w-3 text-blue-500" />
                        <span>Departure Date</span>
                      </label>
                      <input
                        type="date"
                        value={flightDate}
                        min="2026-05-31"
                        onChange={(e) => setFlightDate(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-slate-800 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500/20 outline-none"
                        id="flight-date-input"
                        required
                      />
                    </div>

                    {/* Passenger Selector */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                        <Users className="h-3 w-3 text-blue-500" />
                        <span>Passengers Count</span>
                      </label>
                      <select
                        value={flightPassengers}
                        onChange={(e) => setFlightPassengers(Number(e.target.value))}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-slate-800 focus:border-blue-500 focus:bg-white outline-none cursor-pointer"
                        id="flight-passengers-select"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                          <option key={`pass-${num}`} value={num}>
                            {num} Traveler{num > 1 ? 's' : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Cabin Class Selection */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                        <Plane className="h-3 w-3 text-blue-500" />
                        <span>Cabin Class</span>
                      </label>
                      <select
                        value={flightClass}
                        onChange={(e) => setFlightClass(e.target.value as any)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-slate-800 focus:border-blue-500 focus:bg-white outline-none cursor-pointer"
                        id="flight-class-select"
                      >
                        <option value="Economy">Economy</option>
                        <option value="Premium Economy">Premium Economy</option>
                        <option value="Business">Business Class</option>
                        <option value="First">First Class Elite</option>
                      </select>
                    </div>
                  </div>

                  {/* Submit bar */}
                  <div className="flex justify-end pt-3 border-t border-slate-100">
                    <button
                      type="submit"
                      className="flex items-center space-x-2 rounded-full bg-gradient-to-r from-orange-500 to-red-600 hover:scale-[1.02] active:scale-[0.98] hover:shadow-orange-500/20 px-10 py-3 text-xs font-black uppercase tracking-widest text-white shadow-md transition-all cursor-pointer"
                      id="flight-search-submit"
                    >
                      <Search className="h-4 w-4" />
                      <span>Search Flights</span>
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.form
                  key="hotels-form"
                  initial={{ opacity: 0, x: 5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -5 }}
                  onSubmit={handleHotelSearch}
                  className="space-y-6"
                  id="hotels-search-form"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* Destination input */}
                    <div className="md:col-span-6">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        <span>Destination City / Area</span>
                      </label>
                      <select
                        value={hotelDest}
                        onChange={(e) => setHotelDest(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-slate-800 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500/20 outline-none cursor-pointer"
                        id="hotel-destination-select"
                      >
                        {CITIES.map((city) => (
                          <option key={`hotel-dest-${city.code}`} value={city.code}>
                            {city.name}, {city.country}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Dates columns */}
                    <div className="grid grid-cols-2 gap-3 md:col-span-6">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                          <Calendar className="h-3 w-3 text-blue-500" />
                          <span>Check-In Date</span>
                        </label>
                        <input
                          type="date"
                          value={hotelIn}
                          min="2026-05-31"
                          onChange={(e) => setHotelIn(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:bg-white outline-none"
                          id="hotel-checkin-input"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                          <Calendar className="h-3 w-3 text-blue-500" />
                          <span>Check-Out Date</span>
                        </label>
                        <input
                          type="date"
                          value={hotelOut}
                          min={hotelIn || '2026-05-31'}
                          onChange={(e) => setHotelOut(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:bg-white outline-none"
                          id="hotel-checkout-input"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Guests selection */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                        <Users className="h-3 w-3 text-blue-500" />
                        <span>Guests Count</span>
                      </label>
                      <select
                        value={hotelGuests}
                        onChange={(e) => setHotelGuests(Number(e.target.value))}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-slate-800 focus:border-blue-500 focus:bg-white outline-none cursor-pointer"
                        id="hotel-guests-select"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                          <option key={`guests-${num}`} value={num}>
                            {num} Guest{num > 1 ? 's' : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Rooms count selection */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                        <Hotel className="h-3 w-3 text-blue-500" />
                        <span>Rooms Required</span>
                      </label>
                      <select
                        value={hotelRooms}
                        onChange={(e) => setHotelRooms(Number(e.target.value))}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-slate-800 focus:border-blue-500 focus:bg-white outline-none cursor-pointer"
                        id="hotel-rooms-select"
                      >
                        {[1, 2, 3, 4, 5].map((num) => (
                          <option key={`rooms-${num}`} value={num}>
                            {num} Room{num > 1 ? 's' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Submit bar */}
                  <div className="flex justify-end pt-3 border-t border-slate-100">
                    <button
                      type="submit"
                      className="flex items-center space-x-2 rounded-full bg-gradient-to-r from-orange-500 to-red-600 hover:scale-[1.02] active:scale-[0.98] hover:shadow-orange-500/20 px-10 py-3 text-xs font-black uppercase tracking-widest text-white shadow-md transition-all cursor-pointer"
                      id="hotel-search-submit"
                    >
                      <Search className="h-4 w-4" />
                      <span>Search Hotels</span>
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
