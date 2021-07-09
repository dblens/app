import React from 'react';
import DbSession from '../../sessions/DbSession';
import RankList from '../atoms/RankList';

const TotalTableSize = ({ session }: { session: DbSession }) => {
  return (
    <div className="flex-1 rounded-xl bg-gray-800 overflow-auto p-2 m-2 shadow-lg">
      <h1 className="text-md font-thin">Total Table Size</h1>
      <h2 className="text-4xl">100 KB</h2>
      <RankList />
    </div>
  );
};

export default TotalTableSize;
