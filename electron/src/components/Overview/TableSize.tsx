import React, { ReactText } from 'react';
import RankList from '../atoms/RankList';
import { niceBytes } from '../utils/utils';
import { DiskUsageStateType } from './types';

const TableSize = ({
  percentage,
  data,
  chartType,
  setChartType,
}: {
  percentage: ReactText;
  data: DiskUsageStateType['totalTableData'];
  chartType: string;
  setChartType: (v: string) => void;
}) => {
  const totalSize =
    data?.rows?.reduce((p, c) => p + Number.parseInt(c.size, 10), 0) ?? 0;
  const list =
    data?.rows?.map(({ name, size }) => ({
      field: name,
      value: size,
    })) ?? [];
  return (
    <div
      className="flex-1 rounded-xl bg-gray-800 overflow-auto p-2 m-2 "
      onMouseEnter={() => chartType !== 'TABLE' && setChartType('TABLE')}
    >
      <h1 className="text-md font-thin">
        Table Size {percentage !== undefined && ` (${percentage}%)`}
      </h1>
      <h2 className="text-5xl py-2">{niceBytes(totalSize * 1024)}</h2>
      <RankList list={list} />
    </div>
  );
};

export default TableSize;
