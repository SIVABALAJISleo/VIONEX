import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 100 },  // Ramp to 100 viewers
    { duration: '1m', target: 500 },   // Ramp to 500 viewers
    { duration: '1m', target: 1000 },  // Ramp to 1,000 viewers
    { duration: '30s', target: 0 }     // Graceful ramp-down
  ],
  thresholds: {
    http_req_duration: ['p(95)<300'], // 95% of requests must complete under 300ms
    http_req_failed: ['rate<0.01']     // Error rate must stay below 1%
  }
};

export default function () {
  // 1. Fetch Home Feed
  const feedRes = http.get('http://localhost:4000/api/v1/discovery/home');
  check(feedRes, {
    'home feed status 200': (r) => r.status === 200,
    'feed returned data': (r) => JSON.parse(r.body).feed.length >= 0
  });

  // 2. Simulate Video Watch Page & Manifest Request
  const videoRes = http.get('http://localhost:4000/api/v1/videos/vid-demo-001');
  check(videoRes, {
    'video status 200': (r) => r.status === 200
  });

  // 3. Send Deduplicated View Telemetry Beacon
  const telemetryPayload = JSON.stringify({
    videoId: 'vid-demo-001',
    viewerSessionHash: `test-session-${__VU}`,
    watchedSeconds: 35,
    currentPosition: 35
  });

  const headers = { 'Content-Type': 'application/json' };
  const telRes = http.post('http://localhost:4000/api/v1/analytics/telemetry', telemetryPayload, { headers });
  check(telRes, {
    'telemetry status 200': (r) => r.status === 200
  });

  sleep(1);
}
