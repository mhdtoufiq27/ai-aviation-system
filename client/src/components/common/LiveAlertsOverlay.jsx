import React from 'react';
import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from 'lucide-react';
import { useSocket } from '../../context/SocketContext';

export const LiveAlertsOverlay = () => {
  const { liveAlerts, dismissAlert } = useSocket();

  if (!liveAlerts || liveAlerts.length === 0) return null;

  return (
    <div className="fixed top-20 right-6 z-50 space-y-2.5 max-w-sm w-full pointer-events-none">
      {liveAlerts.map((alert) => {
        const isWarning = alert.type === 'warning';
        const isCritical = alert.type === 'critical';
        const isSuccess = alert.type === 'success';

        return (
          <div
            key={alert.id}
            className={`pointer-events-auto p-3.5 rounded-xl border backdrop-blur-xl shadow-2xl flex items-start space-x-3 transition-all animate-in slide-in-from-top-4 ${
              isCritical
                ? 'bg-rose-950/90 border-rose-500/50 text-rose-200'
                : isWarning
                ? 'bg-amber-950/90 border-amber-500/50 text-amber-200'
                : isSuccess
                ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
                : 'bg-cyan-950/90 border-cyan-500/50 text-cyan-200'
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {isCritical ? (
                <AlertCircle className="w-4 h-4 text-rose-400" />
              ) : isWarning ? (
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              ) : isSuccess ? (
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              ) : (
                <Info className="w-4 h-4 text-cyan-400" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-slate-100 flex items-center justify-between">
                <span>{alert.title}</span>
                <span className="text-[9px] font-mono opacity-60">{alert.time}</span>
              </div>
              <div className="text-[11px] text-slate-300 mt-0.5 leading-snug">{alert.message}</div>
            </div>

            <button
              onClick={() => dismissAlert(alert.id)}
              className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
