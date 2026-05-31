import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { Flight } from '../types';
import { 
  Plane, Zap, Info, ShieldAlert, Award, Clock, Star, Snowflake, 
  Flame, Bell, BellOff, ThumbsUp, ThumbsDown, MessageSquare, Flag, ArrowRight, Sparkles 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function FlightListings() {
  const { 
    filteredFlights, 
    searchParams, 
    selectForBooking, 
    hasSearchedFlights,
    reviews,
    flagReview,
    voteHelpfulReview,
    flightStatuses,
    trackedFlights,
    toggleTrackFlight,
    isPeakSeason,
    frozenPrices,
    freezePriceAction,
    isPriceFrozen,
    recommendationFeedback,
    submitRecFeedback
  } = useBooking();

  const [selectedFlightInfo, setSelectedFlightInfo] = useState<string | null>(null);
  const [showReviewsId, setShowReviewsId] = useState<string | null>(null);

  const passengerCount = searchParams.flights.passengers || 1;

  // Machine learning mock recommendations
  const recommendation = {
    id: 'FL-DEL-GOI-100',
    airline: 'IndiGo',
    route: 'DEL → GOI',
    tag: 'Frequent Flyer Choice ⭐',
    reason: 'Because you frequently check premium-economy flights to coastal Goa in summer weekend slots and prefer early morning flights.'
  };

  const isRecFeedbackGiven = recommendationFeedback[recommendation.id] !== undefined;

  if (!hasSearchedFlights) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center" id="empty-results">
        <Plane className="h-12 w-12 text-slate-300 animate-bounce" />
        <h3 className="mt-4 text-base font-bold text-slate-705">Ready for Take Off?</h3>
        <p className="mt-1 text-xs text-slate-400 max-w-xs">
          Select your departure airport and destination, choose a suitable date, and search above to query schedules immediately.
        </p>
      </div>
    );
  }

  if (filteredFlights.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-2xl border border-slate-200/60 p-8" id="no-flight-results">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400 border border-slate-100 mb-3">
          <Plane className="h-6 w-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800">No matching flights found</h3>
        <p className="mt-1 text-xs text-slate-500 max-w-sm">
          No flight schedules meet your current stop configurations or budget parameters. Try resetting your filters to explore standard options.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4" id="flight-listings-container text-left">
      
      {/* RECOMMENDATION BLOCK WITH TOOLTIP & FEEDBACK LOOP - Task 6 */}
      <AnimatePresence>
        {filteredFlights.some(f => f.id === recommendation.id) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-gradient-to-r from-blue-50/70 to-indigo-50/50 border border-blue-200/80 p-4.5 rounded-xl shadow-xs font-sans text-left relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-3 text-[14px] text-indigo-400 fill-indigo-400 opacity-20">
              <Sparkles className="h-16 w-16" />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10">
              <div>
                <span className="text-[8px] font-black uppercase tracking-widest bg-indigo-600 text-white px-2 py-0.5 rounded-sm">
                  {recommendation.tag}
                </span>
                <h4 className="font-extrabold text-slate-900 text-[12.5px] mt-1.5 flex items-center space-x-1">
                  <span>GoVoyage Elite Suggestion: Premium economy flight DEL to GOI</span>
                </h4>
                
                {/* Tooltip trigger showing explanation justification */}
                <div className="mt-1 flex items-start space-x-1.5 text-[11px] text-slate-600 bg-white/70 p-2 rounded-lg border border-indigo-105/10 max-w-2xl">
                  <span className="font-bold text-indigo-700 uppercase tracking-wider text-[8px] mt-0.5 bg-indigo-50 px-1 py-0.2 shrink-0">Explanation:</span>
                  <p className="text-slate-550 leading-relaxed font-semibold italic">"{recommendation.reason}"</p>
                </div>
              </div>

              {/* Feedback Loop handler */}
              <div className="shrink-0 flex items-center space-x-2 mt-2 sm:mt-0 bg-white/50 p-1.5 rounded-lg border border-indigo-150">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Helpful?</span>
                {isRecFeedbackGiven ? (
                  <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 px-2 py-1 rounded">Thanks for rating!</span>
                ) : (
                  <>
                    <button
                      onClick={() => submitRecFeedback(recommendation.id, 'helpful')}
                      className="p-1 px-2.5 bg-white text-slate-700 border border-slate-200 rounded-md font-bold text-[10px] hover:bg-slate-50 cursor-pointer flex items-center space-x-1 hover:text-indigo-650"
                    >
                      <ThumbsUp className="h-3 w-3 text-emerald-500 fill-emerald-500/10" />
                      <span>Yes</span>
                    </button>
                    <button
                      onClick={() => submitRecFeedback(recommendation.id, 'not_helpful')}
                      className="p-1 px-2.5 bg-white text-slate-700 border border-slate-200 rounded-md font-bold text-[10px] hover:bg-slate-50 cursor-pointer flex items-center space-x-1 hover:text-red-500"
                    >
                      <ThumbsDown className="h-3 w-3 text-red-500" />
                      <span>No</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top count summary bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
        <span>Showing {filteredFlights.length} matching flight schedules</span>
        <span>Prices listed for {passengerCount} Traveler{passengerCount > 1 ? 's' : ''}</span>
      </div>

      <div className="space-y-4.5">
        {filteredFlights.map((flight, idx) => {
          // Task 5 - Pricing checks honoring froze limits vs peak surcharge
          const frozenPrice = frozenPrices[flight.id];
          const isFrozen = frozenPrice !== undefined;
          
          const seatPrice = resolvedBasePrice(flight);
          const totalRoutePrice = seatPrice * passengerCount;
          const isSelectedInfo = selectedFlightInfo === flight.id;
          const isTracking = trackedFlights.includes(flight.flightNo);

          // Task 3 - Get simulated live status
          const liveStatus = flightStatuses[flight.flightNo];

          // Task 2 - Fetch items matching reviews
          const flightReviews = reviews.filter(rev => rev.targetId === flight.id);
          const averageReviewRating = flightReviews.length > 0 
            ? (flightReviews.reduce((acc, current) => acc + current.rating, 0) / flightReviews.length).toFixed(1)
            : '4.8'; // Default high rating if no reviews added yet

          function resolvedBasePrice(f: Flight) {
            if (isPriceFrozen(f.id)) {
              return frozenPrices[f.id];
            }
            if (isPeakSeason) {
              return Math.floor(f.price * 1.25); // Apply holiday surcharge automatically
            }
            return f.price;
          }

          return (
            <motion.div
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: Math.min(idx * 0.05, 0.3) }}
              key={flight.id}
              className="group relative overflow-hidden rounded-xl border border-slate-200 hover:border-slate-350 bg-white shadow-xs hover:shadow-md transition-all duration-200 text-left"
              id={`flight-card-${flight.id}`}
            >
              {/* Premium Top highlight status ribbon */}
              {flight.seatsLeft <= 3 && (
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-red-500 to-brand-coral" />
              )}

              <div className="p-4 sm:p-5">
                
                {/* Real-time surge / pricing frozen banners */}
                <div className="flex flex-wrap items-center justify-between pb-2 mb-2 border-b border-slate-100 gap-2">
                  {/* Reviews rating indicator */}
                  <div className="flex items-center space-x-1.5 cursor-pointer" onClick={() => setShowReviewsId(showReviewsId === flight.id ? null : flight.id)}>
                    <div className="flex items-center bg-amber-500/10 text-amber-700 font-extrabold px-1.5 py-0.5 rounded text-[10px]">
                      <Star className="h-2.5 w-2.5 fill-amber-500 text-amber-500 mr-1 inline" />
                      <span>{averageReviewRating}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 hover:underline font-bold">({flightReviews.length > 0 ? flightReviews.length : 3} guest reviews)</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Freeze Price Locker indicator status */}
                    {isFrozen ? (
                      <span className="bg-sky-500/10 border border-sky-400 text-sky-600 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider flex items-center space-x-1 shadow-3xs animate-pulse">
                        <Snowflake className="h-3 w-3" />
                        <span>Surcharges Bypassed & Locked: ₹{frozenPrice.toLocaleString()} seat</span>
                      </span>
                    ) : isPeakSeason ? (
                      <span className="bg-amber-500/10 border border-amber-300 text-amber-600 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider flex items-center space-x-1 animate-pulse">
                        <Flame className="h-3 w-3" />
                        <span>🔥 Demand Surge Active (+25% applied)</span>
                      </span>
                    ) : (
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Flexible Fare Tier</span>
                    )}

                    {/* Flight status badge (Delayed, On Time, etc.) */}
                    {liveStatus && (
                      <span className={`text-[9px] font-extrabold border px-2 py-0.5 rounded uppercase tracking-wider ${
                        liveStatus.status === 'On Time' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                          : liveStatus.status === 'Boarding'
                            ? 'bg-blue-50 text-blue-700 border-blue-100 animate-pulse'
                            : 'bg-red-50 text-red-700 border-red-100'
                      }`}>
                        {liveStatus.status}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  
                  {/* AIRLINE LOGO & NO */}
                  <div className="md:col-span-3 flex items-center space-x-3">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg font-display text-xs font-black shadow-inner ${flight.logo}`}>
                      {flight.airlineCode}
                    </div>
                    <div>
                      <h4 className="font-display font-extrabold text-slate-900 group-hover:text-brand-coral transition-colors text-sm leading-tight">
                        {flight.airline}
                      </h4>
                      <div className="flex items-center space-x-1.5 mt-0.5">
                        <span className="font-mono text-[9px] font-black text-slate-400 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded-sm">
                          {flight.flightNo}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                          {flight.class}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* FLIGHT TIMES & DURATIONS (TIMELINE TRANSIT GRAPH) */}
                  <div className="md:col-span-5 flex items-center justify-between">
                    {/* Departure info */}
                    <div className="text-left">
                      <div className="font-mono text-base font-extrabold text-slate-900 leading-none">
                        {flight.departureTime}
                      </div>
                      <div className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-wider">{flight.fromCode}</div>
                      <div className="hidden sm:block text-[9px] text-slate-400 font-medium truncate max-w-24 mt-0.5">
                        {flight.from}
                      </div>
                    </div>

                    {/* Timeline slider representation */}
                    <div className="flex-1 px-4 flex flex-col items-center justify-center relative">
                      <span className="text-[9px] text-slate-450 font-black mb-0.5 flex items-center space-x-1 uppercase tracking-wider">
                        <Clock className="h-3 w-3 text-slate-455 text-slate-400" />
                        <span>{flight.duration}</span>
                      </span>

                      {/* Line slider */}
                      <div className="w-full h-0.5 bg-slate-200 relative my-1">
                        {flight.stops > 0 ? (
                          <div className="absolute inset-0 flex items-center justify-center">
                            {Array.from({ length: flight.stops }).map((_, i) => (
                              <div
                                key={`stop-${flight.id}-${i}`}
                                className="h-1.5 w-1.5 rounded-full bg-brand-coral border border-white hover:scale-125 transition-transform"
                                title="Layover stop"
                              />
                            ))}
                          </div>
                        ) : (
                          /* Non-stop glowing center */
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 border border-white" />
                          </div>
                        )}
                        <Plane className="h-3 w-3 text-slate-400 -rotate-45 absolute -top-1.5 right-1/2 translate-x-1/2" />
                      </div>

                      <span className={`text-[9px] uppercase font-black tracking-widest leading-none ${
                        flight.stops === 0 ? 'text-green-600' : 'text-amber-600'
                      }`}>
                        {flight.stops === 0 ? 'Non-Stop' : `${flight.stops} Stop${flight.stops > 1 ? 's' : ''}`}
                      </span>
                    </div>

                    {/* Arrival info */}
                    <div className="text-right">
                      <div className="font-mono text-base font-extrabold text-slate-900 leading-none">
                        {flight.arrivalTime}
                      </div>
                      <div className="text-[10px] font-black text-slate-505 text-slate-500 mt-1 uppercase tracking-wider">{flight.toCode}</div>
                      <div className="hidden sm:block text-[9px] text-slate-400 font-medium truncate max-w-24 mt-0.5">
                        {flight.to}
                      </div>
                    </div>
                  </div>

                  {/* PRICE CONTAINER */}
                  <div className="md:col-span-2 flex flex-col justify-center items-start md:items-end">
                    <div className="text-slate-450 text-[9px] font-black uppercase tracking-wider">Total Booking</div>
                    <div className="font-mono text-lg sm:text-xl font-black text-slate-950 leading-tight">
                      ₹{totalRoutePrice.toLocaleString()}
                    </div>
                    {flight.refundable ? (
                      <span className="inline-flex items-center space-x-1 rounded-sm bg-orange-50 px-1.5 py-0.5 text-[9px] font-bold text-brand-coral border border-orange-100 mt-1 leading-none uppercase tracking-wider">
                        Refundable
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Non-Refundable</span>
                    )}
                  </div>

                  {/* ACTION TRIGGER BUTTON */}
                  <div className="md:col-span-2 flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-stretch gap-1.5 w-full">
                    <button
                      onClick={() => selectForBooking('flight', flight)}
                      className="w-full py-2 px-3 rounded-lg text-center bg-[#0a223d] hover:bg-brand-coral group-hover:bg-brand-coral text-white font-black text-xs uppercase tracking-widest transition-all duration-200 flex items-center justify-center space-x-1 cursor-pointer shadow-xs"
                      id={`btn-book-flight-${flight.id}`}
                    >
                      <Zap className="h-3.5 w-3.5 fill-white text-white" />
                      <span>Book Now</span>
                    </button>

                    <div className="flex gap-1.5 w-full">
                      <button
                        type="button"
                        onClick={() => setSelectedFlightInfo(isSelectedInfo ? null : flight.id)}
                        className="flex-1 py-1 px-2 text-[9px] font-black uppercase tracking-wider text-slate-550 border border-slate-200 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors flex items-center justify-center space-x-0.5"
                      >
                        <Info className="h-3 w-3" />
                        <span>Details</span>
                      </button>

                      {/* Task 5 - Price freezing button */}
                      <button
                        type="button"
                        disabled={isFrozen}
                        onClick={() => freezePriceAction(flight.id, resolvedBasePrice(flight))}
                        className={`flex-1 py-1 px-2 text-[9px] font-black uppercase tracking-wider border rounded-lg cursor-pointer transition-colors flex items-center justify-center space-x-0.5 ${
                          isFrozen 
                            ? 'bg-sky-50 text-sky-600 border-sky-200 cursor-not-allowed' 
                            : 'text-slate-500 border-slate-200 hover:bg-sky-50 hover:border-sky-305 hover:text-sky-650'
                        }`}
                        title="Freeze locked rate on this flight for 24h"
                      >
                        <Snowflake className="h-3 w-3" />
                        <span>{isFrozen ? 'Frozen' : 'Freeze'}</span>
                      </button>
                    </div>

                    {/* Task 3 - Monitor / Track flight action buttons */}
                    <button
                      type="button"
                      onClick={() => toggleTrackFlight(flight.flightNo)}
                      className={`py-1.5 px-3 text-[9px] font-extrabold uppercase tracking-wider rounded-lg cursor-pointer transition-all flex items-center justify-center space-x-1 border ${
                        isTracking 
                          ? 'bg-amber-500 text-white border-amber-500 animate-pulse font-black' 
                          : 'text-slate-650 border-slate-200 hover:bg-slate-50 hover:text-amber-600'
                      }`}
                    >
                      <Bell className="h-3 w-3" />
                      <span>{isTracking ? '📡 Monitoring' : '🔔 Track Status'}</span>
                    </button>
                  </div>

                </div>

                {/* SCARCITY INDICATOR METRIC */}
                {flight.seatsLeft <= 3 && (
                  <div className="flex items-center space-x-1.5 mt-3 pt-3 border-t border-slate-100 text-red-650" id="scarcity-alert">
                    <ShieldAlert className="h-4 w-4" />
                    <span className="text-[10.5px] font-black uppercase tracking-wide">
                      Hurry! Only {flight.seatsLeft} seat{flight.seatsLeft > 1 ? 's' : ''} left at this locked rate!
                    </span>
                  </div>
                )}

                {/* Task 3 - Detailed Live Delay Context Banner */}
                {liveStatus && liveStatus.reason && (
                  <div className="mt-3 bg-blue-50/50 rounded-lg p-2.5 border border-blue-150 flex items-center space-x-2 text-xs font-sans">
                    <span className="text-[8px] font-black uppercase tracking-widest bg-blue-600 text-white px-2 py-0.5 rounded shrink-0">Live Alert</span>
                    <p className="text-slate-600 font-medium leading-relaxed">
                      Gate: <span className="font-bold text-slate-800">{liveStatus.departureGate || '4B'}</span>. Delay context: <span className="font-semibold text-slate-705">"{liveStatus.reason}"</span>. Estimated Arrival slot: <span className="font-bold">{liveStatus.estimatedArrival}</span>.
                    </p>
                  </div>
                )}

                {/* EXPANDABLE DETAILS TAB */}
                {isSelectedInfo && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-slate-100 text-left"
                    id={`flight-details-expanded-${flight.id}`}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50/70 rounded-xl p-4 text-xs font-sans text-slate-650">
                      <div>
                        <span className="block font-bold text-slate-400 uppercase tracking-wider text-[9px] mb-1">Fare Breakdown</span>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span>Base Fare x {passengerCount}:</span>
                            <span className="font-mono font-semibold text-slate-705">₹{(resolvedBasePrice(flight) * 0.9 * passengerCount).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Taxes & Fee:</span>
                            <span className="font-mono font-semibold text-slate-705">₹{(resolvedBasePrice(flight) * 0.1 * passengerCount).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <span className="block font-bold text-slate-400 uppercase tracking-wider text-[9px] mb-1">Standard Luggage Benefits</span>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span>Cabin Baggage:</span>
                            <span className="font-semibold text-slate-700">7 kg cabin allowance</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Check-In Bags:</span>
                            <span className="font-semibold text-slate-700">15 kg checked baggage checked</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <span className="block font-bold text-slate-400 uppercase tracking-wider text-[9px] mb-1">Loyalty Perk Rewards</span>
                        <div className="flex items-center space-x-1.5 text-blue-750 font-semibold bg-blue-50/80 p-2 rounded-lg border border-blue-105/10 mt-0.5 text-slate-700">
                          <Award className="h-4 w-4 text-blue-500 shrink-0" />
                          <span>Earn {(resolvedBasePrice(flight) * 0.15).toFixed(0)} Voyager loyalty stars on this transaction!</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* SHOW VERIFIED REVIEWS ACCORDION INNER BLOCK - Task 2 */}
                {showReviewsId === flight.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 pt-4 border-t border-slate-100 text-left font-sans text-xs space-y-3"
                  >
                    <div className="flex justify-between items-center border-b border-dashed border-slate-200 pb-1.5">
                      <span className="font-black text-slate-900 text-[11px] uppercase tracking-wider">
                        Guest Reviews & Photo Evidence ({flightReviews.length > 0 ? flightReviews.length : 3} submittals)
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">Verified Bookers Only</span>
                    </div>

                    <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                      {flightReviews.length === 0 ? (
                        /* Default mock reviews for flights, preventing blanks */
                        <div className="space-y-3">
                          <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-slate-800 text-[11px]">Sanjay Dev</span>
                              <span className="text-[9px] text-slate-400 font-mono">10 May 2026</span>
                            </div>
                            <div className="flex text-amber-500"><Star className="h-3 w-3 fill-amber-500 mr-0.5" /><Star className="h-3 w-3 fill-amber-500 mr-0.5" /><Star className="h-3 w-3 fill-amber-500 mr-0.5" /><Star className="h-3 w-3 fill-amber-500 mr-0.5" /><Star className="h-3 w-3 fill-amber-500 mr-0.5" /></div>
                            <p className="text-slate-600 leading-relaxed italic">"Punctual flight and delicious hot breakfast. Ground crew at Delhi helped with express baggage tracking. Recommend 100%!"</p>
                            <div className="flex justify-end pt-1 gap-1 flex-wrap">
                              <button onClick={() => alert('Thanks for voting helpful')} className="text-slate-400 font-bold hover:text-slate-700 text-[9px] flex items-center space-x-1 border border-slate-205 rounded px-2 hover:bg-white cursor-pointer"><ThumbsUp className="h-2.5 w-2.5 mr-1" /><span>Helpful (11)</span></button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        flightReviews.map((rev) => (
                          <div 
                            key={rev.id} 
                            className={`p-3 bg-slate-50/50 border border-slate-150 rounded-xl space-y-2 relative transition-all ${
                              rev.flagged ? 'opacity-50 border-red-200' : ''
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="font-bold text-slate-800 tracking-tight">{rev.author}</span>
                                {rev.flagged && (
                                  <span className="text-[8px] bg-red-100 text-red-700 border border-red-200 rounded px-1.5 ml-2 font-black uppercase">
                                    Flagged for Review
                                  </span>
                                )}
                              </div>
                              <span className="text-[9px] text-slate-450 font-mono">{rev.createdAt}</span>
                            </div>

                            <div className="flex items-center space-x-0.5">
                              {Array.from({ length: 5 }).map((_, s) => (
                                <Star 
                                  key={s} 
                                  className={`h-3 w-3 ${s < rev.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-205'}`} 
                                />
                              ))}
                            </div>

                            <p className="text-slate-650 italic">"{rev.text}"</p>

                            {/* Review photos */}
                            {rev.photos && rev.photos.length > 0 && (
                              <div className="flex space-x-1">
                                {rev.photos.map((url, pIdx) => (
                                  <img 
                                    key={pIdx} 
                                    src={url} 
                                    alt="User traveler shot" 
                                    className="w-12 h-12 object-cover rounded-md border border-slate-200" 
                                    referrerPolicy="no-referrer"
                                  />
                                ))}
                              </div>
                            )}

                            {/* Replies */}
                            {rev.replies && rev.replies.map((rep) => (
                              <div key={rep.id} className="bg-white p-2 border-l border-brand-coral rounded mt-2 text-[10.5px]">
                                <span className="font-bold">{rep.author}</span>
                                <p className="text-slate-550 italic">"{rep.text}"</p>
                              </div>
                            ))}

                            {/* Vote & Flag controls */}
                            <div className="flex justify-end pt-1 space-x-2">
                              <button
                                type="button"
                                onClick={() => voteHelpfulReview(rev.id)}
                                className="text-slate-450 hover:text-slate-700 font-bold text-[9px] cursor-pointer flex items-center space-x-0.5 bg-white border border-slate-200 px-1.5 py-0.5 rounded"
                              >
                                <ThumbsUp className="h-2.5 w-2.5" />
                                <span>Helpful ({rev.helpfulCount})</span>
                              </button>
                              
                              {!rev.flagged && (
                                <button
                                  type="button"
                                  onClick={() => flagReview(rev.id)}
                                  className="text-red-420 hover:text-red-600 font-bold text-[9px] cursor-pointer flex items-center space-x-0.5 bg-white border border-slate-200 px-1.5 py-0.5 rounded"
                                >
                                  <Flag className="h-2.5 w-2.5" />
                                  <span>Flag Review</span>
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}

              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
