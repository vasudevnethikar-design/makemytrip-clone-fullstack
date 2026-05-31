import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { Hotel } from '../types';
import { 
  Star, MapPin, Coffee, ShieldCheck, Zap, Bed, ShowerHead, Snowflake, 
  Flame, ThumbsUp, ThumbsDown, MessageSquare, Flag, Sparkles, ImageIcon, Info 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function HotelListings() {
  const { 
    filteredHotels, 
    searchParams, 
    selectForBooking, 
    hasSearchedHotels,
    reviews,
    flagReview,
    voteHelpfulReview,
    isPeakSeason,
    frozenPrices,
    freezePriceAction,
    isPriceFrozen,
    recommendationFeedback,
    submitRecFeedback
  } = useBooking();

  const [expandedHotelId, setExpandedHotelId] = useState<string | null>(null);
  const [showReviewsId, setShowReviewsId] = useState<string | null>(null);

  const hotelParams = searchParams.hotels;
  const inDate = new Date(hotelParams.checkIn);
  const outDate = new Date(hotelParams.checkOut);
  const diffTime = Math.abs(outDate.getTime() - inDate.getTime());
  const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const totalMultiplier = nights * (hotelParams.rooms || 1);

  // Machine learning mock hotel recommendation
  const recommendation = {
    id: 'hot-goa-resort-1',
    name: 'The Leela Resort & Spa',
    area: 'Cavelossim Beach',
    city: 'Goa',
    tag: 'Elite Sanctuary Suggestion 🌴',
    reason: 'Because you frequently reserve 5-Star Beach resorts in Goa and filters indicate high preference for high-speed Wi-Fi & pool access.'
  };

  const isRecFeedbackGiven = recommendationFeedback[recommendation.id] !== undefined;

  if (!hasSearchedHotels) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center" id="empty-hotels">
        <Bed className="h-12 w-12 text-slate-300 animate-bounce" />
        <h3 className="mt-4 text-base font-bold text-slate-750 font-display">Where is your Next Escape?</h3>
        <p className="mt-1 text-xs text-slate-400 max-w-sm">
          Select your destination area, choose check-in and out dates, and search options above to browse high-grade properties matching your standards.
        </p>
      </div>
    );
  }

  if (filteredHotels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-2xl border border-slate-200/65 p-8" id="no-hotel-results">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400 border border-slate-100 mb-3">
          <Bed className="h-6 w-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800">No matching hotels found</h3>
        <p className="mt-1 text-xs text-slate-500 max-w-sm">
          No premium properties meet your active star, filter, or location criteria. Try resetting filters to view all standard properties.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5" id="hotel-listings-container" text-left="true">
      
      {/* RECOMMENDATION BLOCK WITH TOOLTIP & FEEDBACK LOOP - Task 6 */}
      <AnimatePresence>
        {filteredHotels.some(h => h.id === recommendation.id) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-gradient-to-r from-indigo-50/70 to-blue-50/50 border border-blue-200 p-4 rounded-xl shadow-xs font-sans text-left relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-3 text-[14px] text-indigo-400 fill-indigo-400 opacity-20">
              <Sparkles className="h-16 w-16" />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10">
              <div>
                <span className="text-[8px] font-black uppercase tracking-widest bg-indigo-600 text-white px-2 py-0.5 rounded-sm">
                  {recommendation.tag}
                </span>
                <h4 className="font-extrabold text-slate-900 text-[12.5px] mt-1.5">
                  Suggested Sanitarium: {recommendation.name} — {recommendation.area}
                </h4>
                
                {/* Tooltip triggers justification */}
                <div className="mt-1 flex items-start space-x-1.5 text-[11px] text-slate-655 bg-white/75 p-2 rounded-lg border border-indigo-100 max-w-2xl text-slate-600">
                  <span className="font-extrabold text-indigo-700 uppercase tracking-wider text-[8px] mt-0.5 shrink-0 bg-indigo-50 px-1 py-0.2">Explanation:</span>
                  <p className="font-medium italic text-slate-550 leading-relaxed">"{recommendation.reason}"</p>
                </div>
              </div>

              {/* Feedback controls */}
              <div className="shrink-0 flex items-center space-x-2 bg-white p-1.5 rounded-lg border border-indigo-150">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Helpful?</span>
                {isRecFeedbackGiven ? (
                  <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded">Saved!</span>
                ) : (
                  <>
                    <button
                      onClick={() => submitRecFeedback(recommendation.id, 'helpful')}
                      className="p-1 px-2.5 bg-white text-slate-700 border border-slate-205 rounded-md font-extrabold text-[9.5px] hover:bg-slate-50 cursor-pointer flex items-center space-x-1 hover:text-indigo-600"
                    >
                      <ThumbsUp className="h-3 w-3 text-emerald-500" />
                      <span>Yes</span>
                    </button>
                    <button
                      onClick={() => submitRecFeedback(recommendation.id, 'not_helpful')}
                      className="p-1 px-2.5 bg-white text-slate-700 border border-slate-205 rounded-md font-extrabold text-[9.5px] hover:bg-slate-50 cursor-pointer flex items-center space-x-1 hover:text-red-500"
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

      {/* Top list parameters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-slate-500 font-semibold gap-1 px-1">
        <span>Displaying {filteredHotels.length} luxury accommodations</span>
        <span>Prices modeled for {nights} Night{nights > 1 ? 's' : ''}, {hotelParams.rooms} Room{hotelParams.rooms > 1 ? 's' : ''}</span>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredHotels.map((hotel, idx) => {
          // Task 5 - Pricing modifiers honoring price freezing
          const frozenPrice = frozenPrices[hotel.id];
          const isFrozen = frozenPrice !== undefined;

          const resolvedNightPrice = isFrozen 
            ? frozenPrice
            : (isPeakSeason ? Math.floor(hotel.price * 1.25) : hotel.price);
          
          const totalStayPrice = resolvedNightPrice * totalMultiplier;

          // Task 2 - Fetch items matching reviews
          const hotelReviews = reviews.filter(rev => rev.targetId === hotel.id);
          const calculatedRating = hotelReviews.length > 0 
            ? (hotelReviews.reduce((acc, c) => acc + c.rating, 0) / hotelReviews.length).toFixed(1)
            : hotel.rating.toString();

          return (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, delay: Math.min(idx * 0.05, 0.3) }}
              key={hotel.id}
              className="flex flex-col md:flex-row rounded-xl border border-slate-200 hover:border-slate-350 bg-white overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 group relative text-left"
              id={`hotel-card-${hotel.id}`}
            >
              {hotel.roomsAvailable <= 2 && (
                <div className="absolute top-0 right-0 z-10 bg-gradient-to-l from-red-650 to-brand-coral px-3 py-0.5 text-[9px] font-black uppercase tracking-wider text-white rounded-bl-lg shadow-xs">
                  Only {hotel.roomsAvailable} Rooms left!
                </div>
              )}

              {/* HOTEL PHOTO STAGE */}
              <div className="w-full md:w-72 h-44 sm:h-48 md:h-auto md:min-h-48 relative shrink-0 overflow-hidden bg-slate-100">
                <img
                  referrerPolicy="no-referrer"
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 object-center"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80';
                  }}
                />
                
                {/* Visual stars count badge */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-transparent to-transparent p-3 flex items-end">
                  <span className="bg-amber-500 text-slate-950 rounded px-1.5 py-0.5 text-[9px] font-black flex items-center space-x-0.5 uppercase tracking-wider shadow-xs">
                    <span>{hotel.stars} Stars Class</span>
                  </span>
                </div>
              </div>

              {/* DETAILS AND INFO SHEET */}
              <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      {/* Interactive Star layout feedback link */}
                      <div className="flex items-center space-x-1 mb-1 cursor-pointer" onClick={() => setShowReviewsId(showReviewsId === hotel.id ? null : hotel.id)}>
                        <div className="flex items-center space-x-0.5">
                          {Array.from({ length: hotel.stars }).map((_, sIdx) => (
                            <Star key={sIdx} className="h-3 w-3 text-amber-500 fill-amber-500" />
                          ))}
                        </div>
                        <span className="text-[10px] text-slate-450 hover:underline font-bold ml-1">
                          ({hotelReviews.length > 0 ? hotelReviews.length : 4} Verified Guest reviews)
                        </span>
                      </div>

                      <h3 className="font-display font-black text-slate-900 text-sm sm:text-base tracking-tight leading-snug group-hover:text-brand-coral transition-colors">
                        {hotel.name}
                      </h3>

                      <div className="flex items-center space-x-1 text-[11px] text-slate-500 mt-0.5">
                        <MapPin className="h-3 w-3 text-brand-coral shrink-0" />
                        <span className="font-bold text-slate-705">{hotel.area}</span>
                        <span>•</span>
                        <span className="font-semibold text-slate-505">{hotel.city}</span>
                      </div>
                    </div>

                    {/* RATINGS SCORE CARD */}
                    <div className="text-right shrink-0">
                      <div className="flex items-center justify-end space-x-1.5">
                        <div className="text-right">
                          <div className="text-xs font-black text-slate-800 leading-none">{hotel.ratingText} Guests</div>
                          <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider leading-tight mt-0.5">
                            {hotelReviews.length > 0 ? `${hotel.reviewsCount + hotelReviews.length} opinions` : `${hotel.reviewsCount} opinions`}
                          </div>
                        </div>
                        <div className="h-8 w-8 bg-orange-50 text-brand-coral font-mono text-xs font-black flex items-center justify-center rounded-lg border border-orange-100 shadow-3xs">
                          {calculatedRating}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SURGE AND LOCK BADGES BAR - Task 5 */}
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {isFrozen ? (
                      <span className="bg-sky-500/15 border border-sky-305 text-sky-700 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider flex items-center space-x-1">
                        <Snowflake className="h-3 w-3" />
                        <span>PRICE FROZEN: Bypass Surcharge at ₹{frozenPrice.toLocaleString()} / Nt</span>
                      </span>
                    ) : isPeakSeason ? (
                      <span className="bg-amber-500/10 border border-amber-205 text-amber-705 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider flex items-center space-x-1">
                        <Flame className="h-3 w-3 text-brand-coral" />
                        <span>Peak Surcharge Applied (+25% surge)</span>
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-2 text-xs text-slate-550 leading-relaxed font-sans max-w-lg text-slate-500">
                    {hotel.description}
                  </p>

                  {/* AMENITIES */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {hotel.amenities.map((amenity, amIdx) => (
                      <span
                        key={amIdx}
                        className="inline-flex items-center space-x-1.5 bg-slate-50 border border-slate-150 rounded px-1.5 py-0.5 text-[9px] font-black text-slate-500 uppercase tracking-widest"
                      >
                        {amenity.includes('Wi-Fi') && <span className="h-1 w-1 rounded-full bg-orange-500" />}
                        {amenity.includes('Pool') && <span className="h-1 w-1 rounded-full bg-cyan-400 animate-pulse" />}
                        {amenity.includes('Breakfast') && <Coffee className="h-2 w-2 text-amber-600" />}
                        <span>{amenity}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* BOTTOM CTA BUTTON AND NIGHTS CALCULATION */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-between gap-3">
                  <div className="text-left font-sans">
                    <div className="flex items-baseline space-x-1">
                      <span className="font-mono text-lg sm:text-xl font-black text-slate-900">
                        ₹{totalStayPrice.toLocaleString()}
                      </span>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total stay</span>
                    </div>
                    <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                      ₹{resolvedNightPrice.toLocaleString()} / Room / Night
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    {/* Price freezing controls */}
                    <button
                      type="button"
                      disabled={isFrozen}
                      onClick={() => freezePriceAction(hotel.id, resolvedNightPrice)}
                      className={`py-2 px-3 text-[10px] font-black uppercase tracking-widest border rounded-lg cursor-pointer transition-all flex items-center space-x-1 ${
                        isFrozen 
                          ? 'bg-sky-50 text-sky-600 border-sky-100 cursor-not-allowed' 
                          : 'text-slate-505 border-slate-200 hover:bg-sky-50 hover:border-sky-305 hover:text-sky-600'
                      }`}
                      title="Freeze locked night rates for 24h"
                    >
                      <Snowflake className="h-3.5 w-3.5" />
                      <span>{isFrozen ? 'Price Frozen' : 'Freeze Rate'}</span>
                    </button>

                    <button
                      onClick={() => selectForBooking('hotel', hotel)}
                      className="py-2.5 px-4 rounded-lg bg-[#0a223d] hover:bg-brand-coral group-hover:bg-brand-coral text-white font-black text-xs uppercase tracking-widest transition-all cursor-pointer shadow-xs flex items-center space-x-1"
                    >
                      <Zap className="h-3.5 w-3.5 fill-white text-white" />
                      <span>Choose Suites</span>
                    </button>
                  </div>
                </div>

                {/* GUEST REVIEWS MODERATION PANEL - Task 2 */}
                {showReviewsId === hotel.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 pt-4 border-t border-slate-100 text-left text-xs font-sans space-y-3"
                  >
                    <div className="flex justify-between items-center border-b border-dashed border-slate-150 pb-1.5">
                      <span className="font-extrabold text-slate-900 text-[10.5px] uppercase tracking-wider">
                        Verified Guest Review Feed & Photo Evidence
                      </span>
                      <span className="text-[9px] text-slate-405 font-bold uppercase">Real-time moderation enabled</span>
                    </div>

                    <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                      {hotelReviews.length === 0 ? (
                        /* Standard fallback guest reviews to avoid empty slides */
                        <div className="space-y-3 font-sans">
                          <div className="p-3 bg-slate-50 border border-slate-205 rounded-xl space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-slate-800 text-[11px]">Rahul Malhotra</span>
                              <span className="text-[9.5px] text-slate-400 font-mono">22 May 2026</span>
                            </div>
                            <div className="flex text-amber-500"><Star className="h-3 w-3 fill-amber-500" /><Star className="h-3 w-3 fill-amber-500" /><Star className="h-3 w-3 fill-amber-500" /><Star className="h-3 w-3 fill-amber-500" /><Star className="h-3 w-3 fill-amber-500" /></div>
                            <p className="text-slate-655 italic">"Amazing ocean breeze! The luxury pool is extremely clean. Complementary warm local breakfast buffet is of gold standards."</p>
                            <div className="flex justify-end pt-1">
                              <button onClick={() => alert('Voted helpful')} className="text-slate-450 hover:text-slate-700 text-[9px] border border-slate-200 bg-white px-2 py-0.5 rounded shadow-3xs cursor-pointer">Helpful (5)</button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        hotelReviews.map((rev) => (
                          <div 
                            key={rev.id} 
                            className={`p-3 bg-slate-50/60 border border-slate-150 rounded-xl space-y-1.5 relative transition-all ${
                              rev.flagged ? 'opacity-50 border-red-200' : ''
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="font-bold text-slate-850">{rev.author}</span>
                                {rev.flagged && (
                                  <span className="text-[8px] bg-red-100 text-red-700 border border-red-200 px-1.5 ml-2 font-black uppercase rounded">
                                    Flagged for review
                                  </span>
                                )}
                              </div>
                              <span className="text-[9px] text-slate-400 font-mono">{rev.createdAt}</span>
                            </div>

                            <div className="flex text-amber-500">
                              {Array.from({ length: 5 }).map((_, s) => (
                                <Star key={s} className={`h-3 w-3 ${s < rev.rating ? 'fill-amber-500 text-amber-500' : 'text-slate-205'}`} />
                              ))}
                            </div>

                            <p className="text-slate-600 italic">"{rev.text}"</p>

                            {/* Review photos */}
                            {rev.photos && rev.photos.length > 0 && (
                              <div className="flex space-x-1.5 pt-1">
                                {rev.photos.map((ph, index) => (
                                  <img 
                                    key={index} 
                                    src={ph} 
                                    alt="Resort shot" 
                                    className="w-12 h-12 object-cover rounded border border-slate-200 shadow-3xs" 
                                    referrerPolicy="no-referrer"
                                  />
                                ))}
                              </div>
                            )}

                            {/* Replies */}
                            {rev.replies && rev.replies.map((rep) => (
                              <div key={rep.id} className="bg-white p-2 border-l-2 border-brand-coral rounded mt-2 text-[10.5px]">
                                <span className="font-bold text-[#0a223d]">{rep.author}</span>
                                <p className="text-slate-500">"{rep.text}"</p>
                              </div>
                            ))}

                            {/* Flagging & support metrics */}
                            <div className="flex justify-end pt-1 space-x-1.5">
                              <button
                                type="button"
                                onClick={() => voteHelpfulReview(rev.id)}
                                className="text-slate-500 hover:text-slate-700 text-[9px] cursor-pointer border border-slate-200 bg-white px-2 py-0.5 rounded"
                              >
                                Thumbs Up ({rev.helpfulCount})
                              </button>

                              {!rev.flagged && (
                                <button
                                  type="button"
                                  onClick={() => flagReview(rev.id)}
                                  className="text-red-420 hover:text-red-600 text-[9px] cursor-pointer border border-slate-200 bg-white px-2 py-0.5 rounded"
                                >
                                  Flag feedback
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
