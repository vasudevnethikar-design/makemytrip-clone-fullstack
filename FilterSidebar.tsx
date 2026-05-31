import React from 'react';
import { useBooking } from '../context/BookingContext';
import { Filter, SlidersHorizontal, RefreshCw, Star, ShieldCheck, DollarSign } from 'lucide-react';
import { AIRLINES, AMENITIES_LIST } from '../data/mockData';

export default function FilterSidebar() {
  const {
    activeTab,
    flightFilters,
    hotelFilters,
    updateFlightFilters,
    updateHotelFilters,
    resetFlightFilters,
    resetHotelFilters,
    flightsResults,
    hotelsResults,
  } = useBooking();

  if (activeTab !== 'flights' && activeTab !== 'hotels') return null;

  const isFlights = activeTab === 'flights';

  // Toggle Flight Stop selection
  const handleStopToggle = (stop: string) => {
    const current = [...flightFilters.stops];
    const index = current.indexOf(stop);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(stop);
    }
    updateFlightFilters({ stops: current });
  };

  // Toggle Flight Airline selection
  const handleAirlineToggle = (airline: string) => {
    const current = [...flightFilters.airlines];
    const index = current.indexOf(airline);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(airline);
    }
    updateFlightFilters({ airlines: current });
  };

  // Toggle Flight Time selection
  const handleTimeToggle = (timeSlot: string) => {
    const current = [...flightFilters.departureTime];
    const index = current.indexOf(timeSlot);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(timeSlot);
    }
    updateFlightFilters({ departureTime: current });
  };

  // Toggle Hotel Stars selection
  const handleStarToggle = (starCount: number) => {
    const current = [...hotelFilters.stars];
    const index = current.indexOf(starCount);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(starCount);
    }
    updateHotelFilters({ stars: current });
  };

  // Toggle Hotel Amenities selection
  const handleAmenityToggle = (amenity: string) => {
    const current = [...hotelFilters.amenities];
    const index = current.indexOf(amenity);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(amenity);
    }
    updateHotelFilters({ amenities: current });
  };

  // Toggle Hotel Area selection
  const handleAreaToggle = (area: string) => {
    const current = [...hotelFilters.areas];
    const index = current.indexOf(area);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(area);
    }
    updateHotelFilters({ areas: current });
  };

  // Collect unique airlines present in active flight results
  const uniqueAirlines = Array.from(new Set(flightsResults.map((f) => f.airline))) as string[];

  // Collect unique hotel areas present in active hotel results
  const uniqueAreas = Array.from(new Set(hotelsResults.map((h) => h.area))) as string[];

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 p-4 shadow-xs" id="filter-sidebar">
      {/* Sidebar title */}
      <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-100">
        <div className="flex items-center space-x-2 text-slate-900">
          <SlidersHorizontal className="h-4 w-4 text-brand-coral" />
          <span className="font-display font-extrabold text-sm uppercase tracking-wider">Quick Filters</span>
        </div>
        <button
          onClick={isFlights ? resetFlightFilters : resetHotelFilters}
          className="flex items-center space-x-1 text-xs font-bold text-slate-400 hover:text-blue-600 cursor-pointer transition-colors"
          id="btn-reset-filters"
          title="Reset filters"
        >
          <RefreshCw className="h-3 w-3" />
          <span>Reset All</span>
        </button>
      </div>

      <div className="space-y-6">
        {isFlights ? (
          /* Flight specific blocks */
          <>
            {/* STOPS FILTER */}
            <div id="filter-block-stops">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Stops count</h4>
              <div className="flex flex-wrap gap-2">
                {['0', '1', '2+'].map((stop) => {
                  const isChecked = flightFilters.stops.includes(stop);
                  const label = stop === '0' ? 'Direct' : stop === '1' ? '1 Stop' : '2+ Stops';
                  return (
                    <button
                      key={`stop-${stop}`}
                      type="button"
                      onClick={() => handleStopToggle(stop)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border transition-all ${
                        isChecked
                          ? 'bg-orange-50 border-brand-coral text-brand-coral font-bold shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* PRICE SLIDER */}
            <div id="filter-block-price">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex justify-between">
                <span>Budget Limit</span>
                <span className="text-slate-700 font-mono">₹{flightFilters.priceRange[1].toLocaleString()}</span>
              </h4>
              <div className="space-y-2">
                <input
                  type="range"
                  min="2000"
                  max="120000"
                  step="500"
                  value={flightFilters.priceRange[1]}
                  onChange={(e) => updateFlightFilters({ priceRange: [flightFilters.priceRange[0], Number(e.target.value)] })}
                  className="w-full h-1 bg-slate-150 rounded-lg appearance-none cursor-pointer accent-brand-coral outline-none"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                  <span>Min: ₹2,000</span>
                  <span>Max: ₹1,20,000+</span>
                </div>
              </div>
            </div>

            {/* AIRLINE CHOICE */}
            {uniqueAirlines.length > 0 && (
              <div id="filter-block-airlines">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Preferred Carriers</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {uniqueAirlines.map((airline) => {
                    const isChecked = flightFilters.airlines.includes(airline);
                    return (
                      <label key={`airline-${airline}`} className="flex items-center space-x-2.5 text-slate-600 hover:text-slate-900 cursor-pointer text-sm">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleAirlineToggle(airline)}
                          className="h-4 w-4 rounded-sm border-slate-200 text-brand-coral focus:ring-brand-coral/20 accent-brand-coral cursor-pointer"
                        />
                        <span className="font-medium text-slate-700">{airline}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* DEPARTURE WINDOW */}
            <div id="filter-block-schedule">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Departure Windows</h4>
              <div className="space-y-2">
                {[
                  { id: 'morning', label: 'Sunrise Early / Morning (6 AM - 12 PM)' },
                  { id: 'afternoon', label: 'Midday / Afternoon (12 PM - 5 PM)' },
                  { id: 'evening', label: 'Twilight / Night (5 PM - 6 AM)' },
                ].map((slot) => {
                  const isChecked = flightFilters.departureTime.includes(slot.id);
                  return (
                    <label key={`slot-${slot.id}`} className="flex items-center space-x-2.5 text-slate-600 hover:text-slate-900 cursor-pointer text-xs">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleTimeToggle(slot.id)}
                        className="h-4 w-4 rounded-sm border-slate-200 text-brand-coral focus:ring-brand-coral/20 accent-brand-coral cursor-pointer"
                      />
                      <span className="font-semibold text-slate-700">{slot.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* REFUNDABLE OPTIONS */}
            <div id="filter-block-refundable" className="pt-2">
              <label className="flex items-center space-x-2.5 text-slate-600 hover:text-slate-900 cursor-pointer text-sm font-semibold">
                <input
                  type="checkbox"
                  checked={flightFilters.refundable === true}
                  onChange={(e) => updateFlightFilters({ refundable: e.target.checked ? true : null })}
                  className="h-4 w-4 rounded-sm border-slate-200 text-brand-coral focus:ring-brand-coral/20 accent-brand-coral cursor-pointer"
                />
                <div className="flex items-center space-x-1">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span className="text-slate-800">Free Cancellation (Refundable)</span>
                </div>
              </label>
            </div>
          </>
        ) : (
          /* Hotel specific blocks */
          <>
            {/* STAR RATINGS */}
            <div id="filter-block-stars">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Hotel Rating</h4>
              <div className="flex gap-2">
                {[3, 4, 5].map((star) => {
                  const isChecked = hotelFilters.stars.includes(star);
                  return (
                    <button
                      key={`star-${star}`}
                      type="button"
                      onClick={() => handleStarToggle(star)}
                      className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer border transition-all ${
                        isChecked
                          ? 'bg-amber-50 border-amber-400 text-amber-800'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <span>{star}</span>
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* HOTEL BUDGET */}
            <div id="filter-block-hotel-price">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex justify-between">
                <span>Max Budget Limit</span>
                <span className="text-slate-700 font-mono">₹{hotelFilters.priceRange[1].toLocaleString()}</span>
              </h4>
              <div className="space-y-2">
                <input
                  type="range"
                  min="2000"
                  max="25000"
                  step="250"
                  value={hotelFilters.priceRange[1]}
                  onChange={(e) => updateHotelFilters({ priceRange: [hotelFilters.priceRange[0], Number(e.target.value)] })}
                  className="w-full h-1 bg-slate-150 rounded-lg appearance-none cursor-pointer accent-brand-coral outline-none"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                  <span>Min: ₹2,000</span>
                  <span>Max: ₹25,000+</span>
                </div>
              </div>
            </div>

            {/* PREFERRED REGIONS */}
            {uniqueAreas.length > 0 && (
              <div id="filter-block-areas">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Popular Neighborhoods</h4>
                <div className="space-y-2">
                  {uniqueAreas.map((area) => {
                    const isChecked = hotelFilters.areas.includes(area);
                    return (
                      <label key={`area-${area}`} className="flex items-center space-x-2.5 text-slate-600 hover:text-slate-900 cursor-pointer text-xs">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleAreaToggle(area)}
                          className="h-4 w-4 rounded-sm border-slate-200 text-brand-coral focus:ring-brand-coral/20 accent-brand-coral cursor-pointer"
                        />
                        <span className="font-semibold text-slate-700">{area}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* AMENITIES TICKBOX */}
            <div id="filter-block-amenities">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Hotel Luxury Amenities</h4>
              <div className="space-y-2">
                {AMENITIES_LIST.slice(0, 6).map((amenity) => {
                  const isChecked = hotelFilters.amenities.includes(amenity);
                  return (
                    <label key={`amenity-${amenity}`} className="flex items-center space-x-2.5 text-slate-600 hover:text-slate-900 cursor-pointer text-xs">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleAmenityToggle(amenity)}
                        className="h-4 w-4 rounded-sm border-slate-200 text-brand-coral focus:ring-brand-coral/20 accent-brand-coral cursor-pointer"
                      />
                      <span className="font-semibold text-slate-700">{amenity}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
