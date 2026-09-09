import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Plane,
  Clock,
  MapPin,
  QrCode,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const CheckIn = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [checkedIn, setCheckedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [seatConfirm, setSeatConfirm] = useState('12A');

  const flightDetails = {
    airline: 'Air India',
    flightNumber: 'AI 203',
    aircraft: 'Airbus A321neo',
    from: 'Bengaluru (BLR)',
    fromAirport: 'Kempegowda International Airport, Terminal 1',
    to: 'Mumbai (BOM)',
    toAirport: 'Chhatrapati Shivaji Maharaj International, Terminal 2',
    departureTime: '08:30 AM',
    departureDate: 'Today, 12 Oct',
    arrivalTime: '10:15 AM',
    gate: 'B4',
    terminal: '1',
    seat: '12A',
    cabinClass: 'Economy Classic',
    baggageAllowance: '1 Check-in (15kg) + 1 Cabin (7kg)',
  };

  const handlePerformCheckIn = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCheckedIn(true);
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl font-black text-white flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-cyan-400" />
          Online Web Check-in
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Confirm your passenger details, baggage allowance, and generate electronic boarding credentials.
        </p>
      </div>

      {checkedIn ? (
        /* Success State */
        <div className="glass-panel p-8 rounded-2xl border-2 border-emerald-500/50 bg-gradient-to-br from-[#06181b] to-slate-900 text-center space-y-5 shadow-glow-cyan animate-in zoom-in-95">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-400 shadow-glow-cyan">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-white">
              Check-in Completed Successfully
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Your boarding pass for flight <strong className="text-cyan-300 font-mono">AI 203</strong> is now active.
            </p>
          </div>

          <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 max-w-md mx-auto font-mono text-xs text-left space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">PASSENGER:</span>
              <span className="font-bold text-slate-100">{user?.name || 'Aviation Traveler'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">ASSIGNED SEAT:</span>
              <span className="font-bold text-cyan-300">{seatConfirm}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">DEPARTURE GATE:</span>
              <span className="font-bold text-amber-400">{flightDetails.gate} (Terminal {flightDetails.terminal})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">BOARDING STATUS:</span>
              <span className="font-bold text-emerald-400">Boarding Pass Issued</span>
            </div>
          </div>

          <div className="flex justify-center space-x-3 pt-2">
            <button
              onClick={() => navigate('/boarding-pass')}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs rounded-xl shadow-glow-cyan flex items-center space-x-2"
            >
              <QrCode className="w-4 h-4" />
              <span>Open Digital Boarding Pass</span>
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-xl font-bold"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      ) : (
        /* Eligible Flight Card */
        <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-300 text-lg">
                ✈️
              </div>
              <div>
                <div className="font-extrabold text-base text-white">{flightDetails.airline}</div>
                <div className="text-xs font-mono font-bold text-cyan-300">
                  {flightDetails.flightNumber} • {flightDetails.aircraft}
                </div>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
              Online Check-in Open
            </span>
          </div>

          {/* Route & Times */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px] block">ORIGIN DEPARTURE</span>
              <div className="text-xl font-black text-white">{flightDetails.from}</div>
              <div className="text-slate-400 text-[11px] font-sans">{flightDetails.fromAirport}</div>
              <div className="text-cyan-300 text-sm font-bold pt-1">{flightDetails.departureDate} at {flightDetails.departureTime}</div>
            </div>

            <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px] block">ARRIVAL DESTINATION</span>
              <div className="text-xl font-black text-white">{flightDetails.to}</div>
              <div className="text-slate-400 text-[11px] font-sans">{flightDetails.toAirport}</div>
              <div className="text-cyan-300 text-sm font-bold pt-1">{flightDetails.departureDate} at {flightDetails.arrivalTime}</div>
            </div>
          </div>

          {/* Seat & Baggage Verification */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
              <span className="text-slate-500 text-[10px] block">CONFIRMED SEAT</span>
              <span className="text-base font-black text-cyan-300">{flightDetails.seat}</span>
            </div>
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
              <span className="text-slate-500 text-[10px] block">CABIN CLASS</span>
              <span className="text-slate-200 font-bold">{flightDetails.cabinClass}</span>
            </div>
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
              <span className="text-slate-500 text-[10px] block">CHECK-IN WINDOW</span>
              <span className="text-emerald-400 font-bold">Closes in 4h 15m</span>
            </div>
          </div>

          {/* Declaration Checklist */}
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2 text-xs text-slate-300">
            <div className="font-bold text-slate-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              Safety & Baggage Compliance
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              By completing online check-in, you certify that your cabin and checked luggage contain no hazardous materials, compressed gases, or unapproved lithium battery items under IATA aviation standards.
            </p>
          </div>

          {/* Big Check-in CTA Button */}
          <div className="pt-2">
            <button
              onClick={handlePerformCheckIn}
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black text-sm rounded-xl shadow-glow-cyan transition-all flex items-center justify-center space-x-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{loading ? 'Confirming with Air Traffic Manifest...' : 'Check In Now'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
