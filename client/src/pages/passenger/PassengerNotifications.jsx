import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Ticket,
  Luggage,
  Clock,
  Sparkles,
  Trash2,
  CheckCheck
} from 'lucide-react';

export const PassengerNotifications = () => {
  const [filter, setFilter] = useState('ALL');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Gate Assigned: Gate B4',
      message: 'Departure gate for Air India AI 203 (BLR → BOM) has been confirmed as Terminal 1, Gate B4. Boarding starts at 07:50 AM.',
      category: 'GATE',
      time: '10 minutes ago',
      read: false,
      priority: 'high'
    },
    {
      id: 2,
      title: 'Online Web Check-in Available',
      message: 'Web check-in is now open for your upcoming voyage AI 203. Confirm your seat 12A and download your digital boarding pass.',
      category: 'CHECKIN',
      time: '1 hour ago',
      read: false,
      priority: 'medium'
    },
    {
      id: 3,
      title: 'AI On-Time Clearance Confirmed',
      message: 'SkyFlow AI delay telemetry models project flight AI 203 on-time with 0m forecasted turnaround delay. Clear weather en route.',
      category: 'FLIGHT',
      time: '2 hours ago',
      read: true,
      priority: 'low'
    },
    {
      id: 4,
      title: 'Booking Confirmed: PNR SKF-8842',
      message: 'Your booking for BLR → BOM on Air India has been successfully ticketed. 1 check-in bag + 1 cabin allowance verified.',
      category: 'BOOKING',
      time: 'Yesterday',
      read: true,
      priority: 'low'
    },
    {
      id: 5,
      title: 'Mileage Credited: +1,060 Miles',
      message: 'Frequent flyer miles for your recent IndiGo flight 6E 404 (DEL → BLR) have been credited to your SkyFlow Gold account.',
      category: 'MILES',
      time: '3 days ago',
      read: true,
      priority: 'low'
    }
  ]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'GATE':
        return <MapPin className="w-4 h-4 text-cyan-400" />;
      case 'CHECKIN':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'FLIGHT':
        return <Sparkles className="w-4 h-4 text-cyan-400" />;
      case 'BOOKING':
        return <Ticket className="w-4 h-4 text-purple-400" />;
      case 'MILES':
        return <CheckCheck className="w-4 h-4 text-amber-400" />;
      default:
        return <Bell className="w-4 h-4 text-blue-400" />;
    }
  };

  const filtered = notifications.filter((n) => {
    if (filter === 'UNREAD') return !n.read;
    if (filter === 'GATE') return n.category === 'GATE';
    if (filter === 'FLIGHT') return n.category === 'FLIGHT' || n.category === 'CHECKIN';
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-cyan-400" />
            Passenger Notifications & Alerts
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time automated flight alerts, gate change notices, check-in prompts, and mileage updates.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/60 text-cyan-400 hover:text-cyan-300 text-xs font-semibold transition-all w-fit"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark all as read ({unreadCount})
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        {[
          { key: 'ALL', label: 'All Alerts' },
          { key: 'UNREAD', label: `Unread (${unreadCount})` },
          { key: 'GATE', label: 'Gate Notices' },
          { key: 'FLIGHT', label: 'Flight Updates' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === tab.key
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-slate-900/40 border border-slate-800 text-slate-400 text-xs">
            No notifications found in this category.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all duration-200 flex items-start justify-between gap-4 ${
                item.read
                  ? 'bg-slate-900/40 border-slate-800/80 opacity-80'
                  : 'bg-slate-900/90 border-cyan-500/30 shadow-md shadow-cyan-950/20'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 shrink-0 mt-0.5">
                  {getCategoryIcon(item.category)}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-white">{item.title}</h3>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {item.message}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-500 font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.time}
                    </span>
                    <span className="uppercase font-bold text-cyan-400/80">
                      • {item.category}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => clearNotification(item.id)}
                className="text-slate-600 hover:text-slate-300 transition-colors p-1"
                title="Dismiss"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
