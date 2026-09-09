import React from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth, getRoleHome } from '../../context/AuthContext';
import { ShieldAlert, ArrowLeft, Plane } from 'lucide-react';

export const RoleGuard = ({ allowedRoles }) => {
  const { user, token, isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050b14] flex flex-col items-center justify-center text-cyan-400 font-mono text-xs">
        <div className="relative w-12 h-12 mb-4">
          <div className="w-12 h-12 border-2 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin"></div>
          <Plane className="w-5 h-5 text-cyan-400 absolute inset-0 m-auto" />
        </div>
        <div className="tracking-widest uppercase font-bold text-slate-300">
          Verifying Security Clearance...
        </div>
      </div>
    );
  }

  // If unauthenticated, redirect to login
  if (!isAuthenticated || !user || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If specific roles required, verify authorization
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = (user.role || '').toLowerCase();
    const isAuthorized = allowedRoles.some((r) => {
      const allowed = r.toLowerCase();
      if (allowed === userRole) return true;
      if (allowed === 'manager' && userRole === 'airline_manager') return true;
      if (allowed === 'airline_manager' && userRole === 'manager') return true;
      if (allowed === 'staff' && userRole === 'ground_staff') return true;
      return false;
    });

    if (!isAuthorized) {
      return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-950/70 border border-rose-500/50 flex items-center justify-center text-rose-400 mb-4 shadow-2xl shadow-rose-950/40">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-white mb-1 tracking-wide">
            Access Denied
          </h2>
          <p className="text-xs text-rose-300 font-semibold mb-2 uppercase tracking-wider">
            Restricted Operational Clearance
          </p>
          <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">
            You do not have permission to access this page. Your account (<strong className="text-cyan-300 capitalize font-mono">{user.role?.replace('_', ' ')}</strong>) is restricted to your assigned operational workspace.
          </p>
          <button
            onClick={() => navigate(getRoleHome(user.role), { replace: true })}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to My Dashboard
          </button>
        </div>
      );
    }
  }

  return <Outlet />;
};
