"use client";
import { useEffect } from "react";
import { AppProvider } from "../state/AppProvider";
import SqlScreen from "../sql/SqlScreen";
import OverviewScreen from "./Overview/OverviewScreen";

export default function Home() {
  useEffect(() => {}, []);

  return (
    <main
      className="flex flex-col-screen w-full bg-gray-800"

      // className="flex min-h-screen flex-col items-center justify-between p-24">
    >
      <AppProvider>
        <OverviewScreen />
      </AppProvider>
    </main>
  );
}
