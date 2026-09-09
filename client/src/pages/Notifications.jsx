import React, { useState, useEffect } from 'react';
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Info,
  Clock,
  Check,
  RefreshCw
} from 'lucide-react';
import { notificationApi } from '../services/api';

export const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = async () => {
    try {
      setLoading(true);
      const res = await notificationApi.getAll();
      if (res.data?.success) {
        setNotifications(res.data.notifications);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await notificationApi.markRead(id);
      fetchNotifs();
    } catch (err) {}
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllRead();
      fetchNotifs();
    } catch (err) {}
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-cyan-400" />
            Operational Notifications & Alerts
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time feed of delay risk advisories, gate assignments, anomaly detections and system dispatches.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleMarkAllRead}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs rounded-lg transition-colors border border-slate-700"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark All Read</span>
          </button>
          <button
            onClick={fetchNotifs}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors border border-slate-700"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="glass-panel p-12 text-center text-xs text-slate-500 rounded-2xl">
            {loading ? 'Retrieving notifications...' : 'No notifications in system logs.'}
          </div>
        ) : (
          notifications.map((n) => {
            const isCritical = n.severity === 'critical';
            const isWarning = n.severity === 'warning';
            const isSuccess = n.severity === 'success';

            const borderCls = isCritical
              ? 'border-rose-500/40 bg-rose-950/15'
              : isWarning
              ? 'border-amber-500/40 bg-amber-950/15'
              : isSuccess
              ? 'border-emerald-500/40 bg-emerald-950/15'
              : 'border-slate-800 bg-slate-900/40';

            return (
              <div
                key={n._id}
                className={`glass-panel p-4 rounded-xl border ${borderCls} flex items-start justify-between gap-4 text-xs transition-all ${
                  n.isRead ? 'opacity-70' : 'shadow-glow-cyan'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="mt-0.5">
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
                  <div>
                    <div className="font-bold text-slate-100 flex items-center gap-2">
                      <span>{n.title}</span>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                      )}
                    </div>
                    <div className="text-slate-300 mt-1 leading-relaxed">{n.message}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-1.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(n.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>

                {!n.isRead && (
                  <button
                    onClick={() => handleMarkRead(n._id)}
                    className="text-[11px] text-cyan-400 hover:underline flex-shrink-0"
                  >
                    Mark Read
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
