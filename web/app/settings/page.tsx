"use client";
import { useState, useEffect } from "react";
import { AppProvider } from "../state/AppProvider";

const telEnabled = () => {
  if (typeof window === "undefined") return true;
  const data = localStorage.getItem("TEL_DISABLED");
  if (!data || data === null) return true;
  if (JSON.parse(data) === true) return false;
  return true;
};

const SettingsContainer = () => {
  const [isTelEnabled, setIsTelEnabled] = useState(telEnabled());

  useEffect(() => {
    setIsTelEnabled(telEnabled());
  }, []);

  const onChange = (v: boolean) => {
    if (v === true) {
      localStorage.setItem("TEL_DISABLED", "false");
      setIsTelEnabled(true);
      return;
    }

    if (
      window.confirm(
        "Are you sure you want to disable Telemetry? DB lens will only collect anonymous usage statistics, which does not include any sensitive data."
      )
    ) {
      setIsTelEnabled(false);
      localStorage.setItem("TEL_DISABLED", "true");
      return;
    }
    console.warn("user decided to not proceed");
  };

  return (
    <div className="flex w-full h-full">
      <div
        className="h-full bg-gray-800 text-gray-200"
        style={{ width: 300 }}
      />
      <div className="h-full w-full flex flex-col justify-center p-4 bg-gray-100">
        <h1 className="text-2xl font-bold text-gray-800">DB Lens</h1>
        <hr className="my-4" />
        <div className="my-2">
          <span className="font-bold text-gray-800"> Telemetry Enabled :</span>
          <input
            type="checkbox"
            className="form-checkbox h-3 w-3 p-2 m-2 mt-3 text-red-600"
            onChange={(e) => onChange(e.target.checked)}
            checked={isTelEnabled}
          />
        </div>
        <span className="text-sm text-gray-600">
          By enabling telemetry, DB lens will collect anonymous app usage data.
          <br />
          This helps us to understand how the application is being used, what are
          the features that users are most excited about, etc.
        </span>
      </div>
    </div>
  );
};

export default function SettingsPage() {
  return (
    <main className="flex flex-col w-full h-full bg-gray-800">
      <AppProvider>
        <SettingsContainer />
      </AppProvider>
    </main>
  );
}
