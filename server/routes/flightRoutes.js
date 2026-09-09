import express from 'express';
import {
  getFlights,
  getFlightById,
  createFlight,
  updateFlight,
  updateFlightStatus,
  deleteFlight,
  predictDelayForFlight,
} from '../controllers/flightController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', getFlights);
router.get('/:id', getFlightById);
router.post('/', protect, authorize('admin', 'airline_manager'), createFlight);
router.put('/:id', protect, authorize('admin', 'airline_manager'), updateFlight);
router.patch('/:id/status', protect, authorize('admin', 'airline_manager', 'staff'), updateFlightStatus);
router.post('/:id/predict-delay', predictDelayForFlight);
router.delete('/:id', protect, authorize('admin'), deleteFlight);

export default router;
