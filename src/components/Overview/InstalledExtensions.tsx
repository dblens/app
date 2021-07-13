/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import DbSession from '../../sessions/DbSession';
import RankList, { RankListProps } from '../atoms/RankList';

const extensionsQuery = `SELECT * FROM pg_available_extensions WHERE name IN (SELECT unnest(string_to_array(current_setting('extwlist.extensions'), ',')))`;

const InstalledExtensions = ({ session }: { session: DbSession }) => {
  const [indexUsage, setInstalledExtensions] = useState<{
    status: string;
    rows: RankListProps['list'];
  }>({});
  useEffect(() => {
    const getData = async () => {
      try {
        const response = (await session.executeSQL(extensionsQuery)) as any;
        console.log(response);
        const res: RankListProps['list'] =
          response?.rows?.map(
            (i: {
              name: any;
              comment: any;
              default_version: any;
              installed_version: any;
            }) => ({
              field: `${i.name} : ${i.comment}`,
              value: `${i.installed_version ?? 'not installed'} / ${
                i.default_version
              }`,
            })
          ) ?? [];

        setInstalledExtensions({ status: response?.status, rows: res });
      } catch (error) {
        console.error(error);
      }
    };
    getData();
  }, []);
  return (
    <div className="flex-1 rounded-xl bg-gray-800 overflow-auto p-2 m-2 shadow-lg font-semibold">
      <span className="flex justify-between w-full">
        <h1 className="text-xl">Extensions</h1>
        <h1 className="font-thin">installed / available</h1>
      </span>
      <RankList list={indexUsage?.rows ?? []} />
    </div>
  );
};

export default InstalledExtensions;
