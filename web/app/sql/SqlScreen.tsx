import React, { useState, useEffect } from "react";
import SqlExecutor from "./SqlExecutor";
import SqlHistory from "./SqlHistory";
import SideHeader from "../components/atoms/SideHeader";
import PgSession from "../sessions/PgSession";
import Tabs from "./Tabs";

const SqlScreen = () => {
  const [tabs, setTabs] = useState([{ id: 1, title: "Query 1" }]);
  const [activeTabId, setActiveTabId] = useState(1);
  const [selectedSql, setSelectedSql] = useState<string>("");
  const session = new PgSession("PG");

  // Track maximum tab id separately
  const [maxTabId, setMaxTabId] = useState(1);

  const addTab = () => {
    const newTabId = maxTabId + 1; // Use maxTabId to generate new id
    setTabs([...tabs, { id: newTabId, title: `Query ${newTabId}` }]);
    setActiveTabId(newTabId);
    setMaxTabId(newTabId); // Update maxTabId
  };

  const removeTab = (id) => {
    const newTabs = tabs.filter((tab) => tab.id !== id);
    setTabs(newTabs);
    if (newTabs.length > 0) {
      setActiveTabId(newTabs[0].id);
    } else {
      addTab();
    }
  };

  useEffect(() => {
    const savedSql = localStorage.getItem(`sql_${activeTabId}`);
    if (savedSql !== null) {
      setSelectedSql(savedSql);
    } else {
      setSelectedSql("");
    }
  }, [activeTabId]);

  // Adjustments can be made here if needed, such as handling SQL changes
  // const handleSqlChange = (newSql) => {
  //   setSelectedSql(newSql);
  //   localStorage.setItem(`sql_${activeTabId}`, newSql);
  // };

  return (
    <div className="flex w-full h-full text-gray-200">
      <div className="h-full bg-gray-800 w-1/5" style={{ minWidth: "20%" }}>
        <SideHeader title="Queries" />
        <SqlHistory setSelectedSql={setSelectedSql} />
      </div>
      <div className="border-l border-gray-600 sql-dataview-wrapper w-full">
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
