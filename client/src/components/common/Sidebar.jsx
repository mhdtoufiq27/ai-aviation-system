import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Plane,
  Ticket,
  UserCheck,
  Building2,
  MapPin,
  Cpu,
  BarChart3,
  AlertTriangle,
  Bell,
  Settings,
  User,
  Radio,
  CheckCircle2,
  QrCode,
  History,
  Sparkles,
  Search,
  CloudSun,
  LogOut,
  Shield
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const { isConnected } = useSocket();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const role = (user?.role || 'passenger').toLowerCase();
  const isManager = role === 'airline_manager' || role === 'manager';
  const isStaff = role === 'staff' || role === 'ground_staff';
  const isAdmin = role === 'admin';

  // Navigation configurations tailored strictly per role
  const adminNavItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'User Management', path: '/admin/users', icon: Users, badge: 'Auth' },
    { label: 'Flight Management', path: '/admin/flights', icon: Plane },
    { label: 'Bookings', path: '/admin/bookings', icon: Ticket },
    { label: 'Passengers', path: '/admin/passengers', icon: Users },
    { label: 'Aircraft Fleet', path: '/admin/aircraft', icon: Plane },
    { label: 'Crew Operations', path: '/admin/crew', icon: UserCheck },
    { label: 'Airlines', path: '/admin/airlines', icon: Building2 },
    { label: 'Airports & Weather', path: '/admin/airports', icon: MapPin },
    { label: 'AI Predictions', path: '/admin/ai-predictions', icon: Cpu, badge: 'AeroAI' },
    { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { label: 'Anomalies', path: '/admin/anomalies', icon: AlertTriangle },
    { label: 'Notifications', path: '/admin/notifications', icon: Bell },
    { label: 'System Settings', path: '/admin/settings', icon: Settings },
  ];

  const managerNavItems = [
    { label: 'Dashboard', path: '/manager/dashboard', icon: LayoutDashboard },
    { label: 'Flight Scheduling', path: '/manager/flights', icon: Plane },
    { label: 'Aircraft Fleet', path: '/manager/aircraft', icon: Plane },
    { label: 'Crew Operations', path: '/manager/crew', icon: UserCheck },
    { label: 'Passenger Overview', path: '/manager/passengers', icon: Users },
    { label: 'Booking Overview', path: '/manager/bookings', icon: Ticket },
    { label: 'AI Predictions', path: '/manager/ai-predictions', icon: Cpu, badge: 'AeroAI' },
    { label: 'Analytics', path: '/manager/analytics', icon: BarChart3 },
    { label: 'Notifications', path: '/manager/notifications', icon: Bell },
    { label: 'Profile', path: '/manager/profile', icon: User },
  ];

  const staffNavItems = [
    { label: 'Dashboard', path: '/staff/dashboard', icon: LayoutDashboard },
    { label: 'Flight Status', path: '/staff/flight-status', icon: Radio },
    { label: 'Passenger Check-in', path: '/staff/check-in', icon: CheckCircle2 },
    { label: 'Gate Operations', path: '/staff/gates', icon: MapPin },
    { label: 'Boarding Validation', path: '/staff/boarding-pass-validation', icon: QrCode },
    { label: 'Flight Updates', path: '/staff/flight-updates', icon: Plane },
    { label: 'Weather Telemetry', path: '/staff/weather', icon: CloudSun },
    { label: 'Notifications', path: '/staff/notifications', icon: Bell },
    { label: 'Profile', path: '/staff/profile', icon: User },
  ];

  const passengerNavItems = [
    { label: 'Dashboard', path: '/passenger/dashboard', icon: LayoutDashboard },
    { label: 'Search Flights', path: '/passenger/search-flights', icon: Search },
    { label: 'My Bookings', path: '/passenger/my-bookings', icon: Ticket, badge: 'Active' },
    { label: 'Flight Status', path: '/passenger/flight-status', icon: Radio },
    { label: 'Check-in', path: '/passenger/check-in', icon: CheckCircle2 },
    { label: 'Boarding Pass', path: '/passenger/boarding-pass', icon: QrCode },
    { label: 'My Travel History', path: '/passenger/travel-history', icon: History },
    { label: 'AI Travel Assistant', path: '/passenger/ai-assistant', icon: Sparkles, badge: 'AeroAI' },
    { label: 'Notifications', path: '/passenger/notifications', icon: Bell },
    { label: 'Profile & Settings', path: '/passenger/profile', icon: User },
  ];

  let currentNavItems = passengerNavItems;
  let roleTitle = 'PASSENGER PORTAL';
  let roleBadgeColor = 'text-cyan-400';

  if (isAdmin) {
    currentNavItems = adminNavItems;
    roleTitle = 'ADMIN CONSOLE';
    roleBadgeColor = 'text-purple-400';
  } else if (isManager) {
    currentNavItems = managerNavItems;
    roleTitle = 'AIRLINE OPERATIONS';
    roleBadgeColor = 'text-blue-400';
  } else if (isStaff) {
    currentNavItems = staffNavItems;
    roleTitle = 'GROUND OPERATIONS';
    roleBadgeColor = 'text-amber-400';
  }

  return (
    <aside className="w-64 bg-[#08101e] border-r border-slate-800/80 flex flex-col h-screen sticky top-0 select-none z-30">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center shadow-glow-cyan">
            <Plane className="w-5 h-5 text-black transform -rotate-45" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#08101e] animate-ping" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#08101e]" />
          </div>
          <div>
            <div className="font-extrabold tracking-wider text-lg bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">
              SKYFLOW <span className="text-xs font-mono text-cyan-400 font-normal">AI</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`}></span>
              <span className={roleBadgeColor}>{roleTitle}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Role Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3 pb-2 font-mono flex items-center justify-between">
          <span>Navigation Menu</span>
          <span className="text-[9px] font-mono text-cyan-500/80">{currentNavItems.length} modules</span>
        </div>

        {currentNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`
              }
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* User Profile & Secure Logout Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60">
        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/90 border border-slate-800">
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-bold text-xs uppercase shrink-0">
              {user?.name ? user.name[0] : 'U'}
            </div>
            <div className="truncate">
              <div className="text-xs font-semibold text-slate-200 truncate">
                {user?.name || 'Authorized User'}
              </div>
              <div className="text-[10px] text-cyan-400 font-mono capitalize tracking-wide truncate">
                {role.replace('_', ' ')}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Sign Out of Operations Console"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
