import React, { useState } from 'react';
import DbSession from '../sessions/DbSession';
import SqlExecuter from './SqlExecuter';
import Sidebar from './Sidebar';
import TableScreen from './TableScreen';
import Titlebar from './Titlebar';

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
    <div className="w-screen h-screen max-h-screen text-gray-800 focus:font-bold focus:outline-none">
      <Titlebar />
      <div className="flex w-full h-full">
        <Sidebar {...{ selectedTab, setSelectedTab }} />
        <div className="bg-gray-100 w-full max-w-full h-full max-h-full flex flex-row overflow-hidden font-mono">
          {/* {selectedTab === 'SQL' && <SqlExecuter session={session} />} */}
          {/* {selectedTab === 'TABLE' && ( */}
          <TableScreen session={session} selectedTab={selectedTab} />
          {/* )} */}
        </div>
      </div>
    </div>
  );
};

export default MainScreen;
