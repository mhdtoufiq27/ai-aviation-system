import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Plane,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Cpu,
  Clock,
  MapPin,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Sparkles,
  RefreshCw,
  X
} from 'lucide-react';
import { flightApi, airlineApi, airportApi, aircraftApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

export const Flights = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [searchParams] = useSearchParams();

  const [flights, setFlights] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const [airports, setAirports] = useState([]);
  const [aircraftList, setAircraftList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState('All');
  const [airlineFilter, setAirlineFilter] = useState('All');

  // Modals
  const [statusModalFlight, setStatusModalFlight] = useState(null);
  const [statusForm, setStatusForm] = useState({ status: '', delayMinutes: 0, delayReason: '', gate: '', terminal: '' });

  const [predictModalData, setPredictModalData] = useState(null);
  const [predictLoading, setPredictLoading] = useState(false);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [flightForm, setFlightForm] = useState({
    flightNumber: '',
    airline: '',
    aircraft: '',
    departureAirport: '',
    arrivalAirport: '',
    departureTime: '',
    arrivalTime: '',
    terminal: 'T1',
    gate: 'A1',
    basePrice: 150,
  });

  const canEdit = user?.role === 'admin' || user?.role === 'airline_manager';
  const canUpdateStatus = user?.role === 'admin' || user?.role === 'airline_manager' || user?.role === 'staff';

  const fetchFlights = async () => {
    try {
      setLoading(true);
      const res = await flightApi.getAll({
        search,
        status: statusFilter,
        airline: airlineFilter,
        limit: 100,
      });
      if (res.data?.success) {
        setFlights(res.data.flights);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMetadata = async () => {
    try {
      const [alRes, apRes, acRes] = await Promise.all([
        airlineApi.getAll(),
        airportApi.getAll(),
        aircraftApi.getAll(),
      ]);
      if (alRes.data?.success) setAirlines(alRes.data.airlines);
      if (apRes.data?.success) setAirports(apRes.data.airports);
      if (acRes.data?.success) setAircraftList(acRes.data.aircraft);
    } catch (err) {}
  };

  useEffect(() => {
    fetchMetadata();
  }, []);

  useEffect(() => {
    fetchFlights();
  }, [statusFilter, airlineFilter, search]);

  // Listen to socket status updates
  useEffect(() => {
    if (!socket) return;
    const handleUpdate = () => fetchFlights();
    socket.on('flightStatusUpdated', handleUpdate);
    socket.on('flightCreated', handleUpdate);
    socket.on('flightDeleted', handleUpdate);

    return () => {
      socket.off('flightStatusUpdated', handleUpdate);
      socket.off('flightCreated', handleUpdate);
      socket.off('flightDeleted', handleUpdate);
    };
  }, [socket]);

  // Open Status update modal
  const openStatusModal = (flight) => {
    setStatusModalFlight(flight);
    setStatusForm({
      status: flight.status,
      delayMinutes: flight.delayMinutes || 0,
      delayReason: flight.delayReason || '',
      gate: flight.gate || 'A1',
      terminal: flight.terminal || 'T1',
    });
  };

  const handleUpdateStatusSubmit = async (e) => {
    e.preventDefault();
    try {
      await flightApi.updateStatus(statusModalFlight._id, statusForm);
      setStatusModalFlight(null);
      fetchFlights();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status');
    }
  };

  // Run AI Delay Prediction for flight
  const handleRunAiPrediction = async (flight) => {
    try {
      setPredictLoading(true);
      setPredictModalData({ flight, loading: true });
      const res = await flightApi.predictDelay(flight._id);
      if (res.data?.success) {
        setPredictModalData({
          flight: res.data.flight,
          prediction: res.data.prediction,
          loading: false,
        });
        fetchFlights();
      }
    } catch (err) {
      alert('Failed to execute AI predictive delay model.');
      setPredictModalData(null);
    } finally {
      setPredictLoading(false);
    }
  };

  // Create flight submit
  const handleCreateFlight = async (e) => {
    e.preventDefault();
    try {
      await flightApi.create(flightForm);
      setCreateModalOpen(false);
      fetchFlights();
      alert('Flight successfully registered into flight schedule system.');
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating flight');
    }
  };

  // Delete flight
  const handleDeleteFlight = async (id, number) => {
    if (window.confirm(`Are you sure you want to remove Flight ${number}?`)) {
      try {
        await flightApi.delete(id);
        fetchFlights();
      } catch (err) {
        alert('Error removing flight');
      }
    }
  };

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
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Plane className="w-5 h-5 text-cyan-400" />
            Commercial Flight Management
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Active tracking, schedule maintenance, gate assignment, and ML delay probability assessment.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {canEdit && (
            <button
              onClick={() => setCreateModalOpen(true)}
              className="flex items-center space-x-2 px-3.5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black text-xs font-extrabold rounded-lg shadow-glow-cyan transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule New Flight</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter flight number or city..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-900 text-slate-100 placeholder-slate-500 rounded-lg border border-slate-700/80 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center space-x-1.5 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-900 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All Statuses</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Boarding">Boarding</option>
              <option value="Departed">Departed</option>
              <option value="Delayed">Delayed</option>
              <option value="Arrived">Arrived</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <button
            onClick={fetchFlights}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors"
            title="Refresh list"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Flights Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-900/90 text-slate-400 font-mono border-b border-slate-800 text-[11px]">
                <th className="py-3 px-4">FLIGHT</th>
                <th className="py-3 px-4">AIRLINE</th>
                <th className="py-3 px-4">ORIGIN</th>
                <th className="py-3 px-4">DESTINATION</th>
                <th className="py-3 px-4">DEPARTURE</th>
                <th className="py-3 px-4">GATE / TERM</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4">AI RISK</th>
                <th className="py-3 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {flights.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500 text-xs">
                    {loading ? 'Loading scheduled flights...' : 'No flights match your search criteria.'}
                  </td>
                </tr>
              ) : (
                flights.map((flight) => {
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
                    <tr key={flight._id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-extrabold text-cyan-300">
                        {flight.flightNumber}
                      </td>
                      <td className="py-3 px-4 text-slate-200">
                        {flight.airline?.name || 'Commercial'}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-slate-100">{flight.departureAirport?.iataCode}</span>
                        <span className="text-[10px] text-slate-400 block">{flight.departureAirport?.city}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-slate-100">{flight.arrivalAirport?.iataCode}</span>
                        <span className="text-[10px] text-slate-400 block">{flight.arrivalAirport?.city}</span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-300">
                        {new Date(flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {flight.delayMinutes > 0 && (
                          <span className="text-amber-400 font-bold block text-[10px]">
                            +{flight.delayMinutes}m delay
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-300">
                        {flight.terminal} / {flight.gate}
                      </td>
                      <td className="py-3 px-4">
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
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${riskBadge}`}>
                          {flight.aiPrediction?.delayProbability ?? 20}% ({riskLevel})
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                        {/* AI Delay Predictor Button */}
                        <button
                          onClick={() => handleRunAiPrediction(flight)}
                          title="Run AI Delay Predictor"
                          className="px-2 py-1 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 rounded text-[11px] font-mono font-bold transition-colors"
                        >
                          AI Predict
                        </button>

                        {/* Update Status (Staff & Ops) */}
                        {canUpdateStatus && (
                          <button
                            onClick={() => openStatusModal(flight)}
                            title="Update Status / Gate"
                            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] transition-colors"
                          >
                            Status
                          </button>
                        )}

                        {/* Delete (Admin only) */}
                        {user?.role === 'admin' && (
                          <button
                            onClick={() => handleDeleteFlight(flight._id, flight.flightNumber)}
                            title="Remove flight"
                            className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: AI Flight Delay Prediction Analysis Drawer */}
      {predictModalData && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel-glow w-full max-w-lg rounded-2xl p-6 border border-cyan-500/40 shadow-2xl relative animate-in zoom-in-95">
            <button
              onClick={() => setPredictModalData(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-glow-cyan">
                <Sparkles className="w-5 h-5 animate-spin" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  AI Delay Prediction Analysis
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                    ML-INFERENCE
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Flight {predictModalData.flight?.flightNumber} ({predictModalData.flight?.departureAirport?.iataCode} → {predictModalData.flight?.arrivalAirport?.iataCode})
                </p>
              </div>
            </div>

            {predictModalData.loading ? (
              <div className="py-12 text-center text-xs text-slate-400">
                <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                Analyzing departure METAR weather, airport congestion & historical fleet metrics...
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                {/* Score Banner */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="text-[10px] text-slate-400 font-mono">DELAY PROBABILITY</div>
                    <div className="text-2xl font-black text-cyan-300 mt-1">
                      {predictModalData.prediction?.delayProbability ?? 20}%
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-mono">RISK CLASSIFICATION</div>
                    <div className="text-base font-extrabold text-amber-400 mt-1.5">
                      {predictModalData.prediction?.riskLevel ?? 'Low'}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-mono">EXPECTED DELAY</div>
                    <div className="text-2xl font-black text-white mt-1">
                      +{predictModalData.prediction?.expectedDelayMinutes ?? 0}m
                    </div>
                  </div>
                </div>

                {/* AI Recommendation Box */}
                <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30">
                  <div className="font-bold text-cyan-300 flex items-center gap-1.5 mb-1 text-[11px] uppercase tracking-wider font-mono">
                    <Sparkles className="w-3.5 h-3.5" /> AI Operational Recommendation
                  </div>
                  <div className="text-slate-200 text-xs leading-relaxed">
                    {predictModalData.prediction?.aiRecommendation}
                  </div>
                </div>

                {/* Contributing Features breakdown */}
                <div>
                  <div className="font-bold text-slate-300 mb-2 font-mono text-[11px]">
                    CONTRIBUTING RISK FACTORS
                  </div>
                  <div className="space-y-2">
                    {predictModalData.prediction?.contributingFactors?.map((f, i) => (
                      <div key={i} className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800 flex items-start justify-between">
                        <div>
                          <div className="font-semibold text-slate-200 text-xs">{f.factor}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{f.description}</div>
                        </div>
                        <span className="font-mono text-xs font-bold text-cyan-300 px-2 py-0.5 bg-slate-950 rounded">
                          {f.impactScore}/100
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setPredictModalData(null)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg font-medium"
                  >
                    Close Analysis
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: Update Flight Status Drawer */}
      {statusModalFlight && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl p-6 border border-slate-700 shadow-2xl relative animate-in zoom-in-95">
            <button
              onClick={() => setStatusModalFlight(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white mb-1">
              Update Flight Status & Gate
            </h3>
            <p className="text-xs text-slate-400 mb-4 font-mono">
              Flight {statusModalFlight.flightNumber} ({statusModalFlight.departureAirport?.iataCode} → {statusModalFlight.arrivalAirport?.iataCode})
            </p>

            <form onSubmit={handleUpdateStatusSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Operational Flight Status</label>
                <select
                  value={statusForm.status}
                  onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Boarding">Boarding</option>
                  <option value="Departed">Departed</option>
                  <option value="Delayed">Delayed</option>
                  <option value="Arrived">Arrived</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Terminal</label>
                  <input
                    type="text"
                    value={statusForm.terminal}
                    onChange={(e) => setStatusForm({ ...statusForm, terminal: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Gate Number</label>
                  <input
                    type="text"
                    value={statusForm.gate}
                    onChange={(e) => setStatusForm({ ...statusForm, gate: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"
                  />
                </div>
              </div>

              {statusForm.status === 'Delayed' && (
                <>
                  <div>
                    <label className="block text-amber-400 font-medium mb-1">Delay Time (Minutes)</label>
                    <input
                      type="number"
                      min="0"
                      value={statusForm.delayMinutes}
                      onChange={(e) => setStatusForm({ ...statusForm, delayMinutes: e.target.value })}
                      className="w-full bg-slate-900 border border-amber-500/50 rounded-lg p-2 text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-amber-400 font-medium mb-1">Delay Primary Reason</label>
                    <input
                      type="text"
                      value={statusForm.delayReason}
                      onChange={(e) => setStatusForm({ ...statusForm, delayReason: e.target.value })}
                      placeholder="e.g. ATC Traffic Holding Pattern / Squall Line"
                      className="w-full bg-slate-900 border border-amber-500/50 rounded-lg p-2 text-slate-100"
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setStatusModalFlight(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-lg transition-colors shadow-glow-cyan"
                >
                  Broadcast Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Schedule New Flight Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-2xl p-6 border border-slate-700 shadow-2xl relative">
            <button
              onClick={() => setCreateModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white mb-1">
              Register New Commercial Flight
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Add new entry to the live flight registry.
            </p>

            <form onSubmit={handleCreateFlight} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Flight Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AI884"
                    value={flightForm.flightNumber}
                    onChange={(e) => setFlightForm({ ...flightForm, flightNumber: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Airline</label>
                  <select
                    required
                    value={flightForm.airline}
                    onChange={(e) => setFlightForm({ ...flightForm, airline: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"
                  >
                    <option value="">Select Airline</option>
                    {airlines.map((a) => (
                      <option key={a._id} value={a._id}>{a.name} ({a.iataCode})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Departure Airport</label>
                  <select
                    required
                    value={flightForm.departureAirport}
                    onChange={(e) => setFlightForm({ ...flightForm, departureAirport: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"
                  >
                    <option value="">Origin Airport</option>
                    {airports.map((a) => (
                      <option key={a._id} value={a._id}>{a.iataCode} - {a.city}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Arrival Airport</label>
                  <select
                    required
                    value={flightForm.arrivalAirport}
                    onChange={(e) => setFlightForm({ ...flightForm, arrivalAirport: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"
                  >
                    <option value="">Destination Airport</option>
                    {airports.map((a) => (
                      <option key={a._id} value={a._id}>{a.iataCode} - {a.city}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Assigned Aircraft</label>
                  <select
                    required
                    value={flightForm.aircraft}
                    onChange={(e) => setFlightForm({ ...flightForm, aircraft: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"
                  >
                    <option value="">Select Aircraft</option>
                    {aircraftList.map((ac) => (
                      <option key={ac._id} value={ac._id}>{ac.registrationNumber} ({ac.model})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Base Ticket Price ($)</label>
                  <input
                    type="number"
                    value={flightForm.basePrice}
                    onChange={(e) => setFlightForm({ ...flightForm, basePrice: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Departure Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={flightForm.departureTime}
                    onChange={(e) => setFlightForm({ ...flightForm, departureTime: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Arrival Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={flightForm.arrivalTime}
                    onChange={(e) => setFlightForm({ ...flightForm, arrivalTime: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-lg transition-colors shadow-glow-cyan"
                >
                  Save & Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
