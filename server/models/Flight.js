import mongoose from 'mongoose';

const flightSchema = new mongoose.Schema({
  flightNumber: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    index: true,
  },
  airline: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Airline',
    required: true,
  },
  aircraft: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Aircraft',
    required: true,
  },
  departureAirport: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Airport',
    required: true,
  },
  arrivalAirport: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Airport',
    required: true,
  },
  departureTime: {
    type: Date,
    required: true,
  },
  arrivalTime: {
    type: Date,
    required: true,
  },
  actualDepartureTime: {
    type: Date,
    default: null,
  },
  actualArrivalTime: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Boarding', 'Departed', 'Delayed', 'Arrived', 'Cancelled'],
    default: 'Scheduled',
  },
  terminal: {
    type: String,
    default: 'T1',
  },
  gate: {
    type: String,
    default: 'A12',
  },
  baggageBelt: {
    type: String,
    default: 'B4',
  },
  delayMinutes: {
    type: Number,
    default: 0,
  },
  delayReason: {
    type: String,
    default: '',
  },
  basePrice: {
    type: Number,
    required: true,
    default: 150,
  },
  totalSeats: {
    type: Number,
    default: 180,
  },
  bookedSeatsCount: {
    type: Number,
    default: 0,
  },
  occupiedSeats: {
    type: [String],
    default: [],
  },
  aiPrediction: {
    delayProbability: { type: Number, default: 0 },
    riskLevel: { type: String, enum: ['Low', 'Moderate', 'High', 'Severe'], default: 'Low' },
    expectedDelayMinutes: { type: Number, default: 0 },
    recommendation: { type: String, default: 'Standard flight profile. No schedule adjustment required.' },
    analyzedAt: { type: Date, default: Date.now },
  },
  isInternational: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true,
});

export default mongoose.model('Flight', flightSchema);
