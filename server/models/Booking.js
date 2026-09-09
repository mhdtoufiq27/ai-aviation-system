import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  bookingReference: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  passenger: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Passenger',
    required: true,
  },
  flight: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flight',
    required: true,
  },
  seatNumber: {
    type: String,
    required: true,
  },
  cabinClass: {
    type: String,
    enum: ['Economy', 'Premium Economy', 'Business', 'First Class'],
    default: 'Economy',
  },
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Pending', 'Refunded'],
    default: 'Paid',
  },
  bookingStatus: {
    type: String,
    enum: ['Confirmed', 'Pending', 'Cancelled'],
    default: 'Confirmed',
  },
  checkInStatus: {
    type: String,
    enum: ['Not Checked-in', 'Checked-in', 'Boarded'],
    default: 'Not Checked-in',
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  ticketCode: {
    type: String,
    default: '',
  },
  specialRequests: {
    type: [String],
    default: [],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  }
}, {
  timestamps: true,
});

export default mongoose.model('Booking', bookingSchema);
