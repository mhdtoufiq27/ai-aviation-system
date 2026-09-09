import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Search,
  Filter,
  Plane,
  Shield,
  Clock,
  RefreshCw,
  CheckCircle,
  Briefcase
} from 'lucide-react';
import { crewApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const Crew = () => {
  const { user } = useAuth();
  const [crewList, setCrewList] = useState([]);
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetchCrew = async () => {
    try {
      setLoading(true);
      const res = await crewApi.getAll({
        role: roleFilter,
        status: statusFilter,
      });
      if (res.data?.success) {
        setCrewList(res.data.crew);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrew();
  }, [roleFilter, statusFilter]);

  const handleAvailabilityChange = async (id, newStatus) => {
    try {
      await crewApi.update(id, { availabilityStatus: newStatus });
      fetchCrew();
    } catch (err) {
      alert('Failed to update crew availability');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-cyan-400" />
            Flight Crew Operations & Duty Roster
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            60 certified personnel: Captains, First Officers, Cabin Purser staff, and Ramp Ground crew assignments.
          </p>
        </div>

        <button
          onClick={fetchCrew}
          className="flex items-center space-x-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors border border-slate-700"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Crew Roster</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-slate-900 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All Roles (60)</option>
              <option value="Pilot">Commanding Captains</option>
              <option value="Co-Pilot">First Officers (Co-Pilots)</option>
              <option value="Cabin Crew">Cabin Crew / In-Flight Service</option>
              <option value="Ground Staff">Ground Operations Staff</option>
            </select>
          </div>

          <div className="flex items-center space-x-2 text-slate-400">
            <span>Duty Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-900 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All Availability</option>
              <option value="Available">Available for Dispatch</option>
              <option value="On Duty">On Duty / In-Flight</option>
              <option value="Resting">Rest Period (Mandatory)</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>
        </div>

        <div className="font-mono text-slate-400">
          Showing {crewList.length} crew members
        </div>
      </div>

      {/* Crew Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-900/90 text-slate-400 font-mono border-b border-slate-800 text-[11px]">
                <th className="py-3 px-4">EMPLOYEE ID</th>
                <th className="py-3 px-4">NAME</th>
                <th className="py-3 px-4">ROLE</th>
                <th className="py-3 px-4">AIRLINE</th>
                <th className="py-3 px-4">ASSIGNED FLIGHT</th>
                <th className="py-3 px-4">FLIGHT HOURS</th>
                <th className="py-3 px-4">AVAILABILITY</th>
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {crewList.map((c) => {
                const isOnDuty = c.availabilityStatus === 'On Duty';
                const isAvail = c.availabilityStatus === 'Available';

                return (
                  <tr key={c._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-cyan-300">
                      {c.employeeId}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-100">
                      {c.name}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {c.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {c.airline?.name || 'Carrier'}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {c.assignedFlight ? (
                        <span className="font-bold text-cyan-300">
                          {c.assignedFlight.flightNumber} ({c.assignedFlight.departureAirport?.iataCode} → {c.assignedFlight.arrivalAirport?.iataCode})
                        </span>
                      ) : (
                        <span className="text-slate-500">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300">
                      {c.totalHoursFlown} hrs
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          isOnDuty
                            ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30'
                            : isAvail
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {c.availabilityStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <select
                        value={c.availabilityStatus}
                        onChange={(e) => handleAvailabilityChange(c._id, e.target.value)}
                        className="bg-slate-900 text-slate-300 border border-slate-700 rounded px-2 py-1 text-[11px] focus:outline-none"
                      >
                        <option value="Available">Available</option>
                        <option value="On Duty">On Duty</option>
                        <option value="Resting">Resting</option>
                        <option value="On Leave">On Leave</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
