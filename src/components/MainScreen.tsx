import React, { useState } from 'react';
import SqlExecuter from './SqlExecuter';

// TODO move session to context/env for better access
// select screen based on the sidebar selection
const MainScreen = ({ session = '' }) => {
  const [selectedTab, setSelectedTab] = useState();

  return <SqlExecuter session={session} />;
};

export default MainScreen;
