import mongoose from 'mongoose';

const anomalySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  anomalyType: {
    type: String,
    enum: [
      'Flight Delay Spike',
      'Unusual Booking Spike',
      'Aircraft Maintenance Alert',
      'Abnormal Passenger Traffic',
      'Sudden Route Change',
      'Turnaround Delay'
    ],
    required: true,
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium',
  },
  description: {
    type: String,
    required: true,
  },
  entityType: {
    type: String,
    enum: ['Flight', 'Route', 'Airport', 'Aircraft', 'Booking'],
    default: 'Flight',
  },
  entityIdentifier: {
    type: String,
    default: '',
  },
  detectedMetricValue: {
    type: String,
    default: '',
  },
  baselineExpectedValue: {
    type: String,
    default: '',
  },
  deviationPercentage: {
    type: Number,
    default: 0,
  },
  suggestedMitigation: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['Active', 'Investigating', 'Mitigated', 'Dismissed'],
    default: 'Active',
  },
  resolvedAt: {
    type: Date,
    default: null,
  }
}, {
  timestamps: true,
});

export default mongoose.model('Anomaly', anomalySchema);
