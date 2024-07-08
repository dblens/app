import { QueryResultRow } from "pg";
import React, { useEffect, useState } from "react";
import DbSession, { SqlExecReponseType } from "../../sessions/DbSession";

const cacheHitQuery = `SELECT
'index hit rate' AS name,
(sum(idx_blks_hit)) / nullif(sum(idx_blks_hit + idx_blks_read),0) AS ratio
FROM pg_statio_user_indexes
UNION ALL
SELECT
'table hit rate' AS name,
sum(heap_blks_hit) / nullif(sum(heap_blks_hit) + sum(heap_blks_read),0) AS ratio
FROM pg_statio_user_tables;`;

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
const TopCacheHits = ({ session }: { session: DbSession }) => {
  const [cacheHits, setCacheHits] = useState<
    SqlExecReponseType<QueryResultRow[]>
  >({} as any);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = (await session.executeSQL(cacheHitQuery)) as any;
        setCacheHits(response);
      } catch (error) {
        console.error(error);
      }
    };
    getData();
  }, []);
  return (
    <>
      {cacheHits?.status && cacheHits?.status !== "SUCCESS" && (
        <h1 className="text -sm p-4 text-red-500 ">
          Ahh! Error fetching info!
        </h1>
      )}
      {cacheHits?.status === "SUCCESS" &&
        cacheHits?.rows?.map(({ name, ratio }) => (
          <div className="py-4" key={name}>
            <h1 className="text-xl px-2 font-thin">
              {name && capitalizeFirstLetter(name)}
            </h1>
            <h1 className="text-5xl px-2 font-light truncate">{ratio}</h1>
          </div>
        ))}
    </>
  );
};

export default TopCacheHits;
