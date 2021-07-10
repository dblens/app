import React from 'react';
import RankList from '../atoms/RankList';

const InstalledExtensions = () => {
  return (
    <>
      <h1 className="m-4 text-2xl">Installed Extensions</h1>
      <div className="w-full rounded-xl bg-gray-800 overflow-auto p-2 m-2 shadow-lg">
        <RankList list={[]} />
      </div>
    </>
  );
};

export default InstalledExtensions;
