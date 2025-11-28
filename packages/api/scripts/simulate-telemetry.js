import axios from 'axios';

const API_URL = 'http://localhost:4000';

// Configuration
const VEHICLE_IDS = ['veh_1', 'veh_2', 'veh_3', 'veh_4'];
const EVENTS_PER_SECOND = 10; // Scaled down from 100 for demo
const DURATION_SECONDS = 60; // Run for 1 minute
const BATCH_SIZE = 50; // Send in batches

// Generate random telemetry event
function generateTelemetryEvent(vehicleId, timestamp) {
    // Simulate vehicle movement (random walk)
    const baseLocations = {
        veh_1: { lat: 24.7136, lng: 46.6753 },
        veh_2: { lat: 21.3891, lng: 39.8579 },
        veh_3: { lat: 24.7500, lng: 46.7000 },
        veh_4: { lat: 26.4367, lng: 50.1039 }
    };

    const base = baseLocations[vehicleId] || { lat: 24.7, lng: 46.7 };

    return {
        vehicleId,
        timestamp: timestamp.toISOString(),
        lat: base.lat + (Math.random() - 0.5) * 0.1,
        lng: base.lng + (Math.random() - 0.5) * 0.1,
        speed: Math.floor(Math.random() * 140), // 0-140 km/h (some will trigger speeding alerts)
        heading: Math.floor(Math.random() * 360),
        fuel_level: 50 + Math.floor(Math.random() * 50),
        engine_temp: 80 + Math.floor(Math.random() * 30)
    };
}

// Send bulk telemetry
async function sendBulkTelemetry(events) {
    try {
        const response = await axios.post(`${API_URL}/telemetry/bulk`, { events });
        console.log(`✓ Sent ${events.length} events - ${response.data.message}`);
        return true;
    } catch (error) {
        console.error('✗ Error sending telemetry:', error.message);
        return false;
    }
}

// Main simulation
async function runSimulation() {
    console.log('🚀 Starting telemetry simulation...');
    console.log(`📊 Config: ${VEHICLE_IDS.length} vehicles, ${EVENTS_PER_SECOND} events/sec, ${DURATION_SECONDS}s duration`);
    console.log('');

    let totalEventsSent = 0;
    let totalBatches = 0;
    const startTime = Date.now();

    const interval = setInterval(async () => {
        const elapsed = (Date.now() - startTime) / 1000;

        if (elapsed >= DURATION_SECONDS) {
            clearInterval(interval);
            console.log('');
            console.log('✅ Simulation complete!');
            console.log(`📈 Total events sent: ${totalEventsSent}`);
            console.log(`📦 Total batches: ${totalBatches}`);
            console.log(`⏱️  Duration: ${elapsed.toFixed(2)}s`);
            console.log(`📊 Average rate: ${(totalEventsSent / elapsed).toFixed(2)} events/sec`);
            process.exit(0);
        }

        // Generate events for this second
        const events = [];
        const now = new Date();

        for (let i = 0; i < EVENTS_PER_SECOND; i++) {
            const vehicleId = VEHICLE_IDS[Math.floor(Math.random() * VEHICLE_IDS.length)];
            const eventTime = new Date(now.getTime() + (i * 1000 / EVENTS_PER_SECOND));
            events.push(generateTelemetryEvent(vehicleId, eventTime));
        }

        // Send in batches
        for (let i = 0; i < events.length; i += BATCH_SIZE) {
            const batch = events.slice(i, i + BATCH_SIZE);
            const success = await sendBulkTelemetry(batch);

            if (success) {
                totalEventsSent += batch.length;
                totalBatches++;
            }
        }

        process.stdout.write(`\r⏳ Running... ${elapsed.toFixed(0)}s | Events: ${totalEventsSent} | Batches: ${totalBatches}`);
    }, 1000);
}

// Test playback query
async function testPlayback() {
    console.log('\n\n🔍 Testing playback query...');

    try {
        const vehicleId = 'veh_1';
        const to = new Date().toISOString();
        const from = new Date(Date.now() - 60000).toISOString(); // Last minute

        const response = await axios.get(`${API_URL}/telemetry/vehicle/${vehicleId}`, {
            params: { from, to }
        });

        console.log(`✓ Retrieved ${response.data.count} events for ${vehicleId}`);
        console.log(`  Time range: ${from} to ${to}`);

        if (response.data.events.length > 0) {
            console.log(`  First event: ${response.data.events[0].timestamp}`);
            console.log(`  Last event: ${response.data.events[response.data.events.length - 1].timestamp}`);
        }
    } catch (error) {
        console.error('✗ Error testing playback:', error.message);
    }
}

// Run simulation
console.log('FleetSync Telemetry Simulator');
console.log('=============================\n');

runSimulation().then(() => {
    // Test playback after simulation
    setTimeout(testPlayback, 2000);
});
