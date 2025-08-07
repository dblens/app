"use client";
import { useEffect } from "react";
import { AppProvider } from "./state/AppProvider";
import SqlScreen from "./sql/SqlScreen";

export default function Home() {
  useEffect(() => {}, []);

  return (
    <main className="flex flex-col w-full h-full bg-gray-800">
      <AppProvider>
        <SqlScreen />
      </AppProvider>
    </main>
  );
}
