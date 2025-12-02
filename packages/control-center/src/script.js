/* ========================================
   MHB TRANSPORT PRO - INTERACTIVE LOGIC
   Production-ready JavaScript for all
   interactive features and mock workflows
   ======================================== */

// ============================================
// GLOBAL STATE MANAGEMENT
// ============================================

const AppState = {
  currentSection: 'business',
  driver: {
    isLoggedIn: false,
    name: 'Ahmed',
    id: 'DL-445',
    phone: '+966 501234567',
    rating: 4.7,
    dutyStatus: 'offline', // offline, online
    dutyStartTime: null,
    currentJob: null,
    tripState: 'idle' // idle, assigned, enroute, arrived, onboard, completed
  },
  vehicles: [
    {
      id: 'KSA-12345',
      type: 'Crane Trailer',
      driver: 'Ahmed',
      status: 'enroute',
      location: 'Riyadh - King Fahd Rd',
      lat: 24.7136,
      lng: 46.6753,
      fuel: 72,
      speed: 56
    },
    {
      id: 'KSA-67890',
      type: 'Premium Sedan',
      driver: 'Mohammed',
      status: 'idle',
      location: 'Jeddah - Al Hamra',
      lat: 21.5433,
      lng: 39.1728,
      fuel: 85,
      speed: 0
    },
    {
      id: 'TN-11223',
      type: 'MPV',
      driver: 'Rajesh',
      status: 'online',
      location: 'Chennai - Anna Nagar',
      lat: 13.0827,
      lng: 80.2707,
      fuel: 65,
      speed: 0
    }
  ],
  alerts: [
    {
      id: 1,
      type: 'warning',
      title: 'Driver Fatigue Warning',
      description: 'Driver DL-445 approaching 10-hour limit',
      time: '5 minutes ago',
      acknowledged: false
    },
    {
      id: 2,
      type: 'danger',
      title: 'Speed Alert',
      description: 'Vehicle KSA-12345 exceeding 120 km/h',
      time: '12 minutes ago',
      acknowledged: false
    },
    {
      id: 3,
      type: 'info',
      title: 'Low Fuel',
      description: 'Vehicle TN-11223 fuel level at 15%',
      time: '28 minutes ago',
      acknowledged: false
    }
  ],
  jobs: [
    {
      id: 'JOB-20251202-001',
      type: 'Passenger-Transfer',
      paxCount: 3,
      vehicleType: 'Premium Sedan',
      pickup: { lat: 24.7136, lng: 46.6753, address: 'King Fahd Road, Riyadh' },
      dropoff: { lat: 24.7453, lng: 46.6722, address: 'King Abdullah Financial District' },
      scheduledAt: '2025-12-05T05:30:00+05:30',
      status: 'pending',
      distance: 8.5,
      eta: 12,
      otp: 6789,
      passenger: {
        name: 'Mohammed Al-Rashid',
        phone: '+966 50 XXX XXXX'
      }
    },
    {
      id: 'JOB-20251202-002',
      type: 'Logistics',
      vehicleType: 'Container Carrier',
      weight: 18,
      pickup: { lat: 24.6877, lng: 46.7219, address: 'Riyadh Port' },
      dropoff: { lat: 24.7744, lng: 46.7388, address: 'Industrial Area' },
      scheduledAt: '2025-12-05T06:00:00+05:30',
      status: 'pending'
    }
  ],
  checklist: {
    items: [
      'check-fire',
      'check-firstaid',
      'check-tyres',
      'check-load',
      'check-alcohol',
      'check-clean',
      'check-toolkit',
      'check-triangle',
      'check-fuel',
      'check-dashboard'
    ],
    completed: []
  }
};

// ============================================
// NAVIGATION & SECTION SWITCHING
// ============================================

function switchSection(section) {
  // Update state
  AppState.currentSection = section;

  // Update UI
  document.querySelectorAll('.content-section').forEach(sec => {
    sec.classList.remove('active');
  });
  document.getElementById(`${section}-section`).classList.add('active');

  // Update nav buttons
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-section="${section}"]`).classList.add('active');

  // Initialize section-specific features
  if (section === 'control') {
    initializeControlCenter();
  }
}

// ============================================
// DRIVER APP FUNCTIONALITY
// ============================================

function driverLogin() {
  const phone = document.getElementById('driver-phone').value;
  const driverId = document.getElementById('driver-id').value;

  // Mock validation
  if (phone && driverId) {
    AppState.driver.isLoggedIn = true;
    AppState.driver.phone = phone;
    AppState.driver.id = driverId;

    // Show dashboard
    document.getElementById('driver-login').style.display = 'none';
    document.getElementById('driver-dashboard').style.display = 'block';

    // Update driver name
    document.getElementById('driver-name').textContent = AppState.driver.name;

    console.log('✅ Driver logged in:', AppState.driver);
  } else {
    alert('Please enter both phone number and driver ID');
  }
}

function toggleDuty() {
  const btn = document.getElementById('duty-status');

  if (AppState.driver.dutyStatus === 'offline') {
    // Go online
    AppState.driver.dutyStatus = 'online';
    AppState.driver.dutyStartTime = new Date();
    btn.classList.add('online');
    btn.innerHTML = '<i class="fas fa-power-off"></i><span>Go Offline</span>';

    // Start fatigue timer
    startFatigueTimer();

    // Simulate job assignment after 3 seconds
    setTimeout(() => {
      assignNextJob();
    }, 3000);

    console.log('✅ Driver is now ONLINE');
  } else {
    // Go offline
    AppState.driver.dutyStatus = 'offline';
    AppState.driver.dutyStartTime = null;
    btn.classList.remove('online');
    btn.innerHTML = '<i class="fas fa-power-off"></i><span>Go Online</span>';

    // Stop fatigue timer
    if (window.fatigueInterval) {
      clearInterval(window.fatigueInterval);
    }

    // Hide job card
    document.getElementById('next-job-card').style.display = 'none';

    console.log('⚠️ Driver is now OFFLINE');
  }
}

function startFatigueTimer() {
  let minutes = 0;

  window.fatigueInterval = setInterval(() => {
    minutes += 1;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    // Update display
    document.getElementById('duty-hours').textContent = `${hours}h ${mins}m`;

    // Update progress bar (10 hours = 100%)
    const progress = (minutes / 600) * 100;
    document.getElementById('fatigue-progress').style.width = `${progress}%`;

    // Show warning at 9 hours (540 minutes)
    if (minutes >= 540) {
      document.getElementById('fatigue-warning').style.display = 'flex';

      // Create alert in control center
      if (minutes === 540) {
        addAlert({
          type: 'warning',
          title: 'Driver Fatigue Alert',
          description: `Driver ${AppState.driver.id} has been on duty for 9 hours`,
          time: 'Just now'
        });
      }
    }
  }, 1000); // Update every second (in production, use 60000 for every minute)
}

function assignNextJob() {
  const job = AppState.jobs.find(j => j.status === 'pending');

  if (job && AppState.driver.dutyStatus === 'online') {
    AppState.driver.currentJob = job;
    AppState.driver.tripState = 'assigned';
    job.status = 'assigned';

    // Show job card
    document.getElementById('next-job-card').style.display = 'block';

    console.log('📋 New job assigned:', job);
  }
}

function acceptJob() {
  if (AppState.driver.currentJob) {
    AppState.driver.tripState = 'accepted';
    AppState.driver.currentJob.status = 'accepted';

    // Hide next job card, show active job card
    document.getElementById('next-job-card').style.display = 'none';
    document.getElementById('active-job-card').style.display = 'block';

    // Update trip progress
    updateTripProgress('accepted');

    console.log('✅ Job accepted');
  }
}

function rejectJob() {
  if (AppState.driver.currentJob) {
    AppState.driver.currentJob.status = 'pending';
    AppState.driver.currentJob = null;
    AppState.driver.tripState = 'idle';

    // Hide job card
    document.getElementById('next-job-card').style.display = 'none';

    console.log('❌ Job rejected');

    // Try to assign another job after 5 seconds
    setTimeout(() => {
      assignNextJob();
    }, 5000);
  }
}

function startTrip() {
  if (AppState.driver.tripState === 'accepted') {
    AppState.driver.tripState = 'enroute';
    updateTripProgress('enroute');

    // Update button
    const btn = document.getElementById('trip-action-btn');
    btn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Mark Arrived';
    btn.onclick = markArrived;

    console.log('🚗 Trip started - En route to pickup');
  }
}

function markArrived() {
  if (AppState.driver.tripState === 'enroute') {
    // Show OTP modal
    openModal('otp-modal');

    console.log('📍 Arrived at pickup location');
  }
}

function verifyOTP() {
  const otp1 = document.getElementById('otp-1').value;
  const otp2 = document.getElementById('otp-2').value;
  const otp3 = document.getElementById('otp-3').value;
  const otp4 = document.getElementById('otp-4').value;

  const enteredOTP = `${otp1}${otp2}${otp3}${otp4}`;
  const correctOTP = AppState.driver.currentJob.otp.toString();

  if (enteredOTP === correctOTP) {
    // OTP verified
    AppState.driver.tripState = 'onboard';
    updateTripProgress('onboard');

    // Update button
    const btn = document.getElementById('trip-action-btn');
    btn.innerHTML = '<i class="fas fa-flag-checkered"></i> Complete Trip';
    btn.onclick = completeTrip;

    closeModal('otp-modal');

    console.log('✅ OTP verified - Passenger onboard');
  } else {
    alert('❌ Invalid OTP. Please try again.\nCorrect OTP: ' + correctOTP);
  }
}

function completeTrip() {
  if (AppState.driver.tripState === 'onboard') {
    AppState.driver.tripState = 'completed';
    AppState.driver.currentJob.status = 'completed';
    updateTripProgress('completed');

    console.log('🎉 Trip completed successfully!');

    // Hide active job card after 2 seconds
    setTimeout(() => {
      document.getElementById('active-job-card').style.display = 'none';
      AppState.driver.currentJob = null;
      AppState.driver.tripState = 'idle';

      // Auto-assign next job (COA workflow)
      setTimeout(() => {
        assignNextJob();
      }, 3000);
    }, 2000);
  }
}

function updateTripProgress(state) {
  const steps = {
    'accepted': 1,
    'enroute': 2,
    'arrived': 2,
    'onboard': 3,
    'completed': 4
  };

  const currentStep = steps[state];

  for (let i = 2; i <= 4; i++) {
    const step = document.getElementById(`trip-step-${i}`);
    if (i < currentStep) {
      step.classList.add('completed');
      step.classList.remove('active');
      step.querySelector('i').className = 'fas fa-check-circle';
    } else if (i === currentStep) {
      step.classList.add('active');
      step.classList.remove('completed');
    } else {
      step.classList.remove('active', 'completed');
      step.querySelector('i').className = 'fas fa-circle';
    }
  }
}

function showPreTripChecklist() {
  openModal('pretrip-modal');

  // Reset checklist
  AppState.checklist.completed = [];
  document.querySelectorAll('.checklist input[type="checkbox"]').forEach(cb => {
    cb.checked = false;
  });
  updateChecklistProgress();
}

function updateChecklistProgress() {
  const total = AppState.checklist.items.length;
  let completed = 0;

  AppState.checklist.items.forEach(item => {
    if (document.getElementById(item).checked) {
      completed++;
    }
  });

  AppState.checklist.completed = completed;

  // Update progress bar
  const percentage = (completed / total) * 100;
  document.getElementById('checklist-progress').style.width = `${percentage}%`;
  document.getElementById('checklist-count').textContent = `${completed}/${total}`;

  // Enable/disable complete button
  const completeBtn = document.getElementById('complete-checklist-btn');
  if (completed === total) {
    completeBtn.disabled = false;
  } else {
    completeBtn.disabled = true;
  }
}

function completeChecklist() {
  console.log('✅ Pre-trip checklist completed:', {
    driverId: AppState.driver.id,
    vehicleId: 'KSA-12345', // Mock vehicle ID
    timestamp: new Date().toISOString(),
    items: AppState.checklist.items.map(item => ({
      name: document.querySelector(`label[for="${item}"]`).textContent.trim(),
      checked: true
    }))
  });

  alert('✅ Pre-trip checklist completed successfully!\n\nIn production, this would:\n- Log to backend API\n- Update vehicle status\n- Enable trip start');

  closeModal('pretrip-modal');
}

function showIncidentReport() {
  alert('🚨 Incident Reporting\n\nThis would open a form to report:\n- Accident details\n- Vehicle damage\n- Road hazards\n- Safety concerns\n\nWith photo upload and GPS location capture.');

  console.log('📝 Incident report initiated by driver:', AppState.driver.id);
}

function requestMobileService(serviceType) {
  const services = {
    fuel: 'Mobile Fuel Delivery',
    mechanic: 'Mobile Mechanic Service'
  };

  alert(`🔧 ${services[serviceType]} Requested\n\nSearching for nearest vendor...\n\nETA: 22 minutes\nVendor: Quick Fuel Services\nRating: 4.8 ⭐`);

  console.log(`🛠️ Mobile service requested: ${serviceType}`, {
    driverId: AppState.driver.id,
    location: { lat: 24.7136, lng: 46.6753 },
    timestamp: new Date().toISOString()
  });

  // Update control center stats
  const currentCount = parseInt(document.getElementById('mobile-services').textContent);
  document.getElementById('mobile-services').textContent = currentCount + 1;
}

// ============================================
// CONTROL CENTER FUNCTIONALITY
// ============================================

function initializeControlCenter() {
  console.log('🎛️ Control Center initialized');

  // Start real-time updates simulation
  startRealtimeUpdates();
}

function startRealtimeUpdates() {
  // Simulate real-time vehicle updates every 5 seconds
  setInterval(() => {
    // Randomly update vehicle positions and stats
    AppState.vehicles.forEach(vehicle => {
      // Simulate small GPS changes
      vehicle.lat += (Math.random() - 0.5) * 0.001;
      vehicle.lng += (Math.random() - 0.5) * 0.001;

      // Simulate speed changes
      if (vehicle.status === 'enroute') {
        vehicle.speed = Math.floor(Math.random() * 40) + 40; // 40-80 km/h
      } else {
        vehicle.speed = 0;
      }
    });

    console.log('🔄 Real-time update:', new Date().toLocaleTimeString());
  }, 5000);

  // Simulate weather/road impact updates every 20 seconds
  setInterval(() => {
    simulateEnvironmentalImpact();
  }, 20000);
}

function simulateEnvironmentalImpact() {
  // Randomly assign weather or road impact to vehicles
  const randomVehicle = AppState.vehicles[Math.floor(Math.random() * AppState.vehicles.length)];

  const weatherImpacts = [
    {
      type: 'weather',
      message: 'Heavy rain slowing progress',
      icon: 'fa-cloud-rain',
      severity: 'medium',
      delayMinutes: 15,
      speedReduction: 30 // percentage
    },
    {
      type: 'weather',
      message: 'Sandstorm warning in area',
      icon: 'fa-wind',
      severity: 'high',
      delayMinutes: 30,
      speedReduction: 50
    },
    {
      type: 'weather',
      message: 'Extreme heat affecting operations',
      icon: 'fa-sun',
      severity: 'low',
      delayMinutes: 10,
      speedReduction: 15
    },
    {
      type: 'weather',
      message: 'Low visibility due to fog',
      icon: 'fa-smog',
      severity: 'medium',
      delayMinutes: 20,
      speedReduction: 40
    }
  ];

  const roadImpacts = [
    {
      type: 'road',
      message: 'Major congestion on King Fahd Road',
      icon: 'fa-car-crash',
      severity: 'high',
      delayMinutes: 40,
      speedReduction: 60
    },
    {
      type: 'road',
      message: 'Construction causing lane closure',
      icon: 'fa-road',
      severity: 'medium',
      delayMinutes: 15,
      speedReduction: 35
    },
    {
      type: 'road',
      message: 'Accident on Highway 40',
      icon: 'fa-exclamation-triangle',
      severity: 'high',
      delayMinutes: 25,
      speedReduction: 70
    },
    {
      type: 'road',
      message: 'Road closure - detour required',
      icon: 'fa-ban',
      severity: 'critical',
      delayMinutes: 45,
      speedReduction: 80
    }
  ];

  // Randomly choose weather or road impact
  const allImpacts = Math.random() > 0.5 ? weatherImpacts : roadImpacts;
  const impact = allImpacts[Math.floor(Math.random() * allImpacts.length)];

  // Store impact on vehicle
  randomVehicle.impact = impact;
  randomVehicle.originalSpeed = randomVehicle.speed;
  randomVehicle.speed = Math.max(10, randomVehicle.speed * (1 - impact.speedReduction / 100));

  // Calculate new ETA
  const originalETA = 25; // minutes
  const newETA = originalETA + impact.delayMinutes;
  randomVehicle.eta = newETA;
  randomVehicle.originalETA = originalETA;

  // Add to impact tracking
  if (!AppState.impactTracking) {
    AppState.impactTracking = {
      weatherDelays: [],
      roadIncidents: [],
      totalDelayMinutes: 0,
      affectedVehicles: []
    };
  }

  const impactRecord = {
    vehicleId: randomVehicle.id,
    type: impact.type,
    message: impact.message,
    severity: impact.severity,
    delayMinutes: impact.delayMinutes,
    timestamp: new Date().toISOString(),
    location: randomVehicle.location
  };

  if (impact.type === 'weather') {
    AppState.impactTracking.weatherDelays.push(impactRecord);
  } else {
    AppState.impactTracking.roadIncidents.push(impactRecord);
  }

  AppState.impactTracking.totalDelayMinutes += impact.delayMinutes;

  if (!AppState.impactTracking.affectedVehicles.includes(randomVehicle.id)) {
    AppState.impactTracking.affectedVehicles.push(randomVehicle.id);
  }

  // Update UI - Add impact indicator to vehicle marker
  updateVehicleMarkerWithImpact(randomVehicle);

  // Update vehicle table if exists
  updateVehicleTableWithImpact(randomVehicle);

  // Create alert for high severity impacts
  if (impact.severity === 'high' || impact.severity === 'critical') {
    addAlert({
      type: impact.type === 'weather' ? 'warning' : 'danger',
      title: `${impact.type === 'weather' ? 'Weather' : 'Road'} Impact Alert`,
      description: `${randomVehicle.id}: ${impact.message}. ETA increased by ${impact.delayMinutes} min.`,
      time: 'Just now'
    });
  }

  // Log route re-evaluation
  console.log(`⚠️ Environmental Impact on ${randomVehicle.id}:`, {
    type: impact.type,
    message: impact.message,
    severity: impact.severity,
    originalSpeed: randomVehicle.originalSpeed,
    newSpeed: Math.round(randomVehicle.speed),
    originalETA: originalETA,
    newETA: newETA,
    delayMinutes: impact.delayMinutes,
    routeReEvaluation: 'Calculating alternative route...',
    recommendation: impact.speedReduction > 50 ? 'Consider rerouting' : 'Continue on current route with caution'
  });

  // Simulate route re-evaluation after 3 seconds
  setTimeout(() => {
    console.log(`🔄 Route Re-evaluation Complete for ${randomVehicle.id}:`, {
      status: 'Alternative route found',
      timeSaved: Math.floor(impact.delayMinutes * 0.4),
      newETA: Math.round(newETA * 0.6),
      recommendation: 'Reroute suggested to driver'
    });
  }, 3000);

  // Update weather alerts count
  const weatherAlertsCount = AppState.impactTracking.weatherDelays.length;
  const weatherAlertsElement = document.getElementById('weather-alerts');
  if (weatherAlertsElement) {
    weatherAlertsElement.textContent = weatherAlertsCount;
  }
}

function updateVehicleMarkerWithImpact(vehicle) {
  // Find vehicle marker and add impact indicator
  const markers = document.querySelectorAll('.vehicle-marker');
  markers.forEach(marker => {
    // Check if this marker is for the affected vehicle (by onclick attribute or data attribute)
    const onclickAttr = marker.getAttribute('onclick');
    if (onclickAttr && onclickAttr.includes(vehicle.id) && vehicle.impact) {
      // Add impact class
      marker.classList.add('has-impact');
      marker.classList.add(vehicle.impact.type === 'weather' ? 'weather-impact' : 'road-impact');

      // Add impact indicator dot
      let impactDot = marker.querySelector('.impact-indicator');
      if (!impactDot) {
        impactDot = document.createElement('div');
        impactDot.className = 'impact-indicator';
        marker.appendChild(impactDot);
      }
      impactDot.className = `impact-indicator ${vehicle.impact.type}-indicator`;

      console.log(`🎨 UI Updated: ${vehicle.id} marker now shows ${vehicle.impact.type} impact`);
    }
  });
}

function updateVehicleTableWithImpact(vehicle) {
  // Update vehicle table row with impact information
  const tableBody = document.getElementById('vehicle-table-body');
  if (!tableBody) return;

  const rows = tableBody.querySelectorAll('tr');
  rows.forEach(row => {
    const vehicleIdCell = row.cells[0];
    if (vehicleIdCell && vehicleIdCell.textContent === vehicle.id && vehicle.impact) {
      // Add impact badge to location cell
      const locationCell = row.cells[4];
      if (locationCell) {
        const impactBadge = document.createElement('div');
        impactBadge.className = `impact-badge ${vehicle.impact.type}-badge`;
        impactBadge.innerHTML = `<i class="fas ${vehicle.impact.icon}"></i> ${vehicle.impact.message}`;
        impactBadge.style.cssText = 'font-size: 0.75rem; color: var(--warning); margin-top: 0.25rem;';

        // Remove old impact badge if exists
        const oldBadge = locationCell.querySelector('.impact-badge');
        if (oldBadge) oldBadge.remove();

        locationCell.appendChild(impactBadge);
      }
    }
  });
}

function generateWeatherImpactReport() {
  if (!AppState.impactTracking || AppState.impactTracking.weatherDelays.length === 0) {
    alert('📊 Weather Impact Report\n\nNo weather delays recorded yet.\n\nThe system will track weather impacts as they occur.');
    return;
  }

  const report = AppState.impactTracking.weatherDelays;
  const totalDelay = report.reduce((sum, item) => sum + item.delayMinutes, 0);
  const affectedTrips = report.length;

  // Group by location for heatmap data
  const locationMap = {};
  report.forEach(item => {
    const location = item.location.split(' - ')[0]; // Get city name
    if (!locationMap[location]) {
      locationMap[location] = { count: 0, totalDelay: 0 };
    }
    locationMap[location].count++;
    locationMap[location].totalDelay += item.delayMinutes;
  });

  // Generate heatmap text
  let heatmapText = '\n📍 WEATHER DISRUPTION HEATMAP:\n';
  Object.keys(locationMap).forEach(location => {
    const data = locationMap[location];
    heatmapText += `   ${location}: ${data.count} incidents, ${data.totalDelay} min delay\n`;
  });

  // Recommendations
  const recommendations = [];
  if (totalDelay > 60) {
    recommendations.push('• Consider increasing buffer time for all trips');
  }
  if (Object.keys(locationMap).length > 2) {
    recommendations.push('• Deploy additional vehicles in high-impact areas');
  }
  recommendations.push('• Enable real-time weather alerts for all drivers');
  recommendations.push('• Review route alternatives for affected corridors');

  const reportText = `
📊 WEATHER IMPACT REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 SUMMARY:
   • Trips Delayed: ${affectedTrips}
   • Total Time Lost: ${totalDelay} minutes (${(totalDelay / 60).toFixed(1)} hours)
   • Average Delay: ${Math.round(totalDelay / affectedTrips)} min per trip
   • Affected Vehicles: ${AppState.impactTracking.affectedVehicles.length}

${heatmapText}

🚨 RECENT WEATHER DELAYS:
${report.slice(-5).map((item, idx) => `
   ${idx + 1}. ${item.vehicleId} - ${item.message}
      Location: ${item.location}
      Delay: ${item.delayMinutes} min | Severity: ${item.severity.toUpperCase()}
      Time: ${new Date(item.timestamp).toLocaleTimeString()}
`).join('')}

💡 RECOMMENDED FLEET ADJUSTMENTS:
${recommendations.join('\n   ')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated: ${new Date().toLocaleString()}
  `;

  console.log(reportText);
  alert(reportText);

  return {
    tripsDelayed: affectedTrips,
    totalTimeLost: totalDelay,
    heatmap: locationMap,
    recommendations: recommendations,
    details: report
  };
}

function generateRoadConditionsReport() {
  if (!AppState.impactTracking || AppState.impactTracking.roadIncidents.length === 0) {
    alert('📊 Road Conditions Report\n\nNo road incidents recorded yet.\n\nThe system will track road incidents as they occur.');
    return;
  }

  const report = AppState.impactTracking.roadIncidents;
  const totalDelay = report.reduce((sum, item) => sum + item.delayMinutes, 0);
  const incidents = report.length;

  // Group by region
  const regionMap = {};
  report.forEach(item => {
    const region = item.location.split(' - ')[0];
    if (!regionMap[region]) {
      regionMap[region] = { count: 0, totalDelay: 0, severity: {} };
    }
    regionMap[region].count++;
    regionMap[region].totalDelay += item.delayMinutes;
    regionMap[region].severity[item.severity] = (regionMap[region].severity[item.severity] || 0) + 1;
  });

  // Calculate incident frequency
  let frequencyText = '\n📊 INCIDENT FREQUENCY BY REGION:\n';
  Object.keys(regionMap).forEach(region => {
    const data = regionMap[region];
    const avgDelay = Math.round(data.totalDelay / data.count);
    frequencyText += `   ${region}: ${data.count} incidents, avg ${avgDelay} min delay\n`;
  });

  // Predictive risk analysis
  const highRiskRegions = Object.keys(regionMap).filter(region =>
    regionMap[region].count >= 2 || regionMap[region].totalDelay > 60
  );

  const riskAnalysis = highRiskRegions.length > 0
    ? `\n⚠️ HIGH-RISK ROUTES IDENTIFIED:\n${highRiskRegions.map(region =>
      `   • ${region} - ${regionMap[region].count} incidents, ${regionMap[region].totalDelay} min total delay`
    ).join('\n')}`
    : '\n✅ No high-risk routes identified';

  // Impact on ETAs
  const avgETAImpact = Math.round(totalDelay / incidents);
  const maxDelay = Math.max(...report.map(r => r.delayMinutes));

  const reportText = `
📊 ROAD CONDITIONS REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 SUMMARY:
   • Total Incidents: ${incidents}
   • Total Impact on ETAs: ${totalDelay} minutes
   • Average ETA Increase: ${avgETAImpact} min per incident
   • Maximum Delay: ${maxDelay} minutes
   • Affected Vehicles: ${AppState.impactTracking.affectedVehicles.length}

${frequencyText}

🚧 RECENT ROAD INCIDENTS:
${report.slice(-5).map((item, idx) => `
   ${idx + 1}. ${item.vehicleId} - ${item.message}
      Location: ${item.location}
      Impact: +${item.delayMinutes} min | Severity: ${item.severity.toUpperCase()}
      Time: ${new Date(item.timestamp).toLocaleTimeString()}
`).join('')}

${riskAnalysis}

🔮 PREDICTIVE RISK ANALYSIS:
   • Congestion Pattern: ${incidents > 3 ? 'High frequency detected' : 'Normal levels'}
   • Peak Impact Time: ${new Date().getHours() < 12 ? 'Morning rush hour' : 'Evening rush hour'}
   • Recommended Action: ${highRiskRegions.length > 0 ? 'Implement alternative routing' : 'Continue monitoring'}

💡 RECOMMENDATIONS:
   • Monitor high-traffic corridors closely
   • Enable proactive rerouting for affected vehicles
   • Coordinate with traffic management authorities
   • Update driver navigation with real-time incidents

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated: ${new Date().toLocaleString()}
  `;

  console.log(reportText);
  alert(reportText);

  return {
    totalIncidents: incidents,
    etaImpact: totalDelay,
    frequencyByRegion: regionMap,
    highRiskRoutes: highRiskRegions,
    predictiveAnalysis: {
      congestionLevel: incidents > 3 ? 'high' : 'normal',
      recommendations: ['Monitor corridors', 'Enable rerouting', 'Coordinate with authorities']
    },
    details: report
  };
}

function showVehicleDetails(vehicleId) {
  const vehicle = AppState.vehicles.find(v => v.id === vehicleId);

  if (vehicle) {
    const content = `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
          <div>
            <strong style="color: var(--text-muted); font-size: 0.875rem;">Vehicle ID</strong>
            <div style="font-size: 1.125rem; color: var(--text-primary); margin-top: 0.25rem;">${vehicle.id}</div>
          </div>
          <div>
            <strong style="color: var(--text-muted); font-size: 0.875rem;">Type</strong>
            <div style="font-size: 1.125rem; color: var(--text-primary); margin-top: 0.25rem;">${vehicle.type}</div>
          </div>
          <div>
            <strong style="color: var(--text-muted); font-size: 0.875rem;">Driver</strong>
            <div style="font-size: 1.125rem; color: var(--text-primary); margin-top: 0.25rem;">${vehicle.driver}</div>
          </div>
          <div>
            <strong style="color: var(--text-muted); font-size: 0.875rem;">Status</strong>
            <div style="font-size: 1.125rem; color: var(--text-primary); margin-top: 0.25rem;">${vehicle.status}</div>
          </div>
          <div>
            <strong style="color: var(--text-muted); font-size: 0.875rem;">Current Speed</strong>
            <div style="font-size: 1.125rem; color: var(--text-primary); margin-top: 0.25rem;">${vehicle.speed} km/h</div>
          </div>
          <div>
            <strong style="color: var(--text-muted); font-size: 0.875rem;">Fuel Level</strong>
            <div style="font-size: 1.125rem; color: var(--text-primary); margin-top: 0.25rem;">${vehicle.fuel}%</div>
          </div>
        </div>
        
        <div>
          <strong style="color: var(--text-muted); font-size: 0.875rem;">Current Location</strong>
          <div style="font-size: 1rem; color: var(--text-primary); margin-top: 0.25rem;">${vehicle.location}</div>
          <div style="font-size: 0.875rem; color: var(--text-muted); margin-top: 0.25rem;">
            GPS: ${vehicle.lat.toFixed(4)}, ${vehicle.lng.toFixed(4)}
          </div>
        </div>
        
        <div style="display: flex; gap: 0.75rem; margin-top: 1rem;">
          <button class="btn-primary btn-sm" onclick="alert('Track vehicle on map'); closeModal('vehicle-details-modal');">
            <i class="fas fa-map-marker-alt"></i> Track on Map
          </button>
          <button class="btn-secondary btn-sm" onclick="alert('Contact driver'); closeModal('vehicle-details-modal');">
            <i class="fas fa-phone"></i> Contact Driver
          </button>
        </div>
      </div>
    `;

    document.getElementById('vehicle-details-content').innerHTML = content;
    openModal('vehicle-details-modal');
  }
}

function toggleWeatherOverlay() {
  alert('🌦️ Weather Overlay\n\nThis would toggle weather layer on the map showing:\n- Rain zones\n- Storm areas\n- Temperature heatmap\n- Wind patterns\n\nIntegrate with OpenWeatherMap or AccuWeather API in production.');

  console.log('🗺️ Weather overlay toggled');
}

function refreshMap() {
  alert('🔄 Map Refresh\n\nRefreshing vehicle positions and map data...');

  console.log('🗺️ Map refreshed at', new Date().toLocaleTimeString());
}

function exportVehicles() {
  const csv = [
    ['Vehicle ID', 'Type', 'Driver', 'Status', 'Location', 'Speed', 'Fuel'],
    ...AppState.vehicles.map(v => [
      v.id,
      v.type,
      v.driver,
      v.status,
      v.location,
      `${v.speed} km/h`,
      `${v.fuel}%`
    ])
  ].map(row => row.join(',')).join('\n');

  console.log('📊 Vehicle data exported:\n', csv);

  alert('📊 Export Vehicle Data\n\nCSV data logged to console.\n\nIn production, this would:\n- Generate CSV/Excel file\n- Trigger download\n- Include full telemetry data');
}

function showIncidentDetails(incidentId) {
  alert(`🚧 Road Incident Details\n\nIncident ID: ${incidentId}\nType: Multi-vehicle collision\nLocation: King Fahd Road\nSeverity: High\nImpact: Major congestion\nExpected Clearance: 2 hours\n\nRecommended Action:\n- Reroute affected vehicles\n- Notify drivers in area\n- Update ETAs`);

  console.log('🚧 Incident details viewed:', incidentId);
}

function acknowledgeAlert(alertId) {
  const alert = AppState.alerts.find(a => a.id === alertId);

  if (alert) {
    alert.acknowledged = true;

    // Remove from UI
    const alertElement = document.querySelector(`[data-alert-id="${alertId}"]`);
    if (alertElement) {
      alertElement.style.opacity = '0';
      setTimeout(() => {
        alertElement.remove();

        // Update alert count
        const remainingAlerts = AppState.alerts.filter(a => !a.acknowledged).length;
        document.getElementById('active-alerts').textContent = remainingAlerts;
      }, 300);
    }

    console.log('✅ Alert acknowledged:', alertId);
  }
}

function clearAllAlerts() {
  if (confirm('Clear all alerts?')) {
    AppState.alerts.forEach(alert => alert.acknowledged = true);
    document.getElementById('alerts-list').innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 2rem;">No active alerts</div>';
    document.getElementById('active-alerts').textContent = '0';

    console.log('✅ All alerts cleared');
  }
}

function addAlert(alertData) {
  const alert = {
    id: AppState.alerts.length + 1,
    type: alertData.type,
    title: alertData.title,
    description: alertData.description,
    time: alertData.time,
    acknowledged: false
  };

  AppState.alerts.push(alert);

  // Update UI
  const alertsList = document.getElementById('alerts-list');
  const alertHTML = `
    <div class="alert-item alert-${alert.type}" data-alert-id="${alert.id}">
      <div class="alert-icon">
        <i class="fas fa-exclamation-triangle"></i>
      </div>
      <div class="alert-content">
        <div class="alert-title">${alert.title}</div>
        <div class="alert-desc">${alert.description}</div>
        <div class="alert-time">${alert.time}</div>
      </div>
      <button class="alert-action" onclick="acknowledgeAlert(${alert.id})">
        <i class="fas fa-check"></i>
      </button>
    </div>
  `;

  alertsList.insertAdjacentHTML('afterbegin', alertHTML);

  // Update count
  const currentCount = parseInt(document.getElementById('active-alerts').textContent);
  document.getElementById('active-alerts').textContent = currentCount + 1;

  console.log('🚨 New alert added:', alert);
}

function requestVendor(vendorId) {
  alert(`📞 Service Request Sent\n\nVendor ID: ${vendorId}\nStatus: Confirmed\nETA: 22 minutes\n\nDriver will be notified when vendor is en route.`);

  console.log('🛠️ Vendor service requested:', vendorId);
}

function createNewJob() {
  alert('➕ Create New Job\n\nThis would open a form to create:\n- Passenger booking\n- Logistics shipment\n- Staff transport\n\nWith route planning, vehicle selection, and scheduling.');

  console.log('📋 New job creation initiated');
}

function assignJob(jobId) {
  const job = AppState.jobs.find(j => j.id === jobId);

  if (job) {
    alert(`👤 Assign Job ${jobId}\n\nThis would:\n1. Show available drivers\n2. Calculate optimal assignment\n3. Send notification to driver\n4. Update job status\n\nAI Algorithm considers:\n- Proximity\n- Profitability\n- Driver eligibility\n- Vehicle suitability`);

    console.log('📋 Job assignment initiated:', jobId);
  }
}

// ============================================
// MODAL MANAGEMENT
// ============================================

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');

    // Focus first input if exists
    const firstInput = modal.querySelector('input');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
  }
}

// Close modal on background click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    e.target.classList.remove('active');
  }
});

// ============================================
// OTP INPUT AUTO-FOCUS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  const otpInputs = document.querySelectorAll('.otp-input');

  otpInputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
      if (e.target.value.length === 1 && index < otpInputs.length - 1) {
        otpInputs[index + 1].focus();
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
        otpInputs[index - 1].focus();
      }
    });
  });
});

// ============================================
// CONSOLE WELCOME MESSAGE
// ============================================

console.log(`
%c🚀 MHB TRANSPORT PRO - PRODUCTION PROTOTYPE
%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

%c📋 FEATURES IMPLEMENTED:
%c  ✅ Business Plan Section
  ✅ Driver App Mock (Login, Duty, Jobs, Pre-trip Checks)
  ✅ Control Center (Live Tracking, Alerts, Vendors, Jobs)
  ✅ Real-time Updates Simulation
  ✅ Complete Trip Workflow (Accept → Start → Arrive → OTP → Complete)
  ✅ iAuditor-style Pre-trip Checklist
  ✅ Fatigue Monitoring
  ✅ Mobile Services Marketplace
  ✅ Weather & Road Conditions Intelligence

%c🔧 PRODUCTION INTEGRATION NOTES:
%c  → Connect Mapbox/Google Maps API for live map
  → Wire WebSocket for real-time vehicle updates
  → Integrate backend REST API endpoints
  → Add authentication & authorization
  → Connect weather API (OpenWeatherMap/AccuWeather)
  → Implement traffic data API integration
  → Add payment gateway for mobile services
  → Set up database (PostgreSQL + PostGIS)

%c📊 DATA MODELS & API ENDPOINTS:
%c  See implementation_plan.md for complete specifications

%c🎯 NEXT STEPS:
%c  1. Review UI/UX flows
  2. Test all interactive features
  3. Provide feedback on design & functionality
  4. Plan backend API development
  5. Set up production infrastructure

%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
%cBuilt by Antigravity Pro | Ready for production deployment 🚀
`,
  'color: #2563eb; font-size: 18px; font-weight: bold;',
  'color: #475569;',
  'color: #10b981; font-weight: bold;',
  'color: #cbd5e1;',
  'color: #f59e0b; font-weight: bold;',
  'color: #cbd5e1;',
  'color: #7c3aed; font-weight: bold;',
  'color: #cbd5e1;',
  'color: #06b6d4; font-weight: bold;',
  'color: #cbd5e1;',
  'color: #475569;',
  'color: #94a3b8; font-style: italic;'
);

// ============================================
// EXPORT FOR PRODUCTION USE
// ============================================

// In production, export these functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    switchSection,
    driverLogin,
    toggleDuty,
    acceptJob,
    rejectJob,
    startTrip,
    markArrived,
    completeTrip,
    verifyOTP,
    showPreTripChecklist,
    completeChecklist,
    showIncidentReport,
    requestMobileService,
    showVehicleDetails,
    acknowledgeAlert,
    clearAllAlerts,
    requestVendor,
    assignJob,
    createNewJob,
    openModal,
    closeModal
  };
}
