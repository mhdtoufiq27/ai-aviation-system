import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth, getRoleHome } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { RoleGuard } from './components/common/RoleGuard';

// Public Authentication Pages
import { Login } from './pages/Login';
import { Register } from './pages/Register';

// Core Admin Operations Pages
import { Dashboard } from './pages/Dashboard';
import { Flights } from './pages/Flights';
import { Bookings } from './pages/Bookings';
import { Passengers } from './pages/Passengers';
import { Aircraft } from './pages/Aircraft';
import { Crew } from './pages/Crew';
import { Airlines } from './pages/Airlines';
import { Airports } from './pages/Airports';
import { AIPredictions } from './pages/AIPredictions';
import { Analytics } from './pages/Analytics';
import { Anomalies } from './pages/Anomalies';
import { Notifications } from './pages/Notifications';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminSettings } from './pages/admin/AdminSettings';

// Airline Manager Pages
import { ManagerDashboard } from './pages/manager/ManagerDashboard';

// Ground Staff Pages
import { StaffDashboard } from './pages/staff/StaffDashboard';
import { StaffGateOps } from './pages/staff/StaffGateOps';

// Passenger Pages
import { PassengerDashboard } from './pages/passenger/PassengerDashboard';
import { SearchFlights } from './pages/passenger/SearchFlights';
import { MyBookings } from './pages/passenger/MyBookings';
import { FlightStatusPage } from './pages/passenger/FlightStatusPage';
import { CheckIn } from './pages/passenger/CheckIn';
import { BoardingPassPage } from './pages/passenger/BoardingPassPage';
import { TravelHistory } from './pages/passenger/TravelHistory';
import { AITravelAssistant } from './pages/passenger/AITravelAssistant';
import { PassengerNotifications } from './pages/passenger/PassengerNotifications';
import { PassengerProfile } from './pages/passenger/PassengerProfile';

// Root Route Redirector
const RootRedirect = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050b14] flex items-center justify-center text-cyan-400 font-mono text-xs">
        Initializing Security Environment...
      </div>
    );
  }

  if (isAuthenticated && user?.role) {
    return <Navigate to={getRoleHome(user.role)} replace />;
  }

  return <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <BrowserRouter>
          <Routes>
            {/* Root Route: strictly login-first unless valid active session exists */}
            <Route path="/" element={<RootRedirect />} />

            {/* Public Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* 1. ADMIN PROTECTED ROUTES (/admin/*) */}
            <Route element={<RoleGuard allowedRoles={['admin']} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/flights" element={<Flights />} />
                <Route path="/admin/bookings" element={<Bookings />} />
                <Route path="/admin/passengers" element={<Passengers />} />
                <Route path="/admin/aircraft" element={<Aircraft />} />
                <Route path="/admin/crew" element={<Crew />} />
                <Route path="/admin/airlines" element={<Airlines />} />
                <Route path="/admin/airports" element={<Airports />} />
                <Route path="/admin/ai-predictions" element={<AIPredictions />} />
                <Route path="/admin/analytics" element={<Analytics />} />
                <Route path="/admin/anomalies" element={<Anomalies />} />
                <Route path="/admin/notifications" element={<Notifications />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
              </Route>
            </Route>

            {/* 2. AIRLINE MANAGER PROTECTED ROUTES (/manager/*) */}
            <Route element={<RoleGuard allowedRoles={['airline_manager', 'manager']} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/manager" element={<Navigate to="/manager/dashboard" replace />} />
                <Route path="/manager/dashboard" element={<ManagerDashboard />} />
                <Route path="/manager/flights" element={<Flights />} />
                <Route path="/manager/aircraft" element={<Aircraft />} />
                <Route path="/manager/crew" element={<Crew />} />
                <Route path="/manager/passengers" element={<Passengers />} />
                <Route path="/manager/bookings" element={<Bookings />} />
                <Route path="/manager/ai-predictions" element={<AIPredictions />} />
                <Route path="/manager/analytics" element={<Analytics />} />
                <Route path="/manager/notifications" element={<Notifications />} />
                <Route path="/manager/profile" element={<PassengerProfile />} />
              </Route>
            </Route>

            {/* 3. GROUND STAFF PROTECTED ROUTES (/staff/*) */}
            <Route element={<RoleGuard allowedRoles={['staff', 'ground_staff']} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/staff" element={<Navigate to="/staff/dashboard" replace />} />
                <Route path="/staff/dashboard" element={<StaffDashboard />} />
                <Route path="/staff/flight-status" element={<FlightStatusPage />} />
                <Route path="/staff/check-in" element={<StaffGateOps />} />
                <Route path="/staff/gates" element={<StaffGateOps />} />
                <Route path="/staff/boarding-pass-validation" element={<StaffGateOps />} />
                <Route path="/staff/flight-updates" element={<Flights />} />
                <Route path="/staff/weather" element={<Airports />} />
                <Route path="/staff/notifications" element={<Notifications />} />
                <Route path="/staff/profile" element={<PassengerProfile />} />
              </Route>
            </Route>

            {/* 4. PASSENGER PROTECTED ROUTES (/passenger/*) */}
            <Route element={<RoleGuard allowedRoles={['passenger']} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/passenger" element={<Navigate to="/passenger/dashboard" replace />} />
                <Route path="/passenger/dashboard" element={<PassengerDashboard />} />
                <Route path="/passenger/search-flights" element={<SearchFlights />} />
                <Route path="/passenger/my-bookings" element={<MyBookings />} />
                <Route path="/passenger/flight-status" element={<FlightStatusPage />} />
                <Route path="/passenger/check-in" element={<CheckIn />} />
                <Route path="/passenger/boarding-pass" element={<BoardingPassPage />} />
                <Route path="/passenger/travel-history" element={<TravelHistory />} />
                <Route path="/passenger/ai-assistant" element={<AITravelAssistant />} />
                <Route path="/passenger/notifications" element={<PassengerNotifications />} />
                <Route path="/passenger/profile" element={<PassengerProfile />} />
              </Route>
            </Route>

            {/* Unmatched Fallback */}
            <Route path="*" element={<RootRedirect />} />
          </Routes>
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  );
}
