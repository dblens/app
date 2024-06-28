"use client";
import dynamic from "next/dynamic";
import { AppProvider } from "../state/AppProvider";

export default function Home() {
  return (
    <main className="flex flex-col h-screen w-full bg-gray-800 text-gray-200">
      <AppProvider>
        <ErdContainer />
      </AppProvider>
    </main>
  );
}

const ErdContainer = dynamic(() => import("./ErdContainer"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});
