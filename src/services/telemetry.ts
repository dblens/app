/* eslint-disable no-console */
import { v4 as uuidv4 } from 'uuid';

const encodedParams = new URLSearchParams();

const uuid = uuidv4();

const registerInstall = () => {
  try {
    const prevLogin = localStorage.getItem('uuid');
    if (prevLogin) return;

    localStorage.setItem('uuid', uuid);

    encodedParams.set(
      'data',
      `{
    "event": "Install",
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
  } catch (error) {
    console.error('TELEMETRY:something gone wrong ');
  }
};

const def = {
  registerInstall,
};

export default def;
