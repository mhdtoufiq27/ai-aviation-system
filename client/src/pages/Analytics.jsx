import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Plane,
  Users,
  Clock,
  PieChart as PieIcon,
  Activity,
  Layers,
  RefreshCw
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';
import { analyticsApi } from '../services/api';

export const Analytics = () => {
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCharts = async () => {
    try {
      setLoading(true);
      const res = await analyticsApi.getCharts();
      if (res.data?.success) {
        setCharts(res.data.charts);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharts();
  }, []);

  const PIE_COLORS = ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#64748b', '#ef4444'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            Aviation Operational Analytics & Telemetry
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Fleet efficiency, passenger throughput distribution, delay causality matrices, and hub congestion.
          </p>
        </div>

        <button
          onClick={fetchCharts}
          className="flex items-center space-x-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors border border-slate-700"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Analytics</span>
        </button>
      </div>

      {/* Row 1: Flights Per Day & Flights by Airline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Flights Schedule vs Delays */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2 font-mono uppercase">
                <Plane className="w-4 h-4 text-cyan-400" />
                Daily Flights Scheduled vs Delays
              </h2>
              <p className="text-[11px] text-slate-400">On-time departure rate vs weather holds</p>
            </div>
          </div>

          <div className="h-64 w-full">
            {charts?.flightsPerDay ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.flightsPerDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0a1220', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '11px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="onTime" fill="#10b981" name="On Time" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="delayed" fill="#f59e0b" name="Delayed" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : null}
          </div>
        </div>

        {/* Flights by Partner Airline */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2 font-mono uppercase">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                Active Flights by Airline
              </h2>
              <p className="text-[11px] text-slate-400">Scheduled flight distribution across carriers</p>
            </div>
          </div>

          <div className="h-64 w-full">
            {charts?.flightsByAirline ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.flightsByAirline} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis dataKey="airline" type="category" width={110} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0a1220', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '11px' }}
                  />
                  <Bar dataKey="flights" fill="#06b6d4" radius={[0, 4, 4, 0]} name="Flights" />
                </BarChart>
              </ResponsiveContainer>
            ) : null}
          </div>
        </div>
      </div>

      {/* Row 2: Status Distribution & Domestic vs International */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Delay Average KPI */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="text-xs font-mono text-slate-400 uppercase">Average Delay Time</div>
            <div className="text-3xl font-black text-amber-400 mt-2 font-mono">
              +{charts?.avgDelayMinutes || 32} mins
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Recorded across delayed departure slots
            </div>
          </div>
          <div className="mt-4 p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-[11px] text-amber-300">
            Active buffer reduction protocol recommended.
          </div>
        </div>

        {/* Domestic vs International Pie */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800">
          <div className="text-xs font-bold text-white uppercase font-mono mb-2">
            Route Classification
          </div>
          <div className="h-40 w-full">
            {charts?.domesticVsInternational ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.domesticVsInternational}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={55}
                  >
                    <Cell fill="#06b6d4" />
                    <Cell fill="#3b82f6" />
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0a1220', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : null}
          </div>
          <div className="flex justify-center gap-4 text-[10px] font-mono text-slate-300 mt-1">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-400" /> Domestic</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Intl</span>
          </div>
        </div>

        {/* Fleet Aircraft Utilization */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="text-xs font-bold text-white uppercase font-mono mb-2">
            Aircraft Fleet Utilization (50 Aircraft)
          </div>
          <p className="text-[11px] text-slate-400 mb-3">Service readiness and maintenance distribution</p>

          <div className="space-y-3 text-xs">
            {charts?.aircraftUtilization?.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between font-mono">
                  <span className="text-slate-300">{item.name}</span>
                  <span className="font-bold text-slate-100">{item.count} aircraft ({Math.round((item.count / 50) * 100)}%)</span>
                </div>
                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(item.count / 50) * 100}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Peak Travel Hours & Delay Reasons Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Peak Travel Hours Line Chart */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <h2 className="text-sm font-bold text-white font-mono uppercase mb-1">
            Hourly Departure Curve (Peak Travel Hours)
          </h2>
          <p className="text-[11px] text-slate-400 mb-4">Departures distribution across the 24-hour cycle</p>

          <div className="h-64 w-full">
            {charts?.peakTravelHours ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={charts.peakTravelHours}>
                  <defs>
                    <linearGradient id="peakGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="hour" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0a1220', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '11px' }}
                  />
                  <Area type="monotone" dataKey="departures" stroke="#3b82f6" strokeWidth={2} fill="url(#peakGrad)" name="Departures" />
                </AreaChart>
              </ResponsiveContainer>
            ) : null}
          </div>
        </div>

        {/* Delay Reasons Breakdown */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <h2 className="text-sm font-bold text-white font-mono uppercase mb-1">
            Delay Causality Attribution
          </h2>
          <p className="text-[11px] text-slate-400 mb-4">Identified primary drivers for schedule disruption</p>

          <div className="space-y-4 text-xs pt-2">
            {charts?.delayReasons?.map((dr, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between font-mono">
                  <span className="text-slate-300 font-medium">{dr.reason}</span>
                  <span className="font-bold text-cyan-300">{dr.percentage}%</span>
                </div>
                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${dr.percentage}%`,
                      backgroundColor: dr.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
