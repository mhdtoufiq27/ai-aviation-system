import Passenger from '../models/Passenger.js';
import Booking from '../models/Booking.js';

export const getPassengers = async (req, res, next) => {
  try {
    const { search, limit = 50, page = 1 } = req.query;
    const filter = {};

    if (search) {
      const q = search.trim();
      filter.$or = [
        { fullName: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { passportNumber: { $regex: q, $options: 'i' } },
        { nationality: { $regex: q, $options: 'i' } },
      ];
    }

    const passengers = await Passenger.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Passenger.countDocuments(filter);

    res.json({
      success: true,
      count: passengers.length,
      total,
      passengers,
    });
  } catch (error) {
    next(error);
  }
};

export const getPassengerById = async (req, res, next) => {
  try {
    const passenger = await Passenger.findById(req.params.id);
    if (!passenger) return res.status(404).json({ success: false, message: 'Passenger not found' });

    // Fetch booking history
    const bookings = await Booking.find({ passenger: passenger._id })
      .populate({
        path: 'flight',
        populate: [
          { path: 'airline', select: 'name iataCode logo' },
          { path: 'departureAirport', select: 'iataCode city country' },
          { path: 'arrivalAirport', select: 'iataCode city country' },
        ],
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      passenger,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

export const createPassenger = async (req, res, next) => {
  try {
    const passenger = await Passenger.create(req.body);
    res.status(201).json({ success: true, passenger });
  } catch (error) {
    next(error);
  }
};

export const updatePassenger = async (req, res, next) => {
  try {
    const passenger = await Passenger.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!passenger) return res.status(404).json({ success: false, message: 'Passenger not found' });
    res.json({ success: true, passenger });
  } catch (error) {
    next(error);
  }
};
