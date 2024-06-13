"use client";
import { useEffect } from "react";
import SqlExecutor from "./SqlExecutor";

export default function Home() {
  useEffect(() => {}, []);

  return (
    <main
      className="flex flex-col p-4 h-screen w-full bg-gray-800"

      // className="flex min-h-screen flex-col items-center justify-between p-24">
    >
      <SqlExecutor />
    </main>
  );
}
