import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Plane,
  Clock,
  Users,
  AlertTriangle,
  Sparkles,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Cpu,
  ArrowRight
} from 'lucide-react';
import axios from 'axios';

export const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchManagerData = async () => {
      try {
        const res = await axios.get('/api/flights');
        if (res.data?.data) {
          setFlights(res.data.data.slice(0, 6));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchManagerData();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-400" />
            Airline Operations & Fleet Scheduling Console
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Commercial airline fleet oversight, route profitability, aircraft rotations, and crew dispatch readiness.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/manager/flights')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/20"
          >
            <Calendar className="w-3.5 h-3.5" />
            Schedule New Flight
          </button>
        </div>
      </div>

      {/* 4 Manager Operational KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Active Fleet</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Plane className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-white font-mono">50 Aircraft</div>
          <div className="text-[11px] text-emerald-400 font-mono mt-1">94% Fleet Serviceability</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Scheduled Departures</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-cyan-400 font-mono">100 Flights</div>
          <div className="text-[11px] text-slate-400 mt-1">Today's Flight Roster</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Assigned Flight Crew</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-purple-400 font-mono">60 Personnel</div>
          <div className="text-[11px] text-purple-300/80 font-mono mt-1">Captains, FOs & Cabin</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">AI On-Time Score</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-400 font-mono">91.4%</div>
          <div className="text-[11px] text-cyan-400 font-mono mt-1">AI Delay Mitigation Active</div>
        </div>
      </div>

      {/* AI Fleet Efficiency Advisory */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/40 via-cyan-950/30 to-slate-900 border border-blue-500/30 flex items-start gap-3">
        <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 shrink-0">
          <Cpu className="w-5 h-5" />
        </div>
        <div className="flex-1 text-xs">
          <div className="font-bold text-blue-300 uppercase tracking-wider font-mono">
            AeroAI Fleet Optimization Insight
          </div>
          <p className="text-slate-300 mt-1 leading-relaxed">
            Corridor <strong>BLR ↔ BOM</strong> is experiencing high passenger booking load factors (+88%). Recommend dispatching high-capacity <strong>Airbus A321neo</strong> on evening rotation to maximize yield and minimize turnaround gate queues.
          </p>
        </div>
      </div>

      {/* Airline Flight Scheduling Table */}
      <div className="rounded-xl bg-slate-900/60 border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Plane className="w-4 h-4 text-blue-400" />
            Fleet Rotation & Scheduled Deployments
          </h2>
          <button
            onClick={() => navigate('/manager/flights')}
            className="text-xs text-blue-400 hover:underline flex items-center gap-1 font-semibold"
          >
            Open Flight Scheduling <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-[10px] uppercase font-bold text-slate-400 font-mono border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Flight</th>
                <th className="py-3 px-4">Route Sector</th>
                <th className="py-3 px-4">Aircraft Type</th>
                <th className="py-3 px-4">Scheduled Departure</th>
                <th className="py-3 px-4">Operational Status</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {flights.map((f, i) => (
                <tr key={f._id || i} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-white">
                    {f.flightNumber}
                    <div className="text-[10px] text-slate-400 font-sans">{f.airline?.name || 'Air India'}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-cyan-300">
                    {f.originAirport?.iataCode || 'BLR'} → {f.destinationAirport?.iataCode || 'BOM'}
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-mono">
                    {f.aircraft?.model || 'Airbus A321neo'}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400">
                    {f.departureTime ? new Date(f.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '08:30 AM'}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {f.status || 'Scheduled'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => navigate('/manager/flights')}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
                    >
                      Inspect
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
