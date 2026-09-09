import Crew from '../models/Crew.js';

export const getCrew = async (req, res, next) => {
  try {
    const { role, status, airline } = req.query;
    const filter = {};
    if (role && role !== 'All') filter.role = role;
    if (status && status !== 'All') filter.availabilityStatus = status;
    if (airline && airline !== 'All') filter.airline = airline;

    const crewList = await Crew.find(filter)
      .populate('airline', 'name iataCode')
      .populate({
        path: 'assignedFlight',
        select: 'flightNumber departureTime arrivalTime status departureAirport arrivalAirport',
        populate: [
          { path: 'departureAirport', select: 'iataCode city' },
          { path: 'arrivalAirport', select: 'iataCode city' }
        ]
      })
      .sort({ name: 1 });

    res.json({
      success: true,
      count: crewList.length,
      crew: crewList,
    });
  } catch (error) {
    next(error);
  }
};

export const getCrewById = async (req, res, next) => {
  try {
    const member = await Crew.findById(req.params.id)
      .populate('airline')
      .populate('assignedFlight');
    if (!member) return res.status(404).json({ success: false, message: 'Crew member not found' });
    res.json({ success: true, crew: member });
  } catch (error) {
    next(error);
  }
};

export const createCrew = async (req, res, next) => {
  try {
    const crew = await Crew.create(req.body);
    const populated = await Crew.findById(crew._id).populate('airline');
    res.status(201).json({ success: true, crew: populated });
  } catch (error) {
    next(error);
  }
};

export const updateCrew = async (req, res, next) => {
  try {
    const crew = await Crew.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('airline')
      .populate('assignedFlight');
    if (!crew) return res.status(404).json({ success: false, message: 'Crew member not found' });
    res.json({ success: true, crew });
  } catch (error) {
    next(error);
  }
};

export const deleteCrew = async (req, res, next) => {
  try {
    const crew = await Crew.findByIdAndDelete(req.params.id);
    if (!crew) return res.status(404).json({ success: false, message: 'Crew member not found' });
    res.json({ success: true, message: 'Crew member removed' });
  } catch (error) {
    next(error);
  }
};
