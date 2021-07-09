import React from 'react';
import RankList from '../atoms/RankList';

const TopSeqScans = () => {
  return (
    <>
      <h1 className="text-xl p-2">Top Sequential Scans</h1>
      <ul className="p-0">
        <RankList />
      </ul>
    </>
  );
};

export default TopSeqScans;
