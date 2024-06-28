"use client";
import { AppProvider } from "../state/AppProvider";
import SqlScreen from "./SqlScreen";

export default function Home() {
  return (
    <main
      className="flex flex-col h-screen w-full bg-gray-800"

      // className="flex min-h-screen flex-col items-center justify-between p-24">
    >
      <AppProvider>
        <SqlScreen />
      </AppProvider>
    </main>
  );
}
