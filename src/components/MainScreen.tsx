import React, { useState } from 'react';
import DbSession from '../sessions/DbSession';
import SqlExecuter from './SqlExecuter';
import TableScreen from './TableScreen';

interface MainScreenProps {
  session: DbSession;
}
// TODO move session to context/env for better access
// select screen based on the sidebar selection

const MainScreen: React.FC<MainScreenProps> = ({
  session,
}: MainScreenProps) => {
  const [selectedTab, setSelectedTab] = useState('TABLE');

  return (
    <div className="w-screen h-screen flex text-gray-800">
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
      <div className="bg-gray-100 w-full flex flex-row">
        {selectedTab === 'SQL' && <SqlExecuter session={session} />}
        {selectedTab === 'TABLE' && <TableScreen session={session} />}
      </div>
    </div>
  );
};

export default MainScreen;
