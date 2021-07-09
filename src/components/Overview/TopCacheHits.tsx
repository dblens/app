import React from 'react';
import RankList from '../atoms/RankList';

const TopCacheHits = () => {
  return (
    <>
      <h1 className="text-xl px-2">Top Cache Hits</h1>
      <ul className="p-0">
        <RankList />
      </ul>
    </>
  );
};

export default TopCacheHits;
