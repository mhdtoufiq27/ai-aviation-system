import express from 'express';
import {
  getAircraft,
  getAircraftById,
  createAircraft,
  updateAircraft,
  deleteAircraft,
} from '../controllers/aircraftController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', getAircraft);
router.get('/:id', getAircraftById);
router.post('/', protect, authorize('admin', 'airline_manager'), createAircraft);
router.put('/:id', protect, authorize('admin', 'airline_manager'), updateAircraft);
router.delete('/:id', protect, authorize('admin'), deleteAircraft);

export default router;
