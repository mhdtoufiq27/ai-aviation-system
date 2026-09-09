import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Plane,
  Calendar,
  Users,
  Clock,
  ArrowRight,
  Filter,
  CheckCircle,
  Sparkles,
  Ticket,
  X
} from 'lucide-react';
import { flightApi, airportApi, bookingApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const SearchFlights = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [airports, setAirports] = useState([]);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);

  // Search parameters
  const [fromCity, setFromCity] = useState('BLR');
  const [toCity, setToCity] = useState('BOM');
  const [departureDate, setDepartureDate] = useState(new Date().toISOString().split('T')[0]);
  const [returnDate, setReturnDate] = useState('');
  const [passengersCount, setPassengersCount] = useState(1);
  const [tripType, setTripType] = useState('oneWay');

  // Booking seat selector modal
  const [bookingModalFlight, setBookingModalFlight] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState('14A');
  const [cabinClass, setCabinClass] = useState('Economy');
  const [bookingSuccess, setBookingSuccess] = useState(null);

  useEffect(() => {
    airportApi.getAll().then((res) => {
      if (res.data?.success) setAirports(res.data.airports || []);
    });
    handleSearch();
  }, []);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await flightApi.getAll({
        origin: fromCity,
        destination: toCity,
        limit: 50,
      });
      if (res.data?.success) {
        setFlights(res.data.flights || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (flight) => {
    setBookingModalFlight(flight);
    setSelectedSeat('14A');
    setBookingSuccess(null);
  };

  const handleConfirmReservation = async () => {
    try {
      const priceMultiplier =
        cabinClass === 'First Class' ? 3.5 : cabinClass === 'Business' ? 2.2 : cabinClass === 'Premium Economy' ? 1.4 : 1.0;
      const totalAmount = Math.round(bookingModalFlight.basePrice * priceMultiplier);

      const res = await bookingApi.create({
        flightId: bookingModalFlight._id,
        seatNumber: selectedSeat,
        cabinClass,
        passengerData: {
          fullName: user?.name || 'Aviation Traveler',
          email: user?.email || 'passenger@skyflow.com',
          phone: user?.phone || '+91 99001 00004',
          passportNumber: user?.passportNumber || 'Z8942109',
          nationality: user?.nationality || 'Indian',
        },
        totalAmount,
      });

      if (res.data?.success) {
        setBookingSuccess(res.data.booking);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Reservation error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-black text-white flex items-center gap-2">
          <Search className="w-5 h-5 text-cyan-400" />
          Search Commercial Flights & Fares
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Real-time flight seat availability, low-fare calendar, and instant electronic reservation.
        </p>
      </div>

      {/* Flight Search Form Box */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-slate-900 via-[#0a1526] to-slate-900 shadow-glow-card">
        {/* Trip Type Selector */}
        <div className="flex items-center space-x-4 mb-4 text-xs font-semibold">
          <label className="flex items-center space-x-1.5 cursor-pointer text-slate-200">
            <input
              type="radio"
              name="tripType"
              checked={tripType === 'oneWay'}
              onChange={() => setTripType('oneWay')}
              className="accent-cyan-400"
            />
            <span>One Way</span>
          </label>
          <label className="flex items-center space-x-1.5 cursor-pointer text-slate-200">
            <input
              type="radio"
              name="tripType"
              checked={tripType === 'roundTrip'}
              onChange={() => setTripType('roundTrip')}
              className="accent-cyan-400"
            />
            <span>Round Trip</span>
          </label>
        </div>

        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {/* From */}
          <div>
            <label className="block text-slate-400 font-medium mb-1">From (Origin)</label>
            <select
              value={fromCity}
              onChange={(e) => setFromCity(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 font-medium focus:outline-none focus:border-cyan-400"
            >
              {airports.map((a) => (
                <option key={a._id} value={a.iataCode}>{a.iataCode} - {a.city} ({a.country})</option>
              ))}
            </select>
          </div>

          {/* To */}
          <div>
            <label className="block text-slate-400 font-medium mb-1">To (Destination)</label>
            <select
              value={toCity}
              onChange={(e) => setToCity(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 font-medium focus:outline-none focus:border-cyan-400"
            >
              {airports.map((a) => (
                <option key={a._id} value={a.iataCode}>{a.iataCode} - {a.city} ({a.country})</option>
              ))}
            </select>
          </div>

          {/* Departure Date */}
          <div>
            <label className="block text-slate-400 font-medium mb-1">Departure Date</label>
            <input
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 font-medium focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Return Date (Optional) */}
          <div>
            <label className="block text-slate-400 font-medium mb-1">Return Date</label>
            <input
              type="date"
              disabled={tripType === 'oneWay'}
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 font-medium focus:outline-none focus:border-cyan-400 disabled:opacity-40"
            />
          </div>

          {/* Passengers & Action Button */}
          <div>
            <label className="block text-slate-400 font-medium mb-1">Travelers</label>
            <select
              value={passengersCount}
              onChange={(e) => setPassengersCount(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 font-medium focus:outline-none focus:border-cyan-400"
            >
              <option value="1">1 Passenger (Adult)</option>
              <option value="2">2 Passengers</option>
              <option value="3">3 Passengers</option>
              <option value="4">4 Passengers</option>
            </select>
          </div>

          <div className="sm:col-span-2 lg:col-span-5 flex justify-end mt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs rounded-xl shadow-glow-cyan transition-all flex items-center space-x-2"
            >
              <Search className="w-4 h-4" />
              <span>Search Available Flights</span>
            </button>
          </div>
        </form>
      </div>

      {/* Available Flights List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>Found {flights.length} flights for route {fromCity} → {toCity}</span>
          <span>Fares include taxes & charges</span>
        </div>

        {flights.length === 0 ? (
          <div className="glass-panel p-12 text-center text-xs text-slate-500 rounded-2xl">
            {loading ? 'Searching airline schedules & inventory...' : 'No flights currently scheduled for this exact route pair. Try changing destination (e.g. BLR → BOM or DEL → DXB).'}
          </div>
        ) : (
          flights.map((flight) => {
            const availableSeats = Math.max(8, (flight.totalSeats || 180) - (flight.bookedSeatsCount || 120));
            return (
              <div
                key={flight._id}
                className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 text-xs"
              >
                {/* Airline & Number */}
                <div className="flex items-center space-x-3 w-48">
                  <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-300 text-lg">
                    ✈️
                  </div>
                  <div>
                    <div className="font-extrabold text-sm text-white">
                      {flight.airline?.name || 'Air India'}
                    </div>
                    <div className="text-[11px] font-mono text-cyan-400 font-bold">
                      {flight.flightNumber}
                    </div>
                  </div>
                </div>

                {/* Route & Times */}
                <div className="flex-1 grid grid-cols-3 items-center gap-4 text-center">
                  <div className="text-left">
                    <div className="text-lg font-black text-white font-mono">
                      {new Date(flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="text-xs font-bold text-cyan-300">{flight.departureAirport?.iataCode}</div>
                    <div className="text-[10px] text-slate-400 truncate">{flight.departureAirport?.city}</div>
                  </div>

                  <div>
                    <div className="text-[10px] font-mono text-slate-400">1h 45m NON-STOP</div>
                    <div className="w-full flex items-center my-1">
                      <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                      <div className="flex-1 border-t border-dashed border-cyan-500/40"></div>
                      <Plane className="w-3.5 h-3.5 text-cyan-400 mx-1 transform rotate-90" />
                      <div className="flex-1 border-t border-dashed border-cyan-500/40"></div>
                      <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                    </div>
                    <div className="text-[10px] text-emerald-400 font-mono font-bold">On Time</div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-black text-white font-mono">
                      {new Date(flight.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="text-xs font-bold text-cyan-300">{flight.arrivalAirport?.iataCode}</div>
                    <div className="text-[10px] text-slate-400 truncate">{flight.arrivalAirport?.city}</div>
                  </div>
                </div>

                {/* Pricing & Booking CTA */}
                <div className="flex items-center justify-between lg:justify-end gap-6 w-full lg:w-auto border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-800">
                  <div>
                    <div className="text-[10px] text-slate-500 font-mono">AVAILABLE SEATS</div>
                    <div className="text-xs text-emerald-400 font-mono font-bold">{availableSeats} seats left</div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-black text-cyan-300 font-mono">
                      ${flight.basePrice}
                    </div>
                    <div className="text-[10px] text-slate-400">per traveler</div>
                  </div>

                  <button
                    onClick={() => handleBookNow(flight)}
                    className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs rounded-xl shadow-glow-cyan transition-all"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Interactive Seat Selection & Booking Confirmation Modal */}
      {bookingModalFlight && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-2xl p-6 border border-slate-700 shadow-2xl relative text-xs">
            <button
              onClick={() => setBookingModalFlight(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {bookingSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white">Flight Confirmed!</h3>
                <p className="text-xs text-slate-300">
                  Booking Reference: <strong className="text-cyan-300 font-mono">{bookingSuccess.bookingReference}</strong>
                </p>
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 font-mono text-xs">
                  Flight {bookingModalFlight.flightNumber} • Seat {selectedSeat} • {cabinClass}
                </div>
                <div className="flex justify-center space-x-3 pt-2">
                  <button
                    onClick={() => navigate('/boarding-pass')}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold rounded-lg shadow-glow-cyan"
                  >
                    View Boarding Pass
                  </button>
                  <button
                    onClick={() => setBookingModalFlight(null)}
                    className="px-4 py-2 bg-slate-800 text-slate-200 rounded-lg"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-cyan-400" />
                    Reserve Seat on {bookingModalFlight.flightNumber}
                  </h3>
                  <p className="text-slate-400 text-xs">
                    {bookingModalFlight.departureAirport?.city} ({bookingModalFlight.departureAirport?.iataCode}) → {bookingModalFlight.arrivalAirport?.city} ({bookingModalFlight.arrivalAirport?.iataCode})
                  </p>
                </div>

                {/* Cabin Class Selection */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">Select Cabin Class</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Economy', 'Business', 'First Class'].map((tier) => (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => setCabinClass(tier)}
                        className={`p-2 rounded-xl text-center font-semibold border transition-all ${
                          cabinClass === tier
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-glow-cyan'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {tier}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Seat Selector Chips */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">Pick Desired Seat</label>
                  <div className="grid grid-cols-6 gap-1.5 font-mono text-[11px]">
                    {['12A', '12B', '12C', '12D', '12E', '12F', '14A', '14B', '14C', '14D', '14E', '14F'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelectedSeat(s)}
                        className={`py-2 rounded-lg text-center font-bold transition-all ${
                          selectedSeat === s
                            ? 'bg-cyan-400 text-black shadow-glow-cyan'
                            : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-cyan-400'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Passenger Info Summary */}
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-[11px] text-slate-300">
                  <div>Passenger: <strong className="text-white">{user?.name || 'Aviation Traveler'}</strong></div>
                  <div className="mt-0.5">Passport: <span className="font-mono text-cyan-300">{user?.passportNumber || 'Z8942109'}</span></div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                  <div className="font-mono">
                    <span className="text-slate-400">Total: </span>
                    <span className="text-lg font-black text-cyan-300">
                      ${Math.round(bookingModalFlight.basePrice * (cabinClass === 'First Class' ? 3.5 : cabinClass === 'Business' ? 2.2 : 1.0))}
                    </span>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => setBookingModalFlight(null)}
                      className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmReservation}
                      className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold rounded-lg shadow-glow-cyan"
                    >
                      Confirm Booking
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
