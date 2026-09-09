import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plane,
  Ticket,
  Award,
  Bell,
  Clock,
  MapPin,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  QrCode,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Search
} from 'lucide-react';
import { bookingApi, flightApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const PassengerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingApi.getAll()
      .then((res) => {
        if (res.data?.success) {
          setBookings(res.data.bookings || []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const upcomingBooking = bookings[0] || null;

  return (
    <div className="space-y-6">
      {/* Welcome Heading Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-slate-900 via-[#0a1426] to-[#081a33] shadow-glow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-[11px] mb-2 font-bold shadow-glow-cyan">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              PASSENGER REWARD TIER: {user?.tier || 'GOLD ELITE'}
            </div>
            <h1 className="text-2xl font-black tracking-wide text-white">
              Welcome back, {user?.name || 'Aviation Traveler'}
            </h1>
            <p className="text-xs text-slate-300 mt-1 font-sans">
              Manage your flights, bookings, check-ins, and travel information in one place.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/search-flights')}
              className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs rounded-xl shadow-glow-cyan transition-all flex items-center space-x-2"
            >
              <Search className="w-4 h-4" />
              <span>Search Flights</span>
            </button>
            <button
              onClick={() => navigate('/boarding-pass')}
              className="px-4 py-2.5 bg-slate-800/90 hover:bg-slate-700/90 text-cyan-300 font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center space-x-2"
            >
              <QrCode className="w-4 h-4" />
              <span>Boarding Pass</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Passenger Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Upcoming Flights */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Upcoming Flights</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Plane className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-white font-mono">
            {bookings.filter((b) => b.bookingStatus === 'Confirmed').length || 2}
          </div>
          <div className="text-[11px] text-cyan-400 mt-1 font-mono">Next: BLR → BOM</div>
        </div>

        {/* 2. Active Booking */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Active Booking</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-xl font-bold text-emerald-300 font-mono">
            Confirmed
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">
            Ref: {upcomingBooking?.bookingReference || 'SKY-203841'}
          </div>
        </div>

        {/* 3. Miles & Rewards */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Miles & Rewards</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-amber-300 font-mono">
            {user?.mileagePoints?.toLocaleString() || '14,850'} <span className="text-xs text-slate-400 font-normal">pts</span>
          </div>
          <div className="text-[11px] text-amber-400/90 mt-1 font-mono">Tier: Gold Elite</div>
        </div>

        {/* 4. Flight Alerts */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Flight Alerts</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Bell className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-white font-mono">
            1 Advisory
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 font-mono">All flights on time</div>
        </div>
      </div>

      {/* Upcoming Flight Hero Card (AI 203 BLR -> BOM) */}
      <div className="glass-panel p-6 rounded-2xl border-2 border-cyan-500/40 bg-gradient-to-br from-[#091528] to-[#070e1b] shadow-glow-cyan relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Flight Summary */}
          <div className="space-y-4 flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-300 text-lg shadow-glow-cyan">
                  ✈️
                </div>
                <div>
                  <div className="font-extrabold text-base text-white">Air India</div>
                  <div className="text-xs font-mono font-bold text-cyan-300">
                    FLIGHT AI 203
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                  Status: On Time
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                  Gate B4
                </span>
              </div>
            </div>

            {/* Departure to Arrival Route Visualization */}
            <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 py-3 border-y border-slate-800/80">
              <div>
                <div className="text-3xl font-black text-white font-mono">BLR</div>
                <div className="text-xs font-semibold text-cyan-300">Bengaluru</div>
                <div className="text-[11px] text-slate-400 font-mono mt-1">Kempegowda Intl (BLR)</div>
                <div className="text-sm font-bold text-slate-200 mt-2 font-mono">08:30 AM</div>
                <div className="text-[11px] text-slate-400">Terminal 1 • Gate B4</div>
              </div>

              <div className="flex flex-col items-center justify-center text-center">
                <div className="text-[11px] font-mono text-cyan-400 font-bold">1h 45m NON-STOP</div>
                <div className="w-full flex items-center my-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400"></div>
                  <div className="flex-1 border-t-2 border-dashed border-cyan-500/40"></div>
                  <Plane className="w-5 h-5 text-cyan-400 mx-2 transform rotate-90" />
                  <div className="flex-1 border-t-2 border-dashed border-cyan-500/40"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400"></div>
                </div>
                <div className="text-[11px] font-mono text-slate-400">Airbus A321neo</div>
              </div>

              <div className="md:text-right">
                <div className="text-3xl font-black text-white font-mono">BOM</div>
                <div className="text-xs font-semibold text-cyan-300">Mumbai</div>
                <div className="text-[11px] text-slate-400 font-mono mt-1">Chhatrapati Shivaji (BOM)</div>
                <div className="text-sm font-bold text-slate-200 mt-2 font-mono">10:15 AM</div>
                <div className="text-[11px] text-slate-400">Terminal 2 • Belt B3</div>
              </div>
            </div>

            {/* Seat & Boarding Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono pt-1">
              <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] block">CONFIRMED SEAT</span>
                <span className="font-extrabold text-base text-cyan-300">12A (Window)</span>
              </div>
              <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] block">CABIN CLASS</span>
                <span className="font-bold text-slate-200">Economy Classic</span>
              </div>
              <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] block">BOARDING TIME</span>
                <span className="font-bold text-amber-300">07:50 AM</span>
              </div>
              <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] block">CHECK-IN STATUS</span>
                <span className="font-bold text-emerald-400">Eligible Online</span>
              </div>
            </div>
          </div>

          {/* Action Callouts */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:w-48 flex-shrink-0">
            <button
              onClick={() => navigate('/flight-status')}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs rounded-xl shadow-glow-cyan transition-all text-center"
            >
              View Flight Details
            </button>
            <button
              onClick={() => navigate('/check-in')}
              className="w-full py-2.5 px-4 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 font-bold text-xs rounded-xl border border-cyan-500/40 transition-all text-center"
            >
              Web Check-in
            </button>
            <button
              onClick={() => navigate('/boarding-pass')}
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded-xl transition-all text-center"
            >
              Download Pass
            </button>
          </div>
        </div>
      </div>

      {/* AI Travel Assistant Smart Insight Banner */}
      <div className="glass-panel p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/30 flex items-start space-x-3.5 text-xs">
        <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300 mt-0.5">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <div className="font-bold text-cyan-300 font-mono text-[11px] uppercase tracking-wider">
            AeroAI Travel Assistant Recommendation
          </div>
          <p className="text-slate-200 mt-0.5 leading-relaxed font-sans">
            "Your flight <strong>AI 203</strong> is currently <strong>on time</strong> with clear departure weather at Bengaluru (BLR). Runway traffic is nominal. We recommend arriving at Kempegowda Terminal 1 by <strong>06:30 AM</strong> (2 hours before departure) to ensure seamless baggage drop and security clearance."
          </p>
        </div>
        <button
          onClick={() => navigate('/ai-assistant')}
          className="text-cyan-300 hover:underline whitespace-nowrap text-xs font-semibold self-center"
        >
          Ask AeroAI →
        </button>
      </div>

      {/* My Bookings Table Section */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="font-bold text-sm text-white flex items-center gap-2">
            <Ticket className="w-4 h-4 text-cyan-400" />
            My Bookings & Reserved Seats
          </div>
          <button
            onClick={() => navigate('/my-bookings')}
            className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-medium"
          >
            Manage All Bookings <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-900/90 text-slate-400 font-mono border-b border-slate-800 text-[11px]">
                <th className="py-3 px-4">BOOKING ID</th>
                <th className="py-3 px-4">FLIGHT</th>
                <th className="py-3 px-4">ROUTE</th>
                <th className="py-3 px-4">TRAVEL DATE</th>
                <th className="py-3 px-4">SEAT</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {bookings.slice(0, 4).map((b) => (
                <tr key={b._id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-cyan-300">
                    {b.bookingReference}
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-200">
                    {b.flight?.flightNumber || 'AI 203'}
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {b.flight?.departureAirport?.iataCode || 'BLR'} → {b.flight?.arrivalAirport?.iataCode || 'BOM'}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300">
                    {b.flight?.departureTime ? new Date(b.flight.departureTime).toLocaleDateString() : 'Today'}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-cyan-300">
                    {b.seatNumber}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                      {b.bookingStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => navigate('/boarding-pass')}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px]"
                    >
                      Ticket
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
