import express from 'express';
import {
  getAirports,
  getAirportById,
  updateAirportWeather,
} from '../controllers/airportController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', getAirports);
router.get('/:id', getAirportById);
router.patch('/:id/weather', protect, authorize('admin', 'staff'), updateAirportWeather);

export default router;
