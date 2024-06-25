/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import DbSession from "../../sessions/DbSession";
import ReactTooltip from "react-tooltip";

const extensionsQuery = `SELECT * FROM pg_available_extensions;`;

interface ExtensioList {
  comment: string;
  value: string;
  extension: string;
}

const InstalledExtensions = ({ session }: { session: DbSession }) => {
  const [indexUsage, setInstalledExtensions] = useState<{
    status: string;
    rows: ExtensioList[];
  }>({} as any);
  useEffect(() => {
    const getData = async () => {
      try {
        const response = (await session.executeSQL(extensionsQuery)) as any;
        console.log(response);
        const res: ExtensioList[] =
          response?.rows?.map(
            (i: {
              name: any;
              comment: any;
              default_version: any;
              installed_version: any;
            }) => ({
              extension: i.name,
              comment: i.comment,
              value: `${i.installed_version ?? "not installed"} / ${
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
      <ExtensioList list={indexUsage?.rows ?? []} />
    </div>
  );
};

const ExtensioList = ({ list = [] }: { list: ExtensioList[] }) => {
  return (
    <ul className="py-2 text-sm overflow-auto" style={{ height: "10rem" }}>
      {list.map(({ comment, value, extension }) => (
        <li
          key={extension}
          className="flex w-full text-sm leading-normal hover:bg-gray-600 rounded hover:shadow-lg hover:drop-shadow hover:text-gray-100 px-1"
        >
          <span className="flex-1">
            {extension}<span className="font-thin">{` : ${comment}`}</span>
          </span>
          <span className="text-green-50">{value}</span>
          {/* <button
            className="p-0 font-mono hover:text-green-500"
            data-tip
            data-for={`install-extension-${extension}`}
          >↓
          </button>

          <ReactTooltip id={`install-extension-${extension}`} type="info">
            <span>
              Install the extension {extension} on the database. <br />
            </span>
          </ReactTooltip> */}
        </li>
      ))}
      {list?.length === 0 && (
        <li className="flex w-full text-sm leading-normal">
          <span className="flex-1 truncate">Insufficient Data</span>
        </li>
      )}
    </ul>
  );
};

export default InstalledExtensions;
