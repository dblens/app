import React, { ReactText, useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
} from 'recharts';
import { QueryResultRow } from 'pg';

import TotalTableSize from './TotalTableSize';
import TableSize from './TableSize';
import TotalIndexSize from './TotalIndexSize';
import DbSession, { SqlExecReponseType } from '../../sessions/DbSession';
import { DiskUsageStateType } from './types';

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

const data = [
  {
    name: 'Page A',
    table: 4000,
    index: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    table: 3000,
    index: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    table: 2000,
    index: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    table: 2780,
    index: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    table: 1890,
    index: 4800,
    amt: 2181,
  },
  {
    name: 'Page A',
    table: 4000,
    index: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    table: 3000,
    index: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    table: 2000,
    index: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    table: 2780,
    index: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    table: 1890,
    index: 4800,
    amt: 2181,
  },
];

type CustomTooltipProps = {
  active: boolean;
  payload: {
    name: ReactText;
    value: ReactText;
  }[];
};
const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip bg-gray-800 border-gray-300 p-2">
        <p className="label">{`${payload?.[0]?.name} : ${payload?.[0]?.value} kB`}</p>
      </div>
    );
  }

  return null;
};

const ChartsSection = () => (
  <div className="w-full" style={{ height: '33vh' }}>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <Tooltip />
        <Legend />
        <Bar dataKey="table" stackId="a" fill="#8884d8" />
        <Bar dataKey="index" stackId="a" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

type PieDataType = {
  name: ReactText;
  value: ReactText;
};

const PieChartsSection = ({ pieData = [] }: { pieData: PieDataType[] }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          dataKey="value"
          isAnimationActive={false}
          data={pieData}
          cx={170}
          cy={170}
          outerRadius={80}
          fill="#8884d8"
          label
        />

        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
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
    state?.totalTableData?.rows?.map(({ name, size }) => ({
      name,
      value: Number.parseInt(size, 10),
    })) ?? [];

  return (
    <>
      <h1 className="text-2xl p-4">Disk Usage</h1>
      <div className="w-full rounded-xl bg-gray-800">
        <div className="p-4">
          <div className="flex m-auto">
            <div className="flex-1">
              <PieChartsSection pieData={pieData} />
            </div>
            <div className="flex-1">
              <ChartsSection />
            </div>
            {/* <ChartsSection /> */}
          </div>
          <div className="w-full flex">
            <TotalTableSize data={state?.totalTableData} />
            <TableSize data={state?.tableData} />
            <TotalIndexSize data={state?.indexData} />
          </div>
        </div>
      </div>
    </>
  );
};

export default DiskUsageSection;
