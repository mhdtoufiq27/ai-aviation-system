import mongoose from 'mongoose';

const airportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  iataCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  icaoCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  elevation: {
    type: Number,
    default: 0,
  },
  timezone: {
    type: String,
    default: 'UTC',
  },
  terminals: {
    type: [String],
    default: ['T1', 'T2'],
  },
  runways: {
    type: Number,
    default: 2,
  },
  weather: {
    tempC: { type: Number, default: 24 },
    condition: { type: String, default: 'Clear' },
    windSpeedKmph: { type: Number, default: 14 },
    visibilityKm: { type: Number, default: 10 },
    rainProbability: { type: Number, default: 10 },
    humidity: { type: Number, default: 60 },
    airTrafficLevel: { type: String, enum: ['Low', 'Moderate', 'High', 'Congested'], default: 'Moderate' },
    lastUpdated: { type: Date, default: Date.now }
  }
}, {
  timestamps: true,
});

export default mongoose.model('Airport', airportSchema);
