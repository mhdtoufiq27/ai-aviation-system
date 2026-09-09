import Aircraft from '../models/Aircraft.js';

export const getAircraft = async (req, res, next) => {
  try {
    const { status, airline, model } = req.query;
    const filter = {};
    if (status && status !== 'All') filter.maintenanceStatus = status;
    if (airline && airline !== 'All') filter.airline = airline;
    if (model && model !== 'All') filter.model = model;

    const fleet = await Aircraft.find(filter)
      .populate('airline', 'name iataCode logo')
      .sort({ registrationNumber: 1 });

    res.json({
      success: true,
      count: fleet.length,
      aircraft: fleet,
    });
  } catch (error) {
    next(error);
  }
};

export const getAircraftById = async (req, res, next) => {
  try {
    const aircraft = await Aircraft.findById(req.params.id).populate('airline');
    if (!aircraft) return res.status(404).json({ success: false, message: 'Aircraft not found' });
    res.json({ success: true, aircraft });
  } catch (error) {
    next(error);
  }
};

export const createAircraft = async (req, res, next) => {
  try {
    const aircraft = await Aircraft.create(req.body);
    const populated = await Aircraft.findById(aircraft._id).populate('airline');
    res.status(201).json({ success: true, aircraft: populated });
  } catch (error) {
    next(error);
  }
};

export const updateAircraft = async (req, res, next) => {
  try {
    const aircraft = await Aircraft.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('airline');
    if (!aircraft) return res.status(404).json({ success: false, message: 'Aircraft not found' });
    res.json({ success: true, aircraft });
  } catch (error) {
    next(error);
  }
};

export const deleteAircraft = async (req, res, next) => {
  try {
    const aircraft = await Aircraft.findByIdAndDelete(req.params.id);
    if (!aircraft) return res.status(404).json({ success: false, message: 'Aircraft not found' });
    res.json({ success: true, message: 'Aircraft removed from fleet' });
  } catch (error) {
    next(error);
  }
};
