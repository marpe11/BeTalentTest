import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '2m', target: 50  },
    { duration: '2m', target: 100 },
    { duration: '2m', target: 150 },
    { duration: '2m', target: 200 },
    { duration: '2m', target: 0   },
  ],
  thresholds: {
    http_req_duration: ['p(95)<10000'],
  },
};

const BASE_URL = 'https://restful-booker.herokuapp.com';

export default function () {
  // Stress foca em volume de leitura para observar degradação
  const list = http.get(`${BASE_URL}/booking`);
  errorRate.add(list.status !== 200 ? 1 : 0);
  check(list, { 'list 200': (r) => r.status === 200 });

  const ids = list.json();
  if (ids && ids.length > 0) {
    const id = ids[Math.floor(Math.random() * ids.length)].bookingid;
    const get = http.get(`${BASE_URL}/booking/${id}`);
    errorRate.add(get.status !== 200 ? 1 : 0);
    check(get, { 'get 200': (r) => r.status === 200 });
  }

  sleep(0.5);
}
