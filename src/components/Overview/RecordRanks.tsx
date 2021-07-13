/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import DbSession from '../../sessions/DbSession';
import RankList, { RankListProps } from '../atoms/RankList';

const recordRankQuery = `SELECT
relname AS name,
n_live_tup AS estimated_count
FROM
pg_stat_user_tables
ORDER BY
n_live_tup DESC;`;

const RecordRanks = ({ session }: { session: DbSession }) => {
  const [recordRanks, setRecordRanks] = useState<{
    status: string;
    rows: RankListProps['list'];
  }>({});
  useEffect(() => {
    const getData = async () => {
      try {
        const response = (await session.executeSQL(recordRankQuery)) as any;
        const res: RankListProps['list'] =
          response?.rows?.map((i: { name: any; estimated_count: any }) => ({
            field: i.name,
            value: i.estimated_count,
          })) ?? [];

        setRecordRanks({ status: response?.status, rows: res });
      } catch (error) {
        console.error(error);
      }
    };
    getData();
  }, []);
  return (
    <div className="flex-1 rounded-xl bg-gray-800 overflow-auto p-2 m-2 shadow-lg">
      <h1 className="text-xl">Record Ranks</h1>
      <RankList list={recordRanks?.rows ?? []} />
    </div>
  );
};

export default RecordRanks;
