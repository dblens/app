/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryResultRow } from 'pg';
import React, { useEffect, useState } from 'react';
import DbSession, { SqlExecReponseType } from '../../sessions/DbSession';
import RankList, { RankListProps } from "@/app/components/atoms/RankList";

const sqScanQuery = `SELECT
pid,
now() - pg_stat_activity.query_start AS duration,
query AS query
FROM
pg_stat_activity
WHERE
pg_stat_activity.query <> ''::text
AND state <> 'idle'
AND now() - pg_stat_activity.query_start > interval '5 minutes'
ORDER BY
now() - pg_stat_activity.query_start DESC;`;

const SlowestQueries = ({ session }: { session: DbSession }) => {
  const [slowestQueries, setSlowestQueries] = useState<{
    status: string;
    rows: RankListProps['list'];
  }>({} as any);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = (await session.executeSQL(sqScanQuery)) as any;
        console.error(response);
        const res: RankListProps['list'] =
          response?.rows?.map((i: { query: any; duration: any }) => ({
            field: i.query,
            value: i.duration,
          })) ?? [];

        setSlowestQueries({ status: response.status as string, rows: res });
      } catch (error) {
        console.error(error);
      }
    };
    getData();
  }, []);
  return (
    <>
      <h1 className="text-xl py-4 font-thin">Long Running Queries</h1>
      {slowestQueries?.status && slowestQueries?.status !== 'SUCCESS' && (
        <h1 className="text -sm p-4 text-red-500 ">
          Ahh! Error fetching info!
        </h1>
      )}
      {slowestQueries?.status === 'SUCCESS' && (
        <RankList list={slowestQueries?.rows} />
      )}
    </>
  );
};

export default SlowestQueries;
