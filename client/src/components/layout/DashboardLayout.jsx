import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../common/Sidebar';
import { Navbar } from '../common/Navbar';
import { AeroAIChatbot } from '../ai/AeroAIChatbot';
import { LiveAlertsOverlay } from '../common/LiveAlertsOverlay';

export const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-[#050b14] overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-[#050b14] to-[#070e1b]">
          <Outlet />
        </main>
      </div>

      {/* Real-time Socket Alerts Banner */}
      <LiveAlertsOverlay />

      {/* Floating AeroAI Assistant */}
      <AeroAIChatbot />
    </div>
  );
};
