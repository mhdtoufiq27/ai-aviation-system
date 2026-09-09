import React, { useState, useEffect } from 'react';
import {
  Ticket,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Plane,
  User,
  Shield,
  CreditCard,
  QrCode,
  X,
  Sparkles,
  RefreshCw,
  Printer
} from 'lucide-react';
import { bookingApi, flightApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

export const Bookings = () => {
  const { user } = useAuth();
  const { socket } = useSocket();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Booking Flow
  const [bookingWizardOpen, setBookingWizardOpen] = useState(false);
  const [flightsList, setFlightsList] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState('');
  const [cabinClass, setCabinClass] = useState('Economy');
  const [passengerForm, setPassengerForm] = useState({
    fullName: user?.name || 'Aarav Sharma',
    email: user?.email || 'aarav.sharma@flightmail.com',
    phone: '+91 98765 43210',
    passportNumber: 'Z8942109',
    nationality: 'Indian',
  });

  // Boarding Pass Modal
  const [activeBoardingPass, setActiveBoardingPass] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await bookingApi.getAll();
      if (res.data?.success) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableFlights = async () => {
    try {
      const res = await flightApi.getAll({ limit: 40 });
      if (res.data?.success) {
        setFlightsList(res.data.flights.filter((f) => f.status !== 'Cancelled' && f.status !== 'Arrived'));
      }
    } catch (err) {}
  };

  useEffect(() => {
    fetchBookings();
    fetchAvailableFlights();
  }, []);

  // Listen to socket booking creation
  useEffect(() => {
    if (!socket) return;
    const handleUpdate = () => fetchBookings();
    socket.on('bookingCreated', handleUpdate);
    socket.on('bookingUpdated', handleUpdate);

    return () => {
      socket.off('bookingCreated', handleUpdate);
      socket.off('bookingUpdated', handleUpdate);
    };
  }, [socket]);

  // Handle passenger Check-in
  const handleCheckIn = async (bookingId) => {
    try {
      await bookingApi.updateStatus(bookingId, { checkInStatus: 'Checked-in' });
      fetchBookings();
      alert('Passenger boarding pass checked in successfully!');
    } catch (err) {
      alert('Failed to update check-in status');
    }
  };

  // Handle booking cancellation
  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking and release seat?')) {
      try {
        await bookingApi.updateStatus(bookingId, { bookingStatus: 'Cancelled' });
        fetchBookings();
      } catch (err) {
        alert('Failed to cancel booking');
      }
    }
  };

  // Confirm booking
  const handleConfirmBookingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFlight || !selectedSeat) {
      alert('Please select both a flight and an available seat.');
      return;
    }

    try {
      const priceMultiplier =
        cabinClass === 'First Class' ? 3.5 : cabinClass === 'Business' ? 2.2 : cabinClass === 'Premium Economy' ? 1.4 : 1.0;
      const totalAmount = Math.round(selectedFlight.basePrice * priceMultiplier);

      const res = await bookingApi.create({
        flightId: selectedFlight._id,
        seatNumber: selectedSeat,
        cabinClass,
        passengerData: passengerForm,
        totalAmount,
      });

      if (res.data?.success) {
        setBookingWizardOpen(false);
        setActiveBoardingPass(res.data.booking);
        fetchBookings();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Booking reservation failed');
    }
  };

  // Generate fuselage seat grid (Rows 1 to 24, Letters A B C - D E F)
  const renderSeatMap = () => {
    if (!selectedFlight) return null;

    const rows = [];
    for (let r = 1; r <= 18; r++) {
      const rowSeats = ['A', 'B', 'C', 'D', 'E', 'F'].map((col) => {
        const seatCode = `${r}${col}`;
        const isOccupied = selectedFlight.occupiedSeats?.includes(seatCode);
        const isSelected = selectedSeat === seatCode;

        // Cabin tier mapping
        const isFirst = r <= 2;
        const isBiz = r >= 3 && r <= 6;
        const isPrem = r >= 7 && r <= 9;

        return (
          <button
            key={seatCode}
            type="button"
            disabled={isOccupied}
            onClick={() => {
              setSelectedSeat(seatCode);
              if (isFirst) setCabinClass('First Class');
              else if (isBiz) setCabinClass('Business');
              else if (isPrem) setCabinClass('Premium Economy');
              else setCabinClass('Economy');
            }}
            className={`w-7 h-7 rounded text-[10px] font-mono font-bold flex items-center justify-center transition-all ${
              isOccupied
                ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700/50'
                : isSelected
                ? 'bg-cyan-400 text-black shadow-glow-cyan scale-110'
                : isFirst
                ? 'bg-amber-950/60 border border-amber-500/40 text-amber-300 hover:bg-amber-900'
                : isBiz
                ? 'bg-purple-950/60 border border-purple-500/40 text-purple-300 hover:bg-purple-900'
                : 'bg-slate-900 border border-slate-700 text-slate-300 hover:border-cyan-400 hover:text-cyan-300'
            }`}
          >
            {col}
          </button>
        );
      });

      rows.push(
        <div key={r} className="flex items-center justify-center space-x-2 py-0.5">
          <span className="w-5 text-right font-mono text-[10px] text-slate-500">{r}</span>
          <div className="flex space-x-1">{rowSeats.slice(0, 3)}</div>
          <div className="w-4 text-center font-mono text-[9px] text-slate-600">|</div>
          <div className="flex space-x-1">{rowSeats.slice(3, 6)}</div>
        </div>
      );
    }

    return (
      <div className="max-h-64 overflow-y-auto p-2 bg-slate-950/80 rounded-xl border border-slate-800">
        <div className="text-[10px] font-mono text-center text-slate-400 mb-2">
          COCKPIT ▲ NOSE CONE
        </div>
        {rows}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Ticket className="w-5 h-5 text-cyan-400" />
            Passenger Bookings & Boarding Passes
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Seat assignments, cabin tier ticketing, gate check-in status, and instant barcode generation.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedFlight(flightsList[0] || null);
            setBookingWizardOpen(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black text-xs font-extrabold rounded-lg shadow-glow-cyan transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Book New Flight & Seat</span>
        </button>
      </div>

      {/* Bookings Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="text-xs font-bold text-slate-200">
            Confirmed Bookings ({bookings.length})
          </div>
          <button
            onClick={fetchBookings}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-900/90 text-slate-400 font-mono border-b border-slate-800 text-[11px]">
                <th className="py-3 px-4">REFERENCE</th>
                <th className="py-3 px-4">PASSENGER</th>
                <th className="py-3 px-4">FLIGHT</th>
                <th className="py-3 px-4">SEAT / CLASS</th>
                <th className="py-3 px-4">DEPARTURE</th>
                <th className="py-3 px-4">GATE</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4">CHECK-IN</th>
                <th className="py-3 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500 text-xs">
                    {loading ? 'Loading bookings...' : 'No reservations recorded.'}
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-extrabold text-cyan-300">
                      {b.bookingReference}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-100">{b.passenger?.fullName || 'Traveler'}</div>
                      <div className="text-[10px] text-slate-400">{b.passenger?.passportNumber}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-slate-200">{b.flight?.flightNumber}</div>
                      <div className="text-[10px] text-slate-400">
                        {b.flight?.departureAirport?.iataCode} → {b.flight?.arrivalAirport?.iataCode}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <span className="font-bold text-cyan-300">{b.seatNumber}</span>
                      <span className="text-[10px] text-slate-400 block font-sans">{b.cabinClass}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300">
                      {b.flight?.departureTime ? new Date(b.flight.departureTime).toLocaleDateString() : 'Today'}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300">
                      {b.flight?.gate || 'A1'}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                          b.bookingStatus === 'Confirmed'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                            : 'bg-rose-950 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {b.bookingStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                          b.checkInStatus === 'Checked-in'
                            ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-bold'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {b.checkInStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                      {/* View Boarding Pass */}
                      <button
                        onClick={() => setActiveBoardingPass(b)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-medium transition-colors"
                      >
                        Boarding Pass
                      </button>

                      {/* Staff Check-in Action */}
                      {b.checkInStatus !== 'Checked-in' && b.bookingStatus !== 'Cancelled' && (
                        <button
                          onClick={() => handleCheckIn(b._id)}
                          className="px-2 py-1 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 rounded text-[11px] font-medium"
                        >
                          Check-In
                        </button>
                      )}

                      {/* Cancel */}
                      {b.bookingStatus !== 'Cancelled' && (
                        <button
                          onClick={() => handleCancelBooking(b._id)}
                          className="text-rose-400 hover:text-rose-300 text-[11px] p-1"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Interactive Flight Booking & Seat Selection Wizard */}
      {bookingWizardOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-2xl rounded-2xl p-6 border border-slate-700 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <button
              onClick={() => setBookingWizardOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
              <Ticket className="w-4 h-4 text-cyan-400" />
              Book Flight Ticket & Interactive Seat Selector
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Select destination flight, choose cabin class, pick your preferred seat on the aircraft map.
            </p>

            <form onSubmit={handleConfirmBookingSubmit} className="space-y-4 text-xs">
              {/* Step 1: Select Flight */}
              <div>
                <label className="block text-slate-300 font-medium mb-1">Select Available Flight</label>
                <select
                  value={selectedFlight?._id || ''}
                  onChange={(e) => {
                    const f = flightsList.find((x) => x._id === e.target.value);
                    setSelectedFlight(f);
                    setSelectedSeat('');
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100"
                >
                  {flightsList.map((f) => (
                    <option key={f._id} value={f._id}>
                      {f.flightNumber} ({f.airline?.name}) – {f.departureAirport?.iataCode} ({f.departureAirport?.city}) → {f.arrivalAirport?.iataCode} ({f.arrivalAirport?.city}) | ${f.basePrice}
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 2: Interactive Seat Map */}
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-bold text-slate-200 flex items-center gap-2">
                    <Plane className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Aircraft Fuselage Seat Map</span>
                  </div>
                  <div className="text-[11px] font-mono text-cyan-300 font-bold">
                    SELECTED SEAT: {selectedSeat || 'None'} ({cabinClass})
                  </div>
                </div>

                {/* Seat Legend */}
                <div className="flex items-center gap-4 text-[10px] font-mono text-slate-400 mb-2">
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-slate-900 border border-slate-700"></span> Available
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-cyan-400"></span> Selected
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-slate-800 border border-slate-700"></span> Occupied
                  </div>
                </div>

                {renderSeatMap()}
              </div>

              {/* Step 3: Passenger Details */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={passengerForm.fullName}
                    onChange={(e) => setPassengerForm({ ...passengerForm, fullName: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Passport Number</label>
                  <input
                    type="text"
                    required
                    value={passengerForm.passportNumber}
                    onChange={(e) => setPassengerForm({ ...passengerForm, passportNumber: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={passengerForm.email}
                    onChange={(e) => setPassengerForm({ ...passengerForm, email: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={passengerForm.phone}
                    onChange={(e) => setPassengerForm({ ...passengerForm, phone: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"
                  />
                </div>
              </div>

              {/* Price Calculation Summary */}
              {selectedFlight && (
                <div className="p-3 bg-cyan-950/40 border border-cyan-500/30 rounded-xl flex items-center justify-between font-mono">
                  <div>
                    <span className="text-slate-400 text-xs">Estimated Fare: </span>
                    <span className="text-xs text-slate-200">
                      ${selectedFlight.basePrice} base × {cabinClass === 'First Class' ? '3.5' : cabinClass === 'Business' ? '2.2' : cabinClass === 'Premium Economy' ? '1.4' : '1.0'}
                    </span>
                  </div>
                  <div className="text-lg font-black text-cyan-300">
                    Total: $
                    {Math.round(
                      selectedFlight.basePrice *
                        (cabinClass === 'First Class' ? 3.5 : cabinClass === 'Business' ? 2.2 : cabinClass === 'Premium Economy' ? 1.4 : 1.0)
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setBookingWizardOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedSeat}
                  className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-black font-extrabold rounded-lg shadow-glow-cyan transition-all"
                >
                  Confirm Reservation & Issue Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Boarding Pass Print / Digital Pass */}
      {activeBoardingPass && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-gradient-to-b from-slate-900 to-[#08101e] rounded-3xl p-6 border-2 border-cyan-500/50 shadow-2xl relative text-xs">
            <button
              onClick={() => setActiveBoardingPass(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Boarding Pass Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-300 shadow-glow-cyan">
                  <Plane className="w-4 h-4 transform -rotate-45" />
                </div>
                <div>
                  <div className="font-extrabold text-sm text-white">SKYFLOW AIRWAYS</div>
                  <div className="text-[10px] font-mono text-cyan-400">ELECTRONIC BOARDING PASS</div>
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                REF: {activeBoardingPass.bookingReference}
              </span>
            </div>

            {/* Flight Route Banner */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between mb-4">
              <div>
                <div className="text-3xl font-black text-cyan-300 font-mono">
                  {activeBoardingPass.flight?.departureAirport?.iataCode || 'BLR'}
                </div>
                <div className="text-[11px] text-slate-400">
                  {activeBoardingPass.flight?.departureAirport?.city || 'Bengaluru'}
                </div>
              </div>

              <div className="flex-1 flex flex-col items-center px-4">
                <div className="text-[10px] font-mono text-slate-500">NON-STOP</div>
                <div className="w-full flex items-center">
                  <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                  <div className="flex-1 border-t-2 border-dashed border-cyan-500/40"></div>
                  <Plane className="w-4 h-4 text-cyan-400 mx-1 transform rotate-90" />
                  <div className="flex-1 border-t-2 border-dashed border-cyan-500/40"></div>
                  <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                </div>
                <div className="text-[10px] font-mono text-cyan-400 mt-1 font-bold">
                  {activeBoardingPass.flight?.flightNumber}
                </div>
              </div>

              <div className="text-right">
                <div className="text-3xl font-black text-cyan-300 font-mono">
                  {activeBoardingPass.flight?.arrivalAirport?.iataCode || 'DEL'}
                </div>
                <div className="text-[11px] text-slate-400">
                  {activeBoardingPass.flight?.arrivalAirport?.city || 'Delhi'}
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-4 gap-3 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 mb-4 text-center">
              <div>
                <div className="text-[10px] text-slate-500 font-mono">PASSENGER</div>
                <div className="font-bold text-slate-200 mt-0.5 truncate">
                  {activeBoardingPass.passenger?.fullName || 'Traveler'}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 font-mono">SEAT</div>
                <div className="font-black text-cyan-300 text-base mt-0.5 font-mono">
                  {activeBoardingPass.seatNumber}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 font-mono">GATE</div>
                <div className="font-bold text-amber-400 text-base mt-0.5 font-mono">
                  {activeBoardingPass.flight?.gate || 'A12'}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 font-mono">TERMINAL</div>
                <div className="font-bold text-slate-200 text-base mt-0.5 font-mono">
                  {activeBoardingPass.flight?.terminal || 'T1'}
                </div>
              </div>
            </div>

            {/* Barcode representation */}
            <div className="p-3 bg-white text-black rounded-xl text-center space-y-1">
              <div className="h-10 flex items-center justify-center space-x-1 font-mono tracking-widest text-xs">
                |||| | ||||| || |||||| | |||| ||| ||||||| || ||||| ||| |||||
              </div>
              <div className="text-[10px] font-mono tracking-wider text-slate-700">
                {activeBoardingPass.ticketCode || `TK-${activeBoardingPass.bookingReference}`}
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center text-[11px] text-slate-400">
              <span>Status: <strong className="text-emerald-400">{activeBoardingPass.checkInStatus}</strong></span>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg"
              >
                <Printer className="w-3.5 h-3.5" /> Print Pass
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
