import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { Booking, Flight, Hotel } from '../types';
import { 
  Briefcase, Plane, Hotel as HotelIcon, CheckCircle2, History, XCircle, 
  AlertTriangle, Calendar, Star, MessageSquare, Camera, Sparkles 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ProfileDashboard() {
  const { 
    bookingsHistory, 
    cancelBookingWithReasonAction, 
    changeTab,
    reviews,
    addReview
  } = useBooking();

  const [filterCategory, setFilterCategory] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
  const [activeCancellingId, setActiveCancellingId] = useState<string | null>(null);
  
  // cancellation reasons
  const cancellationReasons = [
    'Plan changed / reschedule itinerary',
    'Found cheaper booking elsewhere',
    'Medical / family health emergency',
    'Bad weather / safety concerns',
    'Other personal cancellation reasons'
  ];
  const [selectedReason, setSelectedReason] = useState(cancellationReasons[0]);

  // Review states details
  const [reviewingBookingId, setReviewingBookingId] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewText, setReviewText] = useState<string>('');
  const [selectedPhoto, setSelectedPhoto] = useState<string>('');

  const travelPhotos = [
    { name: 'Panoramic Coast', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80' },
    { name: 'Luxury Suitcase', url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=300&q=80' },
    { name: 'Gourmet Dining', url: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=300&q=80' }
  ];

  const filteredBookings = bookingsHistory.filter(b => b.status === filterCategory);

  const handleCancelClick = (id: string) => {
    setActiveCancellingId(id);
    setSelectedReason(cancellationReasons[0]);
  };

  const handleReviewSubmit = (e: React.FormEvent, itemId: string) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    addReview(itemId, reviewRating, reviewText, selectedPhoto ? [selectedPhoto] : []);
    setReviewingBookingId(null);
    setReviewText('');
    setReviewRating(5);
    setSelectedPhoto('');
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 md:px-8" id="profile-dashboard-container">
      {/* HUD Profile Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs mb-5" id="profile-welcome-hud">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-[9px] bg-orange-50 text-brand-coral border border-orange-100 font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
              Voyager Gold Club VIP
            </span>
            <h2 className="font-display font-extrabold text-xl text-slate-950 mt-1.5 uppercase tracking-tight">Welcome Back, Vasudev!</h2>
            <p className="text-[11.5px] text-slate-500 mt-0.5 font-medium">Track, edit, or cancel your active global itineraries, explore rewards points and elite benefits below.</p>
          </div>

          <div className="flex gap-3">
            <div className="border border-slate-100 bg-slate-50 p-2.5 rounded-lg text-center min-w-24 shrink-0 justify-center flex flex-col">
              <span className="block text-[8px] uppercase font-black tracking-widest text-slate-450">Total Bookings</span>
              <span className="font-mono text-lg font-black text-slate-900 leading-tight block mt-0.5">{bookingsHistory.length}</span>
            </div>
            <div className="border border-slate-150 bg-slate-50 p-2.5 rounded-lg text-center min-w-24 shrink-0 justify-center flex flex-col">
              <span className="block text-[8px] uppercase font-black tracking-widest text-[#0a223d]">Stars Accumulated</span>
              <span className="font-mono text-lg font-black text-brand-coral leading-tight block mt-0.5">4,200 ★</span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Toggle tabs */}
      <div className="flex border-b border-slate-200 mb-5 font-sans overflow-x-auto">
        {[
          { id: 'upcoming', label: 'Upcoming Trips', count: bookingsHistory.filter(b => b.status === 'upcoming').length, icon: Calendar },
          { id: 'completed', label: 'Completed History', count: bookingsHistory.filter(b => b.status === 'completed').length, icon: History },
          { id: 'cancelled', label: 'Cancelled Schedules', count: bookingsHistory.filter(b => b.status === 'cancelled').length, icon: XCircle }
        ].map((cat) => {
          const isSelected = filterCategory === cat.id;
          const Icon = cat.icon;
          return (
            <button
              key={`cat-${cat.id}`}
              onClick={() => {
                setFilterCategory(cat.id as any);
                setActiveCancellingId(null);
                setReviewingBookingId(null);
              }}
              className={`flex-1 sm:flex-none flex items-center justify-center space-x-1.5 py-3 px-4 border-b-2 font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                isSelected
                  ? 'border-brand-coral text-brand-coral'
                  : 'border-transparent text-slate-400 hover:text-slate-700 hover:border-slate-200'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{cat.label}</span>
              {cat.count > 0 && (
                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                  isSelected ? 'bg-brand-coral text-white' : 'bg-slate-100 text-slate-505'
                }`}>
                  {cat.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* LIST OF BOOKINGS */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          /* Empty state */
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-6" id="empty-dashboard-category">
            <Briefcase className="h-9 w-9 text-slate-350 mx-auto animate-pulse mb-3" />
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">No {filterCategory} reservations</h3>
            <p className="text-xs text-slate-550 mt-1 max-w-xs mx-auto leading-relaxed">
              If you have recently scheduled flights or resorts, they will render in their respective buckets. Choose a location to begin!
            </p>
            {filterCategory === 'upcoming' && (
              <button
                onClick={() => changeTab('flights')}
                className="mt-3 inline-flex items-center space-x-1.5 bg-[#0a223d] hover:bg-brand-coral text-white font-black text-xs uppercase tracking-widest py-2 px-4 rounded-lg cursor-pointer transition-all shadow-xs"
              >
                <span>Book your First Trip</span>
              </button>
            )}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredBookings.map((booking) => {
              const isFlight = booking.type === 'flight';
              const targetItemId = booking.item.id;
              
              // find if user has written review
              const existingReview = reviews.find(r => r.targetId === targetItemId);

              return (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs overflow-hidden relative group"
                  id={`history-row-${booking.id}`}
                >
                  {/* Status ribbons badges */}
                  <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-2.5 gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-tight">{booking.id}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Booked on {booking.bookingDate}</span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      {booking.status === 'upcoming' && (
                        <span className="bg-orange-50 text-brand-coral text-[9px] font-black border border-orange-100 px-2 py-0.5 rounded uppercase tracking-wider">
                          Confirmed Upcoming
                        </span>
                      )}
                      {booking.status === 'completed' && (
                        <span className="bg-emerald-50 text-emerald-700 text-[9px] font-black border border-emerald-100 px-2 py-0.5 rounded uppercase tracking-wider">
                          Completed Trip
                        </span>
                      )}
                      {booking.status === 'cancelled' && (
                        <span className="bg-red-50 text-red-700 text-[9px] font-black border border-red-100 px-2 py-0.5 rounded uppercase tracking-wider">
                          Cancelled
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body specifics for row */}
                  <div className="py-3.5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    {/* Item icon & details */}
                    <div className="md:col-span-8 flex items-start space-x-3.5">
                      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-50 border border-slate-100 text-slate-705 shadow-3xs`}>
                        {isFlight ? (
                          <Plane className="h-5 w-5 text-brand-coral -rotate-45" />
                        ) : (
                          <HotelIcon className="h-5 w-5 text-indigo-600" />
                        )}
                      </div>

                      <div className="flex-1">
                        <span className="text-[9px] uppercase font-black tracking-widest text-slate-400 block">
                          {isFlight ? 'Issued Aviator ticket' : 'Hotel Reservation'}
                        </span>
                        
                        <h4 className="font-display font-black text-slate-900 text-sm sm:text-base leading-tight mt-0.5 uppercase tracking-tight">
                          {isFlight 
                            ? `${(booking.item as Flight).fromCode} → ${(booking.item as Flight).toCode} Booking` 
                            : (booking.item as Hotel).name
                          }
                        </h4>

                        <div className="text-[11px] text-slate-500 mt-1 font-medium">
                          {isFlight ? (
                            <span>Carrier: <span className="font-bold text-slate-705">{(booking.item as Flight).airline}</span> ({(booking.item as Flight).flightNo})</span>
                          ) : (
                            <span>Check-In: <span className="font-bold text-slate-705">{booking.hotelDetails?.checkIn}</span> | {booking.hotelDetails?.rooms} Room Units</span>
                          )}
                        </div>

                        {/* Chosen Upgrades summary display */}
                        {booking.chosenUpgrades && (booking.chosenUpgrades.seat || booking.chosenUpgrades.room) && (
                          <div className="mt-2 text-xs flex flex-wrap items-center gap-1.5 font-sans">
                            <span className="text-[8.5px] font-black uppercase bg-amber-500/10 border border-amber-500/20 text-amber-600 rounded px-1.5 py-0.5 tracking-wider flex items-center space-x-1 shrink-0">
                              <Sparkles className="h-2.5 w-2.5" />
                              <span>Elite Class Upgrades</span>
                            </span>
                            {booking.chosenUpgrades.seat && (
                              <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-150">
                                Row {booking.chosenUpgrades.seat.row} ({booking.chosenUpgrades.seat.name})
                              </span>
                            )}
                            {booking.chosenUpgrades.room && (
                              <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-150">
                                Type: {booking.chosenUpgrades.room.name}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Cost and parameters */}
                    <div className="md:col-span-4 flex flex-col md:items-end font-sans">
                      <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider">Total transaction cost</span>
                      <span className="font-mono text-base font-black text-slate-950 block mt-0.5">₹{booking.totalPrice.toLocaleString()}</span>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5 leading-none">Paid via {booking.paymentMethod?.toUpperCase() || 'CARD'} instant net</span>
                    </div>
                  </div>

                  {/* REFUND STATUS TRACKER - Task 1 */}
                  {booking.status === 'cancelled' && (
                    <div className="border-t border-slate-100 pt-3 mt-1">
                      {booking.refundDetails ? (
                        <div className="bg-red-50/10 border border-red-100 rounded-xl p-3.5 space-y-2.5 bg-sky-20/5 animate-fade-in">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-dashed border-red-100 pb-2">
                            <div>
                              <span className="text-[8px] uppercase font-extrabold bg-red-105 bg-red-100 text-red-800 rounded px-2 py-0.5 tracking-wide">
                                Refund Status Tracker
                              </span>
                              <p className="font-bold text-slate-900 text-[11px] mt-1 flex items-center space-x-1.5">
                                <span>Returned Value:</span>
                                <span className="font-mono text-xs text-red-650">₹{booking.refundDetails.refundAmount.toLocaleString()}</span>
                                <span className="text-slate-350">•</span>
                                <span className="text-[10.5px] text-slate-500 font-semibold italic">"{booking.refundDetails.reason}"</span>
                              </p>
                            </div>

                            <div className="flex items-center space-x-1.5 bg-red-50 px-2.5 py-1 rounded-lg">
                              <span className={`h-2 w-2 rounded-full ${
                                booking.refundDetails.status === 'pending'
                                  ? 'bg-amber-500 animate-pulse'
                                  : booking.refundDetails.status === 'processed'
                                    ? 'bg-blue-500'
                                    : 'bg-emerald-500'
                              }`} />
                              <span className="font-black text-[10px] uppercase tracking-wider text-[#0a223d]">
                                {booking.refundDetails.status === 'pending' ? 'Initiated (Pending)' : booking.refundDetails.status}
                              </span>
                            </div>
                          </div>

                          {/* Stepper progress bar */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase tracking-widest px-1">
                              <span className="text-red-700">1. Requested</span>
                              <span className={booking.refundDetails.status !== 'pending' ? 'text-[#0a223d]' : 'text-slate-300'}>2. Processed</span>
                              <span className={booking.refundDetails.status === 'completed' ? 'text-emerald-700' : 'text-slate-300'}>3. Disbursed</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex shadow-xs border border-slate-200/50">
                              <div className={`h-full transition-all duration-1050 ${
                                booking.refundDetails.status === 'pending'
                                  ? 'w-1/3 bg-amber-500'
                                  : booking.refundDetails.status === 'processed'
                                    ? 'w-2/3 bg-blue-500'
                                    : 'w-full bg-emerald-500'
                              }`} />
                            </div>
                            <div className="flex justify-between items-center text-[9.5px] text-slate-500 font-semibold px-1">
                              <span>Timestamp: {booking.refundDetails.requestedDate}</span>
                              <span className="text-brand-coral font-bold">{booking.refundDetails.eta}</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-slate-400 text-[10.5px] italic">
                          Standard legacy cancellation. Refund calculated inside original ledger details.
                        </div>
                      )}
                    </div>
                  )}

                  {/* ACTIVE RESERVATION REASON SELECTION - Task 1 */}
                  {booking.status === 'upcoming' && (
                    <div className="border-t border-slate-100 pt-3 mt-0.5 flex justify-end gap-2 text-xs">
                      {activeCancellingId === booking.id ? (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-start sm:justify-between w-full h-auto gap-3.5 animate-fade-in-down text-left">
                          <div className="space-y-2 flex-1">
                            <span className="font-extrabold text-slate-900 text-xs flex items-center space-x-1.5 uppercase tracking-wide">
                              <AlertTriangle className="h-4 w-4 text-red-650 shrink-0" />
                              <span>Select Cancellation Reason:</span>
                            </span>
                            
                            <p className="text-[10.5px] text-slate-500 font-medium leading-relaxed">
                              Specifying a valid reason helps GoVoyage trace cancellation statistics over dynamic travel slots.
                            </p>

                            <div className="flex flex-col sm:flex-row items-baseline gap-2 mt-2 w-full">
                              <span className="text-[10px] font-black text-[#0a223d] uppercase tracking-wider shrink-0">Reason:</span>
                              <select
                                value={selectedReason}
                                onChange={(e) => setSelectedReason(e.target.value)}
                                className="bg-white border border-slate-250 rounded-lg text-[11px] font-bold text-slate-800 p-1.5 py-1 outline-none focus:ring-1 focus:ring-red-400 w-full max-w-sm cursor-pointer"
                              >
                                {cancellationReasons.map((reason) => (
                                  <option key={reason} value={reason}>{reason}</option>
                                ))}
                              </select>
                            </div>

                            <div className="bg-white/80 border border-slate-200 rounded-lg p-2.5 text-[10.5px] text-slate-600 space-y-1.5 font-sans mt-3">
                              <div className="flex justify-between">
                                <span className="font-medium">Original Paid Sum:</span>
                                <span className="font-mono font-bold text-slate-800">₹{booking.totalPrice.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-slate-500">
                                <span className="font-medium">Standard Deductible Cap:</span>
                                <span className="font-bold">
                                  {booking.bookingDate.includes('30 May') || booking.bookingDate.includes('31 May') ? '50% Surcharge Rate (Cancelled within 24h)' : '20% Partial Rate'}
                                </span>
                              </div>
                              <div className="border-t border-slate-200 pt-1.5 flex justify-between font-bold text-red-600 text-xs mt-1.5">
                                <span>Estimated Settle Value:</span>
                                <span className="font-mono text-sm">
                                  ₹{Math.floor(booking.totalPrice * ((booking.bookingDate.includes('30 May') || booking.bookingDate.includes('31 May')) ? 0.5 : 0.8)).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex sm:flex-col gap-2 shrink-0 justify-end w-full sm:w-auto mt-2 sm:mt-0">
                            <button
                              onClick={() => {
                                cancelBookingWithReasonAction(booking.id, selectedReason);
                                setActiveCancellingId(null);
                              }}
                              className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2 font-black uppercase tracking-wider text-[10px] cursor-pointer shadow-xs transition-all w-full sm:w-36 h-9 flex items-center justify-center text-center"
                            >
                              Release & Refund
                            </button>
                            <button
                              onClick={() => setActiveCancellingId(null)}
                              className="bg-white border border-slate-250 hover:bg-slate-50 text-slate-700 rounded-lg px-4 py-2 font-black uppercase tracking-wider text-[10px] cursor-pointer shadow-3xs transition-all w-full sm:w-36 h-9 flex items-center justify-center text-center"
                            >
                              Keep Ticket
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleCancelClick(booking.id)}
                          className="px-3.5 py-1.5 text-[10px] font-black uppercase tracking-widest text-red-500 border border-slate-200 hover:bg-red-50/50 hover:border-red-250 hover:text-red-700 rounded-lg cursor-pointer transition-all duration-200 shadow-3xs"
                        >
                          Cancel Reservation
                        </button>
                      )}
                    </div>
                  )}

                  {/* REVIEWS SEGMENT & RATING PANEL - Task 2 */}
                  {booking.status === 'completed' && (
                    <div className="border-t border-slate-100 pt-3 mt-1 font-sans text-left">
                      {existingReview ? (
                        <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3.5 space-y-2">
                          <div className="flex items-center justify-between pb-1 border-b border-slate-150">
                            <span className="text-[8px] font-black uppercase bg-[#0a223d] text-slate-50 px-2 py-0.5 rounded tracking-wider">
                              Your Verified Guest Review
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">{existingReview.createdAt}</span>
                          </div>

                          <div className="flex items-center space-x-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-3.5 w-3.5 ${
                                  i < existingReview.rating 
                                    ? 'text-amber-500 fill-amber-500' 
                                    : 'text-slate-200'
                                }`} 
                              />
                            ))}
                          </div>

                          <p className="text-[11.5px] text-slate-700 leading-relaxed italic">
                            "{existingReview.text}"
                          </p>

                          {existingReview.photos && existingReview.photos.length > 0 && (
                            <div className="flex space-x-1.5 pt-1.5">
                              {existingReview.photos.map((ph, idx) => (
                                <img 
                                  key={idx} 
                                  src={ph} 
                                  alt="Guest uploaded asset" 
                                  className="w-14 h-14 object-cover rounded-lg border border-slate-200 shadow-xs"
                                  referrerPolicy="no-referrer"
                                />
                              ))}
                            </div>
                          )}

                          {/* Administrator Replies */}
                          {existingReview.replies && existingReview.replies.length > 0 && (
                            <div className="bg-amber-55/10 border-l-2 border-brand-coral pl-3 py-1.5 mt-2 text-[11px] space-y-1 rounded-r-lg bg-orange-50/10">
                              {existingReview.replies.map((rep) => (
                                <div key={rep.id}>
                                  <span className="font-extrabold text-slate-800 text-[10px]">{rep.author}</span>
                                  <span className="text-[8.5px] font-mono text-slate-400 ml-1.5">({rep.createdAt})</span>
                                  <p className="text-slate-650 mt-0.5 leading-relaxed">{rep.text}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : reviewingBookingId === booking.id ? (
                        /* Review feedback builder form */
                        <form 
                          onSubmit={(e) => handleReviewSubmit(e, targetItemId)} 
                          className="bg-orange-50/10 border border-orange-100 p-4 rounded-xl space-y-3.5 mt-2 animate-fade-in-down"
                        >
                          <div className="flex items-center justify-between border-b border-orange-100 pb-2">
                            <h5 className="font-extrabold text-[#0a223d] text-xs flex items-center space-x-1.5 uppercase tracking-wide">
                              <MessageSquare className="h-4 w-4 text-brand-coral" />
                              <span>Submit Verified Holiday Review</span>
                            </h5>
                            <button 
                              type="button" 
                              onClick={() => setReviewingBookingId(null)}
                              className="text-slate-400 hover:text-slate-650 cursor-pointer text-xs font-bold uppercase tracking-wider"
                            >
                              Cancel
                            </button>
                          </div>

                          {/* Star picker */}
                          <div className="space-y-1">
                            <label className="block text-[10px] font-black text-[#0a223d] uppercase tracking-wider">Overall score rating:</label>
                            <div className="flex items-center space-x-1">
                              {Array.from({ length: 5 }).map((_, i) => {
                                const starValue = i + 1;
                                return (
                                  <button
                                    key={i}
                                    type="button"
                                    onClick={() => setReviewRating(starValue)}
                                    className="p-1 hover:scale-110 transition-transform cursor-pointer"
                                  >
                                    <Star 
                                      className={`h-6 w-6 ${
                                        starValue <= reviewRating 
                                          ? 'text-amber-500 fill-amber-500' 
                                          : 'text-slate-200'
                                      }`} 
                                    />
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Review comment */}
                          <div className="space-y-1">
                            <label className="block text-[10px] font-black text-[#0a223d] uppercase tracking-wider">Describe your vacation experiences:</label>
                            <textarea
                              required
                              value={reviewText}
                              onChange={(e) => setReviewText(e.target.value)}
                              rows={3}
                              placeholder="Fabulous stay! Excellent bedding comfort, high speed amenities, prompt customer support channels, etc..."
                              className="w-full bg-white border border-slate-250 rounded-lg text-xs p-2.5 outline-none focus:border-brand-coral focus:ring-1 focus:ring-brand-coral text-slate-800 shadow-3xs"
                            />
                          </div>

                          {/* Travel Preset Photos */}
                          <div className="space-y-1.5">
                            <label className="block text-[10px] font-black text-[#0a223d] uppercase tracking-wider flex items-center space-x-1">
                              <Camera className="h-3 w-3 inline text-slate-500" />
                              <span>Attach Photograph supplement:</span>
                            </label>
                            <div className="flex flex-wrap items-center gap-3">
                              {travelPhotos.map((photo) => (
                                <button
                                  key={photo.name}
                                  type="button"
                                  onClick={() => setSelectedPhoto(selectedPhoto === photo.url ? '' : photo.url)}
                                  className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                                    selectedPhoto === photo.url ? 'border-brand-coral scale-105 shadow-md' : 'border-slate-200 hover:border-slate-400'
                                  }`}
                                  title={photo.name}
                                >
                                  <img 
                                    src={photo.url} 
                                    alt={photo.name} 
                                    className="w-full h-full object-cover" 
                                    referrerPolicy="no-referrer"
                                  />
                                </button>
                              ))}
                            </div>
                            {selectedPhoto && (
                              <p className="text-[10px] font-bold text-brand-coral mt-1">✓ File "supplement_guest_visual.jpg" appended successfully.</p>
                            )}
                          </div>

                          <div className="pt-1 flex justify-end">
                            <button
                              type="submit"
                              className="bg-brand-coral hover:bg-brand-coral-hover text-white rounded-lg px-4 py-1.5 font-black uppercase tracking-wider text-[10px] cursor-pointer shadow-xs h-9"
                            >
                              Publish Guest Review
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="flex justify-between items-center bg-slate-50/50 p-2.5 rounded-lg border border-slate-150">
                          <span className="text-[10px] font-bold text-slate-500 italic">Tell us about your vacation experiences! Feedback builds Gold points.</span>
                          <button
                            type="button"
                            onClick={() => setReviewingBookingId(booking.id)}
                            className="bg-white border border-slate-250 hover:bg-slate-50 text-[10px] font-extrabold uppercase tracking-widest text-[#0a223d] px-3 py-1.5 rounded-lg cursor-pointer transition-all"
                          >
                            Add Guest Review
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
