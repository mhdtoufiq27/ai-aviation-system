import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Sparkles,
  Plane,
  TrendingUp,
  Compass,
  AlertTriangle,
  Wind,
  CloudRain,
  Shield,
  Clock,
  Fuel,
  ArrowRight,
  BarChart2,
  Calendar,
  Layers
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';
import { aiApi, airportApi, airlineApi } from '../services/api';

export const AIPredictions = () => {
  const [activeTab, setActiveTab] = useState('delay'); // 'delay' | 'demand' | 'route'

  // Metadata
  const [airports, setAirports] = useState([]);
  const [airlines, setAirlines] = useState([]);

  // 1. Delay Simulator State
  const [delayInput, setDelayInput] = useState({
    weatherCondition: 'Heavy Rain',
    departureTraffic: 'High',
    arrivalTraffic: 'Moderate',
    windSpeedKmph: 35,
    rainProbability: 75,
    airlinePerformance: 84,
    departureHour: 18,
    aircraftAgeYears: 5,
    origin: 'BLR',
    destination: 'BOM',
  });
  const [delayResult, setDelayResult] = useState(null);
  const [delayLoading, setDelayLoading] = useState(false);

  // 2. Demand Forecast State
  const [demandData, setDemandData] = useState(null);
  const [demandLoading, setDemandLoading] = useState(false);

  // 3. Route Recommendation State
  const [routeInput, setRouteInput] = useState({ origin: 'BLR', destination: 'LHR' });
  const [routeData, setRouteData] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);

  useEffect(() => {
    airportApi.getAll().then((res) => {
      if (res.data?.success) setAirports(res.data.airports);
    });
    airlineApi.getAll().then((res) => {
      if (res.data?.success) setAirlines(res.data.airlines);
    });

    // Run initial delay prediction
    runDelayPrediction();
    fetchDemandForecast();
    fetchRouteRecommendation();
  }, []);

  const runDelayPrediction = async () => {
    try {
      setDelayLoading(true);
      const res = await aiApi.predictDelay(delayInput);
      if (res.data?.success) {
        setDelayResult(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDelayLoading(false);
    }
  };

  const fetchDemandForecast = async () => {
    try {
      setDemandLoading(true);
      const res = await aiApi.forecastPassengers();
      if (res.data?.success) {
        setDemandData(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDemandLoading(false);
    }
  };

  const fetchRouteRecommendation = async () => {
    try {
      setRouteLoading(true);
      const res = await aiApi.recommendRoute(routeInput);
      if (res.data?.success) {
        setRouteData(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRouteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            AeroAI Predictive Intelligence Suite
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Machine learning flight delay classifications, time-series passenger demand forecasting & smart route optimization.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl space-x-1">
          <button
            onClick={() => setActiveTab('delay')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'delay'
                ? 'bg-cyan-500 text-black shadow-glow-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" /> Delay Predictor
          </button>
          <button
            onClick={() => setActiveTab('demand')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'demand'
                ? 'bg-cyan-500 text-black shadow-glow-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" /> Demand Forecast
          </button>
          <button
            onClick={() => setActiveTab('route')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'route'
                ? 'bg-cyan-500 text-black shadow-glow-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" /> Smart Routes
          </button>
        </div>
      </div>

      {/* TAB 1: AI Flight Delay Prediction */}
      {activeTab === 'delay' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Input Parameter Form (5 Cols) */}
          <div className="lg:col-span-5 glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 text-xs">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Flight Feature Inputs
              </h2>
              <p className="text-[11px] text-slate-400">
                Supply airport METAR, traffic density and scheduled corridor factors.
              </p>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Origin Airport</label>
                  <select
                    value={delayInput.origin}
                    onChange={(e) => setDelayInput({ ...delayInput, origin: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"
                  >
                    {airports.map((a) => (
                      <option key={a._id} value={a.iataCode}>{a.iataCode} - {a.city}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Destination Airport</label>
                  <select
                    value={delayInput.destination}
                    onChange={(e) => setDelayInput({ ...delayInput, destination: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"
                  >
                    {airports.map((a) => (
                      <option key={a._id} value={a.iataCode}>{a.iataCode} - {a.city}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Weather Condition</label>
                <select
                  value={delayInput.weatherCondition}
                  onChange={(e) => setDelayInput({ ...delayInput, weatherCondition: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"
                >
                  <option value="Clear">Clear Skies</option>
                  <option value="Partly Cloudy">Partly Cloudy</option>
                  <option value="Overcast">Overcast</option>
                  <option value="Haze">Haze / Low Visibility</option>
                  <option value="Fog">Dense Fog</option>
                  <option value="Rain">Moderate Rain</option>
                  <option value="Heavy Rain">Heavy Rain & Squalls</option>
                  <option value="Thunderstorm">Severe Thunderstorm</option>
                  <option value="Strong Winds">Strong Crosswinds</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Origin Air Traffic</label>
                  <select
                    value={delayInput.departureTraffic}
                    onChange={(e) => setDelayInput({ ...delayInput, departureTraffic: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"
                  >
                    <option value="Low">Low Density</option>
                    <option value="Moderate">Moderate</option>
                    <option value="High">High Traffic</option>
                    <option value="Congested">Severe Congestion</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Dest Air Traffic</label>
                  <select
                    value={delayInput.arrivalTraffic}
                    onChange={(e) => setDelayInput({ ...delayInput, arrivalTraffic: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"
                  >
                    <option value="Low">Low Density</option>
                    <option value="Moderate">Moderate</option>
                    <option value="High">High Traffic</option>
                    <option value="Congested">Severe Congestion</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Wind Speed: <span className="text-cyan-300 font-mono">{delayInput.windSpeedKmph} km/h</span>
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="80"
                    value={delayInput.windSpeedKmph}
                    onChange={(e) => setDelayInput({ ...delayInput, windSpeedKmph: Number(e.target.value) })}
                    className="w-full accent-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Rain Probability: <span className="text-cyan-300 font-mono">{delayInput.rainProbability}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={delayInput.rainProbability}
                    onChange={(e) => setDelayInput({ ...delayInput, rainProbability: Number(e.target.value) })}
                    className="w-full accent-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Departure Hour (24h)</label>
                  <select
                    value={delayInput.departureHour}
                    onChange={(e) => setDelayInput({ ...delayInput, departureHour: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"
                  >
                    {Array.from({ length: 24 }).map((_, h) => (
                      <option key={h} value={h}>{h.toString().padStart(2, '0')}:00 {h >= 8 && h <= 10 ? 'Morning Peak' : h >= 17 && h <= 20 ? 'Evening Peak' : ''}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Airline Fleet On-Time %</label>
                  <input
                    type="number"
                    min="60"
                    max="99"
                    value={delayInput.airlinePerformance}
                    onChange={(e) => setDelayInput({ ...delayInput, airlinePerformance: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"
                  />
                </div>
              </div>

              <button
                onClick={runDelayPrediction}
                disabled={delayLoading}
                className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold rounded-lg shadow-glow-cyan transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{delayLoading ? 'Executing ML Inference...' : 'Calculate Delay Risk'}</span>
              </button>
            </div>
          </div>

          {/* AI Inference Output (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {delayResult && (
              <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                      AeroAI Neural Delay Engine
                    </span>
                    <h2 className="text-base font-black text-white mt-0.5">
                      Predicted Delay Risk Profile
                    </h2>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                    Confidence: {delayResult.modelConfidence}%
                  </span>
                </div>

                {/* Main 3 Metrics */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                    <div className="text-[10px] text-slate-400 font-mono">DELAY PROBABILITY</div>
                    <div className="text-3xl font-black text-cyan-300 mt-1 font-mono">
                      {delayResult.delayProbability}%
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                    <div className="text-[10px] text-slate-400 font-mono">RISK LEVEL</div>
                    <div className={`text-xl font-extrabold mt-2 font-mono ${
                      delayResult.riskLevel === 'Severe'
                        ? 'text-rose-400'
                        : delayResult.riskLevel === 'High'
                        ? 'text-amber-400'
                        : delayResult.riskLevel === 'Moderate'
                        ? 'text-cyan-400'
                        : 'text-emerald-400'
                    }`}>
                      {delayResult.riskLevel}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                    <div className="text-[10px] text-slate-400 font-mono">EXPECTED DELAY</div>
                    <div className="text-3xl font-black text-white mt-1 font-mono">
                      +{delayResult.expectedDelayMinutes}m
                    </div>
                  </div>
                </div>

                {/* AI Recommendation Banner */}
                <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/40">
                  <div className="text-[11px] font-mono font-bold text-cyan-300 uppercase tracking-wide flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5" /> AI Recommendation
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    "{delayResult.aiRecommendation}"
                  </p>
                </div>

                {/* Feature Impact Weights */}
                <div>
                  <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider mb-2">
                    Key Influencing Factors
                  </h3>
                  <div className="space-y-2">
                    {delayResult.contributingFactors?.map((cf, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-slate-900/70 border border-slate-800 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-semibold text-slate-200">{cf.factor}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{cf.description}</div>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-slate-950 text-cyan-300 border border-slate-800">
                            {cf.impactScore}/100
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Passenger Demand Forecasting */}
      {activeTab === 'demand' && (
        <div className="space-y-6">
          {/* Key Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <div className="text-xs font-medium text-slate-400">Expected Passengers Tomorrow</div>
              <div className="text-3xl font-black text-cyan-300 mt-2 font-mono">
                {demandData?.expectedTomorrow?.toLocaleString() || '18,450'}
              </div>
              <div className="text-xs text-emerald-400 font-mono mt-1">
                {demandData?.tomorrowGrowthPct || '+5.4%'} vs 7-day average
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <div className="text-xs font-medium text-slate-400">Average Load Factor</div>
              <div className="text-3xl font-black text-white mt-2 font-mono">88.2%</div>
              <div className="text-xs text-slate-400 mt-1">Across 10 partner airlines</div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <div className="text-xs font-medium text-slate-400">Peak Demand Window</div>
              <div className="text-xl font-bold text-amber-400 mt-2">Fri Evening (17:00 - 21:00)</div>
              <div className="text-xs text-slate-400 mt-1">Surge passenger load projected at 96%</div>
            </div>
          </div>

          {/* Forecast Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 7-Day Demand Bar Chart */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide mb-1">
                7-Day Passenger Volume Projection
              </h3>
              <p className="text-xs text-slate-400 mb-4">Estimated passenger boarding load by day of week</p>

              <div className="h-64 w-full">
                {demandData?.weeklyForecast ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={demandData.weeklyForecast}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                      <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0a1220',
                          border: '1px solid #1e293b',
                          borderRadius: '8px',
                          fontSize: '11px',
                        }}
                      />
                      <Bar dataKey="expectedPassengers" fill="#06b6d4" radius={[6, 6, 0, 0]} name="Expected Passengers" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-slate-500">Loading forecast...</div>
                )}
              </div>
            </div>

            {/* 12-Month Trajectory Chart */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide mb-1">
                Monthly Commercial Demand Trend
              </h3>
              <p className="text-xs text-slate-400 mb-4">Annual passenger traffic projection curve</p>

              <div className="h-64 w-full">
                {demandData?.monthlyForecast ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={demandData.monthlyForecast}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                      <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0a1220',
                          border: '1px solid #1e293b',
                          borderRadius: '8px',
                          fontSize: '11px',
                        }}
                      />
                      <Line type="monotone" dataKey="passengers" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} name="Passengers" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-slate-500">Loading forecast...</div>
                )}
              </div>
            </div>
          </div>

          {/* Peak Travel Dates & Strategic Operations Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wide mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" /> Peak Travel Dates & Capacity Pressure
              </h3>
              <div className="space-y-2.5 text-xs">
                {demandData?.peakTravelDates?.map((pt, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="flex items-center justify-between font-bold text-slate-200">
                      <span>{pt.date}</span>
                      <span className="text-amber-400 font-mono text-[11px]">{pt.estimatedLoad}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">{pt.reason}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wide mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" /> AI Capacity Allocation Strategies
              </h3>
              <div className="space-y-2.5 text-xs">
                {demandData?.recommendedActions?.map((act, i) => (
                  <div key={i} className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-slate-200 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{act}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Smart Route Recommendation */}
      {activeTab === 'route' && (
        <div className="space-y-6">
          {/* Route Selector Bar */}
          <div className="glass-panel p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Origin Hub</label>
                <select
                  value={routeInput.origin}
                  onChange={(e) => setRouteInput({ ...routeInput, origin: e.target.value })}
                  className="bg-slate-900 text-slate-100 border border-slate-700 rounded-lg p-2"
                >
                  <option value="BLR">BLR - Bengaluru</option>
                  <option value="DEL">DEL - Delhi</option>
                  <option value="BOM">BOM - Mumbai</option>
                  <option value="DXB">DXB - Dubai</option>
                  <option value="SIN">SIN - Singapore</option>
                </select>
              </div>

              <ArrowRight className="w-4 h-4 text-cyan-400 mt-5" />

              <div>
                <label className="block text-slate-400 font-medium mb-1">Destination Hub</label>
                <select
                  value={routeInput.destination}
                  onChange={(e) => setRouteInput({ ...routeInput, destination: e.target.value })}
                  className="bg-slate-900 text-slate-100 border border-slate-700 rounded-lg p-2"
                >
                  <option value="LHR">LHR - London Heathrow</option>
                  <option value="DXB">DXB - Dubai</option>
                  <option value="JFK">JFK - New York</option>
                  <option value="SIN">SIN - Singapore</option>
                  <option value="FRA">FRA - Frankfurt</option>
                </select>
              </div>
            </div>

            <button
              onClick={fetchRouteRecommendation}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-extrabold rounded-lg shadow-glow-cyan"
            >
              Recalculate Optimal Flight Trajectory
            </button>
          </div>

          {routeData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Standard Route Card */}
              <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 text-xs">
                <div className="border-b border-slate-800 pb-2 flex items-center justify-between">
                  <div className="font-bold text-slate-300 uppercase tracking-wider font-mono">
                    Standard Airway Flight Plan
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Baseline</span>
                </div>

                <div className="space-y-2 font-mono text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Airway Corridor:</span>
                    <span className="text-slate-200">{routeData.standardRoute?.airwayName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Total Distance:</span>
                    <span className="text-slate-200">{routeData.standardRoute?.distanceKm} km</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Estimated Duration:</span>
                    <span className="text-slate-200">{Math.floor(routeData.standardRoute?.estimatedMinutes / 60)}h {routeData.standardRoute?.estimatedMinutes % 60}m</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Fuel Consumption:</span>
                    <span className="text-slate-200 font-bold">{routeData.standardRoute?.fuelBurnKg?.toLocaleString()} kg</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Weather Risk:</span>
                    <span className="text-amber-400">{routeData.standardRoute?.weatherRisk}</span>
                  </div>
                </div>
              </div>

              {/* AeroAI Optimized Route Card */}
              <div className="glass-panel-glow p-5 rounded-2xl border border-cyan-500/40 space-y-4 text-xs shadow-glow-cyan">
                <div className="border-b border-cyan-500/30 pb-2 flex items-center justify-between">
                  <div className="font-extrabold text-cyan-300 uppercase tracking-wider font-mono flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5" /> AeroAI Recommended Trajectory
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-cyan-950 text-cyan-300 rounded border border-cyan-500/30">
                    OPTIMIZED
                  </span>
                </div>

                <div className="space-y-2 font-mono text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Recommended Corridor:</span>
                    <span className="text-cyan-200 font-bold">{routeData.optimizedRoute?.airwayName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Estimated Duration:</span>
                    <span className="text-emerald-400 font-bold">
                      {Math.floor(routeData.optimizedRoute?.estimatedMinutes / 60)}h {routeData.optimizedRoute?.estimatedMinutes % 60}m (-{routeData.optimizedRoute?.timeSavedMinutes} mins)
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Fuel Savings:</span>
                    <span className="text-emerald-400 font-black">
                      -{routeData.optimizedRoute?.fuelSavingsKg?.toLocaleString()} kg ({routeData.optimizedRoute?.fuelSavingsPercent}%)
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">CO2 Emissions Reduction:</span>
                    <span className="text-cyan-300 font-bold">-{routeData.optimizedRoute?.co2ReductionKg?.toLocaleString()} kg CO2</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Recommended Altitude:</span>
                    <span className="text-slate-200 font-bold">{routeData.optimizedRoute?.recommendedAltitudeFt} ft (FL380)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Waypoints Sequence Table */}
          {routeData?.waypoints && (
            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wide mb-3 flex items-center gap-2">
                <Compass className="w-4 h-4 text-cyan-400" /> Waypoint Navigation Sequence (AeroAI Jetstream Route)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {routeData.waypoints.map((wp, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center text-xs">
                    <div className="text-[10px] font-mono text-cyan-400 font-bold">LEG {i + 1}</div>
                    <div className="font-black text-sm text-white font-mono mt-1">{wp.code}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{wp.name}</div>
                    <div className="text-[9px] font-mono text-slate-500 mt-1">
                      {wp.lat.toFixed(2)}°, {wp.lng.toFixed(2)}°
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
