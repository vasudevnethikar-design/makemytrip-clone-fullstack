import { Flight, Hotel, Booking } from '../types';

export const CITIES = [
  { name: 'New Delhi', code: 'DEL', country: 'India', airport: 'Indira Gandhi International Airport', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80' },
  { name: 'Mumbai', code: 'BOM', country: 'India', airport: 'Chhatrapati Shivaji Maharaj Airport', image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=600&q=80' },
  { name: 'Goa', code: 'GOI', country: 'India', airport: 'Dabolim Airport / Mopa', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80' },
  { name: 'Bengaluru', code: 'BLR', country: 'India', airport: 'Kempegowda International Airport', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=600&q=80' },
  { name: 'Singapore', code: 'SIN', country: 'Singapore', airport: 'Changi Airport', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=600&q=80' },
  { name: 'London', code: 'LHR', country: 'United Kingdom', airport: 'Heathrow Airport', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ca1ad?auto=format&fit=crop&w=600&q=80' },
  { name: 'Dubai', code: 'DXB', country: 'UAE', airport: 'Dubai International Airport', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80' },
  { name: 'New York', code: 'JFK', country: 'United States', airport: 'John F. Kennedy Airport', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80' },
  { name: 'Paris', code: 'CDG', country: 'France', airport: 'Charles de Gaulle Airport', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80' },
];

export const AIRLINES = [
  { name: 'IndiGo', code: '6E', primaryColor: 'bg-blue-600', textColor: 'text-white' },
  { name: 'Air India', code: 'AI', primaryColor: 'bg-red-600', textColor: 'text-white' },
  { name: 'Vistara', code: 'UK', primaryColor: 'bg-purple-800', textColor: 'text-white' },
  { name: 'Emirates', code: 'EK', primaryColor: 'bg-red-700', textColor: 'text-white' },
  { name: 'Singapore Airlines', code: 'SQ', primaryColor: 'bg-amber-700', textColor: 'text-white' },
  { name: 'Qatar Airways', code: 'QR', primaryColor: 'bg-rose-900', textColor: 'text-white' },
  { name: 'British Airways', code: 'BA', primaryColor: 'bg-blue-900', textColor: 'text-white' },
];

export const HOTEL_IMAGES = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80', // luxurious resort
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80', // pool view
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80', // grand facade
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80', // modern pool deck
  'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80', // luxury bedroom
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80', // boutique resort
  'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=800&q=80', // spa and resort
];

export const AMENITIES_LIST = [
  'Free Wi-Fi',
  'Swimming Pool',
  'Spa & Wellness',
  'Fitness Center',
  'Multi-cuisine Restaurant',
  '24/7 Room Service',
  'Bar / Lounge',
  'Valet Parking',
  'Airport Shuttle',
  'Air Conditioning',
];

const HOTEL_DESCRIPTIONS = [
  'Experience unprecedented luxury and world-class service in the middle of the city. Featuring a state-of-the-art spa, dynamic culinary options, and plush bedding.',
  'A tropical paradise offering premium escape suites, private plunge pools, and stunning ocean and landscape lookouts. Ideal for families and couples alike.',
  'A minimalist contemporary masterpiece with high-tech amenities, an outdoor visual pool, and direct proximity to key commercial and transit hubs.',
  'Boutique accommodations with warm service and custom-designed rooms. Offers a delightful culinary breakfast buffet and personalized tour guidance.',
];

// Helper to get city name from code, or find city object
export const getCityByCode = (code: string) => {
  return CITIES.find((c) => c.code.toUpperCase() === code.toUpperCase()) || CITIES[0];
};

export const getCityByName = (name: string) => {
  return CITIES.find((c) => c.name.toLowerCase().includes(name.toLowerCase())) || CITIES[0];
};

// Generates dynamic but consistent flights for search parameters
export function getMockFlights(from: string, to: string, dateStr: string, cabinClass: string = 'Economy'): Flight[] {
  const fromCity = getCityByCode(from) || getCityByName(from);
  const toCity = getCityByCode(to) || getCityByName(to);

  if (fromCity.code === toCity.code) {
    // Return empty if same city
    return [];
  }

  // Create seed based on flight endpoints
  const routeSeed = fromCity.code.charCodeAt(0) + toCity.code.charCodeAt(0);
  
  const flightCount = 8; // Generate 8 flights per route
  const flights: Flight[] = [];

  const basePriceMultiplier = cabinClass === 'Business' ? 2.5 : cabinClass === 'First' ? 4.5 : cabinClass === 'Premium Economy' ? 1.4 : 1.0;

  for (let i = 0; i < flightCount; i++) {
    const airline = AIRLINES[(routeSeed + i) % AIRLINES.length];
    
    // Flight mechanics
    const startHour = (6 + (i * 2.2)) % 24;
    const durationHours = Math.floor(2 + ((routeSeed * (i + 1)) % 5));
    const durationMinutes = Math.floor((routeSeed + i * 15) % 60);
    
    const arrHour = (startHour + durationHours) % 24;
    const arrMinutes = durationMinutes;

    const depStr = `${Math.floor(startHour).toString().padStart(2, '0')}:${((i * 10) % 60).toString().padStart(2, '0')}`;
    const arrStr = `${Math.floor(arrHour).toString().padStart(2, '0')}:${arrMinutes.toString().padStart(2, '0')}`;

    // Calculate dynamic stops
    // Overseas flight have stops, local have mostly direct
    const isInternational = ['LHR', 'SIN', 'DXB', 'JFK', 'CDG'].includes(fromCity.code) || ['LHR', 'SIN', 'DXB', 'JFK', 'CDG'].includes(toCity.code);
    const stops = isInternational ? (i % 3 === 0 ? 0 : i % 3 === 1 ? 1 : 2) : (i % 4 === 0 ? 1 : 0);

    // Dynamic price based on route, timing and stops
    const baseRoutePrice = isInternational ? 45000 : 4500;
    const stopDiscount = stops === 0 ? 1.2 : stops === 1 ? 0.95 : 0.8;
    const hrPremium = startHour > 8 && startHour < 20 ? 1.15 : 0.9; // Premium for morning/evening flights
    const finalPrice = Math.floor(baseRoutePrice * basePriceMultiplier * stopDiscount * hrPremium + (i * 250));

    flights.push({
      id: `FL-${fromCity.code}-${toCity.code}-${i + 100}`,
      airline: airline.name,
      logo: airline.primaryColor,
      airlineCode: airline.code,
      flightNo: `${airline.code}-${Math.floor(100 + (routeSeed % 800) + (i * 11))}`,
      from: fromCity.name,
      fromCode: fromCity.code,
      to: toCity.name,
      toCode: toCity.code,
      departureTime: depStr,
      arrivalTime: arrStr,
      duration: `${durationHours}h ${durationMinutes}m`,
      stops,
      price: finalPrice,
      class: cabinClass as any,
      seatsLeft: (routeSeed + (i * 7)) % 8 + 1, // Scarcity multiplier (1 to 8 seats left)
      refundable: (routeSeed + i) % 2 === 0,
    });
  }

  // Sort by departure time
  return flights.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
}

// Generates dynamic but consistent hotels for destination search
export function getMockHotels(destination: string): Hotel[] {
  const cityObj = getCityByCode(destination) || getCityByName(destination);
  const citySeed = cityObj.name.charCodeAt(0) + cityObj.name.charCodeAt(cityObj.name.length - 1);

  const hotelCount = 8;
  const hotels: Hotel[] = [];

  const hotelPrefixes = ['Grand', 'Regency', 'Carlton', 'Residency', 'Boutique', 'Emerald', 'Royal', 'Orchid'];
  const hotelSuffixes = ['Suites', 'Palace', 'Resort & Spa', 'Inn & Suites', 'Vista', 'Plaza', 'Retreat', 'Haven'];

  const localAreas = {
    DEL: ['Connaught Place', 'South Delhi', 'Dwarka', 'Aerocity'],
    BOM: ['Colaba', 'Bandra West', 'Juhu Beach', 'Marine Drive'],
    BLR: ['Indiranagar', 'Koramangala', 'Whitefield', 'MG Road'],
    GOI: ['Calangute', 'Candolim', 'Panaji', 'South Goa Beaches'],
    SIN: ['Marina Bay', 'Sentosa Island', 'Orchard Road', 'Clarke Quay'],
    LHR: ['Mayfair', 'Kensington', 'Covent Garden', 'Paddington'],
    DXB: ['Downtown Dubai', 'Dubai Marina', 'Palm Jumeirah', 'Deira'],
    JFK: ['Manhattan Midtown', 'Brooklyn Heights', 'Times Square', 'Queens'],
    CDG: ['Champs-Élysées', 'Latin Quarter', 'Montmartre', 'Louvre Area'],
  };

  const codeKey = (cityObj.code as keyof typeof localAreas) || 'DEL';
  const areas = localAreas[codeKey] || ['Downtown', 'Suburbs', 'Riverside', 'Station Vista'];

  for (let i = 0; i < hotelCount; i++) {
    const star = 3 + ((citySeed + i) % 3); // 3, 4 or 5 stars
    const basePrice = star === 5 ? 12000 : star === 4 ? 6500 : 3500;
    const finalPrice = Math.floor(basePrice + ((citySeed * (i + 1)) % 1500));

    // Select custom amenities (always pick 4 to 6 amenities)
    const amenities: string[] = [];
    const seedOffset = citySeed + i;
    for (let j = 0; j < AMENITIES_LIST.length; j++) {
      if ((seedOffset + j * 3) % (j % 2 === 0 ? 2 : 3) === 0 && amenities.length < 6) {
        amenities.push(AMENITIES_LIST[j]);
      }
    }
    // Make sure we always have wifi and AC
    if (!amenities.includes('Free Wi-Fi')) amenities.push('Free Wi-Fi');
    if (!amenities.includes('Air Conditioning')) amenities.push('Air Conditioning');

    const score = (8.2 + ((citySeed + i * 2) % 18) / 10).toFixed(1);
    const scoreNum = parseFloat(score);
    let ratingText = 'Very Good';
    if (scoreNum >= 9.5) ratingText = 'Exceptional';
    else if (scoreNum >= 9.0) ratingText = 'Outstanding';
    else if (scoreNum >= 8.5) ratingText = 'Excellent';

    hotels.push({
      id: `HT-${cityObj.code}-${100 + i}`,
      name: `${hotelPrefixes[(citySeed + i) % hotelPrefixes.length]} ${cityObj.name} ${hotelSuffixes[(citySeed + i * 2) % hotelSuffixes.length]}`,
      image: HOTEL_IMAGES[(citySeed + i) % HOTEL_IMAGES.length],
      city: cityObj.name,
      rating: scoreNum,
      ratingText,
      reviewsCount: 150 + ((citySeed * (i + 1)) % 980),
      price: finalPrice,
      amenities: amenities.slice(0, 5),
      stars: star,
      area: areas[i % areas.length],
      description: HOTEL_DESCRIPTIONS[i % HOTEL_DESCRIPTIONS.length],
      roomsAvailable: (citySeed + i * 3) % 4 + 1, // Scarcity tracker
    });
  }

  // Sort by popular review scores
  return hotels.sort((a, b) => b.rating - a.rating);
}

// Initial placeholder bookings history to populate the client's account profile dashboard
export function getInitialHistory(): Booking[] {
  const dummyFlight = {
    id: `FL-DEL-BOM-777`,
    airline: 'Air India',
    logo: 'bg-red-600',
    airlineCode: 'AI',
    flightNo: 'AI-102',
    from: 'New Delhi',
    fromCode: 'DEL',
    to: 'Mumbai',
    toCode: 'BOM',
    departureTime: '08:00',
    arrivalTime: '10:05',
    duration: '2h 05m',
    stops: 0,
    price: 5200,
    class: 'Economy' as any,
    seatsLeft: 0,
    refundable: true,
  };

  const dummyHotel = {
    id: `HT-DEL-101`,
    name: 'Grand New Delhi Palace',
    image: HOTEL_IMAGES[0],
    city: 'New Delhi',
    rating: 9.1,
    ratingText: 'Outstanding',
    reviewsCount: 342,
    price: 8900,
    amenities: ['Free Wi-Fi', 'Swimming Pool', 'Air Conditioning'],
    stars: 5,
    area: 'Connaught Place',
    description: 'Experience pure luxury in Connaught Place.',
    roomsAvailable: 0,
  };

  const initialBookings: Booking[] = [
    {
      id: 'BK-FL-2531021',
      type: 'flight',
      item: dummyFlight,
      passengers: [
        { title: 'Mr', firstName: 'John', lastName: 'Doe', email: 'john@example.com', phone: '+1 334 221' }
      ],
      bookingDate: '30 May 2026',
      status: 'upcoming',
      totalPrice: 5200,
      ticketNo: 'TI-AI-44211-92',
      paymentMethod: 'card'
    },
    {
      id: 'BK-HT-1925341',
      type: 'hotel',
      item: dummyHotel,
      hotelDetails: {
        checkIn: '15 June 2026',
        checkOut: '18 June 2026',
        rooms: 1,
        guests: 2
      },
      bookingDate: '26 May 2026',
      status: 'upcoming',
      totalPrice: 26700,
      ticketNo: 'TI-HT-99211-53',
      paymentMethod: 'upi'
    },
    {
      id: 'BK-FL-2531002',
      type: 'flight',
      item: {
        ...dummyFlight,
        id: 'FL-GOI-BLR-09',
        airline: 'IndiGo',
        logo: 'bg-blue-600',
        airlineCode: '6E',
        flightNo: '6E-451',
        from: 'Goa',
        fromCode: 'GOI',
        to: 'Bengaluru',
        toCode: 'BLR',
        departureTime: '17:30',
        arrivalTime: '18:50',
        duration: '1h 20m',
        price: 3400,
        stops: 0,
      },
      passengers: [
        { title: 'Mr', firstName: 'John', lastName: 'Doe', email: 'john@example.com', phone: '+1 334 221' }
      ],
      bookingDate: '10 May 2026',
      status: 'completed',
      totalPrice: 3400,
      ticketNo: 'TI-6E-99044-12',
      paymentMethod: 'card'
    }
  ];

  return initialBookings;
}
