import React from 'react';
import RankList from '../atoms/RankList';
import { DiskUsageStateType } from './types';

const TableSize = ({
  data,
}: {
  data: DiskUsageStateType['totalTableData'];
}) => {
  const totalSize =
    data?.rows?.reduce((p, c) => p + Number.parseInt(c.size, 10), 0) ?? 0;
  const list =
    data?.rows?.map(({ name, size }) => ({
      field: name,
      value: size,
    })) ?? [];
  return (
    <div className="flex-1 rounded-xl bg-gray-800 overflow-auto p-2 m-2 ">
      <h1 className="text-md font-thin">Table Size</h1>
      <h2 className="text-4xl">{totalSize} KB</h2>
      <RankList list={list} />
    </div>
  );
};

export default TableSize;
