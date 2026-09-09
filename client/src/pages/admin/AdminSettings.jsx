import React, { useState } from 'react';
import { Settings, Shield, Cpu, Database, Save, CheckCircle2, Sliders, Bell } from 'lucide-react';

export const AdminSettings = () => {
  const [saved, setSaved] = useState(false);
  const [config, setConfig] = useState({
    telemetryRefreshRate: 15,
    aiModelEndpoint: 'http://localhost:5001',
    anomalyDetectionThreshold: 0.85,
    maxConcurrentFlights: 250,
    enableRealtimeRadar: true,
    enableMetarWeatherSync: true,
    logRetentionDays: 90,
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-400" />
            System Administration & Telemetry Settings
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure system microservices, AI inference parameters, security rules, and telemetry sync timers.
          </p>
        </div>

        {saved && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
            <CheckCircle2 className="w-4 h-4" />
            System Configurations Updated!
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* AI & Telemetry Service Settings */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            AI Inference & Telemetry Engine
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Telemetry Radar Sync Interval (seconds)</label>
              <input
                type="number"
                value={config.telemetryRefreshRate}
                onChange={(e) => setConfig({ ...config, telemetryRefreshRate: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Python AI Microservice URL</label>
              <input
                type="text"
                value={config.aiModelEndpoint}
                onChange={(e) => setConfig({ ...config, aiModelEndpoint: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Anomaly Detection Sensitivity Threshold</label>
              <input
                type="number"
                step="0.05"
                min="0.5"
                max="0.99"
                value={config.anomalyDetectionThreshold}
                onChange={(e) => setConfig({ ...config, anomalyDetectionThreshold: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Max Realtime Monitored Aircraft</label>
              <input
                type="number"
                value={config.maxConcurrentFlights}
                onChange={(e) => setConfig({ ...config, maxConcurrentFlights: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Security & Data Rules */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            Security & Realtime Policies
          </h2>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800 cursor-pointer">
              <div>
                <div className="font-bold text-white">Enable Realtime WebSocket Radar Broadcasts</div>
                <div className="text-[11px] text-slate-400">Stream live GPS coordinate and flight status changes to active client dashboards.</div>
              </div>
              <input
                type="checkbox"
                checked={config.enableRealtimeRadar}
                onChange={(e) => setConfig({ ...config, enableRealtimeRadar: e.target.checked })}
                className="rounded border-slate-700 text-cyan-500 w-4 h-4 bg-slate-950"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800 cursor-pointer">
              <div>
                <div className="font-bold text-white">Automated Global METAR Weather Synchronization</div>
                <div className="text-[11px] text-slate-400">Fetch active airport barometric, precipitation, and visibility telemetry every 15 minutes.</div>
              </div>
              <input
                type="checkbox"
                checked={config.enableMetarWeatherSync}
                onChange={(e) => setConfig({ ...config, enableMetarWeatherSync: e.target.checked })}
                className="rounded border-slate-700 text-cyan-500 w-4 h-4 bg-slate-950"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 transition-all"
          >
            <Save className="w-4 h-4" />
            Save System Configurations
          </button>
        </div>
      </form>
    </div>
  );
};
