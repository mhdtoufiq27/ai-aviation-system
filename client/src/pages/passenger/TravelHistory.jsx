import React, { useState } from 'react';
import {
  History,
  Plane,
  Award,
  MapPin,
  Calendar,
  Download,
  CheckCircle2,
  TrendingUp,
  Globe2,
  Leaf
} from 'lucide-react';

export const TravelHistory = () => {
  const [trips] = useState([
    {
      id: 'TRIP-991',
      flightNumber: '6E 404',
      airline: 'IndiGo',
      from: 'DEL',
      fromCity: 'Delhi',
      to: 'BLR',
      toCity: 'Bengaluru',
      date: '28 Sep 2026',
      seat: '14C',
      cabinClass: 'Economy',
      milesEarned: 1060,
      carbonOffset: '84 kg',
      status: 'Completed',
      aircraft: 'Airbus A320neo',
      fare: '₹5,400'
    },
    {
      id: 'TRIP-982',
      flightNumber: 'UK 812',
      airline: 'Vistara',
      from: 'BOM',
      fromCity: 'Mumbai',
      to: 'GOI',
      toCity: 'Goa',
      date: '14 Aug 2026',
      seat: '3A',
      cabinClass: 'Premium Economy',
      milesEarned: 450,
      carbonOffset: '38 kg',
      status: 'Completed',
      aircraft: 'Airbus A321neo',
      fare: '₹4,800'
    },
    {
      id: 'TRIP-970',
      flightNumber: 'AI 506',
      airline: 'Air India',
      from: 'HYD',
      fromCity: 'Hyderabad',
      to: 'MAA',
      toCity: 'Chennai',
      date: '02 Jul 2026',
      seat: '8D',
      cabinClass: 'Economy',
      milesEarned: 380,
      carbonOffset: '32 kg',
      status: 'Completed',
      aircraft: 'Boeing 737-800',
      fare: '₹3,900'
    },
    {
      id: 'TRIP-955',
      flightNumber: 'EK 501',
      airline: 'Emirates',
      from: 'BOM',
      fromCity: 'Mumbai',
      to: 'DXB',
      toCity: 'Dubai',
      date: '19 May 2026',
      seat: '18K',
      cabinClass: 'Economy Saver',
      milesEarned: 1200,
      carbonOffset: '115 kg',
      status: 'Completed',
      aircraft: 'Boeing 777-300ER',
      fare: '₹19,200'
    },
    {
      id: 'TRIP-940',
      flightNumber: '6E 112',
      airline: 'IndiGo',
      from: 'BLR',
      fromCity: 'Bengaluru',
      to: 'CCU',
      toCity: 'Kolkata',
      date: '04 Apr 2026',
      seat: '11F',
      cabinClass: 'Economy',
      milesEarned: 960,
      carbonOffset: '75 kg',
      status: 'Completed',
      aircraft: 'Airbus A320neo',
      fare: '₹6,100'
    }
  ]);

  const totalMiles = trips.reduce((acc, curr) => acc + curr.milesEarned, 14370);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <History className="w-5 h-5 text-cyan-400" />
            My Travel History
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            View completed journeys, frequent flyer mileage accruals, carbon offsets, and download historical e-invoices.
          </p>
        </div>
      </div>

      {/* Analytics / Milestones Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">Total Miles Flown</div>
            <div className="text-xl font-black text-white font-mono">{totalMiles.toLocaleString()} mi</div>
            <div className="text-[10px] text-cyan-400 font-semibold mt-0.5 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Gold Elite Tier
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Plane className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">Completed Flights</div>
            <div className="text-xl font-black text-white font-mono">18 Flights</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Across 4 major airlines</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Globe2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">Destinations Explored</div>
            <div className="text-xl font-black text-white font-mono">9 Cities</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Domestic & International</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">Carbon Offset</div>
            <div className="text-xl font-black text-white font-mono">344 kg CO₂</div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">100% Green Certified</div>
          </div>
        </div>
      </div>

      {/* Travel History Table Card */}
      <div className="rounded-xl bg-slate-900/60 border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <span>Past Voyages & Accrued Mileage</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
              {trips.length} records
            </span>
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Flight</th>
                <th className="py-3 px-4">Sector / Route</th>
                <th className="py-3 px-4">Travel Date</th>
                <th className="py-3 px-4">Seat / Class</th>
                <th className="py-3 px-4">Miles Earned</th>
                <th className="py-3 px-4">Fare Paid</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">E-Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {trips.map((trip) => (
                <tr key={trip.id} className="hover:bg-slate-800/30 transition-colors">
                  {/* Flight Info */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white font-mono">{trip.flightNumber}</div>
                    <div className="text-[10px] text-slate-400">{trip.airline} • {trip.aircraft}</div>
                  </td>

                  {/* Route */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 font-bold text-cyan-400 font-mono">
                      <span>{trip.from}</span>
                      <span className="text-slate-600">→</span>
                      <span>{trip.to}</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {trip.fromCity} to {trip.toCity}
                    </div>
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 text-slate-300 font-mono">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      {trip.date}
                    </div>
                  </td>

                  {/* Seat & Class */}
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-white">{trip.seat}</div>
                    <div className="text-[10px] text-slate-400">{trip.cabinClass}</div>
                  </td>

                  {/* Miles */}
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-cyan-400">
                      +{trip.milesEarned} mi
                    </div>
                    <div className="text-[9px] text-emerald-400">Accrued</div>
                  </td>

                  {/* Fare */}
                  <td className="py-3.5 px-4 font-mono text-slate-300">
                    {trip.fare}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      {trip.status}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => alert(`Downloading official e-invoice for ${trip.id} (${trip.flightNumber})`)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="Download Invoice"
                    >
                      <Download className="w-3.5 h-3.5" />
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
