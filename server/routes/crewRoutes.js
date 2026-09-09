import express from 'express';
import {
  getCrew,
  getCrewById,
  createCrew,
  updateCrew,
  deleteCrew,
} from '../controllers/crewController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', getCrew);
router.get('/:id', getCrewById);
router.post('/', protect, authorize('admin', 'airline_manager'), createCrew);
router.put('/:id', protect, authorize('admin', 'airline_manager'), updateCrew);
router.delete('/:id', protect, authorize('admin'), deleteCrew);

export default router;
