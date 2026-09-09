import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Shield,
  Award,
  Globe,
  Save,
  CheckCircle2,
  Bell,
  Utensils,
  Armchair,
  Smartphone,
  Lock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const PassengerProfile = () => {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.name || 'Aviation Traveler',
    email: user?.email || 'passenger@skyflow.com',
    phone: '+91 98765 43210',
    passportNumber: 'A78942103',
    passportExpiry: '2031-08-15',
    nationality: 'India',
    seatPreference: 'Window',
    mealPreference: 'Vegetarian (AVML)',
    specialAssistance: false,
    emergencyName: 'Priya Traveler',
    emergencyPhone: '+91 98765 43211',
    smsAlerts: true,
    whatsappPass: true,
    emailReceipts: true
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <User className="w-5 h-5 text-cyan-400" />
            Passenger Profile & Preferences
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your personal travel credentials, frequent flyer benefits, cabin seating, and notification preferences.
          </p>
        </div>

        {saved && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
            <CheckCircle2 className="w-4 h-4" />
            Preferences Saved!
          </div>
        )}
      </div>

      {/* Member Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-slate-900 border border-cyan-500/30 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border-2 border-cyan-400/50 flex items-center justify-center font-black text-2xl text-cyan-400 font-mono shadow-lg shadow-cyan-500/10">
            {formData.fullName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h2 className="text-lg font-black text-white">{formData.fullName}</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                Passenger
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">{formData.email}</div>
            <div className="text-[11px] text-cyan-400/90 font-mono mt-1">
              Frequent Flyer: SKF-GOLD-8921 • Gold Elite Tier
            </div>
          </div>
        </div>

        {/* Mile Counter */}
        <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 text-center sm:text-right w-full sm:w-auto">
          <div className="text-[10px] uppercase font-bold text-slate-400">Accrued Mileage</div>
          <div className="text-2xl font-black text-cyan-400 font-mono mt-0.5">18,420 mi</div>
          <div className="text-[10px] text-emerald-400 font-semibold mt-1 flex items-center justify-center sm:justify-end gap-1">
            <Award className="w-3.5 h-3.5" /> Priority Check-in & Lounge Access
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal & Travel Credentials */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            Personal & Travel Credentials
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Full Name (as in Passport)</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Mobile Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Nationality</label>
              <input
                type="text"
                value={formData.nationality}
                onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Passport / Govt ID Number</label>
              <input
                type="text"
                value={formData.passportNumber}
                onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Passport Expiry Date</label>
              <input
                type="date"
                value={formData.passportExpiry}
                onChange={(e) => setFormData({ ...formData, passportExpiry: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Flight & In-Cabin Preferences */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Armchair className="w-4 h-4 text-cyan-400" />
            Flight & Cabin Preferences
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Preferred Seat Position</label>
              <select
                value={formData.seatPreference}
                onChange={(e) => setFormData({ ...formData, seatPreference: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              >
                <option>Window</option>
                <option>Aisle</option>
                <option>Extra Legroom</option>
                <option>No Preference</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Special Meal Request</label>
              <select
                value={formData.mealPreference}
                onChange={(e) => setFormData({ ...formData, mealPreference: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              >
                <option>Vegetarian (AVML)</option>
                <option>Non-Vegetarian Standard</option>
                <option>Vegan Meal (VGML)</option>
                <option>Diabetic Meal (DBML)</option>
                <option>Gluten-Free (GFML)</option>
                <option>Jain Meal (VJML)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer mt-1">
                <input
                  type="checkbox"
                  checked={formData.specialAssistance}
                  onChange={(e) => setFormData({ ...formData, specialAssistance: e.target.checked })}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-0 w-4 h-4 bg-slate-950"
                />
                <span className="text-slate-300">Request airport wheelchair or special mobility assistance</span>
              </label>
            </div>
          </div>
        </div>

        {/* Notification Delivery Channels */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Bell className="w-4 h-4 text-cyan-400" />
            Automated Alert Delivery Preferences
          </h3>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 cursor-pointer">
              <div className="flex items-center gap-3">
                <Smartphone className="w-4 h-4 text-cyan-400" />
                <div>
                  <div className="font-bold text-white">SMS Flight Alerts</div>
                  <div className="text-[11px] text-slate-400">Receive urgent gate change and departure delay text messages.</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.smsAlerts}
                onChange={(e) => setFormData({ ...formData, smsAlerts: e.target.checked })}
                className="rounded border-slate-700 text-cyan-500 focus:ring-0 w-4 h-4 bg-slate-950"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 cursor-pointer">
              <div className="flex items-center gap-3">
                <Award className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="font-bold text-white">Instant WhatsApp Boarding Pass</div>
                  <div className="text-[11px] text-slate-400">Automatically deliver digital boarding passes to your WhatsApp upon web check-in.</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.whatsappPass}
                onChange={(e) => setFormData({ ...formData, whatsappPass: e.target.checked })}
                className="rounded border-slate-700 text-cyan-500 focus:ring-0 w-4 h-4 bg-slate-950"
              />
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/25 transition-all"
          >
            <Save className="w-4 h-4" />
            Save Profile & Preferences
          </button>
        </div>
      </form>
    </div>
  );
};
