import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { Flight, Hotel } from '../types';
import { Plus, Edit2, Trash2, Shield, Plane, Hotel as HotelIcon, BookOpen, Check, AlertTriangle, ArrowRight, DollarSign, Calendar, Star, Users } from 'lucide-react';

export default function AdminDashboard() {
  const { 
    flightsResults, 
    hotelsResults, 
    bookingsHistory,
    addOrUpdateFlight, 
    deleteFlight, 
    addOrUpdateHotel, 
    deleteHotel 
  } = useBooking();

  const [activeAdminSubTab, setActiveAdminSubTab] = useState<'flights' | 'hotels' | 'bookings'>('flights');
  
  // Custom alerts
  const [successMsg, setSuccessMsg] = useState('');
  
  // Edit slots tracking
  const [editingFlight, setEditingFlight] = useState<Flight | null>(null);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);

  // Forms statuses
  const [showFlightForm, setShowFlightForm] = useState(false);
  const [showHotelForm, setShowHotelForm] = useState(false);

  // Flight Form attributes
  const [flightNo, setFlightNo] = useState('');
  const [airline, setAirline] = useState('IndiGo');
  const [fromCode, setFromCode] = useState('DEL');
  const [toCode, setToCode] = useState('GOI');
  const [departureTime, setDepartureTime] = useState('10:00');
  const [arrivalTime, setArrivalTime] = useState('12:15');
  const [duration, setDuration] = useState('2h 15m');
  const [price, setPrice] = useState(4800);
  const [cabinClass, setCabinClass] = useState<'Economy' | 'Premium Economy' | 'Business' | 'First'>('Economy');
  const [seatsLeft, setSeatsLeft] = useState(6);

  // Hotel Form attributes
  const [hotelName, setHotelName] = useState('');
  const [hotelCity, setHotelCity] = useState('Goa');
  const [hotelPrice, setHotelPrice] = useState(6200);
  const [hotelStars, setHotelStars] = useState(4);
  const [hotelArea, setHotelArea] = useState('Calangute');
  const [hotelRating, setHotelRating] = useState(8.8);
  const [hotelAmenities, setHotelAmenities] = useState('Free Wi-Fi, Swimming Pool, Air Conditioning');
  const [roomsAvailable, setRoomsAvailable] = useState(3);

  // Open Flight Form for Register or Edit
  const handleOpenFlightForm = (flight?: Flight) => {
    if (flight) {
      setEditingFlight(flight);
      setFlightNo(flight.flightNo);
      setAirline(flight.airline);
      setFromCode(flight.fromCode);
      setToCode(flight.toCode);
      setDepartureTime(flight.departureTime);
      setArrivalTime(flight.arrivalTime);
      setDuration(flight.duration);
      setPrice(flight.price);
      setCabinClass(flight.class);
      setSeatsLeft(flight.seatsLeft);
    } else {
      setEditingFlight(null);
      setFlightNo('UK-904');
      setAirline('Vistara');
      setFromCode('DEL');
      setToCode('BOM');
      setDepartureTime('18:00');
      setArrivalTime('20:10');
      setDuration('2h 10m');
      setPrice(6400);
      setCabinClass('Economy');
      setSeatsLeft(8);
    }
    setShowFlightForm(true);
    setShowHotelForm(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open Hotel Form for Register or Edit
  const handleOpenHotelForm = (hotel?: Hotel) => {
    if (hotel) {
      setEditingHotel(hotel);
      setHotelName(hotel.name);
      setHotelCity(hotel.city);
      setHotelPrice(hotel.price);
      setHotelStars(hotel.stars);
      setHotelArea(hotel.area);
      setHotelRating(hotel.rating);
      setHotelAmenities(hotel.amenities.join(', '));
      setRoomsAvailable(hotel.roomsAvailable);
    } else {
      setEditingHotel(null);
      setHotelName('The Royal Emerald Heritage');
      setHotelCity('Mumbai');
      setHotelPrice(7400);
      setHotelStars(5);
      setHotelArea('Juhu Beach');
      setHotelRating(9.0);
      setHotelAmenities('Free Wi-Fi, Room Service, Swimming Pool, Spa & Wellness');
      setRoomsAvailable(4);
    }
    setShowHotelForm(true);
    setShowFlightForm(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Save Flight (Create or Edit PUT simulate)
  const handleSaveFlightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mockFlightId = editingFlight ? editingFlight.id : `FL-GEN-${Math.floor(100 + Math.random() * 899)}`;
    
    const flightPayload: Flight = {
      id: mockFlightId,
      airline,
      flightNo,
      fromCode: fromCode.toUpperCase(),
      from: fromCode.toUpperCase() === 'DEL' ? 'New Delhi' : fromCode.toUpperCase() === 'GOI' ? 'Goa' : fromCode.toUpperCase() === 'BOM' ? 'Mumbai' : 'Bengaluru',
      toCode: toCode.toUpperCase(),
      to: toCode.toUpperCase() === 'GOI' ? 'Goa' : toCode.toUpperCase() === 'BOM' ? 'Mumbai' : toCode.toUpperCase() === 'DEL' ? 'New Delhi' : 'Bengaluru',
      departureTime,
      arrivalTime,
      duration,
      stops: 0,
      price: Number(price),
      class: cabinClass,
      seatsLeft: Number(seatsLeft),
      refundable: true,
      logo: airline === 'IndiGo' ? 'bg-blue-600' : airline === 'Air India' ? 'bg-red-600' : 'bg-purple-850',
      airlineCode: airline === 'IndiGo' ? '6E' : airline === 'Air India' ? 'AI' : 'UK'
    };

    addOrUpdateFlight(flightPayload, !!editingFlight);
    setSuccessMsg(editingFlight ? `Flight ${flightNo} updated successfully (PUT /api/admin/flights/${flightPayload.id})` : `Flight ${flightNo} registered successfully (POST /api/admin/flights)`);
    setShowFlightForm(false);
    setEditingFlight(null);
    clearAlert();
  };

  // Save Hotel (Create or Edit PUT simulate)
  const handleSaveHotelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mockHotelId = editingHotel ? editingHotel.id : `HT-GEN-${Math.floor(100 + Math.random() * 899)}`;
    const parsedAmenities = hotelAmenities.split(',').map(item => item.trim()).filter(Boolean);

    const hotelPayload: Hotel = {
      id: mockHotelId,
      name: hotelName,
      city: hotelCity,
      price: Number(hotelPrice),
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
      rating: Number(hotelRating),
      ratingText: Number(hotelRating) >= 9.0 ? 'Outstanding' : 'Excellent',
      reviewsCount: editingHotel ? editingHotel.reviewsCount : 124,
      stars: Number(hotelStars),
      area: hotelArea,
      description: 'Elegant accommodations offering full-scale bespoke amenities, prime city layouts, and personalized elite member benefits.',
      roomsAvailable: Number(roomsAvailable),
      amenities: parsedAmenities
    };

    addOrUpdateHotel(hotelPayload, !!editingHotel);
    setSuccessMsg(editingHotel ? `Hotel ${hotelName} updated successfully (PUT /api/admin/hotels/${hotelPayload.id})` : `Hotel ${hotelName} registered successfully (POST /api/admin/hotels)`);
    setShowHotelForm(false);
    setEditingHotel(null);
    clearAlert();
  };

  const deleteFlightHandler = (id: string) => {
    if (window.confirm(`Are you sure you want to delete flight ID ${id}? (DELETE /api/admin/flights/${id})`)) {
      deleteFlight(id);
      setSuccessMsg(`Flight ${id} successfully purged from database.`);
      clearAlert();
    }
  };

  const deleteHotelHandler = (id: string) => {
    if (window.confirm(`Are you sure you want to delete hotel ID ${id}? (DELETE /api/admin/hotels/${id})`)) {
      deleteHotel(id);
      setSuccessMsg(`Hotel ${id} successfully purged from database.`);
      clearAlert();
    }
  };

  const clearAlert = () => {
    setTimeout(() => {
      setSuccessMsg('');
    }, 4000);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:px-8 font-sans" id="admin-workspace">
      {/* Admin HUD Greeting card */}
      <div className="bg-slate-900 text-white rounded-xl border border-slate-800 p-5 shadow-lg mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-md text-[9px] font-black font-mono text-amber-400 uppercase tracking-widest leading-none">
            <Shield className="h-3 w-3 fill-amber-400" />
            <span>Voyage Central System Operations Dashboard</span>
          </div>
          <h2 className="font-display font-black text-xl uppercase tracking-tight mt-1">Administrator Control Desk</h2>
          <p className="text-[11.5px] text-slate-400 mt-0.5">Edit flights, manage hotel vacancies, oversee passenger logs and track transactions in real time.</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <div className="border border-slate-800 bg-slate-950 px-3.5 py-2 rounded-lg text-center min-w-20">
            <span className="block text-[8px] uppercase font-black tracking-widest text-slate-500">Live Flights</span>
            <span className="font-mono text-base font-black text-brand-coral">{flightsResults.length}</span>
          </div>
          <div className="border border-slate-800 bg-slate-950 px-3.5 py-2 rounded-lg text-center min-w-20">
            <span className="block text-[8px] uppercase font-black tracking-widest text-slate-500">Hotels Listed</span>
            <span className="font-mono text-base text-teal-400 font-bold">{hotelsResults.length}</span>
          </div>
          <div className="border border-slate-800 bg-slate-950 px-3.5 py-2 rounded-lg text-center min-w-20">
            <span className="block text-[8px] uppercase font-black tracking-widest text-slate-500">Total Orders</span>
            <span className="font-mono text-base text-indigo-400 font-bold">{bookingsHistory.length}</span>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="mb-6 flex items-center space-x-2 rounded-lg bg-emerald-50 border border-emerald-200 text-slate-800 text-xs p-3.5 font-bold animate-pulse">
          <Check className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* CORE INPUT EDITING FORMS - FLIGHTS */}
      {showFlightForm && (
        <div className="bg-white rounded-xl border border-slate-250 p-5 shadow-xs mb-6 focus-shadow transition-all">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center space-x-2">
              <Plane className="h-5 w-5 -rotate-45 text-brand-coral" />
              <h3 className="font-display font-black text-sm uppercase tracking-wider text-slate-900">
                {editingFlight ? `Edit Existing Flight Detail (ID: ${editingFlight.id})` : 'Register a New Elite Flight Record'}
              </h3>
            </div>
            <button
              onClick={() => { setShowFlightForm(false); setEditingFlight(null); }}
              className="text-xs uppercase tracking-wider font-extrabold text-slate-400 hover:text-slate-800 cursor-pointer text-[10px]"
            >
              Cancel Edit
            </button>
          </div>

          <form onSubmit={handleSaveFlightSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[9px] uppercase font-black text-slate-450 tracking-wider mb-1">
                Flight Number ID
              </label>
              <input
                type="text"
                required
                value={flightNo}
                onChange={(e) => setFlightNo(e.target.value)}
                placeholder="EK-503"
                className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold px-3 py-2 rounded-lg text-slate-800 outline-none focus:bg-white focus:ring-1 focus:ring-brand-coral focus:border-brand-coral"
              />
            </div>

            <div>
              <label className="block text-[9px] uppercase font-black text-slate-450 tracking-wider mb-1">
                Airline Carrier Company
              </label>
              <select
                value={airline}
                onChange={(e) => setAirline(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold px-3 py-2 rounded-lg text-slate-800 outline-none"
              >
                <option value="IndiGo">IndiGo</option>
                <option value="Air India">Air India</option>
                <option value="Vistara">Vistara</option>
              </select>
            </div>

            <div>
              <label className="block text-[9px] uppercase font-black text-slate-450 tracking-wider mb-1">
                Cabin Class Level Tier
              </label>
              <select
                value={cabinClass}
                onChange={(e) => setCabinClass(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold px-3 py-2 rounded-lg text-slate-800 outline-none"
              >
                <option value="Economy">Economy</option>
                <option value="Premium Economy">Premium Economy</option>
                <option value="Business">Business</option>
                <option value="First">First Class</option>
              </select>
            </div>

            <div>
              <label className="block text-[9px] uppercase font-black text-slate-450 tracking-wider mb-1">
                Source Code (From)
              </label>
              <input
                type="text"
                required
                maxLength={3}
                value={fromCode}
                onChange={(e) => setFromCode(e.target.value.toUpperCase())}
                placeholder="DEL"
                className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold px-3 py-2 rounded-lg text-slate-800 outline-none focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[9px] uppercase font-black text-slate-450 tracking-wider mb-1">
                Destination Code (To)
              </label>
              <input
                type="text"
                required
                maxLength={3}
                value={toCode}
                onChange={(e) => setToCode(e.target.value.toUpperCase())}
                placeholder="GOI"
                className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold px-3 py-2 rounded-lg text-slate-800 outline-none focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[9px] uppercase font-black text-slate-450 tracking-wider mb-1">
                Flight Fare Price (₹ INR)
              </label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="5400"
                className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold px-3 py-2 rounded-lg text-slate-800 outline-none"
              />
            </div>

            <div>
              <label className="block text-[9px] uppercase font-black text-slate-450 tracking-wider mb-1">
                Departure Time (24h format)
              </label>
              <input
                type="text"
                required
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                placeholder="10:05"
                className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold px-3 py-2 rounded-lg text-slate-800 outline-none"
              />
            </div>

            <div>
              <label className="block text-[9px] uppercase font-black text-slate-450 tracking-wider mb-1">
                Arrival Time (24h format)
              </label>
              <input
                type="text"
                required
                value={arrivalTime}
                onChange={(e) => setArrivalTime(e.target.value)}
                placeholder="12:10"
                className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold px-3 py-2 rounded-lg text-slate-800 outline-none"
              />
            </div>

            <div>
              <label className="block text-[9px] uppercase font-black text-slate-450 tracking-wider mb-1">
                Duration String
              </label>
              <input
                type="text"
                required
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="2h 05m"
                className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold px-3 py-2 rounded-lg text-slate-800 outline-none"
              />
            </div>

            <div className="md:col-span-3 flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => { setShowFlightForm(false); setEditingFlight(null); }}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-[10px] font-black uppercase tracking-wider rounded-lg cursor-pointer text-slate-505"
              >
                Discard
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#0a223d] hover:bg-brand-coral text-white text-[10px] font-black uppercase tracking-widest rounded-lg cursor-pointer transition-colors shadow-xs"
              >
                {editingFlight ? 'Commit Updates (PUT)' : 'Register Flight (POST)'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CORE INPUT EDITING FORMS - HOTELS */}
      {showHotelForm && (
        <div className="bg-white rounded-xl border border-slate-250 p-5 shadow-xs mb-6 focus-shadow transition-all">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center space-x-2">
              <HotelIcon className="h-5 w-5 text-indigo-600" />
              <h3 className="font-display font-black text-sm uppercase tracking-wider text-slate-900">
                {editingHotel ? `Edit Hotel Booking vacancy (ID: ${editingHotel.id})` : 'Register a New Resort Partner'}
              </h3>
            </div>
            <button
              onClick={() => { setShowHotelForm(false); setEditingHotel(null); }}
              className="text-xs uppercase tracking-wider font-extrabold text-slate-400 hover:text-slate-800 cursor-pointer text-[10px]"
            >
              Cancel Edit
            </button>
          </div>

          <form onSubmit={handleSaveHotelSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-[9px] uppercase font-black text-slate-450 tracking-wider mb-1">
                Hotel/Resort Name
              </label>
              <input
                type="text"
                required
                value={hotelName}
                onChange={(e) => setHotelName(e.target.value)}
                placeholder="The Grand Taj Retreat"
                className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold px-3 py-2 rounded-lg text-slate-800 outline-none focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[9px] uppercase font-black text-slate-450 tracking-wider mb-1">
                City Destination Location
              </label>
              <select
                value={hotelCity}
                onChange={(e) => setHotelCity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold px-3 py-2 rounded-lg text-slate-800 outline-none"
              >
                <option value="Goa">Goa</option>
                <option value="Mumbai">Mumbai</option>
                <option value="New Delhi">New Delhi</option>
                <option value="Singapore">Singapore</option>
              </select>
            </div>

            <div>
              <label className="block text-[9px] uppercase font-black text-slate-450 tracking-wider mb-1">
                Sub-area Region Zone
              </label>
              <input
                type="text"
                required
                value={hotelArea}
                onChange={(e) => setHotelArea(e.target.value)}
                placeholder="Connaught Place / Colaba"
                className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold px-3 py-2 rounded-lg text-slate-800 outline-none"
              />
            </div>

            <div>
              <label className="block text-[9px] uppercase font-black text-slate-450 tracking-wider mb-1">
                Star Classification Rating
              </label>
              <select
                value={hotelStars}
                onChange={(e) => setHotelStars(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold px-3 py-2 rounded-lg text-slate-800 outline-none"
              >
                <option value="3">3 Star Mid-scale</option>
                <option value="4">4 Star Premium</option>
                <option value="5">5 Star Ultra-Luxurious</option>
              </select>
            </div>

            <div>
              <label className="block text-[9px] uppercase font-black text-slate-450 tracking-wider mb-1">
                Room Price Per Night (₹ INR)
              </label>
              <input
                type="number"
                required
                value={hotelPrice}
                onChange={(e) => setHotelPrice(Number(e.target.value))}
                placeholder="8500"
                className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold px-3 py-2 rounded-lg text-slate-800 outline-none"
              />
            </div>

            <div>
              <label className="block text-[9px] uppercase font-black text-slate-450 tracking-wider mb-1">
                User Review Rating Score (0 to 10)
              </label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="10"
                required
                value={hotelRating}
                onChange={(e) => setHotelRating(Number(e.target.value))}
                placeholder="9.2"
                className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold px-3 py-2 rounded-lg text-slate-800 outline-none"
              />
            </div>

            <div>
              <label className="block text-[9px] uppercase font-black text-slate-450 tracking-wider mb-1">
                Available Empty Rooms Count
              </label>
              <input
                type="number"
                required
                value={roomsAvailable}
                onChange={(e) => setRoomsAvailable(Number(e.target.value))}
                placeholder="5"
                className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold px-3 py-2 rounded-lg text-slate-800 outline-none"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-[9px] uppercase font-black text-slate-450 tracking-wider mb-1">
                Amenities (comma separated list string)
              </label>
              <input
                type="text"
                required
                value={hotelAmenities}
                onChange={(e) => setHotelAmenities(e.target.value)}
                placeholder="Free Wi-Fi, Swimming Pool, Air Conditioning"
                className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold px-3 py-2 rounded-lg text-slate-800 outline-none focus:bg-white"
              />
            </div>

            <div className="md:col-span-3 flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => { setShowHotelForm(false); setEditingHotel(null); }}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-[10px] font-black uppercase tracking-wider rounded-lg cursor-pointer text-slate-505"
              >
                Discard
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#0a223d] hover:bg-brand-coral text-white text-[10px] font-black uppercase tracking-widest rounded-lg cursor-pointer transition-colors shadow-xs"
              >
                {editingHotel ? 'Commit Updates (PUT)' : 'Register Hotel Partner (POST)'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SUB PANELS CONTROLS BAR */}
      <div className="flex border-b border-slate-200 mb-5 font-sans overflow-x-auto">
        {[
          { id: 'flights', label: 'Flights Master DB', icon: Plane, count: flightsResults.length },
          { id: 'hotels', label: 'Hotel Vacancies DB', icon: HotelIcon, count: hotelsResults.length },
          { id: 'bookings', label: 'Customer Order Book', icon: BookOpen, count: bookingsHistory.length },
        ].map((subT) => {
          const isActive = activeAdminSubTab === subT.id;
          const Icon = subT.icon;
          return (
            <button
              key={subT.id}
              onClick={() => {
                setActiveAdminSubTab(subT.id as any);
                setShowFlightForm(false);
                setShowHotelForm(false);
              }}
              className={`flex-1 sm:flex-none flex items-center justify-center space-x-1.5 py-3 px-4 border-b-2 font-black text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
                isActive
                  ? 'border-brand-coral text-brand-coral'
                  : 'border-transparent text-slate-450 hover:text-slate-700 hover:border-slate-200'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{subT.label}</span>
              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                isActive ? 'bg-brand-coral text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                {subT.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* SUITABLE RENDER CONTROLS */}
      {activeAdminSubTab === 'flights' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-3xs">
          {/* Header row elements */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="text-[11px] uppercase font-black text-slate-500 tracking-wider">Registered Flight Classes Listings</span>
            <button
              onClick={() => handleOpenFlightForm()}
              className="inline-flex items-center space-x-1 bg-brand-coral text-white font-black uppercase text-[9px] tracking-widest px-3 py-1.5 rounded cursor-pointer transition-all"
            >
              <Plus className="h-3 w-3" />
              <span>Register Flight (POST)</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100 text-[10px] uppercase font-black text-slate-450 tracking-wider">
                  <th className="p-3">Carrier / No</th>
                  <th className="p-3">Route Terminal</th>
                  <th className="p-3">Departure/Arrival</th>
                  <th className="p-3">Fare Cost</th>
                  <th className="p-3 text-center">Empty Seats</th>
                  <th className="p-3 text-right">Database Admin Acts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {flightsResults.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">No active flights registered in system. Use post method block above.</td>
                  </tr>
                ) : (
                  flightsResults.map((fl) => (
                    <tr key={fl.id} className="hover:bg-slate-50/50">
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          <span className={`${fl.logo} text-white px-2 py-0.5 rounded text-[10px] font-bold`}>{fl.airlineCode}</span>
                          <div>
                            <span className="block font-black text-slate-900">{fl.flightNo}</span>
                            <span className="block text-[9px] text-slate-400 leading-none">{fl.airline} | {fl.class}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-mono text-slate-900">{fl.fromCode}</span>
                          <ArrowRight className="h-3 w-3 text-slate-400" />
                          <span className="font-mono text-slate-900">{fl.toCode}</span>
                        </div>
                        <span className="block text-[9px] text-slate-400 leading-none font-medium truncate max-w-28">{fl.from} to {fl.to}</span>
                      </td>
                      <td className="p-3 text-slate-600 font-mono">
                        <div>⏱️ {fl.departureTime} → {fl.arrivalTime}</div>
                        <span className="text-[9px] text-slate-400 block leading-none mt-0.5">Duration: {fl.duration}</span>
                      </td>
                      <td className="p-3 font-mono text-slate-900 font-black">
                        ₹{fl.price.toLocaleString()}
                      </td>
                      <td className="p-3 text-center font-mono">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          fl.seatsLeft <= 2 ? 'bg-red-50 text-red-700' : 'bg-slate-50 text-slate-750'
                        }`}>
                          {fl.seatsLeft} Seats Left
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex justify-end items-center space-x-1.5">
                          <button
                            onClick={() => handleOpenFlightForm(fl)}
                            className="p-1.5 border border-slate-200 hover:border-brand-coral hover:bg-orange-50 text-slate-500 hover:text-brand-coral rounded cursor-pointer transition-all"
                            title="Edit (PUT)"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => deleteFlightHandler(fl.id)}
                            className="p-1.5 border border-slate-200 hover:border-red-400 hover:bg-red-50 text-slate-500 hover:text-red-650 rounded cursor-pointer transition-all"
                            title="Purge Object (DELETE)"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeAdminSubTab === 'hotels' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-3xs">
          {/* Header row elements */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="text-[11px] uppercase font-black text-slate-500 tracking-wider">Registered Hotel Vacancies Listings</span>
            <button
              onClick={() => handleOpenHotelForm()}
              className="inline-flex items-center space-x-1 bg-brand-coral text-white font-black uppercase text-[9px] tracking-widest px-3 py-1.5 rounded cursor-pointer transition-all"
            >
              <Plus className="h-3 w-3" />
              <span>Register Hotel Partner (POST)</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100 text-[10px] uppercase font-black text-slate-450 tracking-wider">
                  <th className="p-3">Resort / Partner Name</th>
                  <th className="p-3">Location City</th>
                  <th className="p-3">Rating Status/Stars</th>
                  <th className="p-3">Premium Nightly Cost</th>
                  <th className="p-3 text-center">Empty Vacancies</th>
                  <th className="p-3 text-right">Database Admin Acts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {hotelsResults.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">No active hotel properties stored. Use form control.</td>
                  </tr>
                ) : (
                  hotelsResults.map((ht) => (
                    <tr key={ht.id} className="hover:bg-slate-50/50">
                      <td className="p-3">
                        <div>
                          <span className="block font-black text-slate-900 text-xs">{ht.name}</span>
                          <span className="block text-[10px] text-slate-400 leading-none truncate max-w-xs">{ht.description}</span>
                        </div>
                      </td>
                      <td className="p-3 text-slate-700">
                        <div>📍 {ht.city}</div>
                        <span className="block text-[9px] text-slate-400 leading-none mt-0.5 font-medium">Region: {ht.area}</span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-1 font-bold text-slate-800 text-xs">
                          <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded text-[10px]">{ht.rating} ★</span>
                          <span className="text-[10px] text-slate-400 leading-none font-medium">({ht.reviewsCount} reviews)</span>
                        </div>
                        <div className="flex text-amber-400 mt-0.5 h-3">
                          {Array.from({ length: ht.stars }).map((_, idx) => (
                            <Star key={idx} className="h-3 w-3 fill-amber-400" />
                          ))}
                        </div>
                      </td>
                      <td className="p-3 font-mono text-slate-900 font-black">
                        ₹{ht.price.toLocaleString()}
                        <span className="block text-[8px] uppercase tracking-wider text-slate-400 leading-none font-bold">Per Night Unit</span>
                      </td>
                      <td className="p-3 text-center font-mono">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ht.roomsAvailable <= 1 ? 'bg-rose-50 text-rose-700' : 'bg-slate-50 text-slate-750'
                        }`}>
                          {ht.roomsAvailable} Rooms Left
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex justify-end items-center space-x-1.5">
                          <button
                            onClick={() => handleOpenHotelForm(ht)}
                            className="p-1.5 border border-slate-200 hover:border-brand-coral hover:bg-orange-50 text-slate-500 hover:text-brand-coral rounded cursor-pointer transition-all"
                            title="Edit Hotel Property PUT"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => deleteHotelHandler(ht.id)}
                            className="p-1.5 border border-slate-200 hover:border-red-400 hover:bg-red-50 text-slate-500 hover:text-red-650 rounded cursor-pointer transition-all"
                            title="Purge Partner DELETE"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeAdminSubTab === 'bookings' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-3xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <span className="text-[11px] uppercase font-black text-slate-500 tracking-wider">Supervised Itineraries Order Ledger</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100 text-[10px] uppercase font-black text-slate-450 tracking-wider">
                  <th className="p-3">Transaction PNR Ledger</th>
                  <th className="p-3">Reservation Category</th>
                  <th className="p-3">Scheduled Destination Item</th>
                  <th className="p-3">Issued Date</th>
                  <th className="p-3 text-center">Status Label</th>
                  <th className="p-3 text-right">Charged Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {bookingsHistory.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-450">The transaction ledger is completely clean. No client orders captured.</td>
                  </tr>
                ) : (
                  bookingsHistory.map((bk) => (
                    <tr key={bk.id} className="hover:bg-slate-50/50">
                      <td className="p-3 font-mono font-black text-slate-900">
                        {bk.id}
                      </td>
                      <td className="p-3 text-slate-600">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border tracking-wider ${
                          bk.type === 'flight' 
                            ? 'bg-orange-50 text-brand-coral border-orange-100' 
                            : 'bg-indigo-50 text-indigo-750 border-indigo-100'
                        }`}>
                          {bk.type}
                        </span>
                      </td>
                      <td className="p-3 text-slate-900 font-bold">
                        {bk.type === 'flight' 
                          ? `${(bk.item as Flight).fromCode} → ${(bk.item as Flight).toCode} (${(bk.item as Flight).flightNo})`
                          : `${(bk.item as Hotel).name} (Checkin: ${bk.hotelDetails?.checkIn})`
                        }
                      </td>
                      <td className="p-3 text-slate-500 font-mono">
                        {bk.bookingDate}
                      </td>
                      <td className="p-3 text-center font-bold">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                          bk.status === 'upcoming' 
                            ? 'bg-amber-50 text-amber-700' 
                            : bk.status === 'completed'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-red-50 text-red-700'
                        }`}>
                          {bk.status}
                        </span>
                      </td>
                      <td className="p-3 text-right font-mono text-slate-900 font-black">
                        ₹{bk.totalPrice.toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
