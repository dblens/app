/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import DbSession from '../../sessions/DbSession';
import RankList, { RankListProps } from "@/app/components/atoms/RankList";

const indesUsageQuery = `SELECT
schemaname || '.' || relname AS table,
indexrelname AS index,
pg_size_pretty(pg_relation_size(i.indexrelid)) AS index_size,
idx_scan as index_scans
FROM pg_stat_user_indexes ui
JOIN pg_index i ON ui.indexrelid = i.indexrelid
WHERE NOT indisunique AND idx_scan < 50 AND pg_relation_size(relid) > 5 * 8192
ORDER BY pg_relation_size(i.indexrelid) / nullif(idx_scan, 0) DESC NULLS FIRST,
pg_relation_size(i.indexrelid) DESC;`;

const UnusedIndex = ({ session }: { session: DbSession }) => {
  const [unusedIndex, setUnusedIndex] = useState<{
    status: string;
    rows: RankListProps['list'];
  }>({} as any);
  useEffect(() => {
    const getData = async () => {
      try {
        const response = (await session.executeSQL(indesUsageQuery)) as any;
        const res: RankListProps['list'] =
          response?.rows?.map(
            (i: {
              index: any;
              index_size: any;
              index_scans: any;
              table: any;
            }) => ({
              field: i.index,
              value: i.index_scans
                ? `(${i.index_size}) ${i.index_scans}%`
                : 'Insufficient Data',
            })
          ) ?? [];

        setUnusedIndex({ status: response?.status, rows: res });
      } catch (error) {
        console.error(error);
      }
    };
    getData();
  }, []);
  return (
    <div className="flex-1 rounded-xl bg-gray-800 overflow-auto p-2 m-2 shadow-lg">
      <h1 className="text-xl">Unused Index</h1>
      <RankList list={unusedIndex?.rows ?? []} />
    </div>
  );
};

export default UnusedIndex;
