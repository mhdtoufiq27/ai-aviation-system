import React, { useState, useEffect } from 'react';
import { Users, Shield, UserPlus, Search, RefreshCw, Mail, Phone, CheckCircle2, Clock } from 'lucide-react';
import axios from 'axios';

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/auth/users');
      if (res.data?.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
      // Fallback display
      setUsers([
        { _id: '1', name: 'Chief Operations Officer', email: 'admin@skyflow.com', role: 'admin', status: 'active', createdAt: new Date() },
        { _id: '2', name: 'Air India Fleet Director', email: 'manager@skyflow.com', role: 'airline_manager', status: 'active', createdAt: new Date() },
        { _id: '3', name: 'Gate Operations Lead', email: 'staff@skyflow.com', role: 'staff', status: 'active', createdAt: new Date() },
        { _id: '4', name: 'Aviation Traveler', email: 'passenger@skyflow.com', role: 'passenger', status: 'active', createdAt: new Date() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const getRoleBadge = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30">👑 Admin</span>;
      case 'airline_manager':
      case 'manager':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">🏢 Manager</span>;
      case 'staff':
      case 'ground_staff':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">👨‍✈️ Staff</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">🧳 Passenger</span>;
    }
  };

  const filtered = users.filter((u) => {
    const matchQ = (u.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                   (u.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchR = roleFilter === 'ALL' || u.role === roleFilter || (roleFilter === 'manager' && u.role === 'airline_manager');
    return matchQ && matchR;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            User Management & Access Control
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Administer system accounts, role privileges, authentication statuses, and security credentials.
          </p>
        </div>

        <button
          onClick={fetchUsers}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/70 text-slate-300 hover:text-white text-xs font-semibold"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
          Refresh Accounts
        </button>
      </div>

      {/* Filter bar */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by personnel name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {['ALL', 'admin', 'airline_manager', 'staff', 'passenger'].map((rf) => (
            <button
              key={rf}
              onClick={() => setRoleFilter(rf)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase font-mono whitespace-nowrap transition-all ${
                roleFilter === rf
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {rf.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-xl bg-slate-900/60 border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-[10px] uppercase font-bold text-slate-400 font-mono border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">System Role</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4">Created Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((user) => (
                <tr key={user._id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/30 text-cyan-300 font-black text-xs flex items-center justify-center font-mono">
                      {user.name ? user.name[0] : 'U'}
                    </div>
                    <span>{user.name}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 font-mono">{user.email}</td>
                  <td className="py-3.5 px-4">{getRoleBadge(user.role)}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" /> Active
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active System'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
