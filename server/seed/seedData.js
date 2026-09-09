import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

import User from '../models/User.js';
import Airline from '../models/Airline.js';
import Airport from '../models/Airport.js';
import Aircraft from '../models/Aircraft.js';
import Flight from '../models/Flight.js';
import Crew from '../models/Crew.js';
import Passenger from '../models/Passenger.js';
import Booking from '../models/Booking.js';
import Anomaly from '../models/Anomaly.js';
import Notification from '../models/Notification.js';

dotenv.config();

const SEED_AIRLINES = [
  { name: 'Air India', iataCode: 'AI', icaoCode: 'AIC', country: 'India', headquarters: 'New Delhi', fleetSize: 125, onTimePerformance: 84.5, logo: '✈️' },
  { name: 'IndiGo', iataCode: '6E', icaoCode: 'IGO', country: 'India', headquarters: 'Gurugram', fleetSize: 320, onTimePerformance: 91.2, logo: '✈️' },
  { name: 'Emirates', iataCode: 'EK', icaoCode: 'UAE', country: 'United Arab Emirates', headquarters: 'Dubai', fleetSize: 260, onTimePerformance: 89.8, logo: '✈️' },
  { name: 'Singapore Airlines', iataCode: 'SQ', icaoCode: 'SIA', country: 'Singapore', headquarters: 'Singapore', fleetSize: 155, onTimePerformance: 92.4, logo: '✈️' },
  { name: 'Qatar Airways', iataCode: 'QR', icaoCode: 'QTR', country: 'Qatar', headquarters: 'Doha', fleetSize: 240, onTimePerformance: 90.6, logo: '✈️' },
  { name: 'Lufthansa', iataCode: 'LH', icaoCode: 'DLH', country: 'Germany', headquarters: 'Cologne', fleetSize: 280, onTimePerformance: 86.2, logo: '✈️' },
  { name: 'British Airways', iataCode: 'BA', icaoCode: 'BAW', country: 'United Kingdom', headquarters: 'London', fleetSize: 255, onTimePerformance: 83.9, logo: '✈️' },
  { name: 'Delta Air Lines', iataCode: 'DL', icaoCode: 'DAL', country: 'United States', headquarters: 'Atlanta', fleetSize: 950, onTimePerformance: 87.3, logo: '✈️' },
  { name: 'Qantas', iataCode: 'QF', icaoCode: 'QFA', country: 'Australia', headquarters: 'Sydney', fleetSize: 130, onTimePerformance: 88.0, logo: '✈️' },
  { name: 'Vistara', iataCode: 'UK', icaoCode: 'VTI', country: 'India', headquarters: 'Gurugram', fleetSize: 70, onTimePerformance: 89.1, logo: '✈️' }
];

const SEED_AIRPORTS = [
  { name: 'Kempegowda International Airport', iataCode: 'BLR', icaoCode: 'VOBL', city: 'Bengaluru', country: 'India', coordinates: { lat: 13.1986, lng: 77.7066 }, elevation: 915, timezone: 'Asia/Kolkata', terminals: ['T1', 'T2'], runways: 2, weather: { tempC: 26, condition: 'Clear', windSpeedKmph: 14, visibilityKm: 10, rainProbability: 10, airTrafficLevel: 'High' } },
  { name: 'Indira Gandhi International Airport', iataCode: 'DEL', icaoCode: 'VIDP', city: 'Delhi', country: 'India', coordinates: { lat: 28.5562, lng: 77.1000 }, elevation: 237, timezone: 'Asia/Kolkata', terminals: ['T1', 'T2', 'T3'], runways: 4, weather: { tempC: 30, condition: 'Haze', windSpeedKmph: 12, visibilityKm: 6, rainProbability: 15, airTrafficLevel: 'Congested' } },
  { name: 'Chhatrapati Shivaji Maharaj International', iataCode: 'BOM', icaoCode: 'VABB', city: 'Mumbai', country: 'India', coordinates: { lat: 19.0896, lng: 72.8656 }, elevation: 11, timezone: 'Asia/Kolkata', terminals: ['T1', 'T2'], runways: 2, weather: { tempC: 29, condition: 'Cloudy', windSpeedKmph: 18, visibilityKm: 8, rainProbability: 30, airTrafficLevel: 'High' } },
  { name: 'Chennai International Airport', iataCode: 'MAA', icaoCode: 'VOMM', city: 'Chennai', country: 'India', coordinates: { lat: 12.9941, lng: 80.1709 }, elevation: 16, timezone: 'Asia/Kolkata', terminals: ['T1', 'T4'], runways: 2, weather: { tempC: 31, condition: 'Sunny', windSpeedKmph: 16, visibilityKm: 10, rainProbability: 5, airTrafficLevel: 'Moderate' } },
  { name: 'Rajiv Gandhi International Airport', iataCode: 'HYD', icaoCode: 'VOHS', city: 'Hyderabad', country: 'India', coordinates: { lat: 17.2403, lng: 78.4294 }, elevation: 617, timezone: 'Asia/Kolkata', terminals: ['T1'], runways: 2, weather: { tempC: 28, condition: 'Clear', windSpeedKmph: 13, visibilityKm: 10, rainProbability: 8, airTrafficLevel: 'Moderate' } },
  { name: 'Dubai International Airport', iataCode: 'DXB', icaoCode: 'OMDB', city: 'Dubai', country: 'United Arab Emirates', coordinates: { lat: 25.2532, lng: 55.3657 }, elevation: 19, timezone: 'Asia/Dubai', terminals: ['T1', 'T2', 'T3'], runways: 2, weather: { tempC: 36, condition: 'Clear', windSpeedKmph: 15, visibilityKm: 10, rainProbability: 0, airTrafficLevel: 'Congested' } },
  { name: 'Heathrow Airport', iataCode: 'LHR', icaoCode: 'EGLL', city: 'London', country: 'United Kingdom', coordinates: { lat: 51.4700, lng: -0.4543 }, elevation: 25, timezone: 'Europe/London', terminals: ['T2', 'T3', 'T4', 'T5'], runways: 2, weather: { tempC: 17, condition: 'Light Rain', windSpeedKmph: 22, visibilityKm: 7, rainProbability: 65, airTrafficLevel: 'High' } },
  { name: 'Singapore Changi Airport', iataCode: 'SIN', icaoCode: 'WSSS', city: 'Singapore', country: 'Singapore', coordinates: { lat: 1.3644, lng: 103.9915 }, elevation: 7, timezone: 'Asia/Singapore', terminals: ['T1', 'T2', 'T3', 'T4'], runways: 3, weather: { tempC: 30, condition: 'Thunderstorm', windSpeedKmph: 25, visibilityKm: 5, rainProbability: 85, airTrafficLevel: 'High' } },
  { name: 'John F. Kennedy International Airport', iataCode: 'JFK', icaoCode: 'KJFK', city: 'New York', country: 'United States', coordinates: { lat: 40.6413, lng: -73.7781 }, elevation: 4, timezone: 'America/New_York', terminals: ['T1', 'T4', 'T5', 'T7', 'T8'], runways: 4, weather: { tempC: 22, condition: 'Partly Cloudy', windSpeedKmph: 19, visibilityKm: 10, rainProbability: 20, airTrafficLevel: 'High' } },
  { name: 'Netaji Subhash Chandra Bose International', iataCode: 'CCU', icaoCode: 'VECC', city: 'Kolkata', country: 'India', coordinates: { lat: 22.6547, lng: 88.4467 }, elevation: 5, timezone: 'Asia/Kolkata', terminals: ['T2'], runways: 2, weather: { tempC: 30, condition: 'Humid', windSpeedKmph: 11, visibilityKm: 8, rainProbability: 35, airTrafficLevel: 'Moderate' } },
  { name: 'Manohar International Airport, Mopa', iataCode: 'GOX', icaoCode: 'VOGA', city: 'Goa', country: 'India', coordinates: { lat: 15.7667, lng: 73.8667 }, elevation: 168, timezone: 'Asia/Kolkata', terminals: ['T1'], runways: 1, weather: { tempC: 29, condition: 'Sunny', windSpeedKmph: 17, visibilityKm: 10, rainProbability: 10, airTrafficLevel: 'Moderate' } },
  { name: 'San Francisco International Airport', iataCode: 'SFO', icaoCode: 'KSFO', city: 'San Francisco', country: 'United States', coordinates: { lat: 37.6213, lng: -122.3790 }, elevation: 4, timezone: 'America/Los_Angeles', terminals: ['T1', 'T2', 'T3', 'Intl'], runways: 4, weather: { tempC: 18, condition: 'Fog', windSpeedKmph: 28, visibilityKm: 4, rainProbability: 15, airTrafficLevel: 'High' } },
  { name: 'Charles de Gaulle Airport', iataCode: 'CDG', icaoCode: 'LFPG', city: 'Paris', country: 'France', coordinates: { lat: 49.0097, lng: 2.5479 }, elevation: 119, timezone: 'Europe/Paris', terminals: ['T1', 'T2', 'T3'], runways: 4, weather: { tempC: 19, condition: 'Overcast', windSpeedKmph: 15, visibilityKm: 9, rainProbability: 25, airTrafficLevel: 'Moderate' } },
  { name: 'Tokyo Haneda Airport', iataCode: 'HND', icaoCode: 'RJTT', city: 'Tokyo', country: 'Japan', coordinates: { lat: 35.5494, lng: 139.7798 }, elevation: 6, timezone: 'Asia/Tokyo', terminals: ['T1', 'T2', 'T3'], runways: 4, weather: { tempC: 23, condition: 'Clear', windSpeedKmph: 14, visibilityKm: 10, rainProbability: 5, airTrafficLevel: 'High' } },
  { name: 'Sydney Kingsford Smith Airport', iataCode: 'SYD', icaoCode: 'YSSY', city: 'Sydney', country: 'Australia', coordinates: { lat: -33.9399, lng: 151.1753 }, elevation: 6, timezone: 'Australia/Sydney', terminals: ['T1', 'T2', 'T3'], runways: 3, weather: { tempC: 21, condition: 'Clear', windSpeedKmph: 20, visibilityKm: 10, rainProbability: 10, airTrafficLevel: 'Moderate' } },
  { name: 'Frankfurt Airport', iataCode: 'FRA', icaoCode: 'EDDF', city: 'Frankfurt', country: 'Germany', coordinates: { lat: 50.0379, lng: 8.5622 }, elevation: 111, timezone: 'Europe/Berlin', terminals: ['T1', 'T2'], runways: 4, weather: { tempC: 18, condition: 'Drizzle', windSpeedKmph: 17, visibilityKm: 7, rainProbability: 55, airTrafficLevel: 'High' } },
  { name: 'Suvarnabhumi Airport', iataCode: 'BKK', icaoCode: 'VTBS', city: 'Bangkok', country: 'Thailand', coordinates: { lat: 13.6900, lng: 100.7501 }, elevation: 2, timezone: 'Asia/Bangkok', terminals: ['Main'], runways: 3, weather: { tempC: 32, condition: 'Rain', windSpeedKmph: 16, visibilityKm: 6, rainProbability: 70, airTrafficLevel: 'High' } },
  { name: 'Hamad International Airport', iataCode: 'DOH', icaoCode: 'OTHH', city: 'Doha', country: 'Qatar', coordinates: { lat: 25.2731, lng: 51.6081 }, elevation: 4, timezone: 'Asia/Qatar', terminals: ['T1'], runways: 2, weather: { tempC: 35, condition: 'Clear', windSpeedKmph: 14, visibilityKm: 10, rainProbability: 0, airTrafficLevel: 'Moderate' } },
  { name: 'Amsterdam Airport Schiphol', iataCode: 'AMS', icaoCode: 'EHAM', city: 'Amsterdam', country: 'Netherlands', coordinates: { lat: 52.3105, lng: 4.7683 }, elevation: -3, timezone: 'Europe/Amsterdam', terminals: ['Single'], runways: 6, weather: { tempC: 16, condition: 'Strong Winds', windSpeedKmph: 38, visibilityKm: 9, rainProbability: 40, airTrafficLevel: 'High' } },
  { name: 'O\'Hare International Airport', iataCode: 'ORD', icaoCode: 'KORD', city: 'Chicago', country: 'United States', coordinates: { lat: 41.9742, lng: -87.9073 }, elevation: 204, timezone: 'America/Chicago', terminals: ['T1', 'T2', 'T3', 'T5'], runways: 8, weather: { tempC: 20, condition: 'Clear', windSpeedKmph: 22, visibilityKm: 10, rainProbability: 10, airTrafficLevel: 'Congested' } }
];

const AIRCRAFT_MODELS = [
  { model: 'Airbus A320neo', manufacturer: 'Airbus', capacity: 186, fuel: 26730 },
  { model: 'Airbus A321neo', manufacturer: 'Airbus', capacity: 220, fuel: 32940 },
  { model: 'Airbus A350-900', manufacturer: 'Airbus', capacity: 325, fuel: 141000 },
  { model: 'Boeing 737 MAX 8', manufacturer: 'Boeing', capacity: 178, fuel: 26020 },
  { model: 'Boeing 777-300ER', manufacturer: 'Boeing', capacity: 396, fuel: 181280 },
  { model: 'Boeing 787-9 Dreamliner', manufacturer: 'Boeing', capacity: 290, fuel: 126372 }
];

const FIRST_NAMES = ['Aarav', 'Ananya', 'Rohan', 'Priya', 'Vikram', 'Sneha', 'Kabir', 'Meera', 'Aditya', 'Pooja', 'Rahul', 'Neha', 'Arjun', 'Isha', 'Dev', 'Kavya', 'James', 'Emma', 'Liam', 'Olivia', 'Noah', 'Sophia', 'Lucas', 'Mia', 'Alexander', 'Ava', 'William', 'Isabella', 'Ethan', 'Charlotte'];
const LAST_NAMES = ['Sharma', 'Verma', 'Patel', 'Reddy', 'Nair', 'Singh', 'Iyer', 'Chatterjee', 'Gupta', 'Mehta', 'Deshmukh', 'Kapoor', 'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Wilson', 'Anderson', 'Taylor'];
const NATIONALITIES = ['Indian', 'American', 'British', 'Emirati', 'Singaporean', 'German', 'Australian', 'Canadian', 'French', 'Japanese'];

export const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aviation_management';
    await mongoose.connect(mongoUri);
    console.log('🌱 Connected to MongoDB for seeding...');

    // Clear existing collections
    await Promise.all([
      User.deleteMany({}),
      Airline.deleteMany({}),
      Airport.deleteMany({}),
      Aircraft.deleteMany({}),
      Flight.deleteMany({}),
      Crew.deleteMany({}),
      Passenger.deleteMany({}),
      Booking.deleteMany({}),
      Anomaly.deleteMany({}),
      Notification.deleteMany({})
    ]);
    console.log('🧹 Purged existing collections.');

    // 1. Seed 4 Core Demo Users (Admin, Airline Manager, Staff, Passenger)
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    const createdUsers = await User.insertMany([
      { name: 'Admin Officer', email: 'admin@skyflow.com', password: passwordHash, role: 'admin', phone: '+91 99001 00001' },
      { name: 'Flight Ops Manager', email: 'manager@skyflow.com', password: passwordHash, role: 'airline_manager', phone: '+91 99001 00002' },
      { name: 'Gate Staff Lead', email: 'staff@skyflow.com', password: passwordHash, role: 'staff', phone: '+91 99001 00003' },
      { name: 'Aviation Traveler', email: 'passenger@skyflow.com', password: passwordHash, role: 'passenger', phone: '+91 99001 00004' },
    ]);
    console.log(`✅ Seeded ${createdUsers.length} test users (Password for all: password123)`);

    // 2. Seed 10 Airlines
    const createdAirlines = await Airline.insertMany(SEED_AIRLINES);
    console.log(`✅ Seeded ${createdAirlines.length} Airlines`);

    // Link manager to Air India
    await User.findByIdAndUpdate(createdUsers[1]._id, { airline: createdAirlines[0]._id });

    // 3. Seed 20 Airports
    const createdAirports = await Airport.insertMany(SEED_AIRPORTS);
    console.log(`✅ Seeded ${createdAirports.length} Airports`);

    // 4. Seed 50 Aircraft
    const aircraftDocs = [];
    for (let i = 1; i <= 50; i++) {
      const airline = createdAirlines[i % createdAirlines.length];
      const modelSpec = AIRCRAFT_MODELS[i % AIRCRAFT_MODELS.length];
      const regPrefix = airline.country === 'India' ? 'VT' : airline.country === 'United States' ? 'N' : airline.country === 'United Kingdom' ? 'G' : 'A6';
      const status = i % 15 === 0 ? 'Under Maintenance' : i === 48 ? 'Grounded' : 'Active';

      aircraftDocs.push({
        registrationNumber: `${regPrefix}-${String.fromCharCode(65 + (i % 26))}${String.fromCharCode(65 + ((i * 3) % 26))}${i + 100}`,
        model: modelSpec.model,
        manufacturer: modelSpec.manufacturer,
        airline: airline._id,
        seatingCapacity: modelSpec.capacity,
        fuelCapacityLitres: modelSpec.fuel,
        currentFuelLevel: Math.floor(65 + Math.random() * 32),
        maintenanceStatus: status,
        lastMaintenanceDate: new Date(Date.now() - (i * 2 + 10) * 24 * 60 * 60 * 1000),
        nextMaintenanceDate: new Date(Date.now() + (60 - i) * 24 * 60 * 60 * 1000),
        totalFlightHours: 800 + i * 140,
        healthScore: status === 'Active' ? Math.floor(90 + Math.random() * 9) : status === 'Under Maintenance' ? 72 : 55
      });
    }
    const createdAircraft = await Aircraft.insertMany(aircraftDocs);
    console.log(`✅ Seeded ${createdAircraft.length} Aircraft`);

    // 5. Seed 100 Flights
    const flightStatuses = ['Scheduled', 'Scheduled', 'Boarding', 'Departed', 'Delayed', 'Arrived', 'Scheduled'];
    const delayReasons = ['Severe Convective Weather', 'ATC Traffic Hold', 'Late Inbound Aircraft', 'Ground Handling Disruption', 'Engine Oil Sensor Calibration'];
    const flightDocs = [];

    const now = Date.now();
    for (let i = 1; i <= 100; i++) {
      const airline = createdAirlines[i % createdAirlines.length];
      const aircraft = createdAircraft[i % createdAircraft.length];
      const depAirport = createdAirports[i % createdAirports.length];
      let arrIndex = (i + 3) % createdAirports.length;
      if (arrIndex === (i % createdAirports.length)) arrIndex = (arrIndex + 1) % createdAirports.length;
      const arrAirport = createdAirports[arrIndex];

      const isIntl = depAirport.country !== arrAirport.country;
      const hoursOffset = (i - 40) * 2.5; // spread past, current, future flights
      const depTime = new Date(now + hoursOffset * 60 * 60 * 1000);
      const flightDurationHours = isIntl ? 5 + (i % 8) : 1.5 + (i % 2);
      const arrTime = new Date(depTime.getTime() + flightDurationHours * 60 * 60 * 1000);

      let status = 'Scheduled';
      let delayMinutes = 0;
      let delayReason = '';

      if (hoursOffset < -15) {
        status = 'Arrived';
      } else if (hoursOffset < -1) {
        status = i % 7 === 0 ? 'Delayed' : 'Departed';
        if (status === 'Delayed') {
          delayMinutes = 25 + (i % 55);
          delayReason = delayReasons[i % delayReasons.length];
        }
      } else if (hoursOffset >= -1 && hoursOffset <= 1) {
        status = i % 5 === 0 ? 'Delayed' : 'Boarding';
        if (status === 'Delayed') {
          delayMinutes = 40 + (i % 40);
          delayReason = delayReasons[i % delayReasons.length];
        }
      } else {
        if (i % 9 === 0) {
          status = 'Delayed';
          delayMinutes = 35 + (i % 30);
          delayReason = delayReasons[i % delayReasons.length];
        } else if (i === 77) {
          status = 'Cancelled';
          delayReason = 'Severe Thunderstorm & Flooding at Destination';
        } else {
          status = 'Scheduled';
        }
      }

      // Pre-calculate AI delay risk snapshot
      const delayProbability = status === 'Delayed' ? 78 : (i % 4 === 0 ? 58 : 14 + (i % 25));
      const riskLevel = delayProbability >= 75 ? 'Severe' : delayProbability >= 50 ? 'High' : delayProbability >= 30 ? 'Moderate' : 'Low';
      const expectedDelay = status === 'Delayed' ? delayMinutes : (delayProbability >= 50 ? 30 + (i % 20) : 5);

      const occupied = [];
      const bookedCount = Math.floor(aircraft.seatingCapacity * (0.6 + Math.random() * 0.35));
      for (let s = 1; s <= Math.min(bookedCount, 18); s++) {
        const row = s;
        const letter = ['A', 'B', 'C', 'D', 'E', 'F'][s % 6];
        occupied.push(`${row}${letter}`);
      }

      flightDocs.push({
        flightNumber: `${airline.iataCode}${100 + i}`,
        airline: airline._id,
        aircraft: aircraft._id,
        departureAirport: depAirport._id,
        arrivalAirport: arrAirport._id,
        departureTime: depTime,
        arrivalTime: arrTime,
        actualDepartureTime: status === 'Departed' || status === 'Arrived' ? depTime : null,
        actualArrivalTime: status === 'Arrived' ? arrTime : null,
        status,
        terminal: depAirport.terminals[i % depAirport.terminals.length],
        gate: `${['A', 'B', 'C', 'D'][i % 4]}${1 + (i % 24)}`,
        baggageBelt: `B${1 + (i % 8)}`,
        delayMinutes,
        delayReason,
        basePrice: isIntl ? 450 + (i % 400) : 95 + (i % 120),
        totalSeats: aircraft.seatingCapacity,
        bookedSeatsCount: bookedCount,
        occupiedSeats: occupied,
        aiPrediction: {
          delayProbability,
          riskLevel,
          expectedDelayMinutes: expectedDelay,
          recommendation: riskLevel === 'Severe' || riskLevel === 'High'
            ? `High probability of delay due to ${depAirport.weather?.condition} conditions and ATC slot congestion. Suggest passenger re-routing.`
            : 'Nominal trajectory. Expected on-time departure.',
          analyzedAt: new Date()
        },
        isInternational: isIntl
      });
    }
    const createdFlights = await Flight.insertMany(flightDocs);
    console.log(`✅ Seeded ${createdFlights.length} Flights`);

    // 6. Seed 200 Passengers
    const passengerDocs = [];
    for (let i = 1; i <= 200; i++) {
      const fName = FIRST_NAMES[i % FIRST_NAMES.length];
      const lName = LAST_NAMES[(i * 3) % LAST_NAMES.length];
      passengerDocs.push({
        fullName: `${fName} ${lName}`,
        email: `${fName.toLowerCase()}.${lName.toLowerCase()}${i}@flightmail.com`,
        phone: `+91 ${98000 + i} ${10000 + (i * 7)}`,
        passportNumber: `Z${Math.floor(10000000 + i * 2345)}`,
        nationality: NATIONALITIES[i % NATIONALITIES.length],
        dateOfBirth: new Date(1975 + (i % 30), (i % 12), 1 + (i % 28)),
        gender: i % 2 === 0 ? 'Male' : 'Female',
        frequentFlyerNumber: `FF-${10000 + i}`,
        mileagePoints: 1200 + i * 180,
        userAccount: i === 1 ? createdUsers[3]._id : null,
      });
    }
    const createdPassengers = await Passenger.insertMany(passengerDocs);
    console.log(`✅ Seeded ${createdPassengers.length} Passengers`);

    // 7. Seed 100 Bookings
    const bookingDocs = [];
    const cabinClasses = ['Economy', 'Economy', 'Economy', 'Premium Economy', 'Business', 'First Class'];
    for (let i = 1; i <= 100; i++) {
      const passenger = createdPassengers[i % createdPassengers.length];
      const flight = createdFlights[i % createdFlights.length];
      const row = 1 + (i % 28);
      const letter = ['A', 'B', 'C', 'D', 'E', 'F'][i % 6];
      const seat = `${row}${letter}`;
      const cabin = cabinClasses[i % cabinClasses.length];
      const priceMultiplier = cabin === 'First Class' ? 3.5 : cabin === 'Business' ? 2.2 : cabin === 'Premium Economy' ? 1.4 : 1.0;

      bookingDocs.push({
        bookingReference: `SKY-${100000 + i}`,
        passenger: passenger._id,
        flight: flight._id,
        seatNumber: seat,
        cabinClass: cabin,
        paymentStatus: 'Paid',
        bookingStatus: i % 25 === 0 ? 'Cancelled' : 'Confirmed',
        checkInStatus: i % 3 === 0 ? 'Checked-in' : i % 8 === 0 ? 'Boarded' : 'Not Checked-in',
        totalAmount: Math.round(flight.basePrice * priceMultiplier),
        ticketCode: `TK-${flight.flightNumber}-${seat}-${1000 + i}`,
        specialRequests: i % 4 === 0 ? ['Vegetarian Meal', 'Wheelchair Assistance'] : i % 5 === 0 ? ['Window Seat Preference'] : [],
        user: passenger.userAccount || null
      });
    }
    const createdBookings = await Booking.insertMany(bookingDocs);
    console.log(`✅ Seeded ${createdBookings.length} Bookings`);

    // 8. Seed Crew Members (60 crew members across roles)
    const crewDocs = [];
    const crewRoles = ['Pilot', 'Co-Pilot', 'Cabin Crew', 'Ground Staff'];
    for (let i = 1; i <= 60; i++) {
      const role = crewRoles[i % crewRoles.length];
      const airline = createdAirlines[i % createdAirlines.length];
      const fName = FIRST_NAMES[(i * 2) % FIRST_NAMES.length];
      const lName = LAST_NAMES[(i * 4) % LAST_NAMES.length];
      const assigned = i <= 35 ? createdFlights[i % createdFlights.length]._id : null;

      crewDocs.push({
        name: `${role === 'Pilot' ? 'Capt. ' : role === 'Co-Pilot' ? 'F/O ' : ''}${fName} ${lName}`,
        employeeId: `CREW-${airline.iataCode}-${1000 + i}`,
        role,
        airline: airline._id,
        assignedFlight: assigned,
        availabilityStatus: assigned ? 'On Duty' : (i % 7 === 0 ? 'Resting' : 'Available'),
        contactNumber: `+91 97${10000000 + i}`,
        licenseNumber: role.includes('Pilot') ? `ATPL-${40000 + i}` : `CA-${80000 + i}`,
        totalHoursFlown: 600 + i * 150,
        baseAirport: createdAirports[i % createdAirports.length]._id
      });
    }
    const createdCrew = await Crew.insertMany(crewDocs);
    console.log(`✅ Seeded ${createdCrew.length} Crew members`);

    // 9. Seed Anomalies
    const anomalyDocs = [
      {
        title: 'Abnormal Flight Delay Spike in Bengaluru (BLR) ↔ Mumbai (BOM) Corridor',
        anomalyType: 'Flight Delay Spike',
        severity: 'High',
        description: 'Average turnaround delay on BLR-BOM increased by +42 mins in the last 3 hours due to convective squall lines and ATC runway sequencing.',
        entityType: 'Route',
        entityIdentifier: 'BLR-BOM',
        detectedMetricValue: '+42 mins avg delay',
        baselineExpectedValue: '< 10 mins delay',
        deviationPercentage: 320,
        suggestedMitigation: 'Activate slot re-negotiation with ATC West. Issue pre-emptive passenger notifications.',
        status: 'Active'
      },
      {
        title: 'Unusual Booking Surge Detected for Delhi (DEL) → Dubai (DXB)',
        anomalyType: 'Unusual Booking Spike',
        severity: 'Medium',
        description: 'Seat reservations for flight EK511 & AI995 surged by +185% over the historical 24-hour moving average, indicating sudden event demand.',
        entityType: 'Flight',
        entityIdentifier: 'DEL-DXB Corridor',
        detectedMetricValue: '96.4% load factor',
        baselineExpectedValue: '72.0% load factor',
        deviationPercentage: 185,
        suggestedMitigation: 'Schedule wide-body Boeing 777-300ER replacement aircraft to accommodate overflow passengers.',
        status: 'Investigating'
      },
      {
        title: 'Aircraft Hydraulic Sensor Threshold Warning (VT-AAB102)',
        anomalyType: 'Aircraft Maintenance Alert',
        severity: 'Critical',
        description: 'Telemetry alerts show subtle pressure fluctuations in hydraulic system B during descent cycle. Sensor value outside 2-sigma variance.',
        entityType: 'Aircraft',
        entityIdentifier: 'VT-AAB102 (A320neo)',
        detectedMetricValue: '2,450 PSI',
        baselineExpectedValue: '3,000 ± 100 PSI',
        deviationPercentage: 18.3,
        suggestedMitigation: 'Ground aircraft for inspection upon arrival at Delhi Terminal 3. Swap tail with standby VT-AAR108.',
        status: 'Active'
      },
      {
        title: 'Extended Aircraft Turnaround at Heathrow (LHR)',
        anomalyType: 'Turnaround Delay',
        severity: 'Medium',
        description: 'Ground baggage handling and catering turnaround time exceeded the 45-minute standard envelope by +28 minutes.',
        entityType: 'Airport',
        entityIdentifier: 'LHR',
        detectedMetricValue: '73 minutes',
        baselineExpectedValue: '45 minutes',
        deviationPercentage: 62.2,
        suggestedMitigation: 'Deploy auxiliary ground handling crew team to Ramp Gate B32.',
        status: 'Investigating'
      },
      {
        title: 'Unscheduled Airspace Weather Avoidance Detour (Flight AI105)',
        anomalyType: 'Sudden Route Change',
        severity: 'Low',
        description: 'Flight AI105 executed a 45nm northern deviation from Airway L888 to avoid active severe cumulonimbus thunderstorm formation.',
        entityType: 'Flight',
        entityIdentifier: 'AI105',
        detectedMetricValue: '45nm lateral detour',
        baselineExpectedValue: '0nm detour',
        deviationPercentage: 100,
        suggestedMitigation: 'Re-calculate fuel reserve margin; estimated additional burn 420 kg fuel.',
        status: 'Mitigated'
      }
    ];
    const createdAnomalies = await Anomaly.insertMany(anomalyDocs);
    console.log(`✅ Seeded ${createdAnomalies.length} Initial Anomalies`);

    // 10. Seed Notifications
    const notificationDocs = [
      {
        title: '⚠️ Severe Delay Risk Alert: Flight AI203',
        message: 'Flight AI203 delay risk increased from Moderate to High (78% probability). Weather at BLR indicates heavy rainfall.',
        type: 'delay',
        severity: 'warning',
        targetRole: 'all',
        relatedFlight: createdFlights[0]._id
      },
      {
        title: '🚨 Critical Maintenance Notice: VT-AAB102',
        message: 'Aircraft VT-AAB102 requires mandatory inspection before next departure schedule.',
        type: 'anomaly',
        severity: 'critical',
        targetRole: 'airline_manager'
      },
      {
        title: '🎟️ Passenger Surge Alert',
        message: 'Busiest departure corridor today: Delhi (DEL) with 42 commercial movements.',
        type: 'system',
        severity: 'info',
        targetRole: 'staff'
      }
    ];
    await Notification.insertMany(notificationDocs);
    console.log('✅ Seeded Notifications');

    console.log('\n=============================================');
    console.log('🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('=============================================');
    console.log('Default Evaluation Accounts:');
    console.log('  👑 Admin:           admin@skyflow.com    / password123');
    console.log('  🏢 Airline Manager: manager@skyflow.com  / password123');
    console.log('  👨‍✈️ Ground Staff:    staff@skyflow.com    / password123');
    console.log('  🧳 Passenger:       passenger@skyflow.com / password123');
    console.log('=============================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
};

seedDatabase();
