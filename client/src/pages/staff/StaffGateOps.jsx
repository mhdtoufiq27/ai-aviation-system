import React, { useState } from 'react';
import { QrCode, CheckCircle2, AlertTriangle, ShieldCheck, Search, Users, Plane, Clock } from 'lucide-react';

export const StaffGateOps = () => {
  const [scanInput, setScanInput] = useState('');
  const [lastScanned, setLastScanned] = useState(null);
  const [scanHistory, setScanHistory] = useState([
    { id: '1', pnr: 'SKF-8842', name: 'Aviation Traveler', seat: '12A', flight: 'AI 203', gate: 'B4', status: 'VALIDATED', time: '10:14 AM' },
    { id: '2', pnr: 'SKF-7412', name: 'Rohan Sharma', seat: '14C', flight: 'AI 203', gate: 'B4', status: 'VALIDATED', time: '10:12 AM' },
    { id: '3', pnr: 'SKF-9021', name: 'Deepa Menon', seat: '08F', flight: 'AI 203', gate: 'B4', status: 'VALIDATED', time: '10:08 AM' },
  ]);

  const handleSimulateScan = (e) => {
    e.preventDefault();
    if (!scanInput.trim()) return;

    const newRecord = {
      id: Date.now().toString(),
      pnr: scanInput.toUpperCase(),
      name: scanInput.toUpperCase().includes('8842') ? 'Aviation Traveler' : 'Passenger ' + Math.floor(Math.random() * 800 + 100),
      seat: (Math.floor(Math.random() * 28) + 1) + ['A', 'B', 'C', 'D', 'E', 'F'][Math.floor(Math.random() * 6)],
      flight: 'AI 203',
      gate: 'B4',
      status: 'VALIDATED',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setLastScanned(newRecord);
    setScanHistory([newRecord, ...scanHistory]);
    setScanInput('');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div>
        <h1 className="text-xl font-black text-white flex items-center gap-2">
          <QrCode className="w-5 h-5 text-amber-400" />
          Gate B4 Boarding Pass Validation & Gate Check-in
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Scan mobile 2D barcodes, verify electronic PNR credentials, check carry-on weight tags, and validate gate departure manifest.
        </p>
      </div>

      {/* Scanner Input Panel */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/30 shadow-xl">
        <form onSubmit={handleSimulateScan} className="flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <QrCode className="w-5 h-5 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={scanInput}
              onChange={(e) => setScanInput(e.target.value)}
              placeholder="Scan Barcode / Enter PNR (e.g. SKF-8842 or 12A)..."
              className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-amber-500/40 rounded-xl text-white font-mono text-sm placeholder-slate-500 focus:outline-none focus:border-amber-400 shadow-inner"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-amber-500/20 whitespace-nowrap"
          >
            Validate Boarding Pass
          </button>
        </form>

        {/* Live Validation Alert Result */}
        {lastScanned && (
          <div className="mt-4 p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span>{lastScanned.name}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                    BOARDING CLEARANCE GRANTED
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 font-mono mt-0.5">
                  PNR: {lastScanned.pnr} • Seat: {lastScanned.seat} • Flight: {lastScanned.flight} • Gate {lastScanned.gate}
                </div>
              </div>
            </div>
            <div className="text-[10px] text-emerald-400 font-mono font-bold">
              {lastScanned.time}
            </div>
          </div>
        )}
      </div>

      {/* Scanned Manifest Table */}
      <div className="rounded-xl bg-slate-900/60 border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Gate Boarding Manifest History
          </h2>
          <span className="text-[11px] font-mono text-slate-400">
            {scanHistory.length} Validated
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-[10px] uppercase font-bold text-slate-400 font-mono border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Passenger Name</th>
                <th className="py-3 px-4">PNR</th>
                <th className="py-3 px-4">Assigned Seat</th>
                <th className="py-3 px-4">Flight</th>
                <th className="py-3 px-4">Verification Status</th>
                <th className="py-3 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {scanHistory.map((row) => (
                <tr key={row.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 font-bold text-white">{row.name}</td>
                  <td className="py-3 px-4 font-mono text-cyan-300">{row.pnr}</td>
                  <td className="py-3 px-4 font-mono font-bold text-amber-400">{row.seat}</td>
                  <td className="py-3 px-4 font-mono text-slate-300">{row.flight}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" /> {row.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-400 text-[11px]">{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
