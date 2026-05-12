import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 10 },
    { duration: '2m', target: 50 },
    { duration: '3m', target: 50 },
    { duration: '1m', target: 0  },
  ],
  thresholds: {
    http_req_duration: ['p(95)<3000', 'p(99)<5000'],
    http_req_failed:   ['rate<0.05'],
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
  const headers = {
    'Content-Type': 'application/json',
    Accept:         'application/json',
  };
  const authHeaders = { ...headers, Cookie: `token=${data.token}` };

  const payload = JSON.stringify({
    firstname:    'LoadTest',
    lastname:     'User',
    totalprice:   100,
    depositpaid:  true,
    bookingdates: { checkin: '2025-01-01', checkout: '2025-01-05' },
  });

  // Criar reserva
  const create = http.post(`${BASE_URL}/booking`, payload, { headers });
  check(create, { 'create 200': (r) => r.status === 200 });
  const id = create.json('bookingid');

  if (!id) {
    sleep(1);
    return;
  }

  // Buscar reserva criada
  const get = http.get(`${BASE_URL}/booking/${id}`);
  check(get, { 'get 200': (r) => r.status === 200 });

  // Atualização parcial
  const patch = http.patch(
    `${BASE_URL}/booking/${id}`,
    JSON.stringify({ firstname: 'Updated' }),
    { headers: authHeaders }
  );
  check(patch, { 'patch 200': (r) => r.status === 200 });

  // Deletar reserva
  const del = http.del(`${BASE_URL}/booking/${id}`, null, { headers: authHeaders });
  check(del, { 'delete 201': (r) => r.status === 201 });

  sleep(Math.random() * 2 + 1);
}
