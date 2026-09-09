import Flight from '../models/Flight.js';
import Notification from '../models/Notification.js';
import Airport from '../models/Airport.js';
import { predictFlightDelay } from '../services/aiServiceBridge.js';

export const getFlights = async (req, res, next) => {
  try {
    const { status, airline, origin, destination, search, limit = 100, page = 1 } = req.query;
    const filter = {};

    if (status && status !== 'All') filter.status = status;
    if (airline && airline !== 'All') filter.airline = airline;

    let flightsQuery = Flight.find(filter)
      .populate('airline', 'name iataCode icaoCode logo onTimePerformance')
      .populate('aircraft', 'registrationNumber model manufacturer seatingCapacity healthScore')
      .populate('departureAirport', 'name iataCode city country weather airTrafficLevel terminals')
      .populate('arrivalAirport', 'name iataCode city country weather airTrafficLevel terminals')
      .sort({ departureTime: 1 });

    const flights = await flightsQuery.exec();

    // In-memory filter for search / origin / destination for convenience
    let filtered = flights;
    if (origin && origin !== 'All') {
      filtered = filtered.filter(f => f.departureAirport?.iataCode === origin || f.departureAirport?._id.toString() === origin);
    }
    if (destination && destination !== 'All') {
      filtered = filtered.filter(f => f.arrivalAirport?.iataCode === destination || f.arrivalAirport?._id.toString() === destination);
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(f => 
        f.flightNumber.toLowerCase().includes(q) ||
        f.airline?.name.toLowerCase().includes(q) ||
        f.departureAirport?.city.toLowerCase().includes(q) ||
        f.arrivalAirport?.city.toLowerCase().includes(q)
      );
    }

    res.json({
      success: true,
      count: filtered.length,
      flights: filtered.slice(0, Number(limit)),
    });
  } catch (error) {
    next(error);
  }
};

export const getFlightById = async (req, res, next) => {
  try {
    const flight = await Flight.findById(req.params.id)
      .populate('airline')
      .populate('aircraft')
      .populate('departureAirport')
      .populate('arrivalAirport');

    if (!flight) {
      return res.status(404).json({ success: false, message: 'Flight not found' });
    }

    res.json({
      success: true,
      flight,
    });
  } catch (error) {
    next(error);
  }
};

export const createFlight = async (req, res, next) => {
  try {
    const flight = await Flight.create(req.body);

    const populatedFlight = await Flight.findById(flight._id)
      .populate('airline')
      .populate('aircraft')
      .populate('departureAirport')
      .populate('arrivalAirport');

    const io = req.app.get('io');
    if (io) {
      io.emit('flightCreated', populatedFlight);
    }

    res.status(201).json({
      success: true,
      flight: populatedFlight,
    });
  } catch (error) {
    next(error);
  }
};

export const updateFlight = async (req, res, next) => {
  try {
    const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('airline')
      .populate('aircraft')
      .populate('departureAirport')
      .populate('arrivalAirport');

    if (!flight) {
      return res.status(404).json({ success: false, message: 'Flight not found' });
    }

    const io = req.app.get('io');
    if (io) {
      io.emit('flightUpdated', flight);
    }

    res.json({
      success: true,
      flight,
    });
  } catch (error) {
    next(error);
  }
};

export const updateFlightStatus = async (req, res, next) => {
  try {
    const { status, delayMinutes, delayReason, gate, terminal } = req.body;

    const flight = await Flight.findById(req.params.id)
      .populate('airline')
      .populate('departureAirport')
      .populate('arrivalAirport');

    if (!flight) {
      return res.status(404).json({ success: false, message: 'Flight not found' });
    }

    const previousStatus = flight.status;
    if (status) flight.status = status;
    if (delayMinutes !== undefined) flight.delayMinutes = Number(delayMinutes);
    if (delayReason) flight.delayReason = delayReason;
    if (gate) flight.gate = gate;
    if (terminal) flight.terminal = terminal;

    if (status === 'Departed' && !flight.actualDepartureTime) {
      flight.actualDepartureTime = new Date();
    }
    if (status === 'Arrived' && !flight.actualArrivalTime) {
      flight.actualArrivalTime = new Date();
    }

    await flight.save();

    // Create Notification if delayed or cancelled
    let notification = null;
    if (status === 'Delayed' || status === 'Cancelled' || previousStatus !== status) {
      notification = await Notification.create({
        title: `Flight ${flight.flightNumber} Status: ${status}`,
        message: status === 'Delayed' 
          ? `Flight ${flight.flightNumber} (${flight.departureAirport?.iataCode} → ${flight.arrivalAirport?.iataCode}) is delayed by ${flight.delayMinutes} mins. Reason: ${flight.delayReason || 'Operational constraint'}.`
          : `Flight ${flight.flightNumber} status transitioned from ${previousStatus} to ${status}.`,
        type: status === 'Delayed' ? 'delay' : 'status_change',
        severity: status === 'Cancelled' ? 'critical' : status === 'Delayed' ? 'warning' : 'info',
        relatedFlight: flight._id,
      });
    }

    const io = req.app.get('io');
    if (io) {
      io.emit('flightStatusUpdated', { flight, previousStatus });
      if (notification) {
        io.emit('newNotification', notification);
      }
    }

    res.json({
      success: true,
      message: `Flight status updated to ${flight.status}`,
      flight,
    });
  } catch (error) {
    next(error);
  }
};

export const predictDelayForFlight = async (req, res, next) => {
  try {
    const flight = await Flight.findById(req.params.id)
      .populate('airline')
      .populate('aircraft')
      .populate('departureAirport')
      .populate('arrivalAirport');

    if (!flight) {
      return res.status(404).json({ success: false, message: 'Flight not found' });
    }

    const depWeather = flight.departureAirport?.weather || {};
    const arrWeather = flight.arrivalAirport?.weather || {};

    const predictionResult = await predictFlightDelay({
      flightNumber: flight.flightNumber,
      airline: flight.airline?.name,
      airlinePerformance: flight.airline?.onTimePerformance || 85,
      origin: flight.departureAirport?.iataCode,
      destination: flight.arrivalAirport?.iataCode,
      weatherCondition: depWeather.condition || 'Clear',
      windSpeedKmph: depWeather.windSpeedKmph || 14,
      rainProbability: depWeather.rainProbability || 10,
      departureTraffic: depWeather.airTrafficLevel || 'Moderate',
      arrivalTraffic: arrWeather.airTrafficLevel || 'Moderate',
      departureHour: new Date(flight.departureTime).getHours(),
      aircraftAgeYears: 4,
    });

    flight.aiPrediction = {
      delayProbability: predictionResult.delayProbability,
      riskLevel: predictionResult.riskLevel,
      expectedDelayMinutes: predictionResult.expectedDelayMinutes,
      recommendation: predictionResult.aiRecommendation,
      analyzedAt: new Date(),
    };

    await flight.save();

    const io = req.app.get('io');
    if (io && predictionResult.riskLevel === 'Severe') {
      io.emit('aiRiskAlert', {
        flightNumber: flight.flightNumber,
        riskLevel: predictionResult.riskLevel,
        delayProbability: predictionResult.delayProbability,
        recommendation: predictionResult.aiRecommendation,
      });
    }

    res.json({
      success: true,
      prediction: predictionResult,
      flight,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteFlight = async (req, res, next) => {
  try {
    const flight = await Flight.findByIdAndDelete(req.params.id);
    if (!flight) {
      return res.status(404).json({ success: false, message: 'Flight not found' });
    }

    const io = req.app.get('io');
    if (io) {
      io.emit('flightDeleted', req.params.id);
    }

    res.json({
      success: true,
      message: 'Flight removed successfully',
    });
  } catch (error) {
    next(error);
  }
};
