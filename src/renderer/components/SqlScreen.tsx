import React, { useState } from 'react';
import DbSession from '../sessions/DbSession';
import SqlExecuter from './SqlExecuter';
import SqlHistory from './SqlHistory';
import SideHeader from './atoms/SideHeader';

const SqlScreen = ({ session }: { session: DbSession }) => {
  const [selectedSql, setSelectedSql] = useState<string>('');
  return (
    <div className="flex w-full h-full text-gray-200">
      <div className="h-full bg-gray-800" style={{ width: 300 }}>
        <SideHeader title="Queries" />
        <SqlHistory setSelectedSql={setSelectedSql} />
      </div>
      <div className="h-full w-full max-h-full border-l border-gray-600">
        <SqlExecuter session={session} selectedSql={selectedSql} />
      </div>
    </div>
  );
};

export default SqlScreen;
