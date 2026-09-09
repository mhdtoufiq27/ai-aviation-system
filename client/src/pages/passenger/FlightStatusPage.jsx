import React, { useState, useEffect } from 'react';
import {
  Activity,
  Search,
  Plane,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Filter,
  RefreshCw,
  Sparkles,
  CloudSun,
  Luggage
} from 'lucide-react';
import axios from 'axios';

export const FlightStatusPage = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedFlight, setSelectedFlight] = useState(null);

  // Initial mock flights fallback
  const mockStatusFlights = [
    {
      _id: 'f-1',
      flightNumber: 'AI 203',
      airline: { name: 'Air India', code: 'AI' },
      originAirport: { iataCode: 'BLR', city: 'Bengaluru', name: 'Kempegowda Intl' },
      destinationAirport: { iataCode: 'BOM', city: 'Mumbai', name: 'Chhatrapati Shivaji Intl' },
      scheduledDeparture: new Date(Date.now() + 3600000).toISOString(),
      scheduledArrival: new Date(Date.now() + 10000000).toISOString(),
      status: 'Boarding',
      gate: 'B4',
      terminal: '1',
      baggageBelt: '4',
      delayMinutes: 0,
      weather: '28°C Clear Sky',
      aircraft: { model: 'Airbus A321neo' }
    },
    {
      _id: 'f-2',
      flightNumber: '6E 404',
      airline: { name: 'IndiGo', code: '6E' },
      originAirport: { iataCode: 'DEL', city: 'Delhi', name: 'Indira Gandhi Intl' },
      destinationAirport: { iataCode: 'BLR', city: 'Bengaluru', name: 'Kempegowda Intl' },
      scheduledDeparture: new Date(Date.now() - 3600000).toISOString(),
      scheduledArrival: new Date(Date.now() + 5400000).toISOString(),
      status: 'Departed',
      gate: '12',
      terminal: '3',
      baggageBelt: '8',
      delayMinutes: 0,
      weather: '24°C Partly Cloudy',
      aircraft: { model: 'Airbus A320neo' }
    },
    {
      _id: 'f-3',
      flightNumber: 'UK 812',
      airline: { name: 'Vistara', code: 'UK' },
      originAirport: { iataCode: 'BOM', city: 'Mumbai', name: 'Chhatrapati Shivaji Intl' },
      destinationAirport: { iataCode: 'GOI', city: 'Goa', name: 'Dabolim Airport' },
      scheduledDeparture: new Date(Date.now() + 7200000).toISOString(),
      scheduledArrival: new Date(Date.now() + 11000000).toISOString(),
      status: 'Delayed',
      gate: 'A2',
      terminal: '2',
      baggageBelt: '2',
      delayMinutes: 25,
      weather: '30°C Light Rain',
      aircraft: { model: 'Boeing 737-800' }
    },
    {
      _id: 'f-4',
      flightNumber: 'SG 305',
      airline: { name: 'SpiceJet', code: 'SG' },
      originAirport: { iataCode: 'MAA', city: 'Chennai', name: 'Chennai Intl' },
      destinationAirport: { iataCode: 'HYD', city: 'Hyderabad', name: 'Rajiv Gandhi Intl' },
      scheduledDeparture: new Date(Date.now() + 14400000).toISOString(),
      scheduledArrival: new Date(Date.now() + 18000000).toISOString(),
      status: 'Scheduled',
      gate: 'C7',
      terminal: '1',
      baggageBelt: '1',
      delayMinutes: 0,
      weather: '31°C Sunny',
      aircraft: { model: 'Boeing 737 MAX 8' }
    },
    {
      _id: 'f-5',
      flightNumber: 'EK 501',
      airline: { name: 'Emirates', code: 'EK' },
      originAirport: { iataCode: 'BOM', city: 'Mumbai', name: 'Chhatrapati Shivaji Intl' },
      destinationAirport: { iataCode: 'DXB', city: 'Dubai', name: 'Dubai International' },
      scheduledDeparture: new Date(Date.now() - 14400000).toISOString(),
      scheduledArrival: new Date(Date.now() - 3600000).toISOString(),
      status: 'Arrived',
      gate: 'F18',
      terminal: '2',
      baggageBelt: '6',
      delayMinutes: 0,
      weather: '34°C Hazy',
      aircraft: { model: 'Boeing 777-300ER' }
    }
  ];

  const fetchFlights = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/flights');
      if (res.data?.data && res.data.data.length > 0) {
        setFlights(res.data.data);
      } else {
        setFlights(mockStatusFlights);
      }
    } catch (err) {
      console.warn('API unavailable, using mock flights for status tracking:', err);
      setFlights(mockStatusFlights);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlights();
  }, []);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'boarding':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            Boarding
          </span>
        );
      case 'departed':
      case 'in air':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Plane className="w-3 h-3 text-cyan-400" />
            Departed
          </span>
        );
      case 'arrived':
      case 'landed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Arrived
          </span>
        );
      case 'delayed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <AlertTriangle className="w-3 h-3 text-rose-400" />
            Delayed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase bg-red-500/10 text-red-400 border border-red-500/30">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase bg-blue-500/10 text-blue-400 border border-blue-500/30">
            Scheduled
          </span>
        );
    }
  };

  const filteredFlights = flights.filter((flight) => {
    const fn = flight.flightNumber || '';
    const airline = flight.airline?.name || '';
    const orig = flight.originAirport?.iataCode || flight.originAirport?.city || '';
    const dest = flight.destinationAirport?.iataCode || flight.destinationAirport?.city || '';
    const matchesQuery =
      fn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      airline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      orig.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' ||
      flight.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesQuery && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            Live Flight Status Radar
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor real-time gate announcements, runway departures, delay forecasts, and arrival carousels.
          </p>
        </div>

        <button
          onClick={fetchFlights}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/60 text-slate-300 hover:text-white hover:border-cyan-500/40 text-xs font-semibold transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
          Refresh Radar
        </button>
      </div>

      {/* Search & Filters */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search flight number, airline, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['ALL', 'Scheduled', 'Boarding', 'Departed', 'Delayed', 'Arrived'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Flight Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">
          <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin mx-auto mb-2" />
          Synchronizing aviation radar telemetry...
        </div>
      ) : filteredFlights.length === 0 ? (
        <div className="p-12 rounded-xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-400">
          No flights matched your radar search parameters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFlights.map((flight) => (
            <div
              key={flight._id}
              onClick={() => setSelectedFlight(flight)}
              className="group p-5 rounded-xl bg-gradient-to-br from-slate-900/80 to-slate-950/90 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-cyan-950/30 flex flex-col justify-between"
            >
              <div>
                {/* Card Top: Airline & Status */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center font-mono font-bold text-xs text-cyan-400">
                      {flight.airline?.code || 'FL'}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {flight.airline?.name || 'Airline'}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {flight.flightNumber}
                      </div>
                    </div>
                  </div>
                  <div>{getStatusBadge(flight.status)}</div>
                </div>

                {/* Cities & Arrow */}
                <div className="flex items-center justify-between my-4 px-2">
                  <div>
                    <div className="text-2xl font-black text-white font-mono">
                      {flight.originAirport?.iataCode || 'DEP'}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {flight.originAirport?.city || 'Origin'}
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col items-center px-4">
                    <Plane className="w-4 h-4 text-cyan-400 rotate-90" />
                    <div className="h-0.5 w-full bg-slate-800 my-1" />
                    <span className="text-[10px] text-slate-500 font-mono">
                      {flight.aircraft?.model || 'Commercial'}
                    </span>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-black text-white font-mono">
                      {flight.destinationAirport?.iataCode || 'ARR'}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {flight.destinationAirport?.city || 'Destination'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Bottom Details Bar */}
              <div className="pt-3 border-t border-slate-800/80 grid grid-cols-3 text-center text-[11px] gap-2">
                <div className="bg-slate-950/60 p-1.5 rounded">
                  <span className="text-slate-500 block text-[9px] uppercase font-bold">Terminal</span>
                  <span className="text-cyan-400 font-mono font-bold">
                    T{flight.terminal || '1'}
                  </span>
                </div>
                <div className="bg-slate-950/60 p-1.5 rounded">
                  <span className="text-slate-500 block text-[9px] uppercase font-bold">Gate</span>
                  <span className="text-white font-mono font-bold">
                    {flight.gate || 'B4'}
                  </span>
                </div>
                <div className="bg-slate-950/60 p-1.5 rounded">
                  <span className="text-slate-500 block text-[9px] uppercase font-bold">Carousel</span>
                  <span className="text-slate-300 font-mono font-bold">
                    {flight.baggageBelt ? `Belt ${flight.baggageBelt}` : 'Pending'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Flight Detail Modal */}
      {selectedFlight && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Plane className="w-5 h-5 text-cyan-400" />
                <div>
                  <h3 className="text-base font-black text-white">
                    {selectedFlight.airline?.name} • {selectedFlight.flightNumber}
                  </h3>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Telemetry ID: {selectedFlight._id}
                  </div>
                </div>
              </div>
              <div>{getStatusBadge(selectedFlight.status)}</div>
            </div>

            {/* Flight Route and Times */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <div className="text-[10px] text-slate-500 font-bold uppercase">Departure</div>
                <div className="text-lg font-black text-cyan-400 font-mono">
                  {selectedFlight.originAirport?.iataCode}
                </div>
                <div className="text-xs text-white">{selectedFlight.originAirport?.city}</div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Terminal {selectedFlight.terminal || '1'} • Gate {selectedFlight.gate || 'B4'}
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] text-slate-500 font-bold uppercase">Arrival</div>
                <div className="text-lg font-black text-cyan-400 font-mono">
                  {selectedFlight.destinationAirport?.iataCode}
                </div>
                <div className="text-xs text-white">{selectedFlight.destinationAirport?.city}</div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Baggage Belt: {selectedFlight.baggageBelt || '4'}
                </div>
              </div>
            </div>

            {/* AI Delay & Weather Advisory */}
            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/20 flex items-center gap-3 text-xs">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                <div className="text-slate-300">
                  <span className="font-bold text-cyan-300">AI Operations Predictor: </span>
                  {selectedFlight.delayMinutes > 0
                    ? `Expected delay of ${selectedFlight.delayMinutes} mins due to airspace congestion.`
                    : 'Flight trajectory operating within on-time SLA parameters (0m delay).'}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <CloudSun className="w-4 h-4 text-amber-400" />
                  <span>Destination Weather</span>
                </div>
                <span className="text-slate-200 font-semibold">
                  {selectedFlight.weather || '27°C Good Visibility'}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedFlight(null)}
                className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black transition-colors"
              >
                Close Status Radar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
