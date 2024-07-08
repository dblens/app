/* eslint-disable no-alert */
import React, { useState } from 'react';

const telEnabled = () => {
  const data = localStorage.getItem('TEL_DISABLED');
  if (!data || data === null) return true;
  if (JSON.parse(data) === true) return false;
  return true;
};

const SettingsContainer = () => {
  const [isTelEnabled, setIsTelEnabled] = useState(telEnabled());
  const onChange = (v: boolean) => {
    if (v === true) {
      localStorage.setItem('TEL_DISABLED', 'false');
      setIsTelEnabled(true);
      return;
    }

    if (
      window.confirm(
        'Are you sure you want to disable Telemetry? DB lens will only collect anonymous usage statistcs, which does not include any sensitive data.'
      )
    ) {
      setIsTelEnabled(false);
      localStorage.setItem('TEL_DISABLED', 'true');
      return;
    }
    // eslint-disable-next-line no-console
    console.warn('user decided to not proceed');
  };
  return (
    <div className="flex w-full h-full">
      <div
        className="h-full bg-gray-800 text-gray-200"
        style={{ width: 300 }}
      />
      <div className="h-full w-full flex flex-col justify-center p-4">
        <h1 className="text-2xl font-bold">DB Lens</h1>
        <hr />
        <div className="my-2">
          <span className="font-bold"> Telemetry Enabled :</span>
          <input
            type="checkbox"
            className="form-checkbox h-3 w-3 p-2 m-2 mt-3 text-red-600"
            onChange={(e) => onChange(e.target.checked)}
            checked={isTelEnabled}
          />
        </div>
        <span className="text-sm">
          By enabling telemetry, DB lens will collect anonymous app usage data.
          <br />
          This help us to understand how the application is being used, what are
          the features that users mostly excited like etc.
        </span>
      </div>
    </div>
  );
};

export default SettingsContainer;
