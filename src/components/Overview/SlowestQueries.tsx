import React from 'react';
import RankList from '../atoms/RankList';

const SlowestQueries = () => {
  return (
    <>
      <h1 className="text-xl ">Slowest Queries</h1>
      <RankList />
    </>
  );
};

export default SlowestQueries;
