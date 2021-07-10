import React, { useState } from 'react';
import DbSession from '../../sessions/DbSession';
import TopCacheHits from './TopCacheHits';
import TopSeqScans from './TopSeqScans';
import SlowestQueries from './SlowestQueries';
import RecordRanks from './RecordRanks';
import IndexUsage from './IndexUsage';
import UnusedIndex from './UnusedIndex';
import DiskUsageSection from './DiskUsageSection';
import InstalledExtensions from './InstalledExtensions';

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

        <DiskUsageSection session={session} />
        <h1 className="text-2xl p-4">Records & Indexing</h1>

        <div className="w-full flex">
          <RecordRanks session={session} />
          <IndexUsage session={session} />
          <UnusedIndex session={session} />
        </div>
        <InstalledExtensions />
      </div>
      <div className="h-full flex-none p-4" style={{ width: '25vw' }}>
        <div className="h-full rounded-xl bg-gray-800 overflow-auto p-4 shadow-lg">
          <TopCacheHits session={session} />
          <TopSeqScans session={session} />
          <SlowestQueries session={session} />
        </div>
      </div>
    </div>
  );
};

export default SqlScreen;
