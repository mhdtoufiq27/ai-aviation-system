import Booking from '../models/Booking.js';
import Flight from '../models/Flight.js';
import Passenger from '../models/Passenger.js';
import Notification from '../models/Notification.js';

export const getBookings = async (req, res, next) => {
  try {
    const filter = {};

    // If passenger role, restrict to their own bookings
    if (req.user && req.user.role === 'passenger') {
      filter.user = req.user._id;
    }

    const bookings = await Booking.find(filter)
      .populate('passenger')
      .populate({
        path: 'flight',
        populate: [
          { path: 'airline', select: 'name iataCode logo' },
          { path: 'departureAirport', select: 'name iataCode city country' },
          { path: 'arrivalAirport', select: 'name iataCode city country' },
        ],
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

export const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('passenger')
      .populate({
        path: 'flight',
        populate: [
          { path: 'airline' },
          { path: 'departureAirport' },
          { path: 'arrivalAirport' },
        ],
      });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({
      success: true,
      booking,
    });
  } catch (error) {
    next(error);
  }
};

export const createBooking = async (req, res, next) => {
  try {
    const {
      flightId,
      seatNumber,
      cabinClass = 'Economy',
      passengerData,
      totalAmount,
      specialRequests = [],
    } = req.body;

    const flight = await Flight.findById(flightId)
      .populate('airline')
      .populate('departureAirport')
      .populate('arrivalAirport');

    if (!flight) {
      return res.status(404).json({ success: false, message: 'Selected flight not found' });
    }

    // Check if seat already taken
    if (flight.occupiedSeats.includes(seatNumber)) {
      return res.status(400).json({ success: false, message: `Seat ${seatNumber} is already occupied. Please select another seat.` });
    }

    // Find or create passenger
    let passenger;
    if (passengerData.passportNumber) {
      passenger = await Passenger.findOne({ passportNumber: passengerData.passportNumber.toUpperCase() });
    }

    if (!passenger) {
      passenger = await Passenger.create({
        fullName: passengerData.fullName,
        email: passengerData.email || req.user?.email,
        phone: passengerData.phone || '+91 98765 43210',
        passportNumber: (passengerData.passportNumber || `P${Math.floor(10000000 + Math.random() * 90000000)}`).toUpperCase(),
        nationality: passengerData.nationality || 'Indian',
        dateOfBirth: passengerData.dateOfBirth || new Date('1994-06-15'),
        userAccount: req.user ? req.user._id : null,
      });
    }

    // Reserve seat in flight
    flight.occupiedSeats.push(seatNumber);
    flight.bookedSeatsCount += 1;
    await flight.save();

    const bookingRef = `SKY-${Math.floor(100000 + Math.random() * 900000)}`;
    const ticketCode = `TK-${flight.flightNumber}-${seatNumber}-${Date.now().toString().slice(-6)}`;

    const booking = await Booking.create({
      bookingReference: bookingRef,
      passenger: passenger._id,
      flight: flight._id,
      seatNumber,
      cabinClass,
      paymentStatus: 'Paid',
      bookingStatus: 'Confirmed',
      checkInStatus: 'Not Checked-in',
      totalAmount: totalAmount || flight.basePrice || 180,
      ticketCode,
      specialRequests,
      user: req.user ? req.user._id : null,
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('passenger')
      .populate({
        path: 'flight',
        populate: [{ path: 'airline' }, { path: 'departureAirport' }, { path: 'arrivalAirport' }],
      });

    // Notify via Socket.io
    const io = req.app.get('io');
    if (io) {
      io.emit('bookingCreated', populatedBooking);
      const notif = await Notification.create({
        title: `New Booking: ${bookingRef}`,
        message: `${passenger.fullName} booked seat ${seatNumber} on Flight ${flight.flightNumber} (${flight.departureAirport?.iataCode} → ${flight.arrivalAirport?.iataCode}).`,
        type: 'booking',
        severity: 'info',
        targetRole: 'staff',
        relatedFlight: flight._id,
      });
      io.emit('newNotification', notif);
    }

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully',
      booking: populatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBookingStatus = async (req, res, next) => {
  try {
    const { bookingStatus, checkInStatus } = req.body;
    const booking = await Booking.findById(req.params.id)
      .populate('passenger')
      .populate('flight');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (bookingStatus) booking.bookingStatus = bookingStatus;
    if (checkInStatus) booking.checkInStatus = checkInStatus;

    // If cancelled, free up seat
    if (bookingStatus === 'Cancelled') {
      const flight = await Flight.findById(booking.flight?._id);
      if (flight) {
        flight.occupiedSeats = flight.occupiedSeats.filter(s => s !== booking.seatNumber);
        flight.bookedSeatsCount = Math.max(0, flight.bookedSeatsCount - 1);
        await flight.save();
      }
    }

    await booking.save();

    const io = req.app.get('io');
    if (io) {
      io.emit('bookingUpdated', booking);
    }

    res.json({
      success: true,
      message: 'Booking updated successfully',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const flight = await Flight.findById(booking.flight);
    if (flight) {
      flight.occupiedSeats = flight.occupiedSeats.filter(s => s !== booking.seatNumber);
      flight.bookedSeatsCount = Math.max(0, flight.bookedSeatsCount - 1);
      await flight.save();
    }

    await booking.deleteOne();

    res.json({
      success: true,
      message: 'Booking removed successfully',
    });
  } catch (error) {
    next(error);
  }
};
