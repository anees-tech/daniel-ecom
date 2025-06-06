import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 100, // simulate 20 users
  duration: '30s', // for 30 seconds
};

export default function () {
  let res = http.get('https://www.danielsbelieve.de/');

  check(res, {
    'status is 200': (r) => r.status === 200,
    'page loaded in < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1); // simulate user reading/thinking time
}
