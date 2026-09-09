import mongoose from 'mongoose';

const crewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  employeeId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ['Pilot', 'Co-Pilot', 'Cabin Crew', 'Ground Staff'],
    required: true,
  },
  airline: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Airline',
    required: true,
  },
  assignedFlight: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flight',
    default: null,
  },
  availabilityStatus: {
    type: String,
    enum: ['Available', 'On Duty', 'Resting', 'On Leave'],
    default: 'Available',
  },
  contactNumber: {
    type: String,
    default: '',
  },
  licenseNumber: {
    type: String,
    default: '',
  },
  totalHoursFlown: {
    type: Number,
    default: 850,
  },
  baseAirport: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Airport',
    default: null,
  }
}, {
  timestamps: true,
});

export default mongoose.model('Crew', crewSchema);
