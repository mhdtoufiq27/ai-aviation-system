import mongoose from 'mongoose';

const airlineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  iataCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  icaoCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  country: {
    type: String,
    required: true,
  },
  headquarters: {
    type: String,
    default: '',
  },
  fleetSize: {
    type: Number,
    default: 0,
  },
  logo: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['Active', 'Suspended', 'Grounded'],
    default: 'Active',
  },
  onTimePerformance: {
    type: Number,
    default: 88.5,
  }
}, {
  timestamps: true,
});

export default mongoose.model('Airline', airlineSchema);
