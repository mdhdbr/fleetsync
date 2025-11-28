# FleetSync Testing Guide

## Phase 7: WMS Integration & Dock Scheduler

### Testing WMS Features

1. **Access WMS Dashboard**
   - Navigate to `/wms` (requires admin login)
   - View warehouse overview with capacity indicators

2. **Create Inbound ASN**
   - Click "Inbound" tab
   - Select warehouse (e.g., "Jeddah Hub")
   - Enter item details (name, quantity, bin location)
   - Submit ASN
   - Verify inventory count increases

3. **Book Dock Slot**
   - Click "Docks" tab
   - Fill in booking form:
     - Warehouse: Jeddah Hub
     - Dock ID: 1-6
     - Start/End time
     - Truck ID
   - Submit booking
   - Try booking same dock/time → Should show conflict error

### API Endpoints
```bash
# Get inventory
GET http://localhost:4000/wms/inventory

# Create ASN
POST http://localhost:4000/wms/push-inbound
{
  "warehouseId": "wh_2",
  "items": [{ "item": "Test Item", "qty": 100, "bin": "C-10" }]
}

# Get dock bookings
GET http://localhost:4000/wms/docks

# Book dock
POST http://localhost:4000/wms/docks/book
{
  "warehouseId": "wh_2",
  "dockId": 2,
  "startTime": "2025-11-28T10:00:00Z",
  "endTime": "2025-11-28T11:00:00Z",
  "truckId": "veh_3"
}
```

---

## Phase 8: Driver Mobile App (PWA)

### Testing Driver App

1. **Access Driver App**
   - Navigate to `http://localhost:3001` (or mobile package port)
   - View driver dashboard

2. **Toggle Duty Status**
   - Click "Go On Duty"
   - App starts sending telemetry every 10 seconds

3. **Test COA Workflow**
   - Click "COA (Complete On Arrival)"
   - If pending job exists → Job assigned
   - If driver hours > 10 → Fatigue alert shown
   - If no jobs → "No jobs found" message

4. **Complete Job & Upload POD**
   - View job details (pickup, dropoff)
   - Click "Navigate" → Opens Google Maps
   - Click "Complete & Upload POD"
   - Upload photo, check boxes
   - Submit POD

### Testing Fatigue Rule

1. **Modify Mock Data** (packages/api/mock-data/data.json)
   ```json
   {
     "id": "veh_1",
     "driver_hours_today": 11  // Set > 10
   }
   ```

2. **Trigger COA**
   - Driver app will show fatigue alert
   - Assignment blocked until acknowledged

---

## Phase 9: Notifications, Alerts & Safety Rules

### Testing Alert Engine

1. **View Alerts Widget**
   - Login to dashboard
   - Alerts widget appears in right column
   - Filter by severity (All, High, Critical)

2. **Trigger Speeding Alert**
   ```bash
   POST http://localhost:4000/telemetry
   {
     "vehicleId": "veh_1",
     "lat": 24.7136,
     "lng": 46.6753,
     "speed": 125,  // > 120 triggers alert
     "timestamp": "2025-11-28T10:00:00Z"
   }
   ```
   - Alert should appear in real-time via Socket.IO
   - Type: "speeding", Severity: "high"

3. **Acknowledge Alert**
   - Click "Acknowledge" button on alert
   - Alert status changes to "acknowledged"

4. **Simulate Custom Alert**
   ```bash
   POST http://localhost:4000/alerts/simulate
   {
     "type": "temp_breach",
     "severity": "critical",
     "message": "Reefer temperature exceeded threshold",
     "vehicleId": "veh_2"
   }
   ```

### API Endpoints
```bash
# Get active alerts
GET http://localhost:4000/alerts

# Acknowledge alert
POST http://localhost:4000/alerts/acknowledge
{
  "alertId": "<alert_id>",
  "userId": "admin"
}
```

---

## Phase 10: Analytics Dashboards & Reports

### Testing Analytics Dashboard

1. **Access Analytics**
   - Navigate to `/analytics` (requires admin login)

2. **View KPIs**
   - Active Vehicles: 4
   - Trips Today: 12
   - Dead KM: Calculated from mock data
   - Utilization %: Average across date range
   - Revenue/KM: SAR 12.5

3. **Interact with Charts**
   - **Fleet Utilization**: Line chart showing daily percentages
   - **Dead Kilometers**: Bar chart of repositioning distances
   - **Profitability Trend**: Line chart with revenue vs cost
   - **Hub Throughput**: Bar chart of inbound/outbound volumes

4. **Export to CSV**
   - Click "Export CSV" on any chart
   - File downloads with chart data

5. **Report Templates**
   - View pre-defined templates:
     - Daily Operations
     - Financial Summary
     - Fleet Performance

### API Endpoints
```bash
# Get usage reports
GET http://localhost:4000/reports/usage?from=2025-11-20&to=2025-11-26
```

---

## Complete Integration Test

### Scenario: End-to-End Fleet Operation

1. **Setup**
   - Start API: `cd packages/api && npm run dev`
   - Start Control Center: `cd packages/control-center && npm run dev`
   - Start Mobile: `cd packages/mobile && npm run dev`

2. **Dispatcher Workflow**
   - Login to dashboard (admin/pass)
   - Create new trip via "Create Trip" button
   - Book truck via "Book Truck" button (LTL/FTL)
   - Monitor alerts in real-time
   - View analytics at `/analytics`
   - Manage WMS at `/wms`

3. **Driver Workflow**
   - Open driver app
   - Go on duty
   - Trigger COA
   - Accept job
   - Navigate to destination
   - Complete POD upload

4. **Shipper Workflow**
   - Navigate to `/shipper-portal`
   - View shipment list
   - Create new shipment
   - Track shipment status

5. **Verification**
   - Alerts appear in dashboard
   - Analytics update with new data
   - WMS inventory reflects changes
   - All Socket.IO events broadcast correctly

---

## Key Routes

### Control Center
- `/` - Landing page
- `/login` - Authentication
- `/dashboard` - Main fleet dashboard
- `/wms` - Warehouse Management System
- `/analytics` - Analytics & Reports
- `/shipper-portal` - Shipper interface

### API
- `/health` - Health check
- `/auth/login` - Authentication
- `/vehicles` - Vehicle management
- `/trips` - Trip management
- `/telemetry` - Telemetry data
- `/wms/*` - WMS endpoints
- `/alerts/*` - Alert management
- `/reports/*` - Analytics reports
- `/allocation/assign_next` - Auto-assignment
- `/shipments` - Freight shipments

### Mobile
- `/` or `/driver-app` - Driver PWA

---

## Troubleshooting

### Alerts Not Appearing
- Check Socket.IO connection in browser console
- Verify API server is running
- Check alert creation in API logs

### Charts Not Rendering
- Ensure recharts is installed: `npm install recharts`
- Check browser console for errors
- Verify API endpoint returns data

### Fatigue Rule Not Working
- Check vehicle mock data has `driver_hours_today` field
- Verify value is > 10
- Check allocation endpoint response

### WMS Dock Conflicts
- Ensure time ranges overlap correctly
- Check warehouse ID and dock ID match
- Verify booking data structure

---

## Mock Data Locations

- **Main Data**: `packages/api/mock-data/data.json`
- **Vehicles**: 4 vehicles with varying statuses
- **Warehouses**: 3 warehouses with dock counts
- **Trips**: 1 pending trip for testing
- **Inventory**: 2 sample items
- **Dock Bookings**: 1 sample booking
- **Alerts**: Empty array (populated at runtime)

---

## Next Steps

1. **Production Deployment**
   - Set up environment variables
   - Configure real database
   - Implement actual authentication
   - Set up SSL/TLS

2. **Additional Features**
   - Route optimization
   - Predictive maintenance
   - Customer notifications
   - Mobile app installation prompts
   - Advanced reporting filters

3. **Performance Optimization**
   - Implement caching
   - Optimize Socket.IO events
   - Add pagination to large datasets
   - Implement lazy loading for charts
