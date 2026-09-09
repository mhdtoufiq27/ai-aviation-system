# ✈️ SkyFlow AI – AI Aviation Management System

A full-stack, enterprise-grade **AI Aviation Management System** built with the **MERN Stack (MongoDB, Express.js, React.js, Node.js)**, **Socket.io** for real-time telemetry, and a **Python AI / Machine Learning Microservice** for predictive delay modeling, passenger demand forecasting, smart route optimization, and natural language aviation intelligence.

Designed with a **dark glassmorphism aviation aesthetic**, inspired by modern Air Traffic Control (ATC) radar systems and flight dispatch cockpits.

---

## 🌟 Key Features

### 1. 🛫 Commercial Flight Management
- Comprehensive flight tracking across 100+ commercial flights and 20 international hubs.
- Real-time status transitions: `Scheduled`, `Boarding`, `Departed`, `Delayed`, `Arrived`, `Cancelled`.
- Gate and terminal assignment with automated delay causality logging.
- Instant WebSocket event broadcasting for operational synchronicity.

### 2. 🤖 AI / Machine Learning Features
- **AI Flight Delay Prediction**: Multi-factor machine learning classifier evaluating departure/arrival METAR weather (thunderstorms, squall lines, crosswinds), runway congestion, time-of-day peak bands, airline historical on-time dispatch rate, and aircraft fleet age. Produces delay probability, risk classification (`Severe`, `High`, `Moderate`, `Low`), expected delay minutes, and actionable recommendations.
- **Passenger Demand Forecasting**: Time-series demand forecasting projecting tomorrow's volume, 7-day daily flight passenger loads, 12-month traffic trajectories, and peak travel hours.
- **Smart Route Recommendation**: Compares standard airway corridors against AeroAI jetstream-optimized trajectories, computing fuel savings (kg & %), flight duration delta, CO2 emissions abatement, and airway waypoints.
- **Aviation Anomaly Detection**: Proactively detects statistical outliers such as turnaround bottlenecks, unexpected delay surges, unusual booking spikes, and sensor variances.
- **AeroAI Assistant Chatbot**: Conversational AI agent answering live database queries (e.g. *"Which flights are delayed?"*, *"What is the busiest airport today?"*, *"Show today's booking statistics"*, *"How many passengers are expected tomorrow?"*).

### 3. 🎟️ Interactive Flight Booking & Seat Map
- Interactive aircraft fuselage seat map with cabin class segregation (Economy, Premium Economy, Business, First Class).
- Real-time seat occupation locking and booking reference generation.
- Electronic Boarding Pass generation with barcodes, terminal, gate, seat code, and flight details.
- Ground staff passenger check-in toggle.

### 4. 🛠️ Aircraft Fleet & Maintenance Telemetry
- 50 tracked commercial aircraft (Airbus A350-900, A321neo, Boeing 787-9, 777-300ER, 737 MAX 8).
- Real-time health indices, fuel level gauges, flight hours, and maintenance overhaul schedules.

### 5. 👨‍✈️ Flight Crew Operations & Duty Roster
- 60 certified personnel: Captains, First Officers (Co-Pilots), Cabin Crew, and Ground Staff.
- Flight assignment tracking, flight hours, license classifications, and mandatory rest duty toggles.

### 6. 🌦️ Global Airports & Weather Telemetry
- 20 international airports (BLR, DEL, BOM, MAA, HYD, DXB, LHR, SIN, JFK, SFO, CDG, HND, etc.).
- Live METAR weather integration (Temperature, condition, wind speed, visibility, rain probability, air traffic density).
- **Live Weather & Congestion Simulator**: Allows staff to simulate squalls or thunderstorms and instantly test the impact on AI delay prediction!

---

## 👥 Role-Based Access Control (RBAC)

The system includes pre-seeded evaluation accounts with a **1-Click Demo Switcher** directly in the UI:

| Role | Email | Password | Access Highlights |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@skyflow.com` | `password123` | Full system control, user management, flight deletion, fleet maintenance |
| **Airline Manager** | `manager@skyflow.com` | `password123` | Air India fleet oversight, flight scheduling, crew assignment |
| **Ground Staff** | `staff@skyflow.com` | `password123` | Passenger gate check-in, flight status updates, weather simulation |
| **Passenger** | `passenger@skyflow.com` | `password123` | Flight booking, interactive seat selection, electronic boarding passes |

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS (Dark Glassmorphism Theme), Lucide Icons, Recharts, Axios, Socket.io-client.
- **Backend**: Node.js, Express.js, Socket.io, Mongoose, JWT, bcryptjs, Morgan.
- **Database**: MongoDB (11 Schemas: `users`, `airlines`, `airports`, `aircraft`, `flights`, `crew`, `passengers`, `bookings`, `predictions`, `anomalies`, `notifications`).
- **AI / ML Microservice**: Python, Flask, NumPy, Pandas, Scikit-Learn (with an embedded Node.js fallback bridge).

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally on `mongodb://127.0.0.1:27017`)
- Python 3.9+ (Optional for microservice, fallback engine active)

### 1. Database Seeding
To populate the database with realistic sample data (10 airlines, 20 airports, 50 aircraft, 100 flights, 200 passengers, 100 bookings, 60 crew):
```bash
cd server
npm install
npm run seed
```

### 2. Start Backend Server
```bash
cd server
npm start
# Server listens on port 5000 with Socket.io active
```

### 3. Start Python AI Microservice (Optional)
```bash
cd ai-service
pip install -r requirements.txt
python app.py
# AI microservice listens on port 5001
```

### 4. Start Frontend Client
```bash
cd client
npm install
npm run dev
# Vite dev server running at http://localhost:5173
```

---

## 🔌 API Endpoints Summary

### Authentication
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Authenticate & obtain JWT
- `GET /api/auth/profile` - Current user profile
- `GET /api/auth/users` - Admin user directory

### Flights & Radar
- `GET /api/flights` - List & filter flights
- `POST /api/flights` - Schedule new flight
- `PATCH /api/flights/:id/status` - Update status & gate with socket broadcast
- `POST /api/flights/:id/predict-delay` - Run AI delay prediction for flight

### Bookings & Seat Selection
- `GET /api/bookings` - List bookings
- `POST /api/bookings` - Create reservation & lock seat
- `PATCH /api/bookings/:id/status` - Update check-in status

### AI Microservices
- `POST /api/ai/predict-delay` - Delay probability classifier
- `POST /api/ai/forecast-passengers` - Passenger demand forecasting
- `POST /api/ai/recommend-route` - Airway trajectory optimizer
- `GET /api/ai/anomalies` - Anomaly detection feed
- `POST /api/ai/chat` - AeroAI Assistant NLP query

---

## 🎨 Design Philosophy
SkyFlow AI adheres to modern aviation control standards with high-contrast glowing elements, responsive dark panels, and fluid micro-animations for mission-critical situational awareness.
