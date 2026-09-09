import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserCheck,
  Plane,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  CloudSun,
  Radio,
  ArrowRight,
  ShieldCheck,
  Users
} from 'lucide-react';
import axios from 'axios';

export const StaffDashboard = () => {
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGate, setSelectedGate] = useState('ALL');

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const res = await axios.get('/api/flights');
        if (res.data?.data) {
          setFlights(res.data.data.slice(0, 8));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFlights();
  }, []);

  const handleUpdateStatus = (flightId, newStatus) => {
    setFlights((prev) =>
      prev.map((f) => (f._id === flightId ? { ...f, status: newStatus } : f))
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-amber-400" />
            Ground Operations & Gate Control Terminal
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time passenger gate check-in, ramp departure sequencing, baggage loading status, and boarding validations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/staff/gates')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all"
          >
            <QrCode className="w-3.5 h-3.5" />
            Gate Boarding Scanner
          </button>
        </div>
      </div>

      {/* 4 Staff Operational Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Active Gates</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-white font-mono">14 Gates</div>
          <div className="text-[11px] text-emerald-400 font-mono mt-1">Terminal 1 & 2 Normal</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Now Boarding</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Plane className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-cyan-400 font-mono">3 Flights</div>
          <div className="text-[11px] text-cyan-400 font-mono mt-1">AI 203 • 6E 404 • UK 812</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Checked-In Passengers</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-white font-mono">1,482</div>
          <div className="text-[11px] text-purple-400 font-mono mt-1">88% Load Factor</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Ramp Weather</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CloudSun className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-400 font-mono">28°C VFR</div>
          <div className="text-[11px] text-slate-400 mt-1">Visibility: 8km • Wind: 10kt</div>
        </div>
      </div>

      {/* Live Gate Operations Table */}
      <div className="rounded-xl bg-slate-900/60 border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Radio className="w-4 h-4 text-amber-400" />
            Live Gate Allocation & Departure Sequences
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-[10px] uppercase font-bold text-slate-400 font-mono border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Flight</th>
                <th className="py-3 px-4">Sector</th>
                <th className="py-3 px-4">Terminal / Gate</th>
                <th className="py-3 px-4">Sched. Dept</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4 text-right">Operational Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {flights.map((f, idx) => (
                <tr key={f._id || idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-white">
                    {f.flightNumber}
                    <div className="text-[10px] font-sans text-slate-400">{f.airline?.name || 'Air India'}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-cyan-300">
                    {f.originAirport?.iataCode || 'BLR'} → {f.destinationAirport?.iataCode || 'BOM'}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                    T{f.terminal || '1'} • Gate {f.gate || `B${(idx % 6) + 1}`}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">
                    {f.departureTime ? new Date(f.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '08:30 AM'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      f.status === 'Boarding' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      f.status === 'Departed' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
                      f.status === 'Delayed' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                      'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {f.status || 'Scheduled'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1.5">
                    <button
                      onClick={() => handleUpdateStatus(f._id, 'Boarding')}
                      className="px-2 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold"
                    >
                      Boarding
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(f._id, 'Departed')}
                      className="px-2 py-1 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold"
                    >
                      Departed
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
