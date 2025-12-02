# MHB Transport Pro — Production Prototype

> **Integrated Passenger & Logistics Operations Platform**  
> Tamil Nadu & Saudi Arabia Corridors

---

## 🎯 Overview

MHB Transport Pro is a production-ready web prototype for a unified transport operations command platform combining:

- **Passenger Transport** (Luxury sedan, MPV, SUV, VVIP, staff buses)
- **Road Logistics** (Crane trailers, container carriers, low-bed trucks, mini-wagons)
- **Mobile Services Marketplace** (Mobile fuel, tyre services, mechanics)
- **Real-time Fleet Tracking** (1,000+ vehicles capability)
- **Driver Safety & Compliance** (iAuditor-style checks, fatigue monitoring)
- **Business Intelligence** (KPIs, utilization analytics, empty-km reduction)

---

## 🚀 Quick Start

### Running the Prototype

1. **Open the prototype:**
   ```bash
   cd packages/control-center
   npm run dev
   ```

2. **Access in browser:**
   ```
   http://localhost:5173
   ```

3. **Navigate sections:**
   - **Business Plan** — Executive summary, features, capacity, tech stack
   - **Driver App** — Mobile app mock with complete workflows
   - **Control Center** — Desktop command center with live tracking

---

## ✨ Features Implemented

### 1. Business Plan Section

- **Executive Summary** with vision & value proposition
- **Key Features Grid** (6 major feature categories)
- **Capacity & Scale Stats** (500+ car transactions/day, 1,000+ vehicles)
- **Technology Stack** overview
- **CTA Buttons** to preview Driver App and Control Center

### 2. Driver App Mock (Mobile Preview)

#### Login & Authentication
- Phone number + Driver ID login
- Mock authentication flow
- Driver profile display with rating

#### Duty Management
- **Go Online/Offline** toggle
- Duty hours tracking
- Fatigue monitoring with progress bar
- 10-hour limit warning system

#### Job Workflows
- **Next Job Card** — Shows assigned jobs with pickup/dropoff, ETA, distance
- **Accept/Reject** job actions
- **Active Trip Card** with progress tracking:
  1. Accepted
  2. En Route
  3. Arrived (OTP verification)
  4. Onboard
  5. Complete

#### Pre-Trip Safety Checklist (iAuditor-style)
- 10-item digital checklist:
  - Fire extinguisher
  - First aid kit
  - Tyre check
  - Load secured
  - Alcohol test (mock)
  - Clean car
  - Emergency toolkit
  - Warning triangle & visibility jacket
  - Fuel check
  - Dashboard lights
- Progress tracking (X/10 items)
- Complete button enabled when all checked
- Logs to console (production: API call)

#### OTP Pickup Verification
- 4-digit OTP input modal
- Auto-focus between digits
- Passenger verification before trip start
- Demo OTP: **6789**

#### Quick Actions
- **Pre-Trip Check** — Opens checklist modal
- **Report Incident** — Incident reporting flow
- **Request Fuel** — Mobile fuel delivery request
- **Mechanic** — Mobile mechanic service request

#### Fatigue Monitoring
- Real-time duty hours display
- Visual progress bar (0-10 hours)
- Warning at 9 hours
- Alert sent to control center at 9 hours

#### Job List
- Shows pending, in-progress, and completed jobs
- Job ID, type, status badges
- Historical trip data

### 3. Control Center (Desktop Dashboard)

#### Stats Dashboard
- **Active Vehicles** — Real-time count
- **Pending Jobs** — Unassigned jobs
- **Mobile Service Requests** — Active vendor requests
- **Active Alerts** — Safety & operational alerts
- **Weather Alerts** — Environmental warnings

#### Live Fleet Tracking
- **Map Placeholder** (integrate Mapbox/Google Maps in production)
- **Vehicle Markers** with status colors:
  - 🟢 Online / Available
  - 🔵 En Route / POB
  - 🟡 Idle / Break
  - ⚫ Maintenance
  - 🟠 Weather Impact
  - 🔴 Road Incident
- **Weather Overlay** toggle
- **Refresh** button
- **Map Legend** with all status indicators

#### Vehicle Registry Table
- Searchable vehicle list
- Columns: Vehicle ID, Type, Driver, Status, Location
- **View Details** button per vehicle
- **Export** to CSV functionality
- Vehicle details modal with:
  - Full specifications
  - Current GPS coordinates
  - Speed & fuel level
  - Track on map / Contact driver actions

#### Operational Conditions Panel
- **Live Weather Forecast**
  - Current temperature & conditions
  - Weather icon
  - 3-day forecast strip
- **Active Road Incidents**
  - Incident type & severity
  - Location & description
  - Click to view full details

#### Active Alerts Panel
- Real-time alert feed
- Alert types:
  - ⚠️ Warning (fatigue, low fuel)
  - 🚨 Danger (speeding, accidents)
  - ℹ️ Info (maintenance, updates)
- **Acknowledge** button per alert
- **Clear All** button
- Auto-updates from driver app events

#### Mobile Service Vendors
- Vendor cards with:
  - Service type icon
  - Vendor name & rating
  - Verified badge
  - ETA & distance
  - **Request Service** button
- Mock vendors:
  - Quick Fuel Services (⭐ 4.8)
  - Mobile Mechanics Pro (⭐ 4.6)

#### Pending Jobs Board
- Job cards with:
  - Job ID & type
  - Passenger count / cargo weight
  - Vehicle requirement
  - Scheduled time
  - **Assign Driver** button
- **Create New Job** button

---

## 🎨 Design System

### Color Palette
- **Primary:** `#2563eb` (Blue)
- **Secondary:** `#7c3aed` (Purple)
- **Success:** `#10b981` (Green)
- **Warning:** `#f59e0b` (Orange)
- **Danger:** `#ef4444` (Red)
- **Info:** `#06b6d4` (Cyan)

### Dark Theme
- Background: `#0f172a` → `#1e293b` gradient
- Cards: `#1e293b` with `#334155` borders
- Text: `#f1f5f9` (primary), `#cbd5e1` (secondary), `#94a3b8` (muted)

### Typography
- **Font:** Inter (Google Fonts)
- **Weights:** 300, 400, 500, 600, 700, 800

### Effects
- **Glassmorphism** on header
- **Gradient buttons** with hover animations
- **Smooth transitions** (150-350ms)
- **Micro-animations** (pulse, slide, fade)
- **Box shadows** with glow effects

---

## 📊 Data Models

### Vehicle
```javascript
{
  id: "KSA-12345",
  type: "Crane Trailer",
  driver: "Ahmed",
  status: "enroute", // online, idle, maintenance, offline
  location: "Riyadh - King Fahd Rd",
  lat: 24.7136,
  lng: 46.6753,
  fuel: 72, // percentage
  speed: 56 // km/h
}
```

### Job
```javascript
{
  id: "JOB-20251202-001",
  type: "Passenger-Transfer", // or "Logistics"
  paxCount: 3,
  vehicleType: "Premium Sedan",
  pickup: {
    lat: 24.7136,
    lng: 46.6753,
    address: "King Fahd Road, Riyadh"
  },
  dropoff: {
    lat: 24.7453,
    lng: 46.6722,
    address: "King Abdullah Financial District"
  },
  scheduledAt: "2025-12-05T05:30:00+05:30",
  status: "pending", // assigned, accepted, in-progress, completed
  distance: 8.5, // km
  eta: 12, // minutes
  otp: 6789,
  passenger: {
    name: "Mohammed Al-Rashid",
    phone: "+966 50 XXX XXXX"
  }
}
```

### Driver
```javascript
{
  id: "DL-445",
  name: "Ahmed",
  phone: "+966 501234567",
  rating: 4.7,
  dutyStatus: "online", // offline, online
  dutyStartTime: "2025-12-02T09:00:00+05:30",
  currentJob: null, // or Job object
  tripState: "idle" // assigned, enroute, arrived, onboard, completed
}
```

### Alert
```javascript
{
  id: 1,
  type: "warning", // danger, info
  title: "Driver Fatigue Warning",
  description: "Driver DL-445 approaching 10-hour limit",
  time: "5 minutes ago",
  acknowledged: false
}
```

### Vendor
```javascript
{
  id: "VEND-TR72",
  type: "Tyre Unit", // or "Fuel", "Mechanic"
  name: "Quick Fuel Services",
  rating: 4.8,
  verified: true,
  location: { lat: 21.3, lng: 39.0 },
  etaMins: 22,
  distance: 8.5 // km
}
```

---

## 🔌 API Endpoints (Production Integration)

### Authentication
```
POST /api/auth/driver/login
Body: { phone, driverId }
Response: { token, driverProfile }
```

### Vehicles
```
GET /api/vehicles
GET /api/vehicles/:id
PUT /api/vehicles/:id/status
```

### Jobs
```
GET /api/jobs/pending
POST /api/jobs/assign
Body: { jobId, driverId }

POST /api/jobs/:id/state
Body: { state: "accepted" | "enroute" | "completed" }
```

### Checklist
```
POST /api/checklist/complete
Body: { driverId, vehicleId, items: [...] }
```

### Vendors
```
GET /api/vendors?type=fuel&lat=24.7&lng=46.6
POST /api/vendor/request
Body: { vendorId, driverId, serviceType }
```

### Alerts
```
GET /api/alerts
PUT /api/alerts/:id/acknowledge
POST /api/alerts
Body: { type, title, description }
```

### Weather & Road Conditions
```
GET /api/weather/current/:region
GET /api/weather/forecast/:region
GET /api/road/incidents
GET /api/road/incidents/:region
```

---

## 🌐 WebSocket Events (Real-time)

### Channels
```javascript
// Vehicle location updates
socket.on('vehicle:update', (data) => {
  // { vehicleId, lat, lng, speed, fuel, status }
});

// Job state changes
socket.on('job:update', (data) => {
  // { jobId, status, driverId, timestamp }
});

// New alerts
socket.on('alerts', (data) => {
  // { id, type, title, description, time }
});

// Driver duty changes
socket.on('driver:duty', (data) => {
  // { driverId, status: "online" | "offline" }
});
```

---

## 🧪 Testing the Prototype

### Driver App Flow

1. **Login:**
   - Phone: `+966 501234567`
   - Driver ID: `DL-445`
   - Click **Sign In**

2. **Go Online:**
   - Click **Go Online** button
   - Fatigue timer starts
   - Job assigned after 3 seconds

3. **Accept Job:**
   - Review job details (pickup, dropoff, ETA, distance)
   - Click **Accept Job**

4. **Start Trip:**
   - Click **Start Trip**
   - Status changes to "En Route"

5. **Mark Arrived:**
   - Click **Mark Arrived**
   - OTP modal opens

6. **Verify OTP:**
   - Enter OTP: `6789`
   - Click **Verify OTP**
   - Passenger onboard

7. **Complete Trip:**
   - Click **Complete Trip**
   - Trip marked as completed
   - Auto-assigns next job after 3 seconds (COA workflow)

### Pre-Trip Checklist

1. Click **Pre-Trip Check** quick action
2. Check all 10 items
3. Progress bar updates to 100%
4. Click **Complete Checklist**
5. Check console for logged data

### Mobile Service Request

1. Click **Request Fuel** or **Mechanic**
2. Alert shows vendor details
3. Control center stats update

### Control Center

1. Navigate to **Control Center**
2. View live stats dashboard
3. Click vehicle markers on map
4. View vehicle details modal
5. Acknowledge alerts
6. Request vendor services
7. Assign jobs to drivers

---

## 🛠️ Production Deployment Checklist

### Frontend
- [ ] Integrate Mapbox or Google Maps API
- [ ] Connect WebSocket for real-time updates
- [ ] Add authentication (JWT tokens)
- [ ] Implement role-based access control
- [ ] Add offline support (PWA)
- [ ] Set up error boundaries
- [ ] Add loading states
- [ ] Implement pagination for large datasets

### Backend
- [ ] Set up Node.js + Express server
- [ ] Configure PostgreSQL + PostGIS database
- [ ] Implement REST API endpoints
- [ ] Set up WebSocket server (Socket.IO)
- [ ] Add Redis for caching & sessions
- [ ] Configure RabbitMQ for job queues
- [ ] Implement authentication & authorization
- [ ] Add rate limiting & security headers

### Integrations
- [ ] Weather API (OpenWeatherMap / AccuWeather)
- [ ] Traffic API (Google Maps / HERE)
- [ ] Payment gateway (Stripe / PayPal)
- [ ] SMS gateway (Twilio) for OTP
- [ ] Email service (SendGrid) for notifications
- [ ] Push notifications (Firebase Cloud Messaging)

### Infrastructure
- [ ] Set up CI/CD pipeline
- [ ] Configure cloud hosting (AWS / Azure / GCP)
- [ ] Set up CDN for static assets
- [ ] Configure SSL/TLS certificates
- [ ] Set up monitoring (Datadog / New Relic)
- [ ] Configure logging (ELK stack)
- [ ] Set up backup & disaster recovery

### Security
- [ ] Implement HTTPS everywhere
- [ ] Add CSRF protection
- [ ] Sanitize user inputs
- [ ] Implement SQL injection prevention
- [ ] Add XSS protection
- [ ] Set up API key rotation
- [ ] Configure CORS properly
- [ ] Add audit logging

---

## 📈 Performance Targets

- **Map Load Time:** < 3 seconds
- **Dashboard Refresh:** < 5 seconds
- **API Response Time:** < 500ms
- **WebSocket Latency:** < 100ms
- **Concurrent Users:** 10,000+
- **Vehicle Tracking:** 5,000+ simultaneous

---

## 🔐 Security & Compliance

- **TLS 1.3** for all connections
- **JWT tokens** with refresh mechanism
- **Role-based access control** (Driver, Dispatcher, Admin)
- **Audit logs** for all state changes
- **Data encryption** at rest and in transit
- **PII protection** (GDPR/CCPA compliant)
- **Rate limiting** on all API endpoints
- **Input validation** & sanitization

---

## 📱 Mobile App (Future)

### Progressive Web App (PWA)
- **Installable** on mobile devices
- **Offline support** with service workers
- **Push notifications** for job assignments
- **GPS background tracking**
- **Camera integration** for POD & incidents

### React Native (Optional)
- Native iOS & Android apps
- Better performance for GPS tracking
- Native push notifications
- App store distribution

---

## 🎯 Next Steps

### Phase 1: Backend Development (Weeks 1-4)
1. Set up Node.js + Express server
2. Configure PostgreSQL database with PostGIS
3. Implement core API endpoints
4. Set up WebSocket server
5. Add authentication & authorization

### Phase 2: Map Integration (Weeks 5-6)
1. Integrate Mapbox or Google Maps
2. Implement real-time vehicle markers
3. Add route visualization
4. Implement geofencing
5. Add weather & traffic overlays

### Phase 3: Mobile App (Weeks 7-10)
1. Convert to PWA with service workers
2. Add offline support
3. Implement push notifications
4. Add GPS background tracking
5. Test on various devices

### Phase 4: Analytics & BI (Weeks 11-12)
1. Implement KPI calculations
2. Build report generation system
3. Add data visualization (charts)
4. Create export functionality (CSV, PDF, PPT)
5. Set up scheduled reports

### Phase 5: Testing & Launch (Weeks 13-16)
1. Unit testing (Jest)
2. Integration testing (Supertest)
3. E2E testing (Playwright)
4. Performance testing
5. Security audit
6. Beta launch with pilot users
7. Production deployment

---

## 📞 Support & Documentation

### Developer Resources
- **Implementation Plan:** `implementation_plan.md`
- **Architecture:** `architecture.md`
- **Flowcharts:** `flowcharts.md`
- **Weather Module:** `weather_module.md`
- **Wireframes:** `wireframes.md`

### API Documentation
Generate API docs using Swagger/OpenAPI in production.

### User Guides
Create separate guides for:
- Drivers
- Dispatchers
- Administrators
- Passengers
- Shippers

---

## 🏆 Success Metrics

### Operational KPIs
- **Fleet Utilization:** Target 85%+
- **Empty KM Reduction:** Target 40%+
- **On-Time Performance:** Target 95%+
- **Driver Safety Score:** Target 4.5+/5.0
- **Customer Satisfaction:** Target 4.7+/5.0

### Business Metrics
- **Daily Transactions:** 500+ car transactions
- **Active Vehicles:** 1,000+ tracked
- **Revenue per Vehicle:** Maximize through smart allocation
- **Operational Costs:** Reduce by 25% through optimization

---

## 📄 License

Proprietary — MHB Transport Pro  
© 2025 Mohamed Hameed Buhari

---

## 🙏 Credits

**Built with:**
- HTML5, CSS3, JavaScript (ES6+)
- Font Awesome Icons
- Google Fonts (Inter)
- Modern CSS Grid & Flexbox
- CSS Variables for theming

**Designed by:** Antigravity Pro  
**Author:** Mohamed Hameed Buhari  
**Version:** 1.0.0 (Production Prototype)  
**Last Updated:** December 2, 2025

---

## 🚀 Ready for Production!

This prototype demonstrates all core features and workflows. The next step is to:

1. **Review** the UI/UX flows
2. **Test** all interactive features
3. **Provide feedback** on design & functionality
4. **Plan** backend API development
5. **Deploy** to production infrastructure

**Questions or feedback?** Open an issue or contact the development team.

---

**Happy Transporting! 🚛🚗✨**
