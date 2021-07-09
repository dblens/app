import React from 'react';
import DbSession from '../../sessions/DbSession';
import RankList from '../atoms/RankList';

const UnusedIndex = ({ session }: { session: DbSession }) => {
  return (
    <div className="flex-1 rounded-xl bg-gray-800 overflow-auto p-2 m-2 shadow-lg">
      <h1 className="text-xl">Unused Index</h1>
      <RankList />
    </div>
  );
};

export default UnusedIndex;
