export interface Flight {
  id: string;
  airline: string;
  logo: string;
  flightNo: string;
  from: string;
  fromCode: string;
  to: string;
  toCode: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  price: number;
  class: 'Economy' | 'Premium Economy' | 'Business' | 'First';
  seatsLeft: number;
  refundable: boolean;
  airlineCode: string; // for logos
}

export interface Hotel {
  id: string;
  name: string;
  image: string;
  city: string;
  rating: number;
  ratingText: string;
  reviewsCount: number;
  price: number;
  amenities: string[];
  stars: number;
  area: string;
  description: string;
  roomsAvailable: number;
}

export interface PassengerDetails {
  title: 'Mr' | 'Mrs' | 'Ms';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  passportNo?: string;
}

export interface RefundDetails {
  refundAmount: number;
  refundPercent: number;
  reason: string;
  status: 'pending' | 'processed' | 'completed';
  eta: string;
  requestedDate: string;
}

export interface SelectedUpgrades {
  seat?: {
    code: string;
    type: 'Standard' | 'Premium';
    price: number;
  };
  room?: {
    id: string;
    name: string;
    price: number;
    image: string;
    type: string;
  };
}

export interface Booking {
  id: string;
  type: 'flight' | 'hotel';
  item: Flight | Hotel;
  passengers?: PassengerDetails[];
  hotelDetails?: {
    checkIn: string;
    checkOut: string;
    rooms: number;
    guests: number;
  };
  bookingDate: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  totalPrice: number;
  ticketNo: string;
  paymentMethod: 'card' | 'upi';
  refundDetails?: RefundDetails;
  chosenUpgrades?: SelectedUpgrades;
  priceFrozen?: boolean;
}

export interface SearchParams {
  type: 'flight' | 'hotel';
  flights: {
    from: string;
    to: string;
    departureDate: string;
    returnDate?: string;
    passengers: number;
    cabinClass: 'Economy' | 'Premium Economy' | 'Business' | 'First';
  };
  hotels: {
    destination: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    rooms: number;
  };
}

export interface FlightFilters {
  stops: string[]; // '0', '1', '2+'
  priceRange: [number, number];
  airlines: string[];
  departureTime: string[]; // 'morning', 'afternoon', 'evening'
  refundable: boolean | null;
}

export interface HotelFilters {
  stars: number[];
  priceRange: [number, number];
  amenities: string[];
  areas: string[];
}

export interface User {
  id?: number;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface ReviewReply {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface Review {
  id: string;
  targetId: string; // flightId or hotelId
  author: string;
  avatarInitials: string;
  rating: number; // 1-5
  text: string;
  photos?: string[];
  replies?: ReviewReply[];
  flagged?: boolean;
  helpfulCount: number;
  createdAt: string;
}

export interface FlightStatusUpdate {
  flightNo: string;
  status: 'On Time' | 'Delayed by 30m' | 'Delayed by 1h' | 'Delayed by 2h' | 'Boarding' | 'Cancelled';
  reason?: string;
  departureGate?: string;
  revisedDeparture?: string;
  estimatedArrival?: string;
  lastUpdated: string;
}

export interface LiveNotification {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  type: 'status' | 'refund' | 'upgrade' | 'price';
}

