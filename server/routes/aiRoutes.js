import express from 'express';
import {
  predictDelay,
  forecastDemand,
  recommendRoute,
  getAnomalies,
  resolveAnomaly,
  chatAssistant,
} from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/predict-delay', predictDelay);
router.post('/forecast-passengers', forecastDemand);
router.post('/recommend-route', recommendRoute);
router.get('/anomalies', getAnomalies);
router.post('/anomalies/:id/resolve', protect, resolveAnomaly);
router.post('/chat', chatAssistant);

export default router;
