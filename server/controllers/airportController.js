import Airport from '../models/Airport.js';

export const getAirports = async (req, res, next) => {
  try {
    const airports = await Airport.find().sort({ iataCode: 1 });
    res.json({ success: true, count: airports.length, airports });
  } catch (error) {
    next(error);
  }
};

export const getAirportById = async (req, res, next) => {
  try {
    const airport = await Airport.findById(req.params.id);
    if (!airport) return res.status(404).json({ success: false, message: 'Airport not found' });
    res.json({ success: true, airport });
  } catch (error) {
    next(error);
  }
};

export const updateAirportWeather = async (req, res, next) => {
  try {
    const airport = await Airport.findById(req.params.id);
    if (!airport) return res.status(404).json({ success: false, message: 'Airport not found' });

    airport.weather = {
      ...airport.weather.toObject(),
      ...req.body,
      lastUpdated: new Date(),
    };

    await airport.save();

    const io = req.app.get('io');
    if (io) {
      io.emit('weatherUpdated', { airportId: airport._id, weather: airport.weather });
    }

    res.json({ success: true, airport });
  } catch (error) {
    next(error);
  }
};
