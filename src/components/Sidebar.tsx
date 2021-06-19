import React from 'react';

interface SidebarProps {
  selectedTab: string;
  setSelectedTab: (v: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedTab,
  setSelectedTab,
}: SidebarProps) => {
  return (
    <div className="bg-gray-800 text-gray-100 w-12 pt-8 flex flex-col border border-gray-700">
      <button type="button">
        <span role="img" aria-label="app-icon" className="p-2">
          ⚡️
        </span>
      </button>
      <button
        type="button"
        className={`text-xs h-20 focus:ring-0 ${
          selectedTab === 'SQL' && 'border-l-2 border-gray-300 font-bold'
        }`}
        onClick={() => setSelectedTab('SQL')}
      >
        SQL
      </button>
      <button
        type="button"
        className={`text-xs h-20 focus:ring-0 ${
          selectedTab === 'TABLE' && 'border-l-2 border-gray-300 font-bold'
        }`}
        onClick={() => setSelectedTab('TABLE')}
      >
        Tables
      </button>
    </div>
  );
};

export default Sidebar;
