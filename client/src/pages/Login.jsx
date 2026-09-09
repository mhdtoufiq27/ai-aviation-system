import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  Plane,
  Shield,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  Building2,
  UserCheck,
  Users,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth, getRoleHome } from '../context/AuthContext';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, isAuthenticated } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, automatically redirect to user's assigned dashboard
  useEffect(() => {
    if (isAuthenticated && user?.role) {
      const from = location.state?.from?.pathname;
      const target = from && from !== '/login' ? from : getRoleHome(user.role);
      navigate(target, { replace: true });
    }
  }, [isAuthenticated, user, navigate, location]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      const redirectUrl = result?.redirectUrl || getRoleHome(result?.user?.role);
      navigate(redirectUrl, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  // 1-Click Demo Login Handler
  const handleQuickDemo = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
    setLoading(true);

    try {
      const result = await login(demoEmail, demoPassword);
      const redirectUrl = result?.redirectUrl || getRoleHome(result?.user?.role);
      navigate(redirectUrl, { replace: true });
    } catch (err) {
      setError(err.message || 'Authentication error with demo account');
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    {
      roleName: 'ADMIN',
      email: 'admin@skyflow.com',
      password: 'password123',
      badge: 'Full system control',
      color: 'border-purple-500/40 text-purple-300 hover:border-purple-400',
      icon: Shield,
    },
    {
      roleName: 'AIRLINE MANAGER',
      email: 'manager@skyflow.com',
      password: 'password123',
      badge: 'Airline operations',
      color: 'border-blue-500/40 text-blue-300 hover:border-blue-400',
      icon: Building2,
    },
    {
      roleName: 'GROUND STAFF',
      email: 'staff@skyflow.com',
      password: 'password123',
      badge: 'Ground operations',
      color: 'border-amber-500/40 text-amber-300 hover:border-amber-400',
      icon: UserCheck,
    },
    {
      roleName: 'PASSENGER',
      email: 'passenger@skyflow.com',
      password: 'password123',
      badge: 'Passenger portal',
      color: 'border-cyan-500/40 text-cyan-300 hover:border-cyan-400',
      icon: Users,
    },
  ];

  return (
    <div className="min-h-screen bg-[#050b14] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden radar-grid">
      {/* Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Branding */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-500 shadow-glow-cyan mb-4">
          <Plane className="w-7 h-7 text-black transform -rotate-45" />
        </div>
        <h1 className="text-2xl font-black tracking-wider text-white">
          SKYFLOW <span className="text-cyan-400 font-mono text-base">AI</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1 font-mono uppercase tracking-wider">
          AI Aviation Management System
        </p>
        <div className="inline-block mt-1 px-3 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950/60 text-cyan-400 border border-cyan-500/30">
          Secure Aviation Operations Portal
        </div>
      </div>

      {/* Main Login Box */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="glass-panel-glow py-8 px-6 sm:px-10 rounded-2xl border border-cyan-500/30 shadow-2xl">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-xs text-rose-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@skyflow.com"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-900/90 text-slate-100 placeholder-slate-500 rounded-lg border border-slate-700/80 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-900/90 text-slate-100 placeholder-slate-500 rounded-lg border border-slate-700/80 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-slate-950 font-black rounded-lg shadow-glow-cyan transition-all flex items-center justify-center space-x-2 text-xs"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Operations Console'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Demo Accounts Evaluation Section */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">
                1-Click Demo Evaluation Accounts
              </span>
              <span className="text-[9px] text-cyan-400 font-mono">Instant Access</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              {demoAccounts.map((acc) => {
                const Icon = acc.icon;
                return (
                  <button
                    key={acc.email}
                    type="button"
                    disabled={loading}
                    onClick={() => handleQuickDemo(acc.email, acc.password)}
                    className={`p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border ${acc.color} text-left transition-all duration-200 group flex flex-col justify-between`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-1.5 font-bold font-mono text-[10px]">
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span>{acc.roleName}</span>
                      </div>
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400" />
                    </div>

                    <div className="mt-1 font-mono text-[10px] text-slate-400 truncate">
                      {acc.email}
                    </div>
                    <div className="text-[9px] text-slate-500 mt-0.5">
                      {acc.badge}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-5 text-center text-xs text-slate-400">
            New personnel or passenger registration?{' '}
            <Link to="/register" className="text-cyan-400 hover:underline font-semibold">
              Register now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
