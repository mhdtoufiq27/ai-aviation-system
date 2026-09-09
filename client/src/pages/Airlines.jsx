import React, { useState, useEffect } from 'react';
import {
  Building2,
  Plane,
  Award,
  Globe,
  CheckCircle,
  RefreshCw,
  Search
} from 'lucide-react';
import { airlineApi } from '../services/api';

export const Airlines = () => {
  const [airlines, setAirlines] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAirlines = async () => {
    try {
      setLoading(true);
      const res = await airlineApi.getAll();
      if (res.data?.success) {
        setAirlines(res.data.airlines);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAirlines();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-cyan-400" />
            Partner Airlines & Fleet Carriers
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            10 global and regional commercial airline operators integrated into the SkyFlow network.
          </p>
        </div>

        <button
          onClick={fetchAirlines}
          className="flex items-center space-x-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors border border-slate-700"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Sync Airlines</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {airlines.map((al) => (
          <div
            key={al._id}
            className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all space-y-3 text-xs"
          >
            <div className="flex items-start justify-between border-b border-slate-800/80 pb-3">
              <div>
                <span className="text-2xl font-black font-mono text-cyan-300">
                  {al.iataCode}
                </span>
                <span className="text-slate-500 font-mono text-[10px] ml-1.5">
                  ({al.icaoCode})
                </span>
                <div className="font-bold text-base text-white mt-0.5">{al.name}</div>
                <div className="text-[11px] text-slate-400">
                  HQ: {al.headquarters}, {al.country}
                </div>
              </div>

              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                {al.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 p-3 bg-slate-950/70 rounded-xl border border-slate-800 font-mono">
              <div>
                <span className="text-slate-500 text-[10px] block">TOTAL FLEET</span>
                <span className="text-sm font-bold text-slate-100">{al.fleetSize} Aircraft</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">ON-TIME DISPATCH</span>
                <span className="text-sm font-bold text-emerald-400">{al.onTimePerformance}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
