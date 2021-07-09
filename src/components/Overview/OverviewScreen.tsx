import React, { useState } from 'react';
import DbSession from '../../sessions/DbSession';
import TopCacheHits from './TopCacheHits';
import TopSeqScans from './TopSeqScans';
import SlowestQueries from './SlowestQueries';
import TotalTableSize from './TotalTableSize';
import TableSize from './TableSize';
import TotalIndexSize from './TotalIndexSize';
import RecordRanks from './RecordRanks';
import LongRunningQueries from './IndexUsage';
import UnusedIndex from './UnusedIndex';

const SqlScreen = ({ session }: { session: DbSession }) => {
  return (
    <div
      className="flex w-full h-full text-gray-200 bg-gray-900 font-normal font-sans"
      style={{
        height: 'calc(100vh - 25px)',
        maxHeight: 'calc(100vh - 25px)',
      }}
    >
      <div className="h-full flex-auto p-2 overflow-auto">
        {/* <div
          className="w-full rounded-xl bg-gray-800 overflow-auto p-2 m-2 shadow-lg"
          style={{ height: '30vh' }}
        >
          <h1 className="m-12 text-6xl">Charts here</h1>
        </div> */}

        <div className="w-full flex">
          <TableSize />
          <TotalIndexSize />
          <TotalTableSize />
        </div>
        <div className="w-full flex">
          <RecordRanks />
          <LongRunningQueries />
          <UnusedIndex />
        </div>
        <div className="w-full rounded-xl bg-gray-800 overflow-auto p-2 m-2 shadow-lg">
          <h1 className="m-4 text-2xl">Installed Extensions</h1>
        </div>
      </div>
      <div className="h-full flex-none p-4" style={{ width: '25vw' }}>
        <div className="h-full rounded-xl bg-gray-800 overflow-auto p-4 shadow-lg">
          <TopCacheHits />
          <TopSeqScans />
          <SlowestQueries />
        </div>
      </div>
    </div>
  );
};

export default SqlScreen;
