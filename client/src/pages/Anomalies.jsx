import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle,
  Clock,
  Filter,
  RefreshCw,
  Search,
  ExternalLink,
  ChevronRight,
  Activity,
  Layers
} from 'lucide-react';
import { aiApi } from '../services/api';
import { useSocket } from '../context/SocketContext';

export const Anomalies = () => {
  const { socket } = useSocket();
  const [anomalies, setAnomalies] = useState([]);
  const [severityFilter, setSeverityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetchAnomalies = async () => {
    try {
      setLoading(true);
      const res = await aiApi.getAnomalies({
        severity: severityFilter,
        status: statusFilter,
      });
      if (res.data?.success) {
        setAnomalies(res.data.anomalies);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnomalies();
  }, [severityFilter, statusFilter]);

  useEffect(() => {
    if (!socket) return;
    socket.on('anomalyUpdated', fetchAnomalies);
    return () => socket.off('anomalyUpdated', fetchAnomalies);
  }, [socket]);

  const handleResolve = async (id) => {
    try {
      await aiApi.resolveAnomaly(id, {
        status: 'Mitigated',
        mitigationNotes: 'Operational mitigation protocol applied by duty dispatcher.',
      });
      fetchAnomalies();
      alert('Anomaly marked as Mitigated.');
    } catch (err) {
      alert('Failed to update anomaly');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Aviation Anomaly Detection Center
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated monitoring for unexpected delay spikes, unusual booking surges, telemetry variations & route detours.
          </p>
        </div>

        <button
          onClick={fetchAnomalies}
          className="flex items-center space-x-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors border border-slate-700"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Rescan Sensor Streams</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 flex flex-wrap gap-4 items-center justify-between text-xs">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Severity:</span>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-slate-900 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="flex items-center space-x-2 text-slate-400">
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-900 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Investigating">Investigating</option>
              <option value="Mitigated">Mitigated</option>
            </select>
          </div>
        </div>

        <div className="text-slate-400 font-mono text-[11px]">
          Showing {anomalies.length} anomaly detections
        </div>
      </div>

      {/* Anomalies List */}
      <div className="space-y-4">
        {anomalies.length === 0 ? (
          <div className="glass-panel p-12 text-center text-xs text-slate-500 rounded-2xl">
            {loading ? 'Analyzing telemetry feeds for statistical outliers...' : 'No active anomalies matching current filter.'}
          </div>
        ) : (
          anomalies.map((a) => {
            const isCritical = a.severity === 'Critical';
            const isHigh = a.severity === 'High';
            const isMedium = a.severity === 'Medium';

            const borderCls = isCritical
              ? 'border-rose-500/40 bg-rose-950/10'
              : isHigh
              ? 'border-amber-500/40 bg-amber-950/10'
              : 'border-slate-800 bg-slate-900/40';

            const badgeCls = isCritical
              ? 'bg-rose-950 text-rose-300 border-rose-500/40'
              : isHigh
              ? 'bg-amber-950 text-amber-300 border-amber-500/40'
              : isMedium
              ? 'bg-purple-950 text-purple-300 border-purple-500/40'
              : 'bg-cyan-950 text-cyan-300 border-cyan-500/40';

            return (
              <div key={a._id} className={`glass-panel p-5 rounded-2xl border ${borderCls} space-y-3 transition-all hover:border-cyan-500/30`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center space-x-3">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold border ${badgeCls}`}>
                      {a.severity} Severity
                    </span>
                    <span className="text-xs font-mono text-cyan-400 font-bold">
                      [{a.anomalyType}]
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Target: <strong className="text-slate-200">{a.entityIdentifier}</strong>
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-xs">
                    <span className="text-slate-500 font-mono text-[10px]">
                      {new Date(a.createdAt).toLocaleString()}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                        a.status === 'Active'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : a.status === 'Investigating'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}
                    >
                      {a.status}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white">{a.title}</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{a.description}</p>
                </div>

                {/* Metrics Comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono">
                  <div>
                    <span className="text-slate-500 text-[10px]">DETECTED SENSOR VALUE</span>
                    <div className="text-sm font-bold text-rose-400 mt-0.5">{a.detectedMetricValue}</div>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px]">EXPECTED BASELINE</span>
                    <div className="text-sm font-bold text-slate-300 mt-0.5">{a.baselineExpectedValue}</div>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px]">STATISTICAL DEVIATION</span>
                    <div className="text-sm font-bold text-amber-400 mt-0.5">+{a.deviationPercentage}%</div>
                  </div>
                </div>

                {/* Mitigation Recommendation */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1 text-xs">
                  <div className="text-slate-400">
                    <strong className="text-cyan-300">Suggested Action: </strong>
                    {a.suggestedMitigation}
                  </div>

                  {a.status !== 'Mitigated' && (
                    <button
                      onClick={() => handleResolve(a._id)}
                      className="px-3 py-1.5 bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors"
                    >
                      Apply Mitigation
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
