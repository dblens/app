import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SqlExecutor from "./SqlExecutor";
import SqlHistory from "./SqlHistory";
import SideHeader from "../components/atoms/SideHeader";
import PgSession from "../sessions/PgSession";
import Tabs from "./Tabs";

const SqlScreen = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialTabs =
    typeof window !== "undefined" && localStorage.getItem("sql_tabs")
      ? JSON.parse(localStorage.getItem("sql_tabs") as string)
      : [{ id: 1, title: "Query 1" }];

  const initialActiveTabId =
    (typeof window !== "undefined" &&
      parseInt(localStorage.getItem("sql_activeTabId") as string)) ||
    1;
  const initialSelectedSql =
    (typeof window !== "undefined" &&
      localStorage.getItem(`sql_${initialActiveTabId}`)) ||
    "SELECT now();";

  const [tabs, setTabs] = useState(initialTabs);
  const [activeTabId, setActiveTabId] = useState(initialActiveTabId);
  const [selectedSql, setSelectedSql] = useState<string>(initialSelectedSql);
  const session = new PgSession("PG");

  const [maxTabId, setMaxTabId] = useState(
    initialTabs.length > 0 ? Math.max(...initialTabs.map((tab) => tab.id)) : 1
  );

  const addTab = () => {
    const newTabId = maxTabId + 1;
    const newTabs = [...tabs, { id: newTabId, title: `Query ${newTabId}` }];
    setTabs(newTabs);
    setActiveTabId(newTabId);
    setMaxTabId(newTabId);
    if (typeof window !== "undefined") {
      localStorage.setItem("sql_tabs", JSON.stringify(newTabs));
      localStorage.setItem("sql_activeTabId", newTabId.toString());
      localStorage.setItem(`sql_${newTabId}`, "SELECT now();");
    }
    setSelectedSql("SELECT now();");
  };

  const removeTab = (id) => {
    const newTabs = tabs.filter((tab) => tab.id !== id);
    setTabs(newTabs);
    if (typeof window !== "undefined") {
      localStorage.setItem("sql_tabs", JSON.stringify(newTabs));
      localStorage.removeItem(`sql_${id}`);
    }
    if (id === activeTabId) {
      if (newTabs.length > 0) {
        setActiveTabId(newTabs[0].id);
        if (typeof window !== "undefined") {
          localStorage.setItem("sql_activeTabId", newTabs[0].id.toString());
          setSelectedSql(
            localStorage.getItem(`sql_${newTabs[0].id}`) || "SELECT now();"
          );
        }
      } else {
        addTab();
      }
    }
  };

  useEffect(() => {
    // Ensure the activeTabId is within the current tabs array
    if (!tabs.some((tab) => tab.id === activeTabId)) {
      setActiveTabId(tabs.length > 0 ? tabs[0].id : 1);
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("sql_tabs", JSON.stringify(tabs));
      localStorage.setItem("sql_activeTabId", activeTabId.toString());
      setSelectedSql(
        localStorage.getItem(`sql_${activeTabId}`) || "SELECT now();"
      );
    }
  }, [tabs, activeTabId]);

  useEffect(() => {
    const sqlQuery = searchParams?.get("sql");
    if (sqlQuery) {
      setSelectedSql(decodeURIComponent(sqlQuery));
      // Remove the query parameter from the URL
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.delete("sql");
      router.replace(currentUrl.toString());
    }
  }, [searchParams, router]);

  return (
    <div className="flex w-full h-full text-gray-200">
      <div className="h-full bg-gray-800 w-1/5" style={{ minWidth: "20%" }}>
        <SideHeader title="Queries" />
        <SqlHistory setSelectedSql={setSelectedSql} />
      </div>
      <div className="border-l border-gray-600 sql-dataview-wrapper w-4/5">
        <Tabs
          tabs={tabs}
          activeTabId={activeTabId}
          setActiveTabId={setActiveTabId}
          removeTab={removeTab}
          addTab={addTab}
        />
        <SqlExecutor
          session={session}
          selectedSql={selectedSql}
          activeTabId={activeTabId}
        />
      </div>
    </div>
  );
};

export default SqlScreen;
