import React from 'react';
import DbSession from '../../sessions/DbSession';
import RankList from '../atoms/RankList';

const IndexUsage = ({ session }: { session: DbSession }) => {
  return (
    <div className="flex-1 rounded-xl bg-gray-800 overflow-auto p-2 m-2 shadow-lg">
      <h1 className="text-xl">Index Usage</h1>
      <RankList />
    </div>
  );
};

export default IndexUsage;
