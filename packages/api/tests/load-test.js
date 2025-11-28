import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');

// Test configuration
export const options = {
    stages: [
        { duration: '30s', target: 10 },  // Ramp up to 10 users
        { duration: '1m', target: 10 },   // Stay at 10 users
        { duration: '30s', target: 50 },  // Ramp up to 50 users
        { duration: '1m', target: 50 },   // Stay at 50 users
        { duration: '30s', target: 0 },   // Ramp down
    ],
    thresholds: {
        'http_req_duration': ['p(95)<500'], // 95% of requests should be below 500ms
        'errors': ['rate<0.1'],              // Error rate should be below 10%
    },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:4000';

// Generate random telemetry event
function generateTelemetryEvent() {
    const vehicleIds = ['veh_1', 'veh_2', 'veh_3', 'veh_4'];
    const vehicleId = vehicleIds[Math.floor(Math.random() * vehicleIds.length)];

    return {
        vehicleId,
        timestamp: new Date().toISOString(),
        lat: 24.7 + (Math.random() - 0.5) * 0.1,
        lng: 46.7 + (Math.random() - 0.5) * 0.1,
        speed: Math.floor(Math.random() * 140),
        heading: Math.floor(Math.random() * 360),
        fuel_level: 50 + Math.floor(Math.random() * 50),
    };
}

export default function () {
    // Test 1: Single telemetry post
    {
        const payload = JSON.stringify(generateTelemetryEvent());
        const params = {
            headers: { 'Content-Type': 'application/json' },
        };

        const res = http.post(`${BASE_URL}/telemetry`, payload, params);

        const success = check(res, {
            'single telemetry status is 201': (r) => r.status === 201,
            'single telemetry has message': (r) => r.json('message') !== undefined,
        });

        errorRate.add(!success);
    }

    sleep(0.5);

    // Test 2: Bulk telemetry post
    {
        const events = Array.from({ length: 10 }, () => generateTelemetryEvent());
        const payload = JSON.stringify({ events });
        const params = {
            headers: { 'Content-Type': 'application/json' },
        };

        const res = http.post(`${BASE_URL}/telemetry/bulk`, payload, params);

        const success = check(res, {
            'bulk telemetry status is 201': (r) => r.status === 201,
            'bulk telemetry has count': (r) => r.json('count') === 10,
        });

        errorRate.add(!success);
    }

    sleep(0.5);

    // Test 3: Get telemetry for vehicle
    {
        const vehicleId = 'veh_1';
        const res = http.get(`${BASE_URL}/telemetry/vehicle/${vehicleId}`);

        const success = check(res, {
            'get telemetry status is 200': (r) => r.status === 200,
            'get telemetry has events': (r) => r.json('events') !== undefined,
        });

        errorRate.add(!success);
    }

    sleep(1);
}

export function handleSummary(data) {
    return {
        'load-test-results.json': JSON.stringify(data, null, 2),
        stdout: textSummary(data, { indent: ' ', enableColors: true }),
    };
}

function textSummary(data, options) {
    const indent = options.indent || '';
    let summary = '\n' + indent + '✓ Load Test Summary\n';
    summary += indent + '='.repeat(50) + '\n\n';

    const metrics = data.metrics;

    summary += indent + `Total Requests: ${metrics.http_reqs.values.count}\n`;
    summary += indent + `Request Rate: ${metrics.http_reqs.values.rate.toFixed(2)}/s\n`;
    summary += indent + `Failed Requests: ${metrics.http_req_failed.values.passes || 0}\n`;
    summary += indent + `Error Rate: ${(metrics.errors.values.rate * 100).toFixed(2)}%\n\n`;

    summary += indent + `Response Times:\n`;
    summary += indent + `  Average: ${metrics.http_req_duration.values.avg.toFixed(2)}ms\n`;
    summary += indent + `  Median: ${metrics.http_req_duration.values.med.toFixed(2)}ms\n`;
    summary += indent + `  95th percentile: ${metrics.http_req_duration.values['p(95)'].toFixed(2)}ms\n`;
    summary += indent + `  Max: ${metrics.http_req_duration.values.max.toFixed(2)}ms\n\n`;

    return summary;
}
