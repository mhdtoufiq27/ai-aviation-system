import Airline from '../models/Airline.js';

export const getAirlines = async (req, res, next) => {
  try {
    const airlines = await Airline.find().sort({ name: 1 });
    res.json({ success: true, count: airlines.length, airlines });
  } catch (error) {
    next(error);
  }
};

export const getAirlineById = async (req, res, next) => {
  try {
    const airline = await Airline.findById(req.params.id);
    if (!airline) return res.status(404).json({ success: false, message: 'Airline not found' });
    res.json({ success: true, airline });
  } catch (error) {
    next(error);
  }
};

export const createAirline = async (req, res, next) => {
  try {
    const airline = await Airline.create(req.body);
    res.status(201).json({ success: true, airline });
  } catch (error) {
    next(error);
  }
};

export const updateAirline = async (req, res, next) => {
  try {
    const airline = await Airline.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!airline) return res.status(404).json({ success: false, message: 'Airline not found' });
    res.json({ success: true, airline });
  } catch (error) {
    next(error);
  }
};
