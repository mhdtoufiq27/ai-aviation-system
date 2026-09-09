import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Search,
  Clock,
  User,
  Plane,
  ChevronDown,
  LogOut,
  Shield,
  Building2,
  UserCheck,
  Users
} from 'lucide-react';
import { useAuth, getRoleHome } from '../../context/AuthContext';
import { notificationApi } from '../../services/api';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [utcTime, setUtcTime] = useState('');
  const [localTime, setLocalTime] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Aviation World Clocks
  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().slice(17, 25) + ' UTC');
      setLocalTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch notifications
  const fetchNotifs = async () => {
    try {
      const res = await notificationApi.getAll();
      if (res.data?.success) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (err) {}
  };

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 20000);
    return () => clearInterval(interval);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const role = (user?.role || '').toLowerCase();
    if (role === 'passenger') {
      navigate(`/passenger/search-flights?query=${encodeURIComponent(searchQuery.trim())}`);
    } else if (role === 'admin') {
      navigate(`/admin/flights?search=${encodeURIComponent(searchQuery.trim())}`);
    } else if (role === 'airline_manager' || role === 'manager') {
      navigate(`/manager/flights?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate(`/staff/flight-status?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    setIsProfileOpen(false);
    logout();
    navigate('/login', { replace: true });
  };

  const role = (user?.role || 'passenger').toLowerCase();
  const getRoleBadge = () => {
    if (role === 'admin') {
      return (
        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-purple-950/70 border border-purple-500/40 text-purple-300 font-mono text-xs font-bold shadow-lg shadow-purple-950/40">
          <Shield className="w-3.5 h-3.5 text-purple-400" />
          <span>Admin</span>
        </div>
      );
    }
    if (role === 'airline_manager' || role === 'manager') {
      return (
        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-blue-950/70 border border-blue-500/40 text-blue-300 font-mono text-xs font-bold shadow-lg shadow-blue-950/40">
          <Building2 className="w-3.5 h-3.5 text-blue-400" />
          <span>Airline Manager</span>
        </div>
      );
    }
    if (role === 'staff' || role === 'ground_staff') {
      return (
        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-amber-950/70 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold shadow-lg shadow-amber-950/40">
          <UserCheck className="w-3.5 h-3.5 text-amber-400" />
          <span>Ground Staff</span>
        </div>
      );
    }
    return (
      <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold shadow-glow-cyan">
        <Users className="w-3.5 h-3.5 text-cyan-400" />
        <span>Passenger</span>
      </div>
    );
  };

  return (
    <header className="h-16 bg-[#08101e]/90 backdrop-blur-md border-b border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative w-80 max-w-md hidden md:block">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search flights, routes, airports..."
          className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-900/90 text-slate-100 placeholder-slate-500 rounded-lg border border-slate-700/70 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
        />
      </form>

      {/* Center Clocks (Aviation UTC / Local) */}
      <div className="flex items-center space-x-4 bg-slate-900/80 px-3.5 py-1.5 rounded-lg border border-slate-800">
        <div className="flex items-center space-x-1.5 text-xs font-mono text-cyan-300">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-semibold">{utcTime}</span>
        </div>
        <div className="w-[1px] h-3.5 bg-slate-700"></div>
        <div className="text-xs font-mono text-slate-400">
          LOCAL: <span className="text-slate-200">{localTime}</span>
        </div>
      </div>

      {/* Right Controls: Role Badge, Notifications & Profile */}
      <div className="flex items-center space-x-3.5">
        {/* Static Role Badge - Strictly NO Role Switcher in Normal UI */}
        {getRoleBadge()}

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 text-slate-300 hover:text-cyan-400 bg-slate-900/80 hover:bg-slate-800/80 rounded-lg border border-slate-800 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center border-2 border-[#08101e]">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 glass-dropdown rounded-xl border border-slate-800 shadow-2xl z-50">
              <div className="p-3 border-b border-slate-800 flex items-center justify-between">
                <div className="font-semibold text-xs text-slate-200">System Telemetry Alerts</div>
                <span className="text-[10px] text-cyan-400 font-mono">{unreadCount} unread</span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500">No active alerts.</div>
                ) : (
                  notifications.slice(0, 5).map((n) => (
                    <div key={n._id} className="p-3 hover:bg-slate-800/40 transition-colors text-xs">
                      <div className="font-medium text-slate-200 flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${n.severity === 'critical' ? 'bg-rose-500' : n.severity === 'warning' ? 'bg-amber-400' : 'bg-cyan-400'}`} />
                        {n.title}
                      </div>
                      <div className="text-slate-400 mt-1 text-[11px] line-clamp-2">{n.message}</div>
                      <div className="text-[9px] text-slate-500 font-mono mt-1">
                        {new Date(n.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-2 pl-2 pr-1 py-1 rounded-lg hover:bg-slate-800/60 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-cyan-600 text-black font-extrabold text-xs flex items-center justify-center shadow-glow-cyan uppercase">
              {user?.name ? user.name[0] : 'U'}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 glass-dropdown rounded-xl border border-slate-800 p-2 shadow-2xl z-50">
              <div className="px-3 py-2 border-b border-slate-800">
                <div className="text-xs font-semibold text-slate-200 truncate">{user?.name || 'User'}</div>
                <div className="text-[10px] text-slate-400 truncate">{user?.email || 'user@skyflow.com'}</div>
                <div className="text-[10px] text-cyan-400 font-mono mt-0.5 capitalize">
                  Clearance: {role.replace('_', ' ')}
                </div>
              </div>

              <div className="mt-1 space-y-1">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate(getRoleHome(user?.role));
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 rounded-lg flex items-center gap-2"
                >
                  <Plane className="w-3.5 h-3.5 text-cyan-400" /> My Workspace
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-rose-950/40 rounded-lg flex items-center gap-2 transition-colors font-semibold"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" /> Sign Out (Logout)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
