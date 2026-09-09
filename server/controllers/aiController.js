import {
  predictFlightDelay,
  forecastPassengerDemand,
  recommendSmartRoute,
  handleAeroAIChat,
} from '../services/aiServiceBridge.js';
import Prediction from '../models/Prediction.js';
import Anomaly from '../models/Anomaly.js';
import Flight from '../models/Flight.js';

export const predictDelay = async (req, res, next) => {
  try {
    const result = await predictFlightDelay(req.body);

    if (req.body.flightId) {
      const flight = await Flight.findById(req.body.flightId);
      if (flight) {
        flight.aiPrediction = {
          delayProbability: result.delayProbability,
          riskLevel: result.riskLevel,
          expectedDelayMinutes: result.expectedDelayMinutes,
          recommendation: result.aiRecommendation,
          analyzedAt: new Date(),
        };
        await flight.save();

        await Prediction.create({
          flight: flight._id,
          flightNumber: flight.flightNumber,
          route: {
            origin: req.body.origin || 'DEL',
            destination: req.body.destination || 'BLR',
          },
          delayProbability: result.delayProbability,
          riskLevel: result.riskLevel,
          expectedDelayMinutes: result.expectedDelayMinutes,
          contributingFactors: result.contributingFactors,
          aiRecommendation: result.aiRecommendation,
          weatherCondition: req.body.weatherCondition || 'Clear',
          airTrafficScore: req.body.departureTraffic === 'Congested' ? 85 : 45,
          modelConfidence: result.modelConfidence || 91.2,
        });
      }
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const forecastDemand = async (req, res, next) => {
  try {
    const forecast = await forecastPassengerDemand(req.body);
    res.json(forecast);
  } catch (error) {
    next(error);
  }
};

export const recommendRoute = async (req, res, next) => {
  try {
    const routeData = await recommendSmartRoute(req.body);
    res.json(routeData);
  } catch (error) {
    next(error);
  }
};

export const getAnomalies = async (req, res, next) => {
  try {
    const { status, severity } = req.query;
    const filter = {};
    if (status && status !== 'All') filter.status = status;
    if (severity && severity !== 'All') filter.severity = severity;

    const anomalies = await Anomaly.find(filter).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: anomalies.length,
      anomalies,
    });
  } catch (error) {
    next(error);
  }
};

export const resolveAnomaly = async (req, res, next) => {
  try {
    const { status = 'Mitigated', mitigationNotes } = req.body;
    const anomaly = await Anomaly.findByIdAndUpdate(
      req.params.id,
      {
        status,
        ...(mitigationNotes && { suggestedMitigation: mitigationNotes }),
        resolvedAt: new Date(),
      },
      { new: true }
    );

    if (!anomaly) return res.status(404).json({ success: false, message: 'Anomaly not found' });

    const io = req.app.get('io');
    if (io) {
      io.emit('anomalyUpdated', anomaly);
    }

    res.json({ success: true, anomaly });
  } catch (error) {
    next(error);
  }
};

export const chatAssistant = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message prompt required' });
    }

    const response = await handleAeroAIChat(message);
    res.json(response);
  } catch (error) {
    next(error);
  }
};
