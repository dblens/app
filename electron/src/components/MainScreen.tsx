/* eslint-disable no-alert */
/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from 'react';
import electron from 'electron';
import DbSession from '../sessions/DbSession';
import OverviewScreen from './Overview/OverviewScreen';
import SqlScreen from './SqlScreen';
import Sidebar from './Sidebar';
import TableScreen from './TableScreen';
import Titlebar from './Titlebar';
import ErdContainer from './ERD/ErdContainer';
import SettingsContainer from './Settings/SettingsContainer';
import { useAppState } from '../state/AppProvider';

interface MainScreenProps {
  session: DbSession;
}
// TODO move session to context/env for better access
// select screen based on the sidebar selection

const MainScreen: React.FC<MainScreenProps> = ({
  session,
}: MainScreenProps) => {
  const [selectedTab, setSelectedTab] = useState('OVERVIEW');
  const [, dispatch] = useAppState();

  const disconnect = async () => {
    if (confirm('Are you sure want to disconnect from the database?')) {
      const { status } = await electron.ipcRenderer.invoke('disconnect');
      if (status === 'DISCONNECTED') {
        dispatch({
          type: 'CLEAR_SESSION',
        });
      }
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const escFunction = (e: KeyboardEvent) => {
    if (e.code === 'Escape' && session) {
      disconnect();
    }
  };
  useEffect(() => {
    document.addEventListener('keydown', escFunction, false);
    return () => {
      document.removeEventListener('keydown', escFunction, false);
    };
  }, [escFunction]);

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
