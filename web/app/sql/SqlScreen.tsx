import React, { useState, useEffect } from "react";
import SqlExecutor from "./SqlExecutor";
import SqlHistory from "./SqlHistory";
import SideHeader from "../components/atoms/SideHeader";
import PgSession from "../sessions/PgSession";

const SqlScreen = () => {
  const [tabs, setTabs] = useState([{ id: 1, title: "Query 1" }]);
  const [activeTabId, setActiveTabId] = useState(1);
  const [selectedSql, setSelectedSql] = useState<string>("");
  const session = new PgSession("PG");

  const addTab = () => {
    const newTabId = tabs.length + 1;
    setTabs([...tabs, { id: newTabId, title: `Query ${newTabId}` }]);
    setActiveTabId(newTabId);
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
        <div className="tabs flex p-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab px-4 py-2 ${
                tab.id === activeTabId
                  ? "bg-gray-700 text-white"
                  : "bg-gray-600 text-gray-300"
              }`}
              onClick={() => setActiveTabId(tab.id)}
            >
              {tab.title}
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  removeTab(tab.id);
                }}
                className="ml-2 text-red-500 cursor-pointer"
              >
                x
              </span>
            </button>
          ))}
          <button
            onClick={addTab}
            className="px-4 py-2 bg-gray-600 text-gray-300"
          >
            +
          </button>
        </div>
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
