import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { Flight, Hotel, PassengerDetails } from '../types';
import { 
  Plane, Hotel as HotelIcon, CreditCard, ShieldCheck, Ticket, Download, 
  ChevronRight, ArrowLeft, Loader2, Sparkles, CheckCircle, Smartphone,
  Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function CheckoutFlow() {
  const { 
    selectedItem, 
    checkoutStep, 
    setCheckoutStep, 
    paymentLoading, 
    submitBooking, 
    bookingCompletedItem, 
    clearCompletedBooking,
    searchParams,
    checkoutUpgrades,
    updateCheckoutUpgrades,
    resetCheckoutUpgrades,
    isPeakSeason,
    frozenPrices,
    isPriceFrozen
  } = useBooking();

  // Step 2 Form lists
  const [passengers, setPassengers] = useState<PassengerDetails[]>(() => {
    // Scaffold initial state based on number of passengers searched
    const count = selectedItem?.type === 'flight' ? (searchParams.flights.passengers || 1) : 1;
    return Array.from({ length: count }).map(() => ({
      title: 'Mr',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    }));
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Discount/Promotion state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<'VOYAGE10' | null>(null);
  const [couponError, setCouponError] = useState('');

  // Step 3 Payment State
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [upiID, setUpiID] = useState('');

  if (!selectedItem) {
    return (
      <div className="mx-auto max-w-lg text-center py-16 px-4" id="checkout-empty-state">
        <Ticket className="h-12 w-12 text-slate-350 mx-auto animate-pulse" />
        <h3 className="mt-4 text-lg font-bold text-slate-700">No Booking Active</h3>
        <p className="mt-2 text-xs text-slate-500">
          Your reservation cart is currently empty. Please find and select a flight or hotel property first to start checking out.
        </p>
      </div>
    );
  }

  const { type, item } = selectedItem;
  const isFlight = type === 'flight';
  
  // Travelers count
  const numTravelers = isFlight ? (searchParams.flights.passengers || 1) : 1;
  const numRooms = !isFlight ? (searchParams.hotels.rooms || 1) : 1;

  // Nights count 
  let nights = 1;
  if (!isFlight) {
    const inDate = new Date(searchParams.hotels.checkIn);
    const outDate = new Date(searchParams.hotels.checkOut);
    const diffTime = Math.abs(outDate.getTime() - inDate.getTime());
    nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }

  // Peak season & price freezing check
  const frozenPrice = frozenPrices[item.id];
  const isFrozen = frozenPrice !== undefined;
  const singleUnitBasePrice = isFrozen 
    ? frozenPrice 
    : (isPeakSeason ? Math.floor(item.price * 1.25) : item.price);

  // Raw base calculations
  const rawBasePrice = singleUnitBasePrice * (isFlight ? numTravelers : (nights * numRooms));
  
  // Upgrades calculations
  const seatUpgradeCost = checkoutUpgrades.seat ? (checkoutUpgrades.seat.price * numTravelers) : 0;
  const roomUpgradeCost = checkoutUpgrades.room ? (checkoutUpgrades.room.price * nights * numRooms) : 0;
  const totalUpgradesCost = seatUpgradeCost + roomUpgradeCost;

  const subtotalBeforeDiscounts = rawBasePrice + totalUpgradesCost;
  const taxesAndFees = Math.floor(subtotalBeforeDiscounts * 0.12); // Under 12% standard service tax
  
  // Coupon logic
  const discount = appliedCoupon === 'VOYAGE10' ? Math.floor(subtotalBeforeDiscounts * 0.10) : 0;
  const totalNetCost = subtotalBeforeDiscounts + taxesAndFees - discount;

  // Real-time card type detector
  const getCardType = () => {
    if (cardNumber.startsWith('4')) return 'Visa';
    if (cardNumber.startsWith('5')) return 'Mastercard';
    if (cardNumber.startsWith('3')) return 'American Express';
    return 'Credit/Debit';
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (couponCode.trim().toUpperCase() === 'VOYAGE10') {
      setAppliedCoupon('VOYAGE10');
      setCouponCode('');
    } else {
      setCouponError('Invalid coupon code. Try "VOYAGE10" for 10% off!');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Validate passenger fields
  const handleValidateStep2 = () => {
    const errors: Record<string, string> = {};
    
    passengers.forEach((passenger, idx) => {
      if (!passenger.firstName.trim()) {
        errors[`firstName-${idx}`] = 'First name is required';
      }
      if (!passenger.lastName.trim()) {
        errors[`lastName-${idx}`] = 'Last name is required';
      }
      if (!passenger.email.trim() || !passenger.email.includes('@')) {
        errors[`email-${idx}`] = 'valid email is required';
      }
      if (!passenger.phone.trim() || passenger.phone.length < 5) {
        errors[`phone-${idx}`] = 'valid contact number is required';
      }
    });

    setFormErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      setCheckoutStep(3);
    }
  };

  const handlePassengerChange = (idx: number, field: keyof PassengerDetails, val: string) => {
    const updated = [...passengers];
    updated[idx] = {
      ...updated[idx],
      [field]: val,
    };
    setPassengers(updated);
  };

  // Run final submission simulations
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitBooking({
      passengers,
      paymentMethod,
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:px-8" id="checkout-container">
      {/* Checkout step progress indicators */}
      {checkoutStep < 3 && (
        <div className="flex items-center justify-center space-x-2 sm:space-x-4 mb-8">
          {[
            { step: 1, name: 'Review Itinerary' },
            { step: 2, name: 'Passenger Details' },
            { step: 3, name: 'Payment Method' },
          ].map((item) => (
            <React.Fragment key={`p-step-${item.step}`}>
              <div className="flex items-center space-x-2">
                <div className={`h-8 w-8 rounded-full font-mono text-sm font-bold flex items-center justify-center border transition-all ${
                  checkoutStep >= item.step
                    ? 'bg-brand-coral text-white border-brand-coral shadow-sm'
                    : 'bg-white text-slate-400 border-slate-200'
                }`}>
                  {item.step}
                </div>
                <span className={`text-xs font-bold hidden sm:inline ${
                  checkoutStep >= item.step ? 'text-slate-800' : 'text-slate-400'
                }`}>
                  {item.name}
                </span>
              </div>
              {item.step < 3 && (
                <ChevronRight className={`h-4 w-4 ${
                  checkoutStep > item.step ? 'text-brand-coral' : 'text-slate-200'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* RENDER DETAILED PAGES */}
      <AnimatePresence mode="wait">
        {checkoutStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
            id="checkout-step-1"
          >
            {/* ITINERARY BOX OVERVIEW */}
            <div className="lg:col-span-8 space-y-5">
              <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs">
                <h3 className="font-display font-black text-sm uppercase tracking-wider text-slate-900 mb-4 flex items-center space-x-2">
                  {isFlight ? (
                    <Plane className="h-4 w-4 -rotate-45 text-brand-coral" />
                  ) : (
                    <HotelIcon className="h-4 w-4 text-brand-coral" />
                  )}
                  <span>Review Booking Details</span>
                </h3>

                {isFlight ? (
                  /* Flight details check */
                  (item as Flight) && (
                    <div className="space-y-3">
                      {/* Top route badge */}
                      <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-2.5 gap-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-black text-slate-900 text-sm sm:text-base">{(item as Flight).fromCode}</span>
                          <ChevronRight className="h-4 w-4 text-slate-400" />
                          <span className="font-black text-slate-900 text-sm sm:text-base">{(item as Flight).toCode}</span>
                        </div>
                        <span className="text-[10px] uppercase tracking-wider bg-orange-50 text-brand-coral border border-orange-100 font-extrabold px-2.5 py-1 rounded">
                          {(item as Flight).class} Class
                        </span>
                      </div>

                      {/* Flight card inside summary */}
                      <div className="flex items-start space-x-4">
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-display text-sm font-extrabold text-white shadow-inner ${(item as Flight).logo}`}>
                          {(item as Flight).airlineCode}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-sm text-slate-800">{(item as Flight).airline}</h4>
                          <span className="block text-xs font-semibold text-slate-400 mt-0.5">{(item as Flight).flightNo}</span>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3">
                            <div>
                              <span className="block text-[10px] uppercase font-bold text-slate-400">Departure</span>
                              <span className="font-mono font-extrabold text-sm text-slate-700">{(item as Flight).departureTime}</span>
                              <span className="block text-[10px] text-slate-500 font-medium truncate max-w-28">{(item as Flight).from}</span>
                            </div>
                            <div>
                              <span className="block text-[10px] uppercase font-bold text-slate-400">Arrival</span>
                              <span className="font-mono font-extrabold text-sm text-slate-700">{(item as Flight).arrivalTime}</span>
                              <span className="block text-[10px] text-slate-500 font-medium truncate max-w-28">{(item as Flight).to}</span>
                            </div>
                            <div>
                              <span className="block text-[10px] uppercase font-bold text-slate-400">Travel Span</span>
                              <span className="font-bold text-xs text-slate-705">{(item as Flight).duration}</span>
                              <span className="block text-[10px] text-slate-500 font-medium font-mono leading-none mt-0.5">
                                {(item as Flight).stops === 0 ? 'Non-stop route' : `${(item as Flight).stops} connection stop`}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                ) : (
                  /* Hotel summary check */
                  (item as Hotel) && (
                    <div className="space-y-4">
                      {/* Top property cover summary */}
                      <div className="flex flex-col sm:flex-row gap-5">
                        <div className="w-full sm:w-44 h-28 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                          <img 
                            referrerPolicy="no-referrer"
                            src={(item as Hotel).image} 
                            alt={(item as Hotel).name} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-display font-extrabold text-slate-900 text-sm sm:text-base">{(item as Hotel).name}</h4>
                          <span className="block text-xs text-slate-500 mt-0.5">{(item as Hotel).area}, {(item as Hotel).city}</span>
                          
                          {/* Stars display */}
                          <div className="flex items-center space-x-0.5 mt-1.5">
                            {Array.from({ length: (item as Hotel).stars }).map((_, i) => (
                              <svg key={`stars-${i}`} className="h-3.5 w-3.5 text-amber-500 fill-amber-500" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>

                          {/* Hotel particulars list */}
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3 pt-3 border-t border-slate-100">
                            <div>
                              <span className="block text-[10px] uppercase font-bold text-slate-400">Dates</span>
                              <span className="font-semibold text-xs text-slate-700">
                                {searchParams.hotels.checkIn} to {searchParams.hotels.checkOut}
                              </span>
                            </div>
                            <div>
                              <span className="block text-[10px] uppercase font-bold text-slate-400">Length</span>
                              <span className="font-semibold text-xs text-slate-700">{nights} Night{nights > 1 ? 's' : ''}</span>
                            </div>
                            <div>
                              <span className="block text-[10px] uppercase font-bold text-slate-400">Capacity booked</span>
                              <span className="font-semibold text-xs text-slate-700">
                                {numRooms} Room{numRooms > 1 ? 's' : ''} for {searchParams.hotels.guests} Guest{searchParams.hotels.guests > 1 ? 's' : ''}
                              </span>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* UPGRADES SELECTION SEGMENTS - Task 4 */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs text-left" id="step1-upgrades-panel">
                {isFlight ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-105 pb-2">
                      <div>
                        <h4 className="font-display font-black text-xs uppercase tracking-wider text-slate-900 flex items-center space-x-1">
                          <Sparkles className="h-4 w-4 text-amber-500 fill-amber-500" />
                          <span>Select Your Preferred Cabin Seats</span>
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Pick prime window, aisle, or extra legroom options (scaled for {numTravelers} voyager{numTravelers > 1 ? 's' : ''})</p>
                      </div>
                      <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-black uppercase">
                        Interactive Map
                      </span>
                    </div>

                    {/* Seat Grid Selector Map */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                      {/* Left: Interactive matrix */}
                      <div className="border border-slate-100 p-3 rounded-xl bg-slate-50/50 space-y-3">
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 border-b pb-2 px-1">
                          <span>Row</span>
                          <span className="text-center w-28 font-semibold">Cabin Seating Matrix</span>
                          <span className="text-right">Aisle</span>
                        </div>

                        <div className="space-y-2">
                          {[1, 2, 3, 4, 5].map((rowNumber) => {
                            const isPremiumRow = rowNumber <= 2;
                            const rowPrice = isPremiumRow ? 1500 : 300;
                            const rowName = isPremiumRow ? 'Front Extra Legroom' : 'Standard Economy';

                            return (
                              <div key={`row-${rowNumber}`} className="flex items-center justify-between text-xs font-mono">
                                <span className="font-extrabold text-slate-400 text-[11px] w-6">Row {rowNumber}</span>
                                
                                <div className="flex items-center space-x-1.5 flex-1 justify-center">
                                  {['A', 'B', 'C', 'D', 'E', 'F'].map((colCode) => {
                                    const seatId = `${rowNumber}${colCode}`;
                                    const isSelected = checkoutUpgrades.seat?.name === seatId;
                                    const isOccupied = seatId === '1B' || seatId === '3D' || seatId === '4C';

                                    return (
                                      <button
                                        key={seatId}
                                        type="button"
                                        disabled={isOccupied}
                                        onClick={() => updateCheckoutUpgrades({
                                          seat: {
                                            name: seatId,
                                            price: rowPrice,
                                            row: rowNumber,
                                            col: colCode
                                          }
                                        })}
                                        className={`h-7 w-7 rounded-md cursor-pointer text-[9px] font-black flex items-center justify-center transition-all ${
                                          isOccupied 
                                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300 font-medium'
                                            : isSelected
                                              ? 'bg-emerald-500 text-white border-b-2 border-emerald-700 shadow-sm scale-110'
                                              : isPremiumRow
                                                ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 hover:border-amber-300'
                                                : 'bg-white text-slate-700 border border-slate-205 hover:bg-slate-50 hover:border-slate-300'
                                        }`}
                                        title={`${seatId} - ${rowName} (₹${rowPrice})`}
                                      >
                                        {colCode}
                                      </button>
                                    );
                                  })}
                                </div>

                                <span className="text-[9px] text-[#0a223d] font-bold shrink-0 w-12 text-right text-indigo-700">
                                  {isPremiumRow ? '₹1.5k' : '₹300'}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Interactive Key */}
                        <div className="flex justify-center items-center space-x-3 text-[9px] text-slate-400 pt-2 border-t font-semibold">
                          <div className="flex items-center space-x-1"><span className="h-2.5 w-2.5 rounded bg-white border border-slate-200 block" /> <span>Standard</span></div>
                          <div className="flex items-center space-x-1"><span className="h-2.5 w-2.5 rounded bg-amber-50 border border-amber-200 block" /> <span>First Class</span></div>
                          <div className="flex items-center space-x-1"><span className="h-2.5 w-2.5 rounded bg-emerald-500 block" /> <span>Selected</span></div>
                          <div className="flex items-center space-x-1"><span className="h-2.5 w-2.5 rounded bg-slate-200 block" /> <span>Occupied</span></div>
                        </div>
                      </div>

                      {/* Right: Selected details & visual stats */}
                      <div className="space-y-3 font-sans">
                        <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-150 text-xs text-slate-700 space-y-2">
                          <span className="font-extrabold uppercase text-[10px] tracking-wider text-slate-450 block font-bold">Active Seat Preference</span>
                          
                          {checkoutUpgrades.seat ? (
                            <div className="space-y-1">
                              <div className="flex justify-between items-baseline">
                                <span className="text-sm font-black text-slate-800">Seat {checkoutUpgrades.seat.name}</span>
                                <span className="font-mono font-bold text-slate-900 font-bold">₹{checkoutUpgrades.seat.price.toLocaleString()} / seat</span>
                              </div>
                              <p className="text-[10px] text-slate-505 font-medium leading-normal italic text-slate-500">
                                {checkoutUpgrades.seat.name.startsWith('1') || checkoutUpgrades.seat.name.startsWith('2')
                                  ? '⭐️ Premium First Cabin Space Seat with wide adjustable headrest, complimentary hot beverage, and front speedy exit.'
                                  : 'Economy cozy window or aisle seat with standard luggage space.'}
                              </p>
                              
                              <button
                                type="button"
                                onClick={() => updateCheckoutUpgrades({ seat: undefined })}
                                className="text-[9.5px] font-bold text-red-500 hover:underline mt-1.5 cursor-pointer block text-left"
                              >
                                Remove seat assignment
                              </button>
                            </div>
                          ) : (
                            <div className="py-4 text-center text-slate-400 italic">
                              No seat selected. Choose from grid map to customize. Standard auto-selection (+₹0) is assigned by default.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // HOTEL SUITE UPGRADES WITH 3D THUMBNAILS
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-105 pb-2">
                      <div>
                        <h4 className="font-display font-black text-xs uppercase tracking-wider text-slate-900 flex items-center space-x-1">
                          <Sparkles className="h-4 w-4 text-brand-coral" />
                          <span>Upgrade To Luxury Room Suites</span>
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Customize your lodging experience with curated 3D panoramic layout options</p>
                      </div>
                      <span className="text-[10px] font-mono text-brand-coral bg-orange-50 px-2 py-0.5 rounded font-black uppercase font-bold">
                        Suite Upgrades
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                      {[
                        {
                          name: 'Standard Deluxe',
                          price: 0,
                          view: 'Courtyard look, King bed, modern layout',
                          image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=400&q=80'
                        },
                        {
                          name: 'Elite Jacuzzi Penthouse',
                          price: 1800,
                          view: 'Master suite featuring in-room private jacuzzi & premium bar access',
                          image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=400&q=80'
                        },
                        {
                          name: 'Ocean Vista Panorama Suite',
                          price: 4500,
                          view: 'Floor-to-ceiling soundproof ocean beach vista glass windows',
                          image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80'
                        }
                      ].map((suite) => {
                        const isSelected = (!checkoutUpgrades.room && suite.price === 0) || (checkoutUpgrades.room?.name === suite.name);
                        
                        return (
                          <div
                            key={suite.name}
                            onClick={() => updateCheckoutUpgrades({
                              room: {
                                name: suite.name,
                                price: suite.price,
                                view: suite.view,
                                image: suite.image
                              }
                            })}
                            className={`rounded-xl border p-2.5 cursor-pointer text-left font-sans transition-all flex flex-col justify-between hover:scale-101 ${
                              isSelected 
                                ? 'bg-orange-50/15 border-brand-coral ring-1 ring-brand-coral shadow-xs' 
                                : 'bg-white border-slate-205 hover:border-slate-350'
                            }`}
                          >
                            <div className="space-y-2">
                              {/* 3D realistic aspect thumbnail */}
                              <div className="h-24 w-full rounded-lg overflow-hidden bg-slate-100 relative">
                                <img
                                  referrerPolicy="no-referrer"
                                  src={suite.image}
                                  alt={suite.name}
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=400&q=80';
                                  }}
                                />
                                <div className="absolute top-1.5 right-1.5 bg-slate-900/40 text-white rounded p-1 backdrop-blur-xs">
                                  <ImageIcon className="h-3.5 w-3.5" />
                                </div>
                              </div>

                              <div>
                                <h5 className="font-bold text-[11px] text-slate-800 leading-tight">{suite.name}</h5>
                                <p className="text-[9.5px] text-slate-500 mt-0.5 italic leading-snug line-clamp-2">"{suite.view}"</p>
                              </div>
                            </div>

                            <div className="mt-3.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                              <span className="text-[10px] font-mono font-black text-slate-900">
                                {suite.price === 0 ? 'Complimentary' : `+ ₹${suite.price.toLocaleString()} / Nt`}
                              </span>
                              <span className={`text-[8.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                isSelected ? 'bg-brand-coral text-white' : 'bg-slate-50 text-slate-400 border border-slate-150'
                              }`}>
                                {isSelected ? 'Selected' : 'Pick Room'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* SECURITY ASSURANCES PANEL */}
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 flex items-start space-x-3 text-xs text-emerald-800">
                <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Secure Reservation Guarantee</span>
                  <p className="mt-0.5 text-emerald-700 leading-normal">
                    This reservation comes with our standard 100% security vault certification. Your seat/room selection is soft-locked for the next 20 minutes to prevent fare changes.
                  </p>
                </div>
              </div>
            </div>

            {/* ORDER TOTAL PRICE BREAKDOWN */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
                <h4 className="font-display font-bold text-sm text-slate-800 mb-3 uppercase tracking-wider text-left">Fare Summary</h4>
                
                <div className="space-y-2.5 text-xs text-slate-600 border-b border-slate-100 pb-3">
                  <div className="flex justify-between font-sans">
                    <span>Base Fare x {isFlight ? numTravelers : `${nights} Nights`}:</span>
                    <span className="font-mono font-bold text-slate-850">₹{rawBasePrice.toLocaleString()}</span>
                  </div>

                  {checkoutUpgrades.seat && (
                    <div className="flex justify-between font-sans text-indigo-750 font-semibold" id="seat-upgrade-row">
                      <span>Seat Upgrade ({checkoutUpgrades.seat.name}) x {numTravelers}:</span>
                      <span className="font-mono font-bold">₹{seatUpgradeCost.toLocaleString()}</span>
                    </div>
                  )}

                  {checkoutUpgrades.room && checkoutUpgrades.room.price > 0 && (
                    <div className="flex justify-between font-sans text-brand-coral font-semibold" id="room-upgrade-row">
                      <span>Room Upgrade ({checkoutUpgrades.room.name}):</span>
                      <span className="font-mono font-bold">₹{roomUpgradeCost.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between font-sans">
                    <span>GST taxes & Services (12%):</span>
                    <span className="font-mono font-bold text-slate-850">₹{taxesAndFees.toLocaleString()}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between font-sans text-emerald-600">
                      <div className="flex items-center space-x-1">
                        <span>Coupon VOYAGE10 (10% off):</span>
                        <button type="button" onClick={removeCoupon} className="text-[10px] hover:underline hover:text-red-500 font-bold shrink-0">
                          (Remove)
                        </button>
                      </div>
                      <span className="font-mono font-bold">-₹{discount.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {/* Promotional banner promo block */}
                {!appliedCoupon && (
                  <form onSubmit={handleApplyCoupon} className="py-3 border-b border-slate-100 flex flex-col gap-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Apply Promo Coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs outline-none"
                      />
                      <button 
                        type="submit" 
                        className="bg-slate-800 hover:bg-slate-950 text-white rounded-lg px-3.5 py-1.5 text-xs font-bold leading-none shrink-0"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && <p className="text-[10px] text-red-500 font-bold leading-tight">{couponError}</p>}
                    <p className="text-[10px] text-blue-600 font-semibold">Tip: Try the Coupon <span className="font-bold border px-1 py-0.5 border-dashed border-blue-300 bg-blue-50/50">VOYAGE10</span> </p>
                  </form>
                )}

                {/* Final calculated price */}
                <div className="flex justify-between items-baseline py-3">
                  <span className="text-sm font-bold text-slate-800">Booking Total:</span>
                  <span className="font-mono text-xl sm:text-2xl font-black text-blue-900">₹{totalNetCost.toLocaleString()}</span>
                </div>

                {/* Navigation CTA progress trigger */}
                <button
                  type="button"
                  onClick={() => setCheckoutStep(2)}
                  className="w-full mt-2 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold shadow-md shadow-orange-600/20 text-center flex items-center justify-center space-x-1 cursor-pointer transition-all active:scale-98"
                >
                  <span>Proceed to Travelers</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 2: TRAVELERS FORM INPUTS */}
        {checkoutStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
            id="checkout-step-2"
          >
            <div className="lg:col-span-8 space-y-5">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
                <div className="flex items-center space-x-2 mb-4">
                  <button 
                    onClick={() => setCheckoutStep(1)}
                    className="p-1 text-slate-400 hover:text-slate-800 rounded-lg cursor-pointer transition-colors hover:bg-slate-50"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <h3 className="font-display font-extrabold text-lg text-slate-800">
                    {isFlight ? 'Passenger Information Details' : 'Primary Guest Details'}
                  </h3>
                </div>

                {/* Render forms for each traveler dynamically in detail */}
                <div className="space-y-6">
                  {passengers.map((passenger, idx) => (
                    <div 
                      key={`passenger-form-${idx}`} 
                      className="border border-slate-100 rounded-xl bg-slate-50/35 p-4 relative"
                      id={`passenger-fields-block-${idx}`}
                    >
                      <span className="absolute -top-2.5 left-4 bg-white border border-slate-200 rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase text-slate-400">
                        {isFlight ? `Passenger #${idx + 1}` : 'Lead Accupant'}
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mt-1">
                        {/* Title Choice mr/ms */}
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Title</label>
                          <select
                            value={passenger.title}
                            onChange={(e) => handlePassengerChange(idx, 'title', e.target.value as any)}
                            className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs font-semibold outline-none"
                          >
                            <option value="Mr">Mr.</option>
                            <option value="Mrs">Mrs.</option>
                            <option value="Ms">Ms.</option>
                          </select>
                        </div>

                        {/* First Name */}
                        <div className="sm:col-span-5">
                          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">First Name</label>
                          <input
                            type="text"
                            placeholder="e.g. John"
                            value={passenger.firstName}
                            onChange={(e) => handlePassengerChange(idx, 'firstName', e.target.value)}
                            className={`w-full rounded-lg border p-2.5 text-xs outline-none ${
                              formErrors[`firstName-${idx}`] ? 'border-red-500 bg-red-50/10' : 'border-slate-200 bg-white'
                            }`}
                          />
                          {formErrors[`firstName-${idx}`] && (
                            <p className="text-[10px] text-red-500 mt-1">{formErrors[`firstName-${idx}`]}</p>
                          )}
                        </div>

                        {/* Last Name */}
                        <div className="sm:col-span-5">
                          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Last / Surname</label>
                          <input
                            type="text"
                            placeholder="e.g. Doe"
                            value={passenger.lastName}
                            onChange={(e) => handlePassengerChange(idx, 'lastName', e.target.value)}
                            className={`w-full rounded-lg border p-2.5 text-xs outline-none ${
                              formErrors[`lastName-${idx}`] ? 'border-red-500 bg-red-50/10' : 'border-slate-200 bg-white'
                            }`}
                          />
                          {formErrors[`lastName-${idx}`] && (
                            <p className="text-[10px] text-red-500 mt-1">{formErrors[`lastName-${idx}`]}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                        {/* Email address */}
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Email Address</label>
                          <input
                            type="email"
                            placeholder="e.g. john@example.com"
                            value={passenger.email}
                            onChange={(e) => handlePassengerChange(idx, 'email', e.target.value)}
                            className={`w-full rounded-lg border p-2.5 text-xs outline-none ${
                              formErrors[`email-${idx}`] ? 'border-red-500 bg-red-50/10' : 'border-slate-200 bg-white'
                            }`}
                          />
                          {formErrors[`email-${idx}`] && (
                            <p className="text-[10px] text-red-500 mt-1">{formErrors[`email-${idx}`]}</p>
                          )}
                        </div>

                        {/* Contact Phone */}
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Mobile Contact</label>
                          <input
                            type="tel"
                            placeholder="e.g. +91 99824 10023"
                            value={passenger.phone}
                            onChange={(e) => handlePassengerChange(idx, 'phone', e.target.value)}
                            className={`w-full rounded-lg border p-2.5 text-xs outline-none ${
                              formErrors[`phone-${idx}`] ? 'border-red-500 bg-red-50/10' : 'border-slate-200 bg-white'
                            }`}
                          />
                          {formErrors[`phone-${idx}`] && (
                            <p className="text-[10px] text-red-500 mt-1">{formErrors[`phone-${idx}`]}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Submitting step transition bar */}
                <div className="flex justify-end pt-5 mt-5 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleValidateStep2}
                    className="py-3 px-8 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-sm hover:scale-101 cursor-pointer transition-all active:scale-98"
                    id="validate-passengers-submit"
                  >
                    Continue to Payment Setup
                  </button>
                </div>
              </div>
            </div>

            {/* QUICK FARE SUMMARY PANEL FOR STEP 2 */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
                <span className="block text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Itinerary Review</span>
                <span className="font-display font-semibold text-sm text-slate-800 mt-0.5 block">{item.name}</span>
                <span className="block text-xs text-slate-500 mt-0.5">₹{item.price.toLocaleString()} per occupancy unit</span>
                
                <div className="border-t border-slate-100 mt-4 pt-4 flex justify-between items-baseline">
                  <span className="text-xs font-bold text-slate-600">Total payable price:</span>
                  <span className="font-mono text-lg font-black text-blue-900">₹{totalNetCost.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 3: INTERACTIVE PAYMENT SCREEN */}
        {checkoutStep === 3 && !bookingCompletedItem && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
            id="checkout-step-3"
          >
            {/* PAYMENT FORMS PANEL */}
            <div className="lg:col-span-8 space-y-5">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs relative">
                
                {paymentLoading && (
                  <div className="absolute inset-0 bg-white/95 rounded-2xl flex flex-col items-center justify-center p-8 z-30 transition-all">
                    <Loader2 className="h-10 w-10 text-orange-600 animate-spin" />
                    <h3 className="mt-4 font-display font-bold text-slate-800 text-lg">Authorizing Secure Checkout</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm text-center">
                      Please hold. We are packaging travel logs, encrypting keys, and initiating routing tokens securely. Avoid reloading.
                    </p>
                    <div className="flex items-center space-x-1 border rounded-lg bg-slate-50 border-slate-100 px-3.5 py-1.5 mt-4 text-[10px] font-mono text-slate-400 font-bold tracking-tight">
                      <span>STATUS: ENCRYPTING SECURE_GATEWAY_NODE_LIVE</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-2 mb-4">
                  <button 
                    onClick={() => setCheckoutStep(2)}
                    className="p-1 text-slate-400 hover:text-slate-800 rounded-lg cursor-pointer hover:bg-slate-50"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <h3 className="font-display font-extrabold text-lg text-slate-800">Choose Gateway System</h3>
                </div>

                {/* Switch between Card & UPI */}
                <div className="flex border border-slate-100 rounded-xl bg-slate-50/50 p-1 mb-6">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg text-xs font-bold transition-all ${
                      paymentMethod === 'card'
                        ? 'bg-white text-slate-800 shadow-sm border border-slate-100'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <CreditCard className="h-4 w-4 text-blue-600" />
                    <span>Credit / Debit secure Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg text-xs font-bold transition-all ${
                      paymentMethod === 'upi'
                        ? 'bg-white text-slate-800 shadow-sm border border-slate-100'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Smartphone className="h-4 w-4 text-purple-600" />
                    <span>UPI Net-Banking Transfer</span>
                  </button>
                </div>

                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  {paymentMethod === 'card' ? (
                    /* Elegant CSS Credit Card View */
                    <div className="space-y-4">
                      {/* CSS Mockup Card */}
                      <div className="w-full max-w-sm mx-auto aspect-video rounded-2xl bg-gradient-to-tr from-slate-900 via-blue-950 to-indigo-900 border border-slate-800/80 p-5 text-white flex flex-col justify-between shadow-lg shadow-indigo-950/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 h-44 w-44 rounded-full bg-blue-500/10 blur-xl" />
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400">Voyager Elite Card</span>
                            <div className="w-9 h-7 bg-amber-200/90 rounded-sm shadow-xs border border-amber-300" />
                          </div>
                          <span className="font-display font-black italic text-sm text-blue-300">
                            {getCardType()}
                          </span>
                        </div>

                        <div className="font-mono text-lg font-bold text-center tracking-widest my-4">
                          {cardNumber.padEnd(16, '•').replace(/(.{4})/g, '$1 ')}
                        </div>

                        <div className="flex justify-between items-end border-t border-slate-800/60 pt-2 text-[10px]">
                          <div>
                            <span className="block text-[8px] uppercase font-bold text-slate-400">Card holder</span>
                            <span className="font-semibold block tracking-tight uppercase max-w-44 truncate">
                              {cardHolder || 'Primary Traveler'}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="block text-[8px] uppercase font-bold text-slate-400">Expiry expiry</span>
                            <span className="font-mono font-semibold block">{cardExpiry || '12/28'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Input fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Card Number</label>
                          <input
                            type="text"
                            maxLength={16}
                            placeholder="4000 1282 1002 9902"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                            className="w-full rounded-lg border border-slate-200 p-2.5 text-xs font-mono outline-none"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Cardholder Name</label>
                          <input
                            type="text"
                            placeholder="John Doe"
                            value={cardHolder}
                            onChange={(e) => setCardHolder(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 p-2.5 text-xs outline-none"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Expiry Date (MM/YY)</label>
                          <input
                            type="text"
                            maxLength={5}
                            placeholder="12/28"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 p-2.5 text-xs font-mono outline-none"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Security Code (CVV)</label>
                          <input
                            type="password"
                            maxLength={3}
                            placeholder="***"
                            value={cardCVV}
                            onChange={(e) => setCardCVV(e.target.value.replace(/\D/g, ''))}
                            className="w-full rounded-lg border border-slate-200 p-2.5 text-xs font-mono outline-none"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* UPI Input form */
                    <div className="space-y-3 pt-2">
                      <div className="bg-purple-50/50 border border-purple-100 rounded-xl p-4 text-xs text-purple-900">
                        <span className="font-bold block">Instant Automated Approval with UPI</span>
                        <p className="mt-0.5 text-purple-700 leading-normal">
                          Submit your Virtual Private Address (VPA) or UPI ID below. You will receive a checkout trigger warning inside your authorized mobile app.
                        </p>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">UPI ID / VPA handle</label>
                        <input
                          type="text"
                          placeholder="e.g. john@okhdfcbank"
                          value={upiID}
                          onChange={(e) => setUpiID(e.target.value)}
                          className="w-full rounded-lg border border-slate-200 p-3 text-xs font-mono outline-none"
                          required={paymentMethod === 'upi'}
                        />
                      </div>
                    </div>
                  )}

                  {/* Submission triggers */}
                  <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-xs text-slate-400 font-bold flex items-center space-x-1">
                      <ShieldCheck className="h-4 w-4 text-emerald-600" />
                      <span>256-bit Ssl Encrypted Gateway</span>
                    </span>
                    <button
                      type="submit"
                      disabled={paymentLoading}
                      className="py-3.5 px-8 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:scale-100 disabled:opacity-60 text-white font-bold text-sm shadow-md shadow-orange-600/25 flex items-center justify-center space-x-1 cursor-pointer transition-all hover:scale-101 active:scale-98"
                      id="payment-process-submit"
                    >
                      {paymentLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Authorizing Secure Transfer...</span>
                        </>
                      ) : (
                        <span>Simulate Secure Payment of ₹{totalNetCost.toLocaleString()}</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* ORDER ITEMS QUICK HUD OVERVIEW */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
                <span className="block text-[9px] uppercase font-bold text-slate-400">Selected reservation</span>
                <span className="font-display font-extrabold text-sm text-slate-800 mt-0.5 block">{item.name}</span>
                
                <div className="border-t border-slate-100 mt-4 pt-4 text-xs text-slate-600 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-mono font-bold text-slate-800">₹{rawBasePrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes:</span>
                    <span className="font-mono font-semibold">₹{taxesAndFees.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Promo Savings:</span>
                      <span className="font-mono font-bold">-₹{discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="border-t border-slate-150 pt-3 flex justify-between font-bold text-slate-800 text-sm">
                    <span>Payable Net Total:</span>
                    <span className="font-mono font-black text-blue-900">₹{totalNetCost.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* COMPREHENSIVE SUCCESSFUL BOOKING TICKET MOCK CARD VIEW (STEP 3 END) */}
        {checkoutStep === 3 && bookingCompletedItem && (
          <motion.div
            key="successView"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-3xl mx-auto space-y-6"
            id="checkout-success-container"
          >
            {/* SUCCESS BANNER */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-md text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500" />
              
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-xs mb-4">
                <CheckCircle className="h-8 w-8 text-emerald-500 shrink-0" />
              </div>

              <span className="inline-flex items-center space-x-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-100 mb-2">
                <Sparkles className="h-3.5 w-3.5 animate-bounce text-emerald-500 fill-emerald-500" />
                <span>Voyager VIP Ticket Soft issued</span>
              </span>

              <h2 className="font-display font-extrabold text-2xl text-slate-950">Grand Reservation Successful!</h2>
              <p className="mt-1 text-xs text-slate-550 max-w-md mx-auto leading-relaxed">
                Thank you! Your payment terms are authorized and verified. Your VIP booking is indexed smoothly into your upcoming schedules catalog.
              </p>
            </div>

            {/* ISSUED EXPANDABLE TICKET MOCK */}
            <div 
              className="bg-linear-to-tr from-slate-900 to-indigo-950 rounded-2xl shadow-xl overflow-hidden text-white border border-slate-800 font-sans relative"
              id="printable-ticket-content"
            >
              <div className="absolute -top-12 -left-12 h-36 w-36 rounded-full bg-orange-600/10 blur-2xl" />
              <div className="absolute -bottom-12 -right-12 h-36 w-36 rounded-full bg-cyan-600/15 blur-2xl" />

              {/* TICKET TOP HEADER */}
              <div className="p-5 sm:p-6 border-b border-white/10 flex justify-between items-center relative z-10 bg-slate-950/20">
                <div className="flex items-center space-x-2">
                  <div className="bg-orange-500 rounded-lg p-1">
                    <Plane className="h-4 w-4 -rotate-45 text-slate-950" />
                  </div>
                  <span className="font-display font-bold uppercase tracking-wider text-xs">GOVOYAGE VIP PASS</span>
                </div>
                <div className="text-right">
                  <span className="block text-[8px] uppercase font-bold text-slate-400">Issued Reference ID</span>
                  <span className="font-mono text-xs font-bold text-orange-400 uppercase">{bookingCompletedItem.id}</span>
                </div>
              </div>

              {/* TICKET BODY SLIDER DETAILS */}
              <div className="p-6 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {isFlight ? (
                  /* Flight Pass */
                  <>
                    <div className="md:col-span-8 space-y-4">
                      <div className="flex justify-between items-baseline">
                        <div>
                          <span className="block text-[8px] uppercase font-bold text-slate-400 leading-none">Departure Point</span>
                          <span className="font-display font-black text-2xl text-white mt-1 block">{(bookingCompletedItem.item as Flight).fromCode}</span>
                          <span className="text-[10px] text-slate-350 font-semibold block mt-0.5">{(bookingCompletedItem.item as Flight).from}</span>
                        </div>
                        <div className="flex-1 px-4 flex flex-col items-center justify-center relative">
                          <Plane className="h-5.5 w-5.5 -rotate-45 text-orange-400 animate-pulse" />
                          <div className="w-full h-0.5 bg-gradient-to-r from-orange-400/20 via-orange-450 to-orange-400/20 my-1" />
                          <span className="text-[9px] font-mono text-slate-400 tracking-wider">{(bookingCompletedItem.item as Flight).duration}</span>
                        </div>
                        <div className="text-right">
                          <span className="block text-[8px] uppercase font-bold text-slate-400 leading-none">Arrival Point</span>
                          <span className="font-display font-black text-2xl text-white mt-1 block">{(bookingCompletedItem.item as Flight).toCode}</span>
                          <span className="text-[10px] text-slate-355 font-semibold block mt-0.5">{(bookingCompletedItem.item as Flight).to}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/10">
                        <div>
                          <span className="block text-[8px] uppercase font-bold text-slate-400">Ais Carrier ID</span>
                          <span className="font-mono text-xs font-semibold block text-slate-200">{(bookingCompletedItem.item as Flight).flightNo}</span>
                        </div>
                        <div>
                          <span className="block text-[8px] uppercase font-bold text-slate-400">Class Type</span>
                          <span className="text-xs font-semibold block text-slate-200">{(bookingCompletedItem.item as Flight).class}</span>
                        </div>
                        <div>
                          <span className="block text-[8px] uppercase font-bold text-slate-400">DEP DATE</span>
                          <span className="text-xs font-semibold block text-slate-200">{searchParams.flights.departureDate}</span>
                        </div>
                        <div>
                          <span className="block text-[8px] uppercase font-bold text-slate-400">DEP TIME</span>
                          <span className="font-mono text-xs font-semibold block text-orange-400">{(bookingCompletedItem.item as Flight).departureTime}</span>
                        </div>
                      </div>
                    </div>

                    {/* Left barcode graphic separator */}
                    <div className="md:col-span-4 border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-6 flex flex-col items-center justify-center text-center">
                      <span className="text-[8px] uppercase font-bold text-slate-400 mb-2 block">SECURE BOARDING BARCODE</span>
                      <div className="h-10 w-44 bg-white/10 flex items-center justify-center overflow-hidden rounded-md cursor-pointer group hover:bg-white/15 transition-all p-1">
                        {/* Fake boarder lines to mimic real-world barcode scanners */}
                        <div className="h-full flex items-stretch space-x-0.75 opacity-75">
                          {[2,1,3,1,2,1,1,3,2,1,2,3,1,2,1,3,1,2,1,1,3,2,1].map((weight, i) => (
                            <div 
                              key={`bar-${i}`} 
                              className="bg-white" 
                              style={{ width: `${weight * 1.5}px` }} 
                            />
                          ))}
                        </div>
                      </div>
                      <span className="font-mono text-[9px] text-slate-400 tracking-widest mt-1.5">{bookingCompletedItem.ticketNo}</span>
                    </div>
                  </>
                ) : (
                  /* Hotel Reservation Pass */
                  <>
                    <div className="md:col-span-8 space-y-4">
                      <div>
                        <span className="block text-[8px] uppercase font-bold text-slate-400 leading-none">Property name</span>
                        <span className="font-display font-black text-xl text-white mt-1 block">{(bookingCompletedItem.item as Hotel).name}</span>
                        <span className="text-[10px] text-slate-350 font-semibold block mt-0.5">{(bookingCompletedItem.item as Hotel).area}, {(bookingCompletedItem.item as Hotel).city}</span>
                      </div>

                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-white/10">
                        <div>
                          <span className="block text-[8px] uppercase font-bold text-slate-400">Check-In Date</span>
                          <span className="text-xs font-semibold block text-slate-200">{bookingCompletedItem.hotelDetails?.checkIn}</span>
                        </div>
                        <div>
                          <span className="block text-[8px] uppercase font-bold text-slate-400">Check-Out Date</span>
                          <span className="text-xs font-semibold block text-slate-200">{bookingCompletedItem.hotelDetails?.checkOut}</span>
                        </div>
                        <div>
                          <span className="block text-[8px] uppercase font-bold text-slate-400">Night spans</span>
                          <span className="text-xs font-semibold block text-slate-200">{nights} Night{nights > 1 ? 's' : ''}</span>
                        </div>
                        <div>
                          <span className="block text-[8px] uppercase font-bold text-slate-400">Rooms Secured</span>
                          <span className="text-xs font-semibold block text-orange-400">{bookingCompletedItem.hotelDetails?.rooms} Room Units</span>
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-4 border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-6 flex flex-col items-center justify-center text-center">
                      <span className="text-[8px] uppercase font-bold text-slate-400 mb-2 block">SECURE RESERVATION PASS</span>
                      <div className="h-10 w-44 bg-white/10 flex items-center justify-center overflow-hidden rounded-md cursor-pointer group hover:bg-white/15 transition-all p-1">
                        <div className="h-full flex items-stretch space-x-0.75 opacity-75">
                          {[1,2,1,3,1,2,1,1,3,2,1,2,3,1,2,1,3,1,2,1,1,3,2,1].map((weight, i) => (
                            <div 
                              key={`bar-${i}`} 
                              className="bg-white" 
                              style={{ width: `${weight * 1.5}px` }} 
                            />
                          ))}
                        </div>
                      </div>
                      <span className="font-mono text-[9px] text-slate-400 tracking-widest mt-1.5">{bookingCompletedItem.ticketNo}</span>
                    </div>
                  </>
                )}
              </div>

              {/* TICKET UNDERNEATH PASSENGER HUD BAR */}
              <div className="bg-slate-950/40 p-5 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                <div>
                  <span className="block text-[8px] uppercase font-bold text-slate-400">Accompanying Occupant List</span>
                  {bookingCompletedItem.passengers && bookingCompletedItem.passengers.length > 0 ? (
                    <div className="space-y-0.5 mt-1 font-semibold text-slate-200">
                      {bookingCompletedItem.passengers.map((p, pIdx) => (
                        <div key={`p-ticket-badge-${pIdx}`}>
                          {p.title} {p.firstName} {p.lastName} (<span className="text-slate-400 text-[10px]">{p.email}</span>)
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="font-semibold text-slate-200 mt-1 block">Lead Account Guest</span>
                  )}
                </div>

                <div className="sm:text-right flex flex-col justify-end">
                  <span className="block text-[8px] uppercase font-bold text-slate-400">Simulated Net Transaction Paid</span>
                  <span className="font-mono text-base font-black text-orange-400 mt-0.5">₹{bookingCompletedItem.totalPrice.toLocaleString()}</span>
                  <span className="text-[9px] text-slate-450 uppercase font-medium leading-none mt-0.5">Verified by Stripe-Gpay Simulator</span>
                </div>
              </div>

            </div>

            {/* LOWER ACTIONS BUTTON */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-3 px-6 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm shadow-2xs hover:shadow-xs transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Download className="h-4 w-4 text-slate-500" />
                <span>Print Ticket Invoice details</span>
              </button>

              <button
                type="button"
                onClick={clearCompletedBooking}
                className="flex-1 py-3 px-6 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-md hover:scale-101 cursor-pointer transition-all text-center flex items-center justify-center"
              >
                <span>Navigate to My Bookings dashboard</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
