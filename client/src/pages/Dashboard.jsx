import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plane,
  Clock,
  AlertTriangle,
  XCircle,
  Users,
  Ticket,
  Building2,
  Cpu,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Radio,
  RefreshCw,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis
} from 'recharts';
import { analyticsApi, flightApi, aiApi } from '../services/api';
import { useSocket } from '../context/SocketContext';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { latestFlightUpdate } = useSocket();

  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [recentFlights, setRecentFlights] = useState([]);
  const [activeAnomalies, setActiveAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, chartsRes, flightsRes, anomaliesRes] = await Promise.all([
        analyticsApi.getDashboardStats(),
        analyticsApi.getCharts(),
        flightApi.getAll({ limit: 6 }),
        aiApi.getAnomalies({ status: 'Active' }),
      ]);

      if (statsRes.data?.success) setStats(statsRes.data.cards);
      if (chartsRes.data?.success) setCharts(chartsRes.data.charts);
      if (flightsRes.data?.success) setRecentFlights(flightsRes.data.flights);
      if (anomaliesRes.data?.success) setActiveAnomalies(anomaliesRes.data.anomalies.slice(0, 3));
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (latestFlightUpdate) {
      loadDashboardData();
    }
  }, [latestFlightUpdate]);

  const STATUS_COLORS = {
    Scheduled: '#3b82f6',
    Boarding: '#06b6d4',
    Departed: '#10b981',
    Delayed: '#f59e0b',
    Arrived: '#64748b',
    Cancelled: '#ef4444',
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with AI Operations Status */}
      <div className="glass-panel p-5 rounded-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border border-cyan-500/20 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-cyan-950/30">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
            <h1 className="text-xl font-black tracking-wide text-white flex items-center gap-2">
              Aviation Operations Control Center
              <span className="text-xs font-mono font-normal px-2 py-0.5 bg-cyan-950 text-cyan-300 rounded border border-cyan-500/30">
                LIVE TELEMETRY
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time flight radar, AI predictive delay algorithms, passenger throughput forecasting & anomaly detection.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={loadDashboardData}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-xs font-medium text-slate-200 border border-slate-700 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Telemetry</span>
          </button>
          <button
            onClick={() => navigate('/ai-predictions')}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-xs font-bold text-black shadow-glow-cyan transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Predictor Studio</span>
          </button>
        </div>
      </div>

      {/* 8 Metric KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Flights */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Total Flights</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Plane className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-white">{stats?.totalFlights?.value ?? 100}</span>
            <span className="text-[11px] font-mono text-emerald-400 flex items-center">
              <ArrowUpRight className="w-3 h-3" /> {stats?.totalFlights?.change ?? '+12.4%'}
            </span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Scheduled & active today</div>
        </div>

        {/* Active Flights */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Active In-Flight</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-cyan-300">{stats?.activeFlights?.value ?? 24}</span>
            <span className="text-[11px] font-mono text-emerald-400 flex items-center">
              <ArrowUpRight className="w-3 h-3" /> {stats?.activeFlights?.change ?? '+4.2%'}
            </span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">En-route & boarding</div>
        </div>

        {/* Delayed Flights */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Delayed Flights</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-400">{stats?.delayedFlights?.value ?? 8}</span>
            <span className="text-[11px] font-mono text-amber-400 flex items-center">
              <ArrowDownRight className="w-3 h-3" /> {stats?.delayedFlights?.change ?? '-3.8%'}
            </span>
          </div>
          <div className="text-[10px] text-amber-400/80 mt-1 font-mono">ATC / Weather Holds</div>
        </div>

        {/* Cancelled Flights */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 hover:border-rose-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Cancelled</span>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-rose-400">{stats?.cancelledFlights?.value ?? 1}</span>
            <span className="text-[11px] font-mono text-emerald-400 flex items-center">
              {stats?.cancelledFlights?.change ?? '-1.5%'}
            </span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Severe storm alert</div>
        </div>

        {/* Total Passengers */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Total Passengers</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-white">{stats?.totalPassengers?.value ?? 200}</span>
            <span className="text-[11px] font-mono text-emerald-400 flex items-center">
              <ArrowUpRight className="w-3 h-3" /> {stats?.totalPassengers?.change ?? '+18.6%'}
            </span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Registered flyers</div>
        </div>

        {/* Total Bookings */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Total Bookings</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Ticket className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-white">{stats?.totalBookings?.value ?? 100}</span>
            <span className="text-[11px] font-mono text-emerald-400 flex items-center">
              <ArrowUpRight className="w-3 h-3" /> {stats?.totalBookings?.change ?? '+15.2%'}
            </span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Issued flight tickets</div>
        </div>

        {/* Active Airlines */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Partner Airlines</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-white">{stats?.activeAirlines?.value ?? 10}</span>
            <span className="text-[11px] font-mono text-emerald-400">100% Active</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Global & domestic carriers</div>
        </div>

        {/* AI Delay Risk */}
        <div className="glass-panel p-4 rounded-xl border border-cyan-500/40 bg-gradient-to-br from-[#0a1220] to-cyan-950/20 hover:border-cyan-400 transition-all shadow-glow-cyan">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium text-cyan-300">AI Delay Risk</span>
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-cyan-300">{stats?.aiDelayRisk?.value ?? '28%'}</span>
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
              {stats?.aiDelayRisk?.label ?? 'Moderate'}
            </span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Composite network delay score</div>
        </div>
      </div>

      {/* Critical Active Anomalies Alert Bar */}
      {activeAnomalies.length > 0 && (
        <div className="glass-panel p-4 rounded-xl border border-amber-500/40 bg-amber-950/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs">
              <AlertTriangle className="w-4 h-4" />
              <span>Active Aviation Anomalies Detected ({activeAnomalies.length})</span>
            </div>
            <button
              onClick={() => navigate('/anomalies')}
              className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 font-medium"
            >
              Resolve in Anomaly Center <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {activeAnomalies.map((anom) => (
              <div key={anom._id} className="p-2.5 rounded-lg bg-slate-900/80 border border-amber-500/30 text-xs">
                <div className="font-semibold text-slate-200 line-clamp-1">{anom.title}</div>
                <div className="text-slate-400 text-[11px] mt-1 line-clamp-2">{anom.description}</div>
                <div className="mt-2 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-amber-400 font-bold">{anom.severity} Severity</span>
                  <span className="text-slate-400">Deviation: +{anom.deviationPercentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid: Live Radar Flights & Analytics Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Flights Feed (2 Columns) */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Plane className="w-4 h-4 text-cyan-400" />
                Live Flights Roster & AI Risk Score
              </h2>
              <p className="text-[11px] text-slate-400">Real-time gate, terminal and predictive delay states</p>
            </div>
            <button
              onClick={() => navigate('/flights')}
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-medium"
            >
              View All 100 Flights <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 font-mono border-b border-slate-800/80 text-[11px]">
                  <th className="pb-2 font-medium">FLIGHT</th>
                  <th className="pb-2 font-medium">ROUTE</th>
                  <th className="pb-2 font-medium">SCHEDULE</th>
                  <th className="pb-2 font-medium">STATUS</th>
                  <th className="pb-2 font-medium">GATE</th>
                  <th className="pb-2 font-medium text-right">AI RISK</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {recentFlights.map((flight) => {
                  const riskLevel = flight.aiPrediction?.riskLevel || 'Low';
                  const riskBadge =
                    riskLevel === 'Severe'
                      ? 'bg-rose-950 text-rose-300 border-rose-500/40'
                      : riskLevel === 'High'
                      ? 'bg-amber-950 text-amber-300 border-amber-500/40'
                      : riskLevel === 'Moderate'
                      ? 'bg-cyan-950 text-cyan-300 border-cyan-500/40'
                      : 'bg-emerald-950 text-emerald-300 border-emerald-500/40';

                  return (
                    <tr key={flight._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 font-mono font-bold text-cyan-300">
                        {flight.flightNumber}
                        <div className="text-[10px] text-slate-400 font-sans font-normal">
                          {flight.airline?.name || 'Airline'}
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="font-semibold text-slate-200">
                          {flight.departureAirport?.iataCode} → {flight.arrivalAirport?.iataCode}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {flight.departureAirport?.city} to {flight.arrivalAirport?.city}
                        </div>
                      </td>
                      <td className="py-3 font-mono text-[11px] text-slate-300">
                        {new Date(flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {flight.delayMinutes > 0 && (
                          <div className="text-amber-400 font-bold text-[10px]">+{flight.delayMinutes}m delay</div>
                        )}
                      </td>
                      <td className="py-3">
                        <span
                          className="px-2 py-0.5 rounded-full text-[10px] font-semibold font-mono"
                          style={{
                            backgroundColor: `${STATUS_COLORS[flight.status]}18`,
                            color: STATUS_COLORS[flight.status],
                            border: `1px solid ${STATUS_COLORS[flight.status]}40`,
                          }}
                        >
                          {flight.status}
                        </span>
                      </td>
                      <td className="py-3 font-mono text-slate-300">
                        {flight.terminal} / {flight.gate}
                      </td>
                      <td className="py-3 text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${riskBadge}`}>
                          {flight.aiPrediction?.delayProbability ?? 20}% ({riskLevel})
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Flight Status Distribution Chart & Passenger Trend (1 Column) */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-6">
          {/* Status Breakdown Donut Chart */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono mb-1">
              Flight Status Distribution
            </h3>
            <p className="text-[11px] text-slate-400 mb-3">Live status breakdown across 100 flights</p>

            <div className="h-44 w-full">
              {charts?.flightStatusDistribution ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={charts.flightStatusDistribution}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={42}
                      outerRadius={65}
                      paddingAngle={3}
                    >
                      {charts.flightStatusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || '#3b82f6'} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0a1220',
                        border: '1px solid #1e293b',
                        borderRadius: '8px',
                        fontSize: '11px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-500">Loading chart...</div>
              )}
            </div>

            {/* Chart Legend Badges */}
            <div className="grid grid-cols-3 gap-2 mt-2 text-[10px] font-mono">
              {charts?.flightStatusDistribution?.map((item) => (
                <div key={item.name} className="flex items-center space-x-1.5 text-slate-300">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: STATUS_COLORS[item.name] || '#3b82f6' }}
                  />
                  <span className="truncate">{item.name} ({item.value})</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-800/80 pt-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono mb-1">
              Passenger Booking Velocity
            </h3>
            <p className="text-[11px] text-slate-400 mb-3">6-Month volume trajectory</p>

            <div className="h-32 w-full">
              {charts?.passengerGrowth ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={charts.passengerGrowth}>
                    <defs>
                      <linearGradient id="paxGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 10 }} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 10 }} hide />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0a1220',
                        border: '1px solid #1e293b',
                        borderRadius: '8px',
                        fontSize: '11px',
                      }}
                    />
                    <Area type="monotone" dataKey="passengers" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#paxGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
