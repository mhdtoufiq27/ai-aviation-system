import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Ticket,
  Plane,
  Award,
  Calendar,
  Phone,
  Mail,
  Shield,
  RefreshCw,
  X
} from 'lucide-react';
import { passengerApi } from '../services/api';

export const Passengers = () => {
  const [passengers, setPassengers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedPassenger, setSelectedPassenger] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchPassengers = async () => {
    try {
      setLoading(true);
      const res = await passengerApi.getAll({ search, limit: 100 });
      if (res.data?.success) {
        setPassengers(res.data.passengers);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPassengers();
  }, [search]);

  const openPassengerDetail = async (p) => {
    try {
      setDetailLoading(true);
      setSelectedPassenger({ passenger: p, bookings: [] });
      const res = await passengerApi.getById(p._id);
      if (res.data?.success) {
        setSelectedPassenger(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            Passenger Directory & Travel Records
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            200 verified traveler profiles, passport references, booking manifests and mileage reward tiers.
          </p>
        </div>

        <button
          onClick={fetchPassengers}
          className="flex items-center space-x-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors border border-slate-700"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Directory</span>
        </button>
      </div>

      {/* Search Toolbar */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search passenger name, email, or passport..."
            className="w-full pl-9 pr-4 py-2 bg-slate-900 text-slate-100 placeholder-slate-500 rounded-lg border border-slate-700 focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div className="font-mono text-slate-400">Total: {passengers.length} Registered</div>
      </div>

      {/* Passengers Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-900/90 text-slate-400 font-mono border-b border-slate-800 text-[11px]">
                <th className="py-3 px-4">NAME</th>
                <th className="py-3 px-4">PASSPORT NUMBER</th>
                <th className="py-3 px-4">NATIONALITY</th>
                <th className="py-3 px-4">EMAIL</th>
                <th className="py-3 px-4">CONTACT</th>
                <th className="py-3 px-4">MILES REWARD</th>
                <th className="py-3 px-4 text-right">PROFILE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {passengers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    {loading ? 'Searching passenger profiles...' : 'No passengers found.'}
                  </td>
                </tr>
              ) : (
                passengers.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-100">
                      {p.fullName}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-cyan-300">
                      {p.passportNumber}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {p.nationality}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {p.email}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {p.phone}
                    </td>
                    <td className="py-3 px-4 font-mono text-amber-300 font-semibold">
                      {p.mileagePoints?.toLocaleString()} pts
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => openPassengerDetail(p)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-medium"
                      >
                        History
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PASSENGER PROFILE & BOOKINGS HISTORY MODAL */}
      {selectedPassenger && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-2xl p-6 border border-slate-700 shadow-2xl relative text-xs animate-in zoom-in-95">
            <button
              onClick={() => setSelectedPassenger(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-bold text-base">
                {selectedPassenger.passenger?.fullName ? selectedPassenger.passenger.fullName[0] : 'P'}
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{selectedPassenger.passenger?.fullName}</h3>
                <div className="text-[11px] text-slate-400 font-mono">
                  Passport: <strong className="text-cyan-300">{selectedPassenger.passenger?.passportNumber}</strong> • {selectedPassenger.passenger?.nationality}
                </div>
              </div>
            </div>

            {/* Travel Stats Banner */}
            <div className="grid grid-cols-3 gap-2.5 p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-center font-mono mb-4">
              <div>
                <span className="text-[10px] text-slate-500">BOOKED FLIGHTS</span>
                <div className="text-lg font-bold text-white mt-0.5">
                  {selectedPassenger.bookings?.length || 0}
                </div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500">FREQUENT FLYER</span>
                <div className="text-lg font-bold text-amber-400 mt-0.5">Gold Tier</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500">MILEAGE BALANCE</span>
                <div className="text-lg font-bold text-cyan-300 mt-0.5">
                  {selectedPassenger.passenger?.mileagePoints?.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Booking History */}
            <div>
              <h4 className="font-bold text-slate-200 mb-2 flex items-center gap-1.5 font-mono">
                <Ticket className="w-3.5 h-3.5 text-cyan-400" /> Travel History & Reservations
              </h4>

              <div className="max-h-48 overflow-y-auto space-y-2">
                {selectedPassenger.bookings?.length === 0 ? (
                  <div className="p-4 text-center text-slate-500 text-xs">No booking records found.</div>
                ) : (
                  selectedPassenger.bookings?.map((b) => (
                    <div key={b._id} className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="font-mono font-bold text-slate-100">
                          {b.flight?.flightNumber} ({b.flight?.departureAirport?.iataCode} → {b.flight?.arrivalAirport?.iataCode})
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Seat: <strong className="text-cyan-300">{b.seatNumber}</strong> • {b.cabinClass} • Ref: {b.bookingReference}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                          {b.bookingStatus}
                        </span>
                        <div className="text-[10px] text-slate-500 mt-1 font-mono">${b.totalAmount}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-800 mt-4">
              <button
                onClick={() => setSelectedPassenger(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
