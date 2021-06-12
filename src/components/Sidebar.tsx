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
    <div className="bg-gray-800 text-gray-100 w-12 pt-8 flex flex-col ">
      <button type="button">
        <span role="img" aria-label="app-icon" className="pl-6">
          ⚡️
        </span>
      </button>
      <button
        type="button"
        className={`text-xs h-20 ${
          selectedTab === 'SQL' && 'bg-blue-200 text-blue-900'
        }`}
        onClick={() => setSelectedTab('SQL')}
      >
        SQL
      </button>
      <button
        type="button"
        className={`text-xs h-20 ${
          selectedTab === 'TABLE' && 'bg-blue-200 text-blue-900'
        }`}
        onClick={() => setSelectedTab('TABLE')}
      >
        Tables
      </button>
    </div>
  );
};

export default Sidebar;
