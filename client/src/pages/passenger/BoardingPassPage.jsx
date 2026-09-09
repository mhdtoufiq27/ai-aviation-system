import React, { useRef } from 'react';
import {
  QrCode,
  Printer,
  Download,
  Plane,
  Clock,
  MapPin,
  Sparkles,
  ShieldCheck,
  Share2,
  Calendar,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const BoardingPassPage = () => {
  const { user } = useAuth();
  const passRef = useRef(null);

  const passData = {
    passengerName: user?.name || 'Aviation Traveler',
    pnr: 'SKF-8842',
    eTicket: '098-4491028471',
    flightNumber: 'AI 203',
    airline: 'Air India',
    aircraft: 'Airbus A321neo',
    fromCode: 'BLR',
    fromCity: 'Bengaluru',
    fromAirport: 'Kempegowda Int. Airport',
    toCode: 'BOM',
    toCity: 'Mumbai',
    toAirport: 'Chhatrapati Shivaji Maharaj Int.',
    date: '12 Oct 2026',
    boardingTime: '07:50 AM',
    departureTime: '08:30 AM',
    gate: 'B4',
    terminal: '1',
    seat: '12A',
    cabinClass: 'ECONOMY',
    zone: 'ZONE 2',
    sequence: '042',
    frequentFlyer: 'SKF-GOLD-8921',
    status: 'BOARDING SCHEDULED',
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <QrCode className="w-5 h-5 text-cyan-400" />
            Digital Boarding Pass
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Present this e-boarding pass with valid government photo ID at airport security and departure gate.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700/60 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-cyan-400" />
            Print Pass
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black shadow-lg shadow-cyan-500/20 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            Save PDF
          </button>
        </div>
      </div>

      {/* AI Advisory Banner */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/40 via-blue-950/20 to-slate-900/60 border border-cyan-500/30 flex items-start gap-3">
        <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="flex-1 text-xs">
          <span className="font-bold text-cyan-300">SkyFlow Smart Advisory: </span>
          <span className="text-slate-300">
            Security wait times at BLR Terminal 1 are currently approximately 12 minutes. Boarding for AI 203 begins promptly at 07:50 AM at Gate B4.
          </span>
        </div>
      </div>

      {/* Futuristic Boarding Pass Card */}
      <div
        ref={passRef}
        className="rounded-2xl bg-gradient-to-br from-[#0c1322] via-[#09101d] to-[#060b14] border border-cyan-500/30 shadow-2xl shadow-cyan-950/30 overflow-hidden"
      >
        {/* Pass Top Branding Bar */}
        <div className="bg-gradient-to-r from-cyan-900/40 via-blue-900/30 to-slate-900/60 px-6 py-4 border-b border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center">
              <Plane className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="text-xs font-black tracking-widest text-cyan-400 uppercase">
                {passData.airline}
              </div>
              <div className="text-[11px] text-slate-400">Electronic Boarding Document</div>
            </div>
          </div>

          <div className="text-right">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              {passData.status}
            </span>
            <div className="text-[10px] text-slate-400 font-mono mt-1">PNR: {passData.pnr}</div>
          </div>
        </div>

        {/* Main Pass Content Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Flight Path / Cities (Left 2 cols) */}
          <div className="md:col-span-2 space-y-6">
            {/* Route origin to destination */}
            <div className="flex items-center justify-between bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
              <div>
                <div className="text-3xl font-black text-white font-mono tracking-tight">
                  {passData.fromCode}
                </div>
                <div className="text-xs font-bold text-cyan-400">{passData.fromCity}</div>
                <div className="text-[10px] text-slate-400">{passData.fromAirport}</div>
              </div>

              <div className="flex flex-col items-center px-4 flex-1 max-w-[200px]">
                <div className="text-[11px] font-bold text-slate-400 font-mono mb-1">
                  {passData.flightNumber}
                </div>
                <div className="w-full flex items-center gap-1">
                  <div className="h-0.5 flex-1 bg-gradient-to-r from-cyan-500 to-transparent"></div>
                  <Plane className="w-4 h-4 text-cyan-400 rotate-90 shrink-0" />
                  <div className="h-0.5 flex-1 bg-gradient-to-l from-cyan-500 to-transparent"></div>
                </div>
                <div className="text-[10px] text-cyan-400/80 mt-1 font-mono">1h 45m Direct</div>
              </div>

              <div className="text-right">
                <div className="text-3xl font-black text-white font-mono tracking-tight">
                  {passData.toCode}
                </div>
                <div className="text-xs font-bold text-cyan-400">{passData.toCity}</div>
                <div className="text-[10px] text-slate-400">{passData.toAirport}</div>
              </div>
            </div>

            {/* Passenger & Flight Meta Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800/60">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Passenger</div>
                <div className="text-xs font-black text-white truncate mt-0.5">
                  {passData.passengerName}
                </div>
                <div className="text-[9px] text-cyan-400/80 font-mono mt-0.5">{passData.frequentFlyer}</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800/60">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Date</div>
                <div className="text-xs font-black text-white mt-0.5">{passData.date}</div>
                <div className="text-[9px] text-slate-400 mt-0.5">Dept: {passData.departureTime}</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800/60">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Cabin Class</div>
                <div className="text-xs font-black text-cyan-300 mt-0.5">{passData.cabinClass}</div>
                <div className="text-[9px] text-slate-400 mt-0.5">{passData.zone}</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800/60">
                <div className="text-[10px] font-bold text-slate-400 uppercase">E-Ticket No.</div>
                <div className="text-xs font-black text-white font-mono mt-0.5 truncate">{passData.eTicket}</div>
                <div className="text-[9px] text-slate-400 mt-0.5">Seq: {passData.sequence}</div>
              </div>
            </div>

            {/* Boarding Callout Highlight Bar */}
            <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-center">
              <div>
                <div className="text-[10px] font-black text-slate-400 uppercase">Terminal</div>
                <div className="text-xl font-black text-cyan-400 font-mono mt-0.5">
                  T{passData.terminal}
                </div>
              </div>
              <div className="border-x border-cyan-500/20">
                <div className="text-[10px] font-black text-slate-400 uppercase">Gate</div>
                <div className="text-xl font-black text-white font-mono mt-0.5">
                  {passData.gate}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-black text-slate-400 uppercase">Boarding Time</div>
                <div className="text-xl font-black text-amber-400 font-mono mt-0.5">
                  {passData.boardingTime}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Seat & High-Contrast QR Code */}
          <div className="flex flex-col items-center justify-between p-5 rounded-xl bg-slate-900/80 border border-slate-800 text-center relative">
            {/* Cutout notch effect visual */}
            <div className="w-full">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Assigned Seat
              </div>
              <div className="text-4xl font-black text-cyan-400 font-mono tracking-tight my-1">
                {passData.seat}
              </div>
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                Window • Forward Cabin
              </div>
            </div>

            {/* QR Code container */}
            <div className="my-4 p-3 bg-white rounded-xl shadow-lg shadow-cyan-500/10 flex flex-col items-center">
              <div className="w-32 h-32 bg-slate-950 p-2 rounded-lg flex items-center justify-center">
                {/* SVG QR Code Simulation */}
                <svg
                  className="w-full h-full text-white"
                  viewBox="0 0 100 100"
                  fill="currentColor"
                >
                  <rect x="5" y="5" width="25" height="25" fill="black" />
                  <rect x="8" y="8" width="19" height="19" fill="white" />
                  <rect x="12" y="12" width="11" height="11" fill="black" />

                  <rect x="70" y="5" width="25" height="25" fill="black" />
                  <rect x="73" y="8" width="19" height="19" fill="white" />
                  <rect x="77" y="12" width="11" height="11" fill="black" />

                  <rect x="5" y="70" width="25" height="25" fill="black" />
                  <rect x="8" y="73" width="19" height="19" fill="white" />
                  <rect x="12" y="77" width="11" height="11" fill="black" />

                  {/* Randomized pattern blocks */}
                  <rect x="35" y="10" width="6" height="6" fill="black" />
                  <rect x="45" y="15" width="10" height="6" fill="black" />
                  <rect x="60" y="8" width="6" height="8" fill="black" />

                  <rect x="10" y="35" width="6" height="6" fill="black" />
                  <rect x="22" y="42" width="8" height="6" fill="black" />
                  <rect x="15" y="55" width="6" height="10" fill="black" />

                  <rect x="35" y="35" width="30" height="30" fill="black" />
                  <rect x="42" y="42" width="16" height="16" fill="white" />
                  <rect x="47" y="47" width="6" height="6" fill="black" />

                  <rect x="70" y="40" width="10" height="8" fill="black" />
                  <rect x="85" y="45" width="8" height="15" fill="black" />
                  <rect x="75" y="60" width="15" height="6" fill="black" />

                  <rect x="40" y="75" width="8" height="15" fill="black" />
                  <rect x="52" y="82" width="12" height="6" fill="black" />
                  <rect x="68" y="75" width="8" height="8" fill="black" />
                  <rect x="80" y="80" width="12" height="12" fill="black" />
                </svg>
              </div>
              <div className="text-[9px] font-mono font-bold text-slate-800 mt-1">
                SCAN AT GATE {passData.gate}
              </div>
            </div>

            {/* Barcode representation */}
            <div className="w-full">
              <div className="h-6 flex items-center justify-center gap-0.5 bg-slate-950/60 p-1 rounded">
                {[4, 2, 6, 1, 3, 5, 2, 7, 3, 2, 4, 1, 6, 3, 2, 5, 1, 4, 6, 2, 3, 5, 1, 7, 2, 4].map(
                  (w, i) => (
                    <span
                      key={i}
                      className="bg-cyan-400/80 h-full inline-block rounded-[0.5px]"
                      style={{ width: `${w * 1.5}px` }}
                    />
                  )
                )}
              </div>
              <div className="text-[9px] font-mono text-slate-400 mt-1">
                *SKF-AI203-BLRBOM-12A*
              </div>
            </div>
          </div>
        </div>

        {/* Footer Notes */}
        <div className="px-6 py-3 bg-slate-950/60 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>SkyFlow Verified Secure Digital Credential</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            Issued via SkyFlow AI Aviation Cloud • Token: 98f4-e01a-88bc
          </div>
        </div>
      </div>
    </div>
  );
};
