import express from 'express';
import {
  getDashboardStats,
  getAnalyticsCharts,
} from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/dashboard', getDashboardStats);
router.get('/charts', getAnalyticsCharts);

export default router;
