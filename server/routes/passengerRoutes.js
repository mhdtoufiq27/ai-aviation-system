import express from 'express';
import {
  getPassengers,
  getPassengerById,
  createPassenger,
  updatePassenger,
} from '../controllers/passengerController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', protect, getPassengers);
router.get('/:id', protect, getPassengerById);
router.post('/', protect, createPassenger);
router.put('/:id', protect, updatePassenger);

export default router;
