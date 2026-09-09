import express from 'express';
import {
  getAirlines,
  getAirlineById,
  createAirline,
  updateAirline,
} from '../controllers/airlineController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', getAirlines);
router.get('/:id', getAirlineById);
router.post('/', protect, authorize('admin'), createAirline);
router.put('/:id', protect, authorize('admin'), updateAirline);

export default router;
