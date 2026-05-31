import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Flight, Hotel, Booking, SearchParams, FlightFilters, HotelFilters, PassengerDetails, User,
  Review, ReviewReply, FlightStatusUpdate, LiveNotification, SelectedUpgrades 
} from '../types';
import { getMockFlights, getMockHotels, getInitialHistory, getCityByCode } from '../data/mockData';

interface BookingContextType {
  activeTab: 'flights' | 'hotels' | 'profile' | 'checkout' | 'admin';
  searchParams: SearchParams;
  flightsResults: Flight[];
  hotelsResults: Hotel[];
  flightFilters: FlightFilters;
  hotelFilters: HotelFilters;
  filteredFlights: Flight[];
  filteredHotels: Hotel[];
  selectedItem: { type: 'flight' | 'hotel'; item: Flight | Hotel } | null;
  checkoutStep: number;
  paymentLoading: boolean;
  bookingsHistory: Booking[];
  bookingCompletedItem: Booking | null;
  hasSearchedFlights: boolean;
  hasSearchedHotels: boolean;
  
  // Auth State
  user: User | null;

  // Reviews System
  reviews: Review[];
  addReview: (targetId: string, rating: number, text: string, photos?: string[]) => void;
  addReviewReply: (reviewId: string, author: string, text: string) => void;
  flagReview: (reviewId: string) => void;
  clearFlaggedReview: (reviewId: string) => void;
  deleteReview: (reviewId: string) => void;
  voteHelpfulReview: (reviewId: string) => void;

  // Live Flight Tracker & Notifications State
  flightStatuses: Record<string, FlightStatusUpdate>;
  trackedFlights: string[]; // flight IDs being tracked
  toggleTrackFlight: (flightId: string) => void;
  notifications: LiveNotification[];
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  pushCustomNotification: (title: string, body: string, type: 'status' | 'refund' | 'upgrade' | 'price') => void;

  // Checkout Seat & Room Selections state
  checkoutUpgrades: SelectedUpgrades;
  updateCheckoutUpgrades: (upgrades: Partial<SelectedUpgrades>) => void;
  resetCheckoutUpgrades: () => void;

  // Dynamic Pricing engine state
  isPeakSeason: boolean;
  togglePeakSeason: () => void;
  frozenPrices: Record<string, number>; // item.id -> price
  freezePriceAction: (itemId: string, currentPrice: number) => void;
  isPriceFrozen: (itemId: string) => boolean;

  // Tailored Recommendations feedbacks
  recommendationFeedback: Record<string, 'helpful' | 'not_helpful'>;
  submitRecFeedback: (itemId: string, status: 'helpful' | 'not_helpful') => void;

  // Actions
  changeTab: (tab: 'flights' | 'hotels' | 'profile' | 'checkout' | 'admin') => void;
  searchFlightsAction: (
    from: string,
    to: string,
    departureDate: string,
    returnDate?: string,
    passengers?: number,
    cabinClass?: 'Economy' | 'Premium Economy' | 'Business' | 'First'
  ) => void;
  searchHotelsAction: (
    destination: string,
    checkIn: string,
    checkOut: string,
    guests?: number,
    rooms?: number
  ) => void;
  updateFlightFilters: (filters: Partial<FlightFilters>) => void;
  updateHotelFilters: (filters: Partial<HotelFilters>) => void;
  resetFlightFilters: () => void;
  resetHotelFilters: () => void;
  selectForBooking: (type: 'flight' | 'hotel', item: Flight | Hotel) => void;
  setCheckoutStep: (step: number) => void;
  submitBooking: (details: { passengers?: PassengerDetails[]; paymentMethod: 'card' | 'upi' }) => Promise<void>;
  cancelBookingAction: (id: string) => void;
  cancelBookingWithReasonAction: (id: string, reason: string) => void;
  clearCompletedBooking: () => void;

  // Auth Operations
  loginAction: (email: string, role: 'USER' | 'ADMIN', name?: string) => Promise<boolean>;
  signupAction: (name: string, email: string, role: 'USER' | 'ADMIN') => Promise<boolean>;
  logoutAction: () => void;

  // Admin CRUD Actions
  addOrUpdateFlight: (flight: Flight, isEdit: boolean) => void;
  deleteFlight: (id: string) => void;
  addOrUpdateHotel: (hotel: Hotel, isEdit: boolean) => void;
  deleteHotel: (id: string) => void;
}

const defaultFlightFilters: FlightFilters = {
  stops: [],
  priceRange: [0, 150000],
  airlines: [],
  departureTime: [],
  refundable: null,
};

const defaultHotelFilters: HotelFilters = {
  stars: [],
  priceRange: [0, 30000],
  amenities: [],
  areas: [],
};

const initialSearchParams: SearchParams = {
  type: 'flight',
  flights: {
    from: 'DEL',
    to: 'GOI',
    departureDate: '2026-06-10',
    passengers: 1,
    cabinClass: 'Economy',
  },
  hotels: {
    destination: 'GOI',
    checkIn: '2026-06-15',
    checkOut: '2026-06-18',
    guests: 2,
    rooms: 1,
  },
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<'flights' | 'hotels' | 'profile' | 'checkout' | 'admin'>('flights');
  const [searchParams, setSearchParams] = useState<SearchParams>(initialSearchParams);
  
  // Auth state - default logged in as VIP Member Vasudev
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('custom_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return { name: 'Vasudev Nethikar', email: 'vasudevnethikar@gmail.com', role: 'USER' };
  });

  // Results
  const [flightsResults, setFlightsResults] = useState<Flight[]>([]);
  const [hotelsResults, setHotelsResults] = useState<Hotel[]>([]);
  const [hasSearchedFlights, setHasSearchedFlights] = useState(false);
  const [hasSearchedHotels, setHasSearchedHotels] = useState(false);

  // Filters State
  const [flightFilters, setFlightFilters] = useState<FlightFilters>(defaultFlightFilters);
  const [hotelFilters, setHotelFilters] = useState<HotelFilters>(defaultHotelFilters);

  // Filtered lists
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);

  // Checkout State
  const [selectedItem, setSelectedItem] = useState<{ type: 'flight' | 'hotel'; item: Flight | Hotel } | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<number>(1);
  const [paymentLoading, setPaymentLoading] = useState<boolean>(false);
  const [bookingCompletedItem, setBookingCompletedItem] = useState<Booking | null>(null);

  // Bookings Profile History list
  const [bookingsHistory, setBookingsHistory] = useState<Booking[]>([]);

  // Reviews system state
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('travel_reviews_collection');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    // Default mock reviews
    const initialReviews: Review[] = [
      {
        id: 'rev-1',
        targetId: 'FL-DEL-GOI-100',
        author: 'Arjun Mehta',
        avatarInitials: 'AM',
        rating: 5,
        text: 'Phenomenal flight experience. Cabin crew was extremely helpful and seats had generous legroom for an economy flight. Highly recommended!',
        helpfulCount: 14,
        flagged: false,
        createdAt: '24 May 2026',
        replies: [
          { id: 'rep-1', author: 'IndiGo Support', text: 'Thank you for your generous feedback, Arjun! We hope to welcome you on board again soon.', createdAt: '25 May 2026' }
        ]
      },
      {
        id: 'rev-2',
        targetId: 'HT-GOI-100',
        author: 'Priya Sharma',
        avatarInitials: 'PS',
        rating: 4,
        text: 'Excellent room services and beautiful beach facing balcony! WiFi count was occasionally sketchy, but overall a wonderful boutique layout.',
        helpfulCount: 8,
        flagged: false,
        createdAt: '20 May 2026',
        replies: []
      },
      {
        id: 'rev-3',
        targetId: 'HT-DEL-101',
        author: 'John C.',
        avatarInitials: 'JC',
        rating: 5,
        text: 'The best experience ever in New Delhi! The grand lobby, pristine pool facility, and delicious food exceeded my expectations completely!',
        helpfulCount: 22,
        flagged: false,
        createdAt: '28 May 2026',
        replies: []
      }
    ];
    return initialReviews;
  });

  // Tracked live flight IDs
  const [trackedFlights, setTrackedFlights] = useState<string[]>(() => {
    const saved = localStorage.getItem('tracked_flights_collection');
    return saved ? JSON.parse(saved) : ['AI-102']; // Track the default flight
  });

  // Live flight status cache
  const [flightStatuses, setFlightStatuses] = useState<Record<string, FlightStatusUpdate>>({
    'AI-102': { flightNo: 'AI-102', status: 'Delayed by 1h', reason: 'Late arrival of incoming aircraft due to strong headwind clusters', departureGate: 'Gate 4B', revisedDeparture: '09:00 AM', estimatedArrival: '11:05 AM', lastUpdated: 'Just now' },
    '6E-451': { flightNo: '6E-451', status: 'On Time', departureGate: 'Gate A12', estimatedArrival: '06:50 PM', lastUpdated: '10 mins ago' },
    'UK-152': { flightNo: 'UK-152', status: 'Boarding', departureGate: 'Gate 22', estimatedArrival: 'Estimated On Time', lastUpdated: 'Just now' },
    '6E-100': { flightNo: '6E-100', status: 'Delayed by 30m', reason: 'ATC congestion at source runway', departureGate: 'Gate 1C', revisedDeparture: '06:30 AM', estimatedArrival: '08:45 AM', lastUpdated: '2 mins ago' },
    'AI-101': { flightNo: 'AI-101', status: 'Cancelled', reason: 'Severe thunderstorm advisory in destination corridor', revisedDeparture: 'Rebooked tomorrow', lastUpdated: '3 mins ago' }
  });

  // In-app live alerts/notifications list
  const [notifications, setNotifications] = useState<LiveNotification[]>(() => {
    const saved = localStorage.getItem('user_live_notifications');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 'notif-1', title: 'Flight Delayed Alert', body: 'Your upcoming Flight Air India AI-102 from Delhi is delayed by 1 hour. Revised departure: 09:00 AM.', timestamp: '30 mins ago', read: false, type: 'status' },
      { id: 'notif-2', title: 'Booking Guaranteed', body: 'Your stay at Grand New Delhi Palace has been verified by the desk supervisor.', timestamp: '1 day ago', read: true, type: 'price' }
    ];
  });

  // Selected upgrades in checkout step
  const [checkoutUpgrades, setCheckoutUpgrades] = useState<SelectedUpgrades>({
    seat: undefined,
    room: undefined
  });

  // Dynamic pricing features & frozen state management
  const [isPeakSeason, setIsPeakSeason] = useState<boolean>(() => {
    const saved = localStorage.getItem('is_peak_season_active');
    return saved === 'true';
  });

  const [frozenPrices, setFrozenPrices] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('user_frozen_prices');
    return saved ? JSON.parse(saved) : {};
  });

  // Personalized recommendation feedback tracker
  const [recommendationFeedback, setRecommendationFeedback] = useState<Record<string, 'helpful' | 'not_helpful'>>(() => {
    const saved = localStorage.getItem('recommendation_feedback');
    return saved ? JSON.parse(saved) : {};
  });

  // Auth Operations
  const loginAction = async (email: string, role: 'USER' | 'ADMIN', name?: string) => {
    await new Promise((resolve) => setTimeout(resolve, 800)); // simulate latency
    const matchedName = name || (role === 'ADMIN' ? 'System Administrator' : 'Vasudev Nethikar');
    const signedUser: User = { name: matchedName, email, role };
    setUser(signedUser);
    localStorage.setItem('custom_auth_user', JSON.stringify(signedUser));
    return true;
  };

  const signupAction = async (name: string, email: string, role: 'USER' | 'ADMIN') => {
    await new Promise((resolve) => setTimeout(resolve, 800)); // simulate latency
    const signedUser: User = { name, email, role };
    setUser(signedUser);
    localStorage.setItem('custom_auth_user', JSON.stringify(signedUser));
    return true;
  };

  const logoutAction = () => {
    setUser(null);
    localStorage.removeItem('custom_auth_user');
    setActiveTab('flights');
  };

  // Admin CRUD Actions
  const addOrUpdateFlight = (flight: Flight, isEdit: boolean) => {
    if (isEdit) {
      setFlightsResults((prev) => prev.map((f) => (f.id === flight.id ? flight : f)));
    } else {
      setFlightsResults((prev) => [flight, ...prev]);
    }
  };

  const deleteFlight = (id: string) => {
    setFlightsResults((prev) => prev.filter((f) => f.id !== id));
  };

  const addOrUpdateHotel = (hotel: Hotel, isEdit: boolean) => {
    if (isEdit) {
      setHotelsResults((prev) => prev.map((h) => (h.id === hotel.id ? hotel : h)));
    } else {
      setHotelsResults((prev) => [hotel, ...prev]);
    }
  };

  const deleteHotel = (id: string) => {
    setHotelsResults((prev) => prev.filter((h) => h.id !== id));
  };

  // Initialize and load from localstorage
  useEffect(() => {
    const saved = localStorage.getItem('travel_bookings_history');
    if (saved) {
      try {
        setBookingsHistory(JSON.parse(saved));
      } catch (e) {
        setBookingsHistory(getInitialHistory());
      }
    } else {
      const initial = getInitialHistory();
      setBookingsHistory(initial);
      localStorage.setItem('travel_bookings_history', JSON.stringify(initial));
    }

    // Default search action load on startup
    const flights = getMockFlights('DEL', 'GOI', '2026-06-10', 'Economy');
    setFlightsResults(flights);
    setFilteredFlights(flights);
    setHasSearchedFlights(true);
  }, []);

  // Save changes to localStorage helper
  const saveBookings = (newBookings: Booking[]) => {
    setBookingsHistory(newBookings);
    localStorage.setItem('travel_bookings_history', JSON.stringify(newBookings));
  };

  // Sync state modifications to LocalStorage
  useEffect(() => {
    localStorage.setItem('travel_reviews_collection', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('tracked_flights_collection', JSON.stringify(trackedFlights));
  }, [trackedFlights]);

  useEffect(() => {
    localStorage.setItem('user_live_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('is_peak_season_active', String(isPeakSeason));
  }, [isPeakSeason]);

  useEffect(() => {
    localStorage.setItem('user_frozen_prices', JSON.stringify(frozenPrices));
  }, [frozenPrices]);

  useEffect(() => {
    localStorage.setItem('recommendation_feedback', JSON.stringify(recommendationFeedback));
  }, [recommendationFeedback]);

  // Review Operations
  const addReview = (targetId: string, rating: number, text: string, photos?: string[]) => {
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      targetId,
      author: user?.name || 'Anonymous Voyager',
      avatarInitials: (user?.name || 'A V').split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2),
      rating,
      text,
      photos,
      replies: [],
      flagged: false,
      helpfulCount: 0,
      createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    setReviews(prev => [newRev, ...prev]);
  };

  const addReviewReply = (reviewId: string, author: string, text: string) => {
    setReviews(prev => prev.map(rev => {
      if (rev.id === reviewId) {
        return {
          ...rev,
          replies: [...(rev.replies || []), { id: `rep-${Date.now()}`, author, text, createdAt: 'Just now' }]
        };
      }
      return rev;
    }));
  };

  const flagReview = (reviewId: string) => {
    setReviews(prev => prev.map(rev => (rev.id === reviewId ? { ...rev, flagged: true } : rev)));
    pushCustomNotification('Flagged Review Alert', 'A review has been flagged and enqueued for moderator review.', 'status');
  };

  const clearFlaggedReview = (reviewId: string) => {
    setReviews(prev => prev.map(rev => (rev.id === reviewId ? { ...rev, flagged: false } : rev)));
  };

  const deleteReview = (reviewId: string) => {
    setReviews(prev => prev.filter(rev => rev.id !== reviewId));
  };

  const voteHelpfulReview = (reviewId: string) => {
    setReviews(prev => prev.map(rev => (rev.id === reviewId ? { ...rev, helpfulCount: rev.helpfulCount + 1 } : rev)));
  };

  // Notification Operations
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const pushCustomNotification = (title: string, body: string, type: 'status' | 'refund' | 'upgrade' | 'price' = 'status') => {
    const newNotif: LiveNotification = {
      id: `notif-${Date.now()}`,
      title,
      body,
      timestamp: 'Just now',
      read: false,
      type
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Flight Status tracking operations
  const toggleTrackFlight = (flightId: string) => {
    setTrackedFlights(prev => {
      if (prev.includes(flightId)) {
        pushCustomNotification('Stopped Tracking Flight', `Flight No: ${flightId} is removed from monitor feed.`, 'status');
        return prev.filter(f => f !== flightId);
      } else {
        pushCustomNotification('🔔 Tracking Flight Live', `Flight No: ${flightId} is now under real-time satellite tracking status.`, 'status');
        return [...prev, flightId];
      }
    });
  };

  // Upgrades management inside step checkout
  const updateCheckoutUpgrades = (upgrades: Partial<SelectedUpgrades>) => {
    setCheckoutUpgrades(prev => ({ ...prev, ...upgrades }));
  };

  const resetCheckoutUpgrades = () => {
    setCheckoutUpgrades({ seat: undefined, room: undefined });
  };

  // Dynamic pricing controls & Freeze actions
  const togglePeakSeason = () => {
    setIsPeakSeason(prev => {
      const active = !prev;
      pushCustomNotification(
        active ? '🔥 Peak Travel Mode Active' : '🟢 Value Season Pricing Restored',
        active ? 'Universal 20% holiday demand pricing is now active across all dates!' : 'System set to base value-season rates.',
        'price'
      );
      return active;
    });
  };

  const freezePriceAction = (itemId: string, currentPrice: number) => {
    setFrozenPrices(prev => ({ ...prev, [itemId]: currentPrice }));
    pushCustomNotification('❄️ Price Frozen Successfully', `Locked ₹${currentPrice.toLocaleString()} rate for the next 24 hours. No surge can affect it!`, 'price');
  };

  const isPriceFrozen = (itemId: string) => {
    return frozenPrices[itemId] !== undefined;
  };

  // Recommendations feedback operations
  const submitRecFeedback = (itemId: string, status: 'helpful' | 'not_helpful') => {
    setRecommendationFeedback(prev => ({ ...prev, [itemId]: status }));
    pushCustomNotification('Recommendation Verified', 'Thank you! Your feedback helps us improve your suggestions.', 'upgrade');
  };

  // Detailed Cancellation Action calculating refunds based on duration rules
  const cancelBookingWithReasonAction = (bookingId: string, reason: string) => {
    const updated = bookingsHistory.map((bk) => {
      if (bk.id === bookingId) {
        // Find if booking was done within 24 hours (simulated against mock history dates)
        let isWithin24Hours = false;
        try {
          if (bk.bookingDate.includes('30 May') || bk.bookingDate.includes('31 May')) {
            isWithin24Hours = true;
          }
        } catch (e) {}

        const refundPercent = isWithin24Hours ? 50 : 80;
        const refundAmount = Math.floor(bk.totalPrice * (refundPercent / 100));

        const refundDetailsObj = {
          refundAmount,
          refundPercent,
          reason,
          status: 'pending' as const,
          eta: 'Refund arriving in 3-5 business days',
          requestedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        };

        pushCustomNotification(
          'Refund Tracker Updated',
          `Canceled booking ${bk.id} due to: "${reason}". Calculated ${refundPercent}% refund value of ₹${refundAmount.toLocaleString()} safely.`,
          'refund'
        );

        return {
          ...bk,
          status: 'cancelled' as const,
          refundDetails: refundDetailsObj
        };
      }
      return bk;
    });
    saveBookings(updated);
  };

  // Switch top tab view
  const changeTab = (tab: 'flights' | 'hotels' | 'profile' | 'checkout') => {
    setActiveTab(tab);
    if (tab === 'flights' && flightsResults.length === 0) {
      const f = getMockFlights(searchParams.flights.from, searchParams.flights.to, searchParams.flights.departureDate, searchParams.flights.cabinClass);
      setFlightsResults(f);
      setHasSearchedFlights(true);
    } else if (tab === 'hotels' && hotelsResults.length === 0) {
      const h = getMockHotels(searchParams.hotels.destination);
      setHotelsResults(h);
      setHasSearchedHotels(true);
    }
  };

  // Run Flight Search
  const searchFlightsAction = (
    from: string,
    to: string,
    departureDate: string,
    returnDate?: string,
    passengers: number = 1,
    cabinClass: 'Economy' | 'Premium Economy' | 'Business' | 'First' = 'Economy'
  ) => {
    setSearchParams((prev) => ({
      ...prev,
      type: 'flight',
      flights: { from, to, departureDate, returnDate, passengers, cabinClass },
    }));

    const results = getMockFlights(from, to, departureDate, cabinClass);
    setFlightsResults(results);
    setHasSearchedFlights(true);
    
    // Auto reset flights filters ranges when dynamic queries change
    if (results.length > 0) {
      const prices = results.map((flight) => flight.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      setFlightFilters((f) => ({
        ...defaultFlightFilters,
        priceRange: [minPrice - 100, maxPrice + 100],
      }));
    } else {
      setFlightFilters(defaultFlightFilters);
    }
  };

  // Run Hotel Search
  const searchHotelsAction = (
    destination: string,
    checkIn: string,
    checkOut: string,
    guests: number = 2,
    rooms: number = 1
  ) => {
    setSearchParams((prev) => ({
      ...prev,
      type: 'hotel',
      hotels: { destination, checkIn, checkOut, guests, rooms },
    }));

    const results = getMockHotels(destination);
    setHotelsResults(results);
    setHasSearchedHotels(true);

    if (results.length > 0) {
      const prices = results.map((hotel) => hotel.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      setHotelFilters((h) => ({
        ...defaultHotelFilters,
        priceRange: [minPrice - 100, maxPrice + 100],
      }));
    } else {
      setHotelFilters(defaultHotelFilters);
    }
  };

  // Filter lists in real-time
  useEffect(() => {
    if (flightsResults.length === 0) {
      setFilteredFlights([]);
      return;
    }

    let result = [...flightsResults];

    // Stops filter
    if (flightFilters.stops.length > 0) {
      result = result.filter((flight) => {
        const stopsStr = flight.stops === 0 ? '0' : flight.stops === 1 ? '1' : '2+';
        return flightFilters.stops.includes(stopsStr);
      });
    }

    // Colors/Carrier filter
    if (flightFilters.airlines.length > 0) {
      result = result.filter((flight) => flightFilters.airlines.includes(flight.airline));
    }

    // Departure time window filter
    if (flightFilters.departureTime.length > 0) {
      result = result.filter((flight) => {
        const hour = parseInt(flight.departureTime.split(':')[0], 10);
        if (flightFilters.departureTime.includes('morning') && hour >= 6 && hour < 12) return true;
        if (flightFilters.departureTime.includes('afternoon') && hour >= 12 && hour < 17) return true;
        if (flightFilters.departureTime.includes('evening') && (hour >= 17 || hour < 6)) return true;
        return false;
      });
    }

    // Price scope filter
    result = result.filter((flight) => flight.price >= flightFilters.priceRange[0] && flight.price <= flightFilters.priceRange[1]);

    // Refundable status
    if (flightFilters.refundable !== null) {
      result = result.filter((flight) => flight.refundable === flightFilters.refundable);
    }

    setFilteredFlights(result);
  }, [flightsResults, flightFilters]);

  useEffect(() => {
    if (hotelsResults.length === 0) {
      setFilteredHotels([]);
      return;
    }

    let result = [...hotelsResults];

    // Star filtering
    if (hotelFilters.stars.length > 0) {
      result = result.filter((hotel) => hotelFilters.stars.includes(hotel.stars));
    }

    // Amenities filtering
    if (hotelFilters.amenities.length > 0) {
      result = result.filter((hotel) => {
        return hotelFilters.amenities.every((amenity) => hotel.amenities.includes(amenity));
      });
    }

    // Zone region filtering
    if (hotelFilters.areas.length > 0) {
      result = result.filter((hotel) => hotelFilters.areas.includes(hotel.area));
    }

    // Price scope filter
    result = result.filter((hotel) => hotel.price >= hotelFilters.priceRange[0] && hotel.price <= hotelFilters.priceRange[1]);

    setFilteredHotels(result);
  }, [hotelsResults, hotelFilters]);

  // Actions updates
  const updateFlightFilters = (filters: Partial<FlightFilters>) => {
    setFlightFilters((prev) => ({ ...prev, ...filters }));
  };

  const updateHotelFilters = (filters: Partial<HotelFilters>) => {
    setHotelFilters((prev) => ({ ...prev, ...filters }));
  };

  const resetFlightFilters = () => {
    const prices = flightsResults.map((flight) => flight.price);
    const minPrice = prices.length > 0 ? Math.min(...prices) - 100 : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) + 100 : 150000;
    setFlightFilters({
      ...defaultFlightFilters,
      priceRange: [minPrice, maxPrice],
    });
  };

  const resetHotelFilters = () => {
    const prices = hotelsResults.map((hotel) => hotel.price);
    const minPrice = prices.length > 0 ? Math.min(...prices) - 100 : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) + 100 : 30000;
    setHotelFilters({
      ...defaultHotelFilters,
      priceRange: [minPrice, maxPrice],
    });
  };

  const selectForBooking = (type: 'flight' | 'hotel', item: Flight | Hotel) => {
    setSelectedItem({ type, item });
    setCheckoutStep(1);
    setBookingCompletedItem(null);
    setActiveTab('checkout');
  };

  // Simulating beautiful booking transactions safely
  const submitBooking = async (details: { passengers?: PassengerDetails[]; paymentMethod: 'card' | 'upi' }) => {
    if (!selectedItem) return;

    setPaymentLoading(true);
    // Simulate payment response latency to mimic actual system workflows
    await new Promise((resolve) => setTimeout(resolve, 2200));

    let basePrice = selectedItem.item.price;
    const isFrozen = frozenPrices[selectedItem.item.id] !== undefined;

    // Resolve base price honoring freezing locks vs peak surge
    if (isFrozen) {
      basePrice = frozenPrices[selectedItem.item.id];
    } else if (isPeakSeason) {
      basePrice = Math.floor(basePrice * 1.2);
    }

    let finalPrice = basePrice;
    let itemTitle = '';

    if (selectedItem.type === 'flight') {
      const flight = selectedItem.item as Flight;
      finalPrice = basePrice * (searchParams.flights.passengers || 1);
      if (checkoutUpgrades.seat) {
        finalPrice += checkoutUpgrades.seat.price * (searchParams.flights.passengers || 1);
      }
      itemTitle = `${flight.fromCode} → ${flight.toCode} Flight`;
    } else {
      const hotel = selectedItem.item as Hotel;
      // calculate total nights
      const inDate = new Date(searchParams.hotels.checkIn);
      const outDate = new Date(searchParams.hotels.checkOut);
      const diffTime = Math.abs(outDate.getTime() - inDate.getTime());
      const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      finalPrice = basePrice * nights * (searchParams.hotels.rooms || 1);
      if (checkoutUpgrades.room) {
        finalPrice += checkoutUpgrades.room.price * nights * (searchParams.hotels.rooms || 1);
      }
      itemTitle = `${hotel.name}`;
    }

    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const codePrefix = selectedItem.type === 'flight' ? 'FI' : 'HT';

    const newBooking: Booking = {
      id: `BK-${codePrefix.toUpperCase()}-${randomSuffix}`,
      type: selectedItem.type,
      item: selectedItem.item,
      passengers: details.passengers,
      hotelDetails: selectedItem.type === 'hotel' ? {
        checkIn: searchParams.hotels.checkIn,
        checkOut: searchParams.hotels.checkOut,
        rooms: searchParams.hotels.rooms,
        guests: searchParams.hotels.guests,
      } : undefined,
      bookingDate: formattedDate,
      status: 'upcoming',
      totalPrice: finalPrice,
      ticketNo: `TI-${codePrefix.toUpperCase()}-${randomSuffix}-${Math.floor(10 + Math.random() * 89)}`,
      paymentMethod: details.paymentMethod,
      chosenUpgrades: { ...checkoutUpgrades },
      priceFrozen: isFrozen,
    };

    const updatedBookings = [newBooking, ...bookingsHistory];
    saveBookings(updatedBookings);
    setBookingCompletedItem(newBooking);
    setPaymentLoading(false);
    resetCheckoutUpgrades(); // clear upgrades selection state for next flow
    setCheckoutStep(3); // success view
  };

  // Easy cancelling state action
  const cancelBookingAction = (bookingId: string) => {
    const updated = bookingsHistory.map((bk) => {
      if (bk.id === bookingId) {
        return { ...bk, status: 'cancelled' as const };
      }
      return bk;
    });
    saveBookings(updated);
  };

  const clearCompletedBooking = () => {
    setBookingCompletedItem(null);
    setSelectedItem(null);
    setCheckoutStep(1);
    setActiveTab('profile'); // Send them to their bookings page to enjoy the ticket
  };

  return (
    <BookingContext.Provider
      value={{
        activeTab,
        searchParams,
        flightsResults,
        hotelsResults,
        flightFilters,
        hotelFilters,
        filteredFlights,
        filteredHotels,
        selectedItem,
        checkoutStep,
        paymentLoading,
        bookingsHistory,
        bookingCompletedItem,
        hasSearchedFlights,
        hasSearchedHotels,
        user,
        reviews,
        addReview,
        addReviewReply,
        flagReview,
        clearFlaggedReview,
        deleteReview,
        voteHelpfulReview,
        flightStatuses,
        trackedFlights,
        toggleTrackFlight,
        notifications,
        markNotificationAsRead,
        clearNotifications,
        pushCustomNotification,
        checkoutUpgrades,
        updateCheckoutUpgrades,
        resetCheckoutUpgrades,
        isPeakSeason,
        togglePeakSeason,
        frozenPrices,
        freezePriceAction,
        isPriceFrozen,
        recommendationFeedback,
        submitRecFeedback,
        changeTab,
        searchFlightsAction,
        searchHotelsAction,
        updateFlightFilters,
        updateHotelFilters,
        resetFlightFilters,
        resetHotelFilters,
        selectForBooking,
        setCheckoutStep,
        submitBooking,
        cancelBookingAction,
        cancelBookingWithReasonAction,
        clearCompletedBooking,
        loginAction,
        signupAction,
        logoutAction,
        addOrUpdateFlight,
        deleteFlight,
        addOrUpdateHotel,
        deleteHotel,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
