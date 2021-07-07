/* eslint-disable no-console */
import { v4 as uuidv4 } from 'uuid';

const encodedParams = new URLSearchParams();

const uuid = uuidv4();

const sendEvent = (event: string) => {
  const isDisabled = localStorage.getItem('TEL_DISABLED');
  if (isDisabled && isDisabled === 'true') return;

  encodedParams.set(
    'data',
    `{
  "event": ${event},
  "properties": {
    "distinct_id": "${uuid}",
    "token": "6251fc1f306b01dccb4d3df99f15283e"
  }
}`
  );
  // TODO ability to get this URL & transformer function from repo
  const url = 'https://api.mixpanel.com/track#live-event';
  const options = {
    method: 'POST',
    headers: {
      Accept: 'text/plain',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: encodedParams,
  };

  fetch(url, options)
    .then((res) => res.json())
    .then((json) => console.log(json))
    .catch((err) => console.error('error:', err));
};
const countOpen = (report: (v: string) => void) => {
  const openCount = Number.parseInt(
    localStorage.getItem('TEL_OPEN_COUNT') ?? '0',
    10
  );
  const newCount = openCount + 1;
  localStorage.setItem('TEL_OPEN_COUNT', JSON.stringify(openCount + 1));

  if (newCount === 10) report('10th_OPEN');
  else if (newCount === 50) report('50th_OPEN');
  else if (newCount === 100) report('100th_OPEN');
  else if (newCount === 500) report('500th_OPEN');
  else if (newCount === 1000) report('1000th_OPEN');
  else if (newCount === 5000) report('5000th_OPEN');
  else if (newCount === 10000) report('10000th_OPEN');
  else if (newCount === 100000) report('100000th_OPEN');
  else if (newCount === 1000000) report('1000000th_OPEN');
  else if (newCount === 10000000) report('10000000th_OPEN');
};
const trackTimeElapsed = (report: (v: string) => void) => {
  let counter = 0;
  setInterval(() => {
    counter += 1;
    const matchBucket = [
      1, 10, 60, 120, 180, 240, 1440, 2880, 1440, 43200,
    ].find((i) => counter === i);
    if (matchBucket) {
      report(`${matchBucket}_MINS_OPEN`);
    }
  }, 1000 * 60);
};
const registerInstall = (report: (v: string) => void) => {
  const prevLogin = localStorage.getItem('uuid');
  if (prevLogin) return;
  localStorage.setItem('uuid', uuid);
  report('Install');
};

const init = (report: (v: string) => void = sendEvent) => {
  try {
    registerInstall(report);
    countOpen(report);
    trackTimeElapsed(report);
  } catch (error) {
    console.error('TELEMETRY:something gone wrong ');
  }
};

const def = {
  init,
};

export default def;
