import { QueryResultRow } from 'pg';
import React, { useEffect, useState } from 'react';
import DbSession, { SqlExecReponseType } from '../../sessions/DbSession';
import RankList, { RankListProps } from '../atoms/RankList';

const sqScanQuery = `SELECT relname AS name,
seq_scan as count
FROM
pg_stat_user_tables
ORDER BY seq_scan DESC;`;

const TopSeqScans = ({ session }: { session: DbSession }) => {
  const [sqScans, setSqScans] = useState<{
    status: string;
    rows: RankListProps['list'];
  }>({} as any);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = (await session.executeSQL(sqScanQuery)) as any;
        const res: RankListProps['list'] =
          response?.rows?.map((i: { name: any; count: any }) => ({
            field: i.name,
            value: i.count,
          })) ?? [];

        setSqScans({ status: response.status as string, rows: res });
      } catch (error) {
        console.error(error);
      }
    };
    getData();
  }, []);
  return (
    <>
      <h1 className="text-xl py-4 font-thin">Top Seq Scans</h1>
      {sqScans?.status && sqScans?.status !== 'SUCCESS' && (
        <h1 className="text -sm p-4 text-red-500 ">
          Ahh! Error fetching info!
        </h1>
      )}
      {sqScans?.status === 'SUCCESS' && <RankList list={sqScans?.rows} />}
    </>
  );
};

export default TopSeqScans;
