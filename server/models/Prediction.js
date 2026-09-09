import mongoose from 'mongoose';

const predictionSchema = new mongoose.Schema({
  flight: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flight',
    required: true,
  },
  flightNumber: {
    type: String,
    required: true,
  },
  route: {
    origin: String,
    destination: String,
  },
  delayProbability: {
    type: Number,
    required: true,
  },
  riskLevel: {
    type: String,
    enum: ['Low', 'Moderate', 'High', 'Severe'],
    required: true,
  },
  expectedDelayMinutes: {
    type: Number,
    required: true,
  },
  contributingFactors: [{
    factor: String,
    impactScore: Number, // e.g. 1-100
    description: String,
  }],
  aiRecommendation: {
    type: String,
    required: true,
  },
  weatherCondition: {
    type: String,
    default: 'Normal',
  },
  airTrafficScore: {
    type: Number,
    default: 50,
  },
  aircraftAgeYears: {
    type: Number,
    default: 4,
  },
  modelConfidence: {
    type: Number,
    default: 89.2,
  }
}, {
  timestamps: true,
});

export default mongoose.model('Prediction', predictionSchema);
