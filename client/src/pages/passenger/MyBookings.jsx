import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Ticket,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Plane,
  Download,
  X,
  Printer,
  RefreshCw,
  QrCode
} from 'lucide-react';
import { bookingApi } from '../../services/api';

export const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTicket, setActiveTicket] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await bookingApi.getAll();
      if (res.data?.success) {
        setBookings(res.data.bookings || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking and request refund?')) {
      try {
        await bookingApi.updateStatus(id, { bookingStatus: 'Cancelled' });
        fetchBookings();
        alert('Booking successfully cancelled.');
      } catch (err) {
        alert('Failed to cancel booking');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Ticket className="w-5 h-5 text-cyan-400" />
            My Bookings & Travel Reservations
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Confirmed flight itineraries, seat assignments, digital e-tickets and cancellation management.
          </p>
        </div>

        <button
          onClick={fetchBookings}
          className="flex items-center space-x-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors border border-slate-700"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Bookings</span>
        </button>
      </div>

      {/* Bookings Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between text-xs font-bold text-slate-200">
          <span>Your Confirmed Reservations ({bookings.length})</span>
          <span className="text-[11px] text-cyan-400 font-mono font-normal">Strictly Personal Access</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-900/90 text-slate-400 font-mono border-b border-slate-800 text-[11px]">
                <th className="py-3 px-4">BOOKING ID</th>
                <th className="py-3 px-4">FLIGHT NUMBER</th>
                <th className="py-3 px-4">ROUTE</th>
                <th className="py-3 px-4">TRAVEL DATE</th>
                <th className="py-3 px-4">SEAT</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    {loading ? 'Retrieving your bookings...' : 'You have no active flight bookings.'}
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-cyan-300">
                      {b.bookingReference}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-100">
                      {b.flight?.flightNumber || 'AI 203'}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-200">
                        {b.flight?.departureAirport?.iataCode || 'BLR'} → {b.flight?.arrivalAirport?.iataCode || 'BOM'}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {b.flight?.departureAirport?.city} to {b.flight?.arrivalAirport?.city}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {b.flight?.departureTime ? new Date(b.flight.departureTime).toLocaleDateString() : 'Today'}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-cyan-300">
                      {b.seatNumber}
                      <span className="text-[10px] text-slate-400 font-sans block font-normal">{b.cabinClass}</span>
                    </td>
                    <td className="py-3.5 px-4">
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
                    <td className="py-3.5 px-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => setActiveTicket(b)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-medium"
                      >
                        View Booking
                      </button>
                      <button
                        onClick={() => navigate('/boarding-pass')}
                        className="px-2.5 py-1 bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 rounded text-[11px] font-medium"
                      >
                        Download Ticket
                      </button>
                      {b.bookingStatus !== 'Cancelled' && (
                        <button
                          onClick={() => handleCancelBooking(b._id)}
                          className="text-rose-400 hover:text-rose-300 text-[11px] p-1 font-medium"
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

      {/* Ticket Details Modal */}
      {activeTicket && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl p-6 border border-slate-700 shadow-2xl relative text-xs animate-in zoom-in-95">
            <button
              onClick={() => setActiveTicket(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Ticket className="w-4 h-4 text-cyan-400" />
              Booking Details: {activeTicket.bookingReference}
            </h3>
            <p className="text-slate-400 mb-4 font-mono text-[11px]">
              Passenger E-Ticket Receipt
            </p>

            <div className="space-y-3 font-mono">
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Flight:</span>
                  <span className="font-bold text-white">{activeTicket.flight?.flightNumber || 'AI 203'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Route:</span>
                  <span className="font-bold text-cyan-300">
                    {activeTicket.flight?.departureAirport?.iataCode} → {activeTicket.flight?.arrivalAirport?.iataCode}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Seat:</span>
                  <span className="font-bold text-white">{activeTicket.seatNumber} ({activeTicket.cabinClass})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Gate / Terminal:</span>
                  <span className="text-slate-200">{activeTicket.flight?.terminal || 'T1'} / {activeTicket.flight?.gate || 'B4'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Fare Paid:</span>
                  <span className="font-bold text-emerald-400">${activeTicket.totalAmount || 185}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t border-slate-800 mt-4">
              <button
                onClick={() => setActiveTicket(null)}
                className="px-4 py-1.5 bg-slate-800 text-slate-200 rounded-lg"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setActiveTicket(null);
                  navigate('/boarding-pass');
                }}
                className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-lg shadow-glow-cyan"
              >
                Go to Boarding Pass
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
