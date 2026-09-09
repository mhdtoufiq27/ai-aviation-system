import React, { createContext, useContext, useEffect, useState } from 'react';
import { socket } from '../services/socket';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [liveAlerts, setLiveAlerts] = useState([]);
  const [latestFlightUpdate, setLatestFlightUpdate] = useState(null);
  const [latestBooking, setLatestBooking] = useState(null);
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }
    function onDisconnect() {
      setIsConnected(false);
    }

    function onFlightStatus(data) {
      setLatestFlightUpdate(data);
      addLiveAlert({
        id: Date.now(),
        type: data.flight?.status === 'Delayed' ? 'warning' : 'info',
        title: `Flight ${data.flight?.flightNumber} Update`,
        message: `Status transitioned to ${data.flight?.status} (${data.flight?.delayMinutes ? `+${data.flight.delayMinutes}m` : 'On Time'})`,
        time: new Date().toLocaleTimeString(),
      });
    }

    function onNewBooking(booking) {
      setLatestBooking(booking);
      addLiveAlert({
        id: Date.now(),
        type: 'success',
        title: 'New Flight Booking',
        message: `Seat ${booking.seatNumber} confirmed on flight ${booking.flight?.flightNumber || ''}`,
        time: new Date().toLocaleTimeString(),
      });
    }

    function onNotification(notif) {
      addLiveAlert({
        id: Date.now(),
        type: notif.severity === 'critical' ? 'critical' : notif.severity === 'warning' ? 'warning' : 'info',
        title: notif.title,
        message: notif.message,
        time: new Date().toLocaleTimeString(),
      });
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('flightStatusUpdated', onFlightStatus);
    socket.on('bookingCreated', onNewBooking);
    socket.on('newNotification', onNotification);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('flightStatusUpdated', onFlightStatus);
      socket.off('bookingCreated', onNewBooking);
      socket.off('newNotification', onNotification);
    };
  }, []);

  const addLiveAlert = (alert) => {
    setLiveAlerts((prev) => [alert, ...prev.slice(0, 4)]);
    // Auto dismiss after 7 seconds
    setTimeout(() => {
      setLiveAlerts((prev) => prev.filter((a) => a.id !== alert.id));
    }, 7000);
  };

  const dismissAlert = (id) => {
    setLiveAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        liveAlerts,
        latestFlightUpdate,
        latestBooking,
        dismissAlert,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
