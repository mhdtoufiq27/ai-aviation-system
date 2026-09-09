import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Search,
  Wind,
  CloudRain,
  Eye,
  Thermometer,
  Radio,
  Sliders,
  Sparkles,
  RefreshCw,
  X
} from 'lucide-react';
import { airportApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const Airports = () => {
  const { user } = useAuth();
  const [airports, setAirports] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Weather Simulation Drawer
  const [simModalAirport, setSimModalAirport] = useState(null);
  const [weatherForm, setWeatherForm] = useState({
    condition: 'Clear',
    tempC: 25,
    windSpeedKmph: 15,
    visibilityKm: 10,
    rainProbability: 10,
    airTrafficLevel: 'Moderate',
  });

  const fetchAirports = async () => {
    try {
      setLoading(true);
      const res = await airportApi.getAll();
      if (res.data?.success) {
        setAirports(res.data.airports);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAirports();
  }, []);

  const openSimModal = (airport) => {
    setSimModalAirport(airport);
    setWeatherForm({
      condition: airport.weather?.condition || 'Clear',
      tempC: airport.weather?.tempC || 25,
      windSpeedKmph: airport.weather?.windSpeedKmph || 15,
      visibilityKm: airport.weather?.visibilityKm || 10,
      rainProbability: airport.weather?.rainProbability || 10,
      airTrafficLevel: airport.weather?.airTrafficLevel || 'Moderate',
    });
  };

  const handleWeatherSubmit = async (e) => {
    e.preventDefault();
    try {
      await airportApi.updateWeather(simModalAirport._id, weatherForm);
      setSimModalAirport(null);
      fetchAirports();
      alert(`Weather telemetry for ${simModalAirport.iataCode} updated.`);
    } catch (err) {
      alert('Failed to update airport weather');
    }
  };

  const filteredAirports = airports.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.iataCode.toLowerCase().includes(search.toLowerCase()) ||
      a.city.toLowerCase().includes(search.toLowerCase()) ||
      a.country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-cyan-400" />
            Global Airports & Weather Telemetry
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            20 international hubs: terminal configurations, live METAR weather conditions & runway congestion metrics.
          </p>
        </div>

        <button
          onClick={fetchAirports}
          className="flex items-center space-x-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors border border-slate-700"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Weather Feeds</span>
        </button>
      </div>

      {/* Search Filter */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search airport code (e.g. BLR, DEL, DXB, LHR) or city..."
            className="w-full pl-9 pr-4 py-2 bg-slate-900 text-slate-100 placeholder-slate-500 rounded-lg border border-slate-700 focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div className="font-mono text-slate-400">Total: {filteredAirports.length} Hubs</div>
      </div>

      {/* 20 Airports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredAirports.map((ap) => {
          const w = ap.weather || {};
          const isCongested = w.airTrafficLevel === 'Congested';
          const isHigh = w.airTrafficLevel === 'High';

          return (
            <div
              key={ap._id}
              className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all space-y-3 text-xs"
            >
              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-800/80 pb-2.5">
                <div>
                  <span className="text-2xl font-black font-mono text-cyan-300">
                    {ap.iataCode}
                  </span>
                  <span className="text-slate-500 font-mono text-[10px] ml-1.5">
                    ({ap.icaoCode})
                  </span>
                  <div className="font-bold text-slate-100 mt-0.5 truncate max-w-[180px]" title={ap.name}>
                    {ap.name}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {ap.city}, {ap.country}
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    isCongested
                      ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                      : isHigh
                      ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  {w.airTrafficLevel || 'Moderate'}
                </span>
              </div>

              {/* Weather Telemetry Box */}
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between font-mono">
                  <span className="text-slate-300 font-bold flex items-center gap-1.5">
                    <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
                    {w.tempC}°C • {w.condition}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {ap.terminals?.length || 2} Terminals
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800/60">
                  <div className="flex items-center gap-1">
                    <Wind className="w-3 h-3 text-slate-500" />
                    <span>{w.windSpeedKmph} km/h</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CloudRain className="w-3 h-3 text-slate-500" />
                    <span>{w.rainProbability}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3 text-slate-500" />
                    <span>{w.visibilityKm} km</span>
                  </div>
                </div>
              </div>

              {/* Action Button: Live Weather Simulator */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-slate-500 font-mono">
                  {ap.runways} Runways Active
                </span>
                <button
                  onClick={() => openSimModal(ap)}
                  className="flex items-center gap-1 px-2.5 py-1 bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/30 text-cyan-300 rounded text-[10px] font-mono font-bold transition-colors"
                >
                  <Sliders className="w-3 h-3" /> Simulate Weather
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* WEATHER SIMULATOR MODAL */}
      {simModalAirport && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel-glow w-full max-w-md rounded-2xl p-6 border border-cyan-500/40 shadow-2xl relative animate-in zoom-in-95 text-xs">
            <button
              onClick={() => setSimModalAirport(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Live Weather & Congestion Simulator
            </h3>
            <p className="text-slate-400 mb-4 font-mono">
              Adjust METAR telemetry for {simModalAirport.iataCode} ({simModalAirport.city}) to trigger AI delay adjustments.
            </p>

            <form onSubmit={handleWeatherSubmit} className="space-y-3.5">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Weather Condition</label>
                <select
                  value={weatherForm.condition}
                  onChange={(e) => setWeatherForm({ ...weatherForm, condition: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"
                >
                  <option value="Clear">Clear Skies</option>
                  <option value="Partly Cloudy">Partly Cloudy</option>
                  <option value="Overcast">Overcast</option>
                  <option value="Fog">Dense Fog (CAT III Operations)</option>
                  <option value="Rain">Rain & Low Ceiling</option>
                  <option value="Heavy Rain">Heavy Rain & Squall Line</option>
                  <option value="Thunderstorm">Severe Convective Thunderstorm</option>
                  <option value="Strong Winds">Crosswinds / Microbursts</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Temperature (°C): <strong className="text-cyan-300 font-mono">{weatherForm.tempC}°C</strong>
                  </label>
                  <input
                    type="number"
                    value={weatherForm.tempC}
                    onChange={(e) => setWeatherForm({ ...weatherForm, tempC: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Wind Speed (km/h): <strong className="text-cyan-300 font-mono">{weatherForm.windSpeedKmph}</strong>
                  </label>
                  <input
                    type="number"
                    value={weatherForm.windSpeedKmph}
                    onChange={(e) => setWeatherForm({ ...weatherForm, windSpeedKmph: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Visibility (km): <strong className="text-cyan-300 font-mono">{weatherForm.visibilityKm} km</strong>
                  </label>
                  <input
                    type="number"
                    value={weatherForm.visibilityKm}
                    onChange={(e) => setWeatherForm({ ...weatherForm, visibilityKm: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Rain Chance: <strong className="text-cyan-300 font-mono">{weatherForm.rainProbability}%</strong>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={weatherForm.rainProbability}
                    onChange={(e) => setWeatherForm({ ...weatherForm, rainProbability: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Air Traffic Density</label>
                <select
                  value={weatherForm.airTrafficLevel}
                  onChange={(e) => setWeatherForm({ ...weatherForm, airTrafficLevel: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"
                >
                  <option value="Low">Low Density</option>
                  <option value="Moderate">Moderate Density</option>
                  <option value="High">High Density</option>
                  <option value="Congested">Congested (Runway Hold)</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSimModalAirport(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-lg transition-colors shadow-glow-cyan"
                >
                  Apply & Emit Weather
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
