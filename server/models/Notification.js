import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['delay', 'anomaly', 'booking', 'status_change', 'weather', 'system'],
    default: 'system',
  },
  severity: {
    type: String,
    enum: ['info', 'warning', 'critical', 'success'],
    default: 'info',
  },
  targetRole: {
    type: String,
    enum: ['all', 'admin', 'airline_manager', 'staff', 'passenger'],
    default: 'all',
  },
  relatedFlight: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flight',
    default: null,
  },
  isRead: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true,
});

export default mongoose.model('Notification', notificationSchema);
