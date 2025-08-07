"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { AppProvider } from "../state/AppProvider";
import TableScreen from "./TableScreen";
import PgSession from "../sessions/PgSession";

export default function Home() {
  const pathname = usePathname();

  // Determine the selected tab based on the current path
  let selectedTab: string = "SQL";
  if (pathname?.includes("/sql")) {
    selectedTab = "SQL";
  } else if (pathname?.includes("/overview")) {
    selectedTab = "OVERVIEW";
  } else if (pathname?.includes("/overview")) {
    selectedTab = "OVERVIEW";
  }

  const session = new PgSession("PG");

  return (
    <main
      className="flex flex-col w-full h-full bg-gray-800"

      // className="flex min-h-screen flex-col items-center justify-between p-24">
    >
      <AppProvider>
        <TableScreen session={session} selectedTab={selectedTab} />
      </AppProvider>
    </main>
  );
}
