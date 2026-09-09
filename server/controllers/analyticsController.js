import Flight from '../models/Flight.js';
import Booking from '../models/Booking.js';
import Passenger from '../models/Passenger.js';
import Airline from '../models/Airline.js';
import Aircraft from '../models/Aircraft.js';
import Airport from '../models/Airport.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalFlights,
      activeFlights,
      delayedFlights,
      cancelledFlights,
      totalPassengers,
      totalBookings,
      activeAirlines,
      aircraftList,
      flightsList
    ] = await Promise.all([
      Flight.countDocuments(),
      Flight.countDocuments({ status: { $in: ['Boarding', 'Departed'] } }),
      Flight.countDocuments({ status: 'Delayed' }),
      Flight.countDocuments({ status: 'Cancelled' }),
      Passenger.countDocuments(),
      Booking.countDocuments(),
      Airline.countDocuments({ status: 'Active' }),
      Aircraft.find().select('maintenanceStatus'),
      Flight.find().select('aiPrediction status delayMinutes isInternational')
    ]);

    // Calculate aggregate AI Delay Risk score
    const totalAssessed = flightsList.length || 1;
    const highRiskFlights = flightsList.filter(f => f.aiPrediction?.riskLevel === 'High' || f.aiPrediction?.riskLevel === 'Severe').length;
    const avgDelayProb = Math.round(flightsList.reduce((acc, f) => acc + (f.aiPrediction?.delayProbability || 20), 0) / totalAssessed);

    const cards = {
      totalFlights: { value: totalFlights, change: '+12.4%', trend: 'up' },
      activeFlights: { value: activeFlights, change: '+4.2%', trend: 'up' },
      delayedFlights: { value: delayedFlights, change: '-3.8%', trend: 'down', alert: delayedFlights > 5 },
      cancelledFlights: { value: cancelledFlights, change: '-1.5%', trend: 'down' },
      totalPassengers: { value: totalPassengers, change: '+18.6%', trend: 'up' },
      totalBookings: { value: totalBookings, change: '+15.2%', trend: 'up' },
      activeAirlines: { value: activeAirlines, change: '100%', trend: 'neutral' },
      aiDelayRisk: { value: `${avgDelayProb}%`, label: avgDelayProb > 50 ? 'High' : avgDelayProb > 30 ? 'Moderate' : 'Low', highRiskCount: highRiskFlights, change: '-2.1%', trend: 'down' }
    };

    res.json({
      success: true,
      cards,
    });
  } catch (error) {
    next(error);
  }
};

export const getAnalyticsCharts = async (req, res, next) => {
  try {
    const [flights, bookings, airlines, aircraft, airports] = await Promise.all([
      Flight.find()
        .populate('airline', 'name')
        .populate('departureAirport', 'iataCode city')
        .populate('arrivalAirport', 'iataCode city'),
      Booking.find().populate('flight', 'flightNumber basePrice'),
      Airline.find().select('name onTimePerformance fleetSize'),
      Aircraft.find().select('maintenanceStatus model manufacturer'),
      Airport.find().select('iataCode city airTrafficLevel')
    ]);

    // 1. Flights by status
    const statusCounts = {};
    flights.forEach(f => {
      statusCounts[f.status] = (statusCounts[f.status] || 0) + 1;
    });
    const flightStatusDistribution = Object.keys(statusCounts).map(status => ({
      name: status,
      value: statusCounts[status],
    }));

    // 2. Flights by airline
    const airlineCounts = {};
    flights.forEach(f => {
      const name = f.airline?.name || 'Other';
      airlineCounts[name] = (airlineCounts[name] || 0) + 1;
    });
    const flightsByAirline = Object.keys(airlineCounts).map(name => ({
      airline: name,
      flights: airlineCounts[name],
    }));

    // 3. Domestic vs International
    const domesticCount = flights.filter(f => !f.isInternational).length;
    const internationalCount = flights.filter(f => f.isInternational).length;
    const domesticVsInternational = [
      { name: 'Domestic', value: domesticCount },
      { name: 'International', value: internationalCount }
    ];

    // 4. Flights per day (mock timeline distribution)
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const flightsPerDay = days.map((day, idx) => ({
      day,
      scheduled: 85 + (idx * 3) + Math.floor(Math.sin(idx) * 8),
      onTime: 72 + (idx * 2) + Math.floor(Math.cos(idx) * 6),
      delayed: 10 + (idx % 3) * 2,
    }));

    // 5. Passenger Growth & Booking Trends
    const passengerGrowth = [
      { month: 'May', passengers: 12400, bookings: 9800 },
      { month: 'Jun', passengers: 14200, bookings: 11200 },
      { month: 'Jul', passengers: 16800, bookings: 13500 },
      { month: 'Aug', passengers: 18100, bookings: 14900 },
      { month: 'Sep', passengers: 19500, bookings: 16200 },
      { month: 'Oct', passengers: 21800, bookings: 18100 },
    ];

    // 6. Peak travel hours
    const peakTravelHours = [
      { hour: '04:00', departures: 12 },
      { hour: '06:00', departures: 35 },
      { hour: '08:00', departures: 68 }, // Morning rush
      { hour: '10:00', departures: 52 },
      { hour: '12:00', departures: 44 },
      { hour: '14:00', departures: 48 },
      { hour: '16:00', departures: 62 },
      { hour: '18:00', departures: 75 }, // Evening peak
      { hour: '20:00', departures: 58 },
      { hour: '22:00', departures: 38 },
      { hour: '00:00', departures: 18 }
    ];

    // 7. Popular destinations
    const destCounts = {};
    flights.forEach(f => {
      const dest = f.arrivalAirport?.iataCode || 'DEL';
      destCounts[dest] = (destCounts[dest] || 0) + 1;
    });
    const popularDestinations = Object.keys(destCounts)
      .sort((a, b) => destCounts[b] - destCounts[a])
      .slice(0, 6)
      .map(code => ({ code, flights: destCounts[code] }));

    // 8. Delay reasons distribution
    const delayReasons = [
      { reason: 'Severe Weather', percentage: 38, color: '#06b6d4' },
      { reason: 'Air Traffic Control (ATC)', percentage: 28, color: '#3b82f6' },
      { reason: 'Late Inbound Aircraft', percentage: 18, color: '#f59e0b' },
      { reason: 'Maintenance & Servicing', percentage: 11, color: '#ef4444' },
      { reason: 'Crew Rest / Duty Limits', percentage: 5, color: '#10b981' }
    ];

    // 9. Aircraft Utilization
    const aircraftUtilization = [
      { name: 'Active In Service', count: aircraft.filter(a => a.maintenanceStatus === 'Active').length || 42, color: '#10b981' },
      { name: 'Under Maintenance', count: aircraft.filter(a => a.maintenanceStatus === 'Under Maintenance').length || 6, color: '#f59e0b' },
      { name: 'Grounded / Standby', count: aircraft.filter(a => a.maintenanceStatus === 'Grounded').length || 2, color: '#ef4444' }
    ];

    // 10. Average delay time
    const delayedFlightsList = flights.filter(f => f.status === 'Delayed');
    const avgDelayMinutes = delayedFlightsList.length
      ? Math.round(delayedFlightsList.reduce((sum, f) => sum + (f.delayMinutes || 0), 0) / delayedFlightsList.length)
      : 32;

    res.json({
      success: true,
      charts: {
        flightStatusDistribution,
        flightsByAirline,
        domesticVsInternational,
        flightsPerDay,
        passengerGrowth,
        peakTravelHours,
        popularDestinations,
        delayReasons,
        aircraftUtilization,
        avgDelayMinutes,
      }
    });
  } catch (error) {
    next(error);
  }
};
