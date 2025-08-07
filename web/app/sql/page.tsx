"use client";
import { AppProvider } from "../state/AppProvider";
import SqlScreen from "./SqlScreen";

export default function Home() {
  return (
    <main className="flex flex-col w-full h-full bg-gray-800">
      <AppProvider>
        <SqlScreen />
      </AppProvider>
    </main>
  );
}
