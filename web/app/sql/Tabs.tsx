import React, { useState } from "react";

interface Tab {
  id: number;
  title: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTabId: number;
  setActiveTabId: (id: number) => void;
  removeTab: (id: number) => void;
  addTab: () => void;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTabId,
  setActiveTabId,
  removeTab,
  addTab,
}) => {
  const [hoveredTabId, setHoveredTabId] = useState<number | null>(null);

  const handleMouseEnter = (tabId: number) => {
    setHoveredTabId(tabId);
  };

  const handleMouseLeave = () => {
    setHoveredTabId(null);
  };

  return (
    <div className="tabs flex mx-2 border border-gray-300">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className="relative border-r"
          onMouseEnter={() => handleMouseEnter(tab.id)}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className={
              tab.id === activeTabId ? "border-b-4 border-blue-500" : ""
            }
          >
            <button
              className={`tab text-xs px-2 py-2 ${
                tab.id === activeTabId ? "text-blue-500" : "text-gray-500"
              }`}
              onClick={() => setActiveTabId(tab.id)}
            >
              {tab.title}
            </button>
            {tabs.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeTab(tab.id);
                }}
                className="px-2 right-0 text-s text-gray-400 cursor-pointer hover:bg-slate-700"
              >
                x
              </button>
            )}
          </div>
        </div>
      ))}
      <button
        onClick={addTab}
        className="tab px-2 py-1 text-gray-500 hover:bg-slate-600"
      >
        +
      </button>
    </div>
  );
};

export default Tabs;
