/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactText, useEffect, useState } from 'react';

import { QueryResultRow } from 'pg';

import TotalTableSize from './TotalTableSize';
import TableSize from './TableSize';
import TotalIndexSize from './TotalIndexSize';
import DbSession, { SqlExecReponseType } from '../../sessions/DbSession';
import { CustomTooltipProps, DiskUsageStateType } from './types';
import PieChart from './PieChart';
import BarChart from './BarChart';

const totalTableSize = `SELECT c.relname AS name,
pg_size_pretty(pg_total_relation_size(c.oid)) AS size
FROM pg_class c
LEFT JOIN pg_namespace n ON (n.oid = c.relnamespace)
WHERE n.nspname NOT IN ('pg_catalog', 'information_schema')
AND n.nspname !~ '^pg_toast'
AND c.relkind='r'
ORDER BY pg_total_relation_size(c.oid) DESC;`;

const tableSizeQuery = `SELECT c.relname AS name,
pg_size_pretty(pg_table_size(c.oid)) AS size
FROM pg_class c
LEFT JOIN pg_namespace n ON (n.oid = c.relnamespace)
WHERE n.nspname NOT IN ('pg_catalog', 'information_schema')
AND n.nspname !~ '^pg_toast'
AND c.relkind='r'
ORDER BY pg_table_size(c.oid) DESC;`;

const indexSizeQuery = `
SELECT c.relname AS name,
  pg_size_pretty(sum(c.relpages::bigint*8192)::bigint) AS size
FROM pg_class c
LEFT JOIN pg_namespace n ON (n.oid = c.relnamespace)
WHERE n.nspname NOT IN ('pg_catalog', 'information_schema')
AND n.nspname !~ '^pg_toast'
AND c.relkind='i'
GROUP BY c.relname
ORDER BY sum(c.relpages) DESC;
  `;

const getBarChartData = (state: DiskUsageStateType) => {
  const resultMap = {} as Record<string, any>;
  state?.tableData?.rows?.forEach(({ name, size }: any) => {
    resultMap[name] = {
      tableSize: Number.parseInt(size, 10),
    };
  });
  state?.totalTableData?.rows?.forEach(({ name, size }: any) => {
    resultMap[name] = {
      ...(resultMap[name] && resultMap[name]),
      totalTableSize: Number.parseInt(size, 10),
    };
  });
  const result = Object.entries(resultMap).map(([key, value]) => ({
    name: key,
    ...value,
  }));

  return result;
};

const DiskUsageSection = ({ session }: { session: DbSession }) => {
  const [state, setState] = useState<DiskUsageStateType>({});

  useEffect(() => {
    const getdata = async () => {
      try {
        const totalTableData = (await session.executeSQL(
          totalTableSize
        )) as SqlExecReponseType<QueryResultRow[]>;
        const tableData = (await session.executeSQL(
          tableSizeQuery
        )) as SqlExecReponseType<QueryResultRow[]>;
        const indexData = (await session.executeSQL(
          indexSizeQuery
        )) as SqlExecReponseType<QueryResultRow[]>;
        setState({ totalTableData, tableData, indexData });
      } catch (error) {
        console.log(error);
      }
    };
    getdata();
  }, []);
  const pieData =
    state?.indexData?.rows?.map(({ name, size }) => ({
      name,
      value: Number.parseInt(size, 10),
    })) ?? [];
  const barChartData = getBarChartData(state);

  return (
    <>
      <h1 className="text-2xl p-4">Disk Usage</h1>
      <div className="w-full rounded-xl bg-gray-800">
        <div className="p-4">
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <BarChart barchartData={barChartData} />
            </div>
            <div className="col">
              <PieChart pieData={pieData} />
            </div>
            {/* <ChartsSection /> */}
          </div>
          <div className="w-full flex">
            <TableSize data={state?.tableData} />
            <TotalTableSize data={state?.totalTableData} />
            <TotalIndexSize data={state?.indexData} />
          </div>
        </div>
      </div>
    </>
  );
};

export default DiskUsageSection;
