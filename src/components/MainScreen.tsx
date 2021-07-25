import React, { useState } from 'react';
import DbSession from '../sessions/DbSession';
import OverviewScreen from './Overview/OverviewScreen';
import SqlScreen from './SqlScreen';
import Sidebar from './Sidebar';
import TableScreen from './TableScreen';
import Titlebar from './Titlebar';
import ErdContainer from './ERD/ErdContainer';
import SettingsContainer from './Settings/SettingsContainer';

interface MainScreenProps {
  session: DbSession;
}
// TODO move session to context/env for better access
// select screen based on the sidebar selection

const MainScreen: React.FC<MainScreenProps> = ({
  session,
}: MainScreenProps) => {
  const [selectedTab, setSelectedTab] = useState('OVERVIEW');

  return (
    <div className="w-screen h-screen max-h-screen text-gray-800 focus:font-bold focus:outline-none">
      <Titlebar />
      <div className="flex w-full h-full">
        <Sidebar {...{ selectedTab, setSelectedTab }} />
        <div className="bg-gray-100 w-full max-w-full h-full max-h-full flex flex-row overflow-hidden font-mono">
          {selectedTab === 'OVERVIEW' && <OverviewScreen session={session} />}
          {selectedTab === 'SQL' && <SqlScreen session={session} />}
          {selectedTab === 'TABLE' && (
            <TableScreen session={session} selectedTab={selectedTab} />
          )}
          {selectedTab === 'ERD' && <ErdContainer session={session} />}
          {selectedTab === 'SETTINGS' && <SettingsContainer />}
        </div>
      </div>
    </div>
  );
};

export default MainScreen;
