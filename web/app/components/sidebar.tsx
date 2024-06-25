"use client";
import React, { useEffect } from "react";

import { usePathname, useRouter } from "next/navigation";
import PgSession from "../sessions/PgSession";

const OverViewIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="feather feather-activity"
    style={{
      transform: "translate(5px, 5px)",
    }}
  >
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

const TableIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="feather feather-columns"
    style={{
      transform: "translate(5px, 5px)",
    }}
  >
    <path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7m0-18H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7m0-18v18" />
  </svg>
);
let counter = 0;

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    counter++;
    if (counter == 1) {
      const session = new PgSession("PG");
      session
        .executeSQL("SELECT 1;")
        .then((_) => {
          // request resolved from the localserver, do nothing 
          // console.log(_);
        })
        .catch((err) => {
          alert(
            `Looks like you are not connected to the database. Please connect to the database by executing  the following from terminal 
npx dblens <postgres_connection_string>`
          );
          console.error(err);
        });
    }
  }, []);

  // Determine the selected tab based on the current path
  let selectedTab: string = "SQL";
  if (pathname?.includes("/sql")) {
    selectedTab = "SQL";
  } else if (pathname?.includes("/overview")) {
    selectedTab = "OVERVIEW";
  } else if (pathname?.includes("/overview")) {
    selectedTab = "OVERVIEW";
  }

  const setSelectedTab = (ss: string) => {
    router.push(`/${ss.toLowerCase()}`);
  };

  const disconnect = async () => {
    // if (confirm('Are you sure want to disconnect from the database?')) {
    //   const { status } = await electron.ipcRenderer.invoke('disconnect');
    //   if (status === 'DISCONNECTED') {
    //     dispatch({
    //       type: 'CLEAR_SESSION',
    //     });
    //   }
    // }
  };
  return (
    <div className="bg-gray-900 text-gray-100 w-12  flex flex-col border border-gray-700 text-xs">
      <button
        type="button"
        className="m-2 text-sm text-green-600 font-bold animate-ping"
        onClick={disconnect}
        data-tip
        data-for="btn-disconnect"
      >
        <span role="img" aria-label="app-icon" className="p-2 font-mono">
          ●
        </span>
      </button>
      {/* <ReactTooltip id="btn-disconnect" type="dark" place="right">
        <span>Click to Disconnect from the database</span>
      </ReactTooltip> */}
      <button type="button" className="mb-4 pt-4">
        <span
          role="img"
          aria-label="app-icon"
          className="p-2 font-mono text-2xl"
        >
          ⚡️
        </span>
      </button>
      <button
        type="button"
        className={`text-xs h-20 pl-1 focus:ring-0 hover:bg-gray-600 ${
          selectedTab === "OVERVIEW" &&
          "border-l-4 border-green-600 text-green-600 font-bold"
        }`}
        onClick={() => setSelectedTab("OVERVIEW")}
      >
        <OverViewIcon />
      </button>
      <button
        type="button"
        className={`text-xs h-20 focus:ring-0 hover:bg-gray-600 ${
          selectedTab === "SQL" &&
          "border-l-4 border-green-600 text-green-600 font-bold"
        }`}
        onClick={() => setSelectedTab("SQL")}
      >
        SQL
      </button>
      <button
        type="button"
        className={`text-xs h-20 focus:ring-0 pl-1 hover:bg-gray-600 ${
          selectedTab === "TABLE" &&
          "border-l-4 border-green-600 text-green-600 font-bold"
        }`}
        onClick={() => setSelectedTab("")}
        // onClick={() => setSelectedTab("TABLE")}
      >
        <TableIcon />
      </button>
      <button
        type="button"
        className={`text-xs h-20 focus:ring-0 hover:bg-gray-600 ${
          selectedTab === "ERD" &&
          "border-l-4 border-green-600 text-green-600 font-bold"
        }`}
        onClick={() => setSelectedTab("")}
        // onClick={() => setSelectedTab("ERD")}
      >
        ER
      </button>
      <button
        type="button"
        className={`text-xs h-20 focus:ring-0 hover:bg-gray-600 ${
          selectedTab === "SETTINGS" &&
          "border-l-4 border-green-600 text-green-600 font-bold"
        }`}
        onClick={() => setSelectedTab("")}
        // onClick={() => setSelectedTab("SETTINGS")}
      >
        <span
          role="img"
          aria-label="app-icon"
          className="p-2 font-mono text-2xl"
        >
          ⚙️
        </span>
      </button>
    </div>
  );
};

export default Sidebar;
