/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import DbSession from "../../sessions/DbSession";
import RankList, { RankListProps } from "@/app/components/atoms/RankList";

const indesUsageQuery = `SELECT relname,
CASE idx_scan
  WHEN 0 THEN 'Insufficient data'
  ELSE (100 * idx_scan / (seq_scan + idx_scan))::text
END percent_of_times_index_used,
n_live_tup rows_in_table
FROM
pg_stat_user_tables
ORDER BY
n_live_tup DESC;`;

const IndexUsage = ({ session }: { session: DbSession }) => {
  const [indexUsage, setIndexUsage] = useState<{
    status?: string;
    rows?: RankListProps["list"];
  }>({} as any);
  useEffect(() => {
    const getData = async () => {
      try {
        const response = (await session.executeSQL(indesUsageQuery)) as any;
        const res: RankListProps["list"] =
          response?.rows?.map(
            (i: { relname: any; percent_of_times_index_used: any }) => ({
              field: i.relname,
              value:
                i.percent_of_times_index_used !== "Insufficient data"
                  ? `${i.percent_of_times_index_used}%`
                  : i.percent_of_times_index_used,
            })
          ) ?? [];

        setIndexUsage({ status: response?.status, rows: res });
      } catch (error) {
        console.error(error);
      }
    };
    getData();
  }, []);
  return (
    <div className="flex-1 rounded-xl bg-gray-800 overflow-auto p-2 m-2 shadow-lg">
      <h1 className="text-xl">Index Usage</h1>
      <RankList list={indexUsage?.rows ?? []} />
    </div>
  );
};

export default IndexUsage;
