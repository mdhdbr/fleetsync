# FleetSync UI/UX Wireframes & Blueprint

## Overview

This document provides detailed wireframes and user experience flows for all FleetSync interfaces, covering the Control Center, mobile apps, and specialized portals.

---

## 1. Unified Control Center Dashboard

### Main Interface

![Control Center Dashboard](C:/Users/Hameed/.gemini/antigravity/brain/417f16c0-a450-4036-81e9-3a5bd6d4f93a/control_center_wireframe_1764503181776.png)

### Key Features

#### Top Navigation Bar
- **FleetSync Logo** (left) - Brand identity
- **Real-time Clock** - Saudi Arabia timezone
- **Active Alerts Badge** - Red notification icon with count
- **Mode Switcher** - Toggle between RideSync/LogiSync view
- **User Profile** - Avatar, name, role, logout

#### Left Sidebar - Filters & Controls
- **Vehicle Type Dropdown**
  - Cars (Standard, MPV, Luxury)
  - Trucks (Flatbed, Reefer, Tanker, Box)
- **Service Type Toggle**
  - RideSync (Passenger trips)
  - LogiSync (Freight shipments)
  - Both (Unified view)
- **Status Checkboxes**
  - ✅ Available/Empty
  - ✅ Active/Loaded
  - ✅ En-route
  - ❌ Offline
  - ❌ Maintenance
- **Region Selector**
  - Riyadh
  - Jeddah
  - Dammam
  - Mecca
  - Medina
  - All Regions
- **Search Bar** - Search by driver name, vehicle ID, trip ID

#### Center Map View
- **Interactive Map** - Full Saudi Arabia coverage
- **Weather Overlay Toggle** - Show/hide weather zones (rain, storm, heat)
- **Vehicle Icons** with color coding:
  - 🟢 Green - Available/Empty
  - 🔵 Blue - POB/Loaded
  - 🟡 Yellow - En-route
  - 🔴 Red - Offline
  - ⚫ Black - Maintenance
- **Impact Indicators** on markers:
  - 🟠 Orange dot - Weather impact
  - 🔴 Red dot - Road incident impact
- **Incident Markers** - Weather zones and road incidents
- **Clustering** - Group nearby vehicles at zoom out
- **Click Actions**:
  - View vehicle details
  - Contact driver
  - Assign job manually
  - View trip/shipment history
  - View weather/road impact

#### Right Panel - Live KPIs
- **Active Vehicles** - 125 (real-time count)
- **Trips Today** - 342 (RideSync + LogiSync)
- **Dead KM** - 12% (with trend arrow)
- **Utilization** - 87% (circular progress)
- **Revenue/KM** - SAR 4.50 (profitability)
- **Safety Score** - 8.7/10 (average driver rating)
- **Active Weather Alerts** - 3 (click to filter affected vehicles)

#### Operational Conditions Panel
**Live Weather Forecast**
- Current: 32°C, Clear Sky
- 3-day forecast strip (Mon: Rain 30°/23°, Tue: Cloudy 31°/24°, Wed: Sunny 33°/25°)

**Active Road Incidents**
- Scrollable list with severity badges
- Click to view details and highlight on map

![Operational Conditions Panel](C:/Users/Hameed/.gemini/antigravity/brain/417f16c0-a450-4036-81e9-3a5bd6d4f93a/weather_dashboard_panel_1764506560121.png)

#### Bottom Panel - Activity Feed
- Real-time event stream:
  - "Driver Ahmed completed trip #1234"
  - "New booking: Riyadh → Airport"
  - "Alert: Vehicle SA-1234 speeding"
  - "Truck #456 arrived at warehouse"

### User Flows

```mermaid
flowchart TD
    Login[Agent Logs In] --> Dashboard[View Dashboard]
    Dashboard --> Filter[Apply Filters]
    Filter --> Map[View Filtered Vehicles]
    Map --> Click[Click Vehicle]
    Click --> Details[View Details Panel]
    Details --> Action{Choose Action}
    Action -->|Assign Job| Manual[Manual Assignment]
    Action -->|Contact| Call[Call/Message Driver]
    Action -->|History| View[View Trip History]
    Action -->|Alert| Ack[Acknowledge Alert]
```

---

## 2. Passenger App (RideSync)

### Booking Interface

![Passenger App](C:/Users/Hameed/.gemini/antigravity/brain/417f16c0-a450-4036-81e9-3a5bd6d4f93a/passenger_app_wireframe_1764503200242.png)

### Key Features

#### Map View
- Shows available cars as green car icons
- Each icon displays ETA (e.g., "5 min")
- User's current location marked with blue dot
- Destination pin when selected

#### Booking Form (Bottom Sheet)
- **"Where to?" Input**
  - Autocomplete with Saudi addresses
  - Recent destinations
  - Saved favorites (Home, Work)
- **Passenger Count Selector**
  - Buttons: 1, 2, 3, 4, 5, 6, 7, 8
  - Visual indicator for selected count
- **Special Requirements**
  - ☑️ Child seat
  - ☑️ Wheelchair accessible
  - ☑️ Extra luggage space
  - ☑️ Pet-friendly
- **Vehicle Type Cards**
  - Standard (4 seats) - SAR 35
  - MPV (7 seats) - SAR 55
  - Luxury (4 seats) - SAR 75
  - Each card shows: image, capacity, price, ETA
- **Dynamic Pricing Display**
  - Base fare: SAR 20
  - Distance: SAR 15
  - Time: SAR 5
  - Surge (if applicable): +20%
  - **Total: SAR 45.00**
- **"Book Now" Button** - Large, vibrant blue

### Ride Tracking Screen
- Full-screen map with route
- Driver info card:
  - Photo, name, rating
  - Vehicle: Make, model, color, plate
  - ETA to pickup
- Action buttons:
  - 📞 Call driver
  - 💬 Message driver
  - 🚨 Emergency SOS
- Trip progress bar
- Fare estimate

### User Flow

```mermaid
flowchart TD
    Open[Open App] --> Map[View Available Cars]
    Map --> Dest[Enter Destination]
    Dest --> Req[Select Requirements]
    Req --> Type[Choose Vehicle Type]
    Type --> Price[View Dynamic Price]
    Price --> Confirm{Confirm Booking?}
    Confirm -->|Yes| Book[Create Booking]
    Confirm -->|No| Map
    Book --> Match[System Assigns Driver]
    Match --> Notify[Receive Confirmation]
    Notify --> Track[Track Driver Arrival]
    Track --> Pickup[Driver Arrives]
    Pickup --> Trip[Trip in Progress]
    Trip --> Dropoff[Arrive at Destination]
    Dropoff --> Pay[Payment]
    Pay --> Rate[Rate Driver]
    Rate --> End[Trip Complete]
```

---

## 3. Driver App

### Active Trip Interface

![Driver App](C:/Users/Hameed/.gemini/antigravity/brain/417f16c0-a450-4036-81e9-3a5bd6d4f93a/driver_app_wireframe_1764503223916.png)

### Key Features

#### Top Status Bar
- **Status Indicator**: "En-route to Pickup" with 🟡 yellow dot
- **Earnings Widget**: "Today: SAR 450 | This Trip: SAR 45"

#### Navigation Map (Top Half)
- Route to pickup/destination highlighted in blue
- ETA displayed prominently: "8 mins"
- Turn-by-turn navigation integration
- Traffic overlay

#### Trip Details Card (Bottom Half)
- **Passenger Info**
  - Name: "Ahmed Al-Saud"
  - Rating: ⭐ 4.8
  - Phone: (masked until accepted)
- **Locations**
  - Pickup: "King Fahd Road, Riyadh"
  - Destination: "King Khalid Airport"
- **Trip Details**
  - Passenger count: 2
  - Special requirements: "Child seat required" 🍼
  - Fare: SAR 45
- **Action Buttons**
  - 🧭 Navigate (blue) - Opens Google Maps
  - 📞 Call Passenger (green)
  - 💬 Message (gray)
- **COA Button** (appears on arrival)
  - Large orange button: "Complete on Arrival"
  - Triggers auto-assignment of next job

### Home Screen (No Active Trip)
- **Status Toggle**: Online/Offline
- **Earnings Summary**
  - Today: SAR 450
  - This Week: SAR 2,340
  - This Month: SAR 9,870
- **Performance Metrics**
  - Rating: ⭐ 4.9
  - Acceptance Rate: 95%
  - Completion Rate: 98%
  - Safety Score: 9.2/10
- **Trip History** - Recent trips list
- **Notifications** - New trip requests

### User Flow

```mermaid
flowchart TD
    Login[Driver Logs In] --> Online[Set Status: Online]
    Online --> Wait[Wait for Assignment]
    Wait --> Notify[Receive Trip Notification]
    Notify --> Accept{Accept Trip?}
    Accept -->|Yes| Nav[Navigate to Pickup]
    Accept -->|No| Wait
    Nav --> Arrive[Arrive at Pickup]
    Arrive --> Start[Start Trip]
    Start --> Drive[Navigate to Destination]
    Drive --> Complete[Arrive at Destination]
    Complete --> COA[Tap COA Button]
    COA --> Auto[Auto-Assignment Triggered]
    Auto --> Next{Next Job Available?}
    Next -->|Yes| Notify
    Next -->|No| Idle[Idle - Waiting]
    Idle --> Wait
```

---

## 4. Shipper Portal (LogiSync)

### Truck Booking Interface

![Shipper Portal](C:/Users/Hameed/.gemini/antigravity/brain/417f16c0-a450-4036-81e9-3a5bd6d4f93a/shipper_portal_wireframe_1764503251515.png)

### Key Features

#### Main Booking Form
- **Load Type Toggle**
  - LTL (Less Than Truckload)
  - FTL (Full Truckload)
- **Truck Type Selector** (visual cards)
  - 🚛 Flatbed
  - 🧊 Reefer (refrigerated)
  - 🛢️ Tanker
  - 📦 Box Truck
- **Load Details**
  - Weight (kg): Number input
  - Dimensions: L × W × H (cm)
  - Cargo Type: Dropdown (General, Perishable, Hazardous, Fragile)
- **Locations**
  - Pickup: Address autocomplete + map pin
  - Delivery: Address autocomplete + map pin
- **Scheduling**
  - Pickup Date/Time: Date-time picker
  - Delivery Date/Time: Date-time picker
- **Pricing Calculator**
  - Shows estimated cost based on:
    - Distance
    - Truck type
    - Load weight
    - Urgency

#### Right Sidebar - Available Trucks Map
- Map showing truck locations
- Color-coded status:
  - 🟢 Empty (available)
  - 🔵 Loaded (in transit)
  - 🟡 Loading (at warehouse)
  - 🟠 Unloading (at destination)
- Click truck for details

#### Active Shipments Table
- Columns:
  - Shipment ID
  - Truck Number
  - Status
  - Current Location
  - ETA
  - Actions (Track, Documents, Contact)
- Real-time status updates

### User Flow

```mermaid
flowchart TD
    Login[Shipper Logs In] --> Form[Fill Booking Form]
    Form --> Type[Select Load Type]
    Type --> Truck[Choose Truck Type]
    Truck --> Details[Enter Load Details]
    Details --> Loc[Set Pickup/Delivery]
    Loc --> Time[Schedule Times]
    Time --> Search[Search Available Trucks]
    Search --> Avail{Trucks Available?}
    Avail -->|Yes| Options[View Options + Pricing]
    Avail -->|No| Queue[Add to Queue]
    Options --> Book[Book Truck]
    Queue --> Notify[Notify When Available]
    Book --> Confirm[Booking Confirmed]
    Confirm --> Track[Track Shipment]
    Track --> POD[Proof of Delivery]
    POD --> Complete[Shipment Complete]
```

---

## 5. Analytics Dashboard

### KPI & Reports Interface

![Analytics Dashboard](C:/Users/Hameed/.gemini/antigravity/brain/417f16c0-a450-4036-81e9-3a5bd6d4f93a/analytics_dashboard_wireframe_1764503274044.png)

### Key Features

#### Top Filters Bar
- **Date Range Picker**: Last 7 days, 30 days, 90 days, Custom
- **Region Dropdown**: All, Riyadh, Jeddah, etc.
- **Vehicle Type**: All, Cars, Trucks
- **Export Buttons**: CSV, PDF, Excel

#### KPI Cards (Grid Layout)
1. **Active Vehicles**
   - Value: 125
   - Trend: 🔼 +8% vs last period
   - Sparkline chart
2. **Trips Today**
   - Value: 342
   - Chart icon
   - Breakdown: RideSync (280) + LogiSync (62)
3. **Dead Mileage**
   - Value: 12%
   - Trend: 🔽 -3% (improvement)
   - Target: <10%
4. **Fleet Utilization**
   - Value: 87%
   - Circular progress bar
   - Color: Green (>80%), Yellow (60-80%), Red (<60%)
5. **Revenue per KM**
   - Value: SAR 4.50
   - Trend: 🔼 +0.30
   - Profitability indicator
6. **Driver Safety Score**
   - Value: 8.7/10
   - Star rating: ⭐⭐⭐⭐⭐
   - Composite of all drivers

#### Revenue Trend Chart
- Large area chart
- X-axis: Last 30 days
- Y-axis: Revenue (SAR)
- Blue gradient fill
- Hover tooltips with daily breakdown

#### Top Performers Panel
- List of top 10 drivers
- Each entry shows:
  - Driver photo
  - Name
  - Total trips
  - Revenue generated
  - Safety score
  - Rating

#### Regional Performance Heat Map
- Map of Saudi Arabia
- Color intensity by activity level:
  - Dark blue: High activity
  - Light blue: Medium activity
  - Gray: Low activity
- Click region for detailed breakdown

---

## 6. Warehouse Management Interface

### Dock Scheduling Screen

#### Visual Dock Calendar
- Grid view: Dock doors (rows) × Time slots (columns)
- Color coding:
  - 🟢 Available
  - 🟡 Scheduled
  - 🔵 In Progress
  - ⚫ Blocked/Maintenance
- Drag-and-drop scheduling
- Conflict detection

#### Appointment Details
- Shipment ID
- Truck number
- Arrival time
- Expected duration
- Load type
- Special requirements
- Assigned dock door

#### Barcode Scanning Interface
- Camera view for QR/barcode scanning
- Manual entry option
- Scan results:
  - Item ID
  - Quantity
  - Location
  - Status (Inbound/Outbound)
- Batch scanning support

#### WMS Integration Status
- Connected systems:
  - SAP EWM: ✅ Connected
  - Oracle WMS: ✅ Connected
  - Zoho Inventory: ⚠️ Syncing
  - Fishbowl: ❌ Error
- Last sync time
- Sync logs
- Manual sync button

---

## Design System

### Color Palette

#### Primary Colors
- **Blue**: #4A90E2 (Primary actions, RideSync)
- **Orange**: #F5A623 (LogiSync, warnings)
- **Green**: #7ED321 (Success, available)
- **Red**: #D0021B (Alerts, errors)

#### Status Colors
- **Available/Empty**: #00C853 (Green)
- **Active/Loaded**: #2196F3 (Blue)
- **En-route/Loading**: #FFC107 (Yellow)
- **Offline/Error**: #F44336 (Red)
- **Maintenance**: #9E9E9E (Gray)

#### Background
- **Light Mode**: #FFFFFF, #F5F5F5
- **Dark Mode**: #1E1E1E, #2D2D2D

### Typography
- **Primary Font**: Inter (Google Fonts)
- **Headings**: 600 weight
- **Body**: 400 weight
- **Numbers/Data**: 500 weight, tabular-nums

### Components

#### Buttons
- **Primary**: Blue background, white text, rounded corners
- **Secondary**: White background, blue border, blue text
- **Danger**: Red background, white text
- **Size**: Large (48px), Medium (40px), Small (32px)

#### Cards
- White background (light mode) / Dark gray (dark mode)
- Border radius: 8px
- Shadow: 0 2px 8px rgba(0,0,0,0.1)
- Padding: 16px

#### Icons
- **Library**: Material Icons / Heroicons
- **Size**: 24px (standard), 32px (large), 16px (small)

### Responsive Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px
- **Large Desktop**: > 1440px

---

## Interaction Patterns

### Real-time Updates
- WebSocket connection for live data
- Visual indicators for updates (pulse animation)
- Toast notifications for important events
- Auto-refresh every 5 seconds as fallback

### Loading States
- Skeleton screens for initial load
- Spinner for actions
- Progress bars for uploads
- Optimistic UI updates

### Error Handling
- Inline validation messages
- Toast notifications for errors
- Retry buttons for failed actions
- Offline mode indicators

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader friendly
- High contrast mode
- Focus indicators
- Alt text for images

---

## Mobile-Specific Considerations

### Touch Targets
- Minimum size: 44×44px
- Spacing between targets: 8px
- Large buttons for primary actions

### Gestures
- Swipe to refresh
- Pull to load more
- Pinch to zoom (maps)
- Swipe to dismiss (notifications)

### Offline Support
- Service workers for caching
- Queue actions when offline
- Sync when connection restored
- Clear offline indicators

### Performance
- Lazy loading images
- Virtual scrolling for long lists
- Debounced search inputs
- Optimized map rendering
