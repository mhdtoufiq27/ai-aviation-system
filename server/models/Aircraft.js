import mongoose from 'mongoose';

const aircraftSchema = new mongoose.Schema({
  registrationNumber: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  model: {
    type: String,
    required: true,
    trim: true,
  },
  manufacturer: {
    type: String,
    required: true,
    trim: true,
  },
  airline: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Airline',
    required: true,
  },
  seatingCapacity: {
    type: Number,
    required: true,
  },
  fuelCapacityLitres: {
    type: Number,
    required: true,
  },
  currentFuelLevel: {
    type: Number,
    default: 85, // percentage
  },
  maintenanceStatus: {
    type: String,
    enum: ['Active', 'Under Maintenance', 'Grounded'],
    default: 'Active',
  },
  lastMaintenanceDate: {
    type: Date,
    default: () => new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  },
  nextMaintenanceDate: {
    type: Date,
    default: () => new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  totalFlightHours: {
    type: Number,
    default: 1200,
  },
  healthScore: {
    type: Number,
    default: 96,
  }
}, {
  timestamps: true,
});

export default mongoose.model('Aircraft', aircraftSchema);
