import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Plus,
  RefreshCw,
  Fuel,
  Activity,
  Calendar
} from 'lucide-react';
import { aircraftApi, airlineApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const Aircraft = () => {
  const { user } = useAuth();
  const [fleet, setFleet] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetchFleet = async () => {
    try {
      setLoading(true);
      const res = await aircraftApi.getAll({ status: statusFilter });
      if (res.data?.success) {
        setFleet(res.data.aircraft);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    airlineApi.getAll().then((res) => {
      if (res.data?.success) setAirlines(res.data.airlines);
    });
    fetchFleet();
  }, [statusFilter]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await aircraftApi.update(id, { maintenanceStatus: newStatus });
      fetchFleet();
    } catch (err) {
      alert('Failed to update aircraft maintenance status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Wrench className="w-5 h-5 text-cyan-400" />
            Aircraft Fleet & Maintenance Records
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            50 commercial aircraft tracking: health scores, fuel capacities, inspection cycles, and service readiness.
          </p>
        </div>

        <button
          onClick={fetchFleet}
          className="flex items-center space-x-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors border border-slate-700"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Fleet Telemetry</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2 text-slate-400">
          <Filter className="w-3.5 h-3.5" />
          <span>Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
          >
            <option value="All">All Aircraft (50)</option>
            <option value="Active">Active In-Service</option>
            <option value="Under Maintenance">Under Maintenance</option>
            <option value="Grounded">Grounded</option>
          </select>
        </div>
        <div className="font-mono text-slate-400">Total: {fleet.length} units</div>
      </div>

      {/* Fleet Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fleet.map((ac) => {
          const isActive = ac.maintenanceStatus === 'Active';
          const isMaint = ac.maintenanceStatus === 'Under Maintenance';

          return (
            <div
              key={ac._id}
              className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-cyan-500/30 transition-all space-y-4 text-xs"
            >
              <div className="flex items-start justify-between border-b border-slate-800/80 pb-3">
                <div>
                  <div className="font-mono text-base font-black text-cyan-300">
                    {ac.registrationNumber}
                  </div>
                  <div className="text-slate-300 font-semibold mt-0.5">
                    {ac.manufacturer} {ac.model}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Carrier: {ac.airline?.name || 'Air India'}
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    isActive
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                      : isMaint
                      ? 'bg-amber-950 text-amber-300 border border-amber-500/30'
                      : 'bg-rose-950 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {ac.maintenanceStatus}
                </span>
              </div>

              {/* Health Score & Fuel Bars */}
              <div className="space-y-2 font-mono">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">Health Index:</span>
                    <span className={`font-bold ${ac.healthScore > 85 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {ac.healthScore}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${ac.healthScore > 85 ? 'bg-emerald-400' : 'bg-amber-400'}`}
                      style={{ width: `${ac.healthScore}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">Fuel Level:</span>
                    <span className="text-cyan-300 font-bold">{ac.currentFuelLevel}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-cyan-400"
                      style={{ width: `${ac.currentFuelLevel}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Spec details */}
              <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-950/70 rounded-xl border border-slate-800 text-[11px] font-mono">
                <div>
                  <span className="text-slate-500 block">SEATING</span>
                  <span className="font-bold text-slate-200">{ac.seatingCapacity} Pax</span>
                </div>
                <div>
                  <span className="text-slate-500 block">FUEL CAPACITY</span>
                  <span className="font-bold text-slate-200">{ac.fuelCapacityLitres?.toLocaleString()} L</span>
                </div>
                <div>
                  <span className="text-slate-500 block">LAST SERVICE</span>
                  <span className="text-slate-300">{new Date(ac.lastMaintenanceDate).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">NEXT OVERHAUL</span>
                  <span className="text-amber-300">{new Date(ac.nextMaintenanceDate).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Admin/Manager Actions */}
              {(user?.role === 'admin' || user?.role === 'airline_manager') && (
                <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
                  <span className="text-[10px] text-slate-400">Update Status:</span>
                  <div className="flex space-x-1.5">
                    <button
                      onClick={() => handleStatusChange(ac._id, 'Active')}
                      className="px-2 py-0.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/30 rounded text-[10px]"
                    >
                      Active
                    </button>
                    <button
                      onClick={() => handleStatusChange(ac._id, 'Under Maintenance')}
                      className="px-2 py-0.5 bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-500/30 rounded text-[10px]"
                    >
                      Maint
                    </button>
                    <button
                      onClick={() => handleStatusChange(ac._id, 'Grounded')}
                      className="px-2 py-0.5 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-500/30 rounded text-[10px]"
                    >
                      Ground
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
