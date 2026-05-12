import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate } from 'k6/metrics';

const responseTime = new Trend('response_time');
const errorRate    = new Rate('errors');

export const options = {
  vus: 1,
  duration: '1m',
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    errors:            ['rate<0.01'],
  },
};

const BASE_URL = 'https://restful-booker.herokuapp.com';

export function setup() {
  const res = http.post(
    `${BASE_URL}/auth`,
    JSON.stringify({ username: 'admin', password: 'password123' }),
    { headers: { 'Content-Type': 'application/json' } }
  );
  return { token: res.json('token') };
}

export default function (data) {
  // Health check
  let r = http.get(`${BASE_URL}/ping`);
  check(r, { 'ping 201': (r) => r.status === 201 });
  responseTime.add(r.timings.duration);
  errorRate.add(r.status !== 201 ? 1 : 0);

  // Listar reservas
  r = http.get(`${BASE_URL}/booking`);
  check(r, { 'list bookings 200': (r) => r.status === 200 });
  responseTime.add(r.timings.duration);
  errorRate.add(r.status !== 200 ? 1 : 0);

  // Buscar primeira reserva
  const ids = r.json();
  if (ids && ids.length > 0) {
    const id = ids[0].bookingid;
    r = http.get(`${BASE_URL}/booking/${id}`);
    check(r, { 'get booking 200': (r) => r.status === 200 });
    responseTime.add(r.timings.duration);
    errorRate.add(r.status !== 200 ? 1 : 0);
  }

  sleep(1);
}
