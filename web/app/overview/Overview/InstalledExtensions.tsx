/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import DbSession from "../../sessions/DbSession";
import ReactTooltip from "react-tooltip";
import { useRouter } from "next/navigation";

const extensionsQuery = `SELECT * FROM pg_available_extensions;`;

interface ExtensionList {
  name: string;
  default_version: string;
  installed_version: string;
  comment: string;
}

const InstalledExtensions = ({ session }: { session: DbSession }) => {
  const [indexUsage, setInstalledExtensions] = useState<{
    status: string;
    rows: ExtensionList[];
  }>({} as any);
  const router = useRouter();

  useEffect(() => {
    const getData = async () => {
      try {
        const response = (await session.executeSQL(extensionsQuery)) as any;
        const res: ExtensionList[] =
          response?.rows?.map(
            (i: {
              name: any;
              comment: any;
              default_version: any;
              installed_version: any;
            }) => ({
              name: i.name,
              comment: i.comment,
              default_version: i.default_version,
              installed_version: i.installed_version,
            })
          ) ?? [];

        setInstalledExtensions({ status: response?.status, rows: res });
      } catch (error) {
        console.error(error);
      }
    };
    getData();
  }, []);

  const onInstallOrUninstall = (
    extension: string,
    installed_version?: string
  ) => {
    if (!installed_version) {
      // ask user to install the extension
      const userConfirmed = confirm(
        `Do you want to install the extension ${extension}? This will open SQL editor with the installation query, you can then execute the query manually.`
      );
      if (!userConfirmed) {
        return;
      }
      router.push(`/sql?sql=CREATE EXTENSION IF NOT EXISTS ${extension};`);
    } else {
      // ask user to uninstall the extension
      const userConfirmed = confirm(
        `Do you want to uninstall the extension ${extension}? This will open SQL editor with the uninstallation query, you can then execute the query manually.`
      );
      if (!userConfirmed) {
        return;
      }
      router.push(`/sql?sql=DROP EXTENSION IF EXISTS ${extension};`);
    }
  };

  return (
    <div className="flex-1 rounded-xl bg-gray-800 overflow-auto p-2 m-2 shadow-lg font-semibold">
      <span className="flex justify-between w-full">
        <h1 className="text-xl">Extensions</h1>
        <h1 className="font-thin">installed / available</h1>
      </span>
      <ExtensionList
        list={indexUsage?.rows ?? []}
        onInstallOrUninstall={onInstallOrUninstall}
      />
    </div>
  );
};

const ExtensionList = ({
  list = [],
  onInstallOrUninstall,
}: {
  list: ExtensionList[];
  onInstallOrUninstall: (extension: string, installed_version?: string) => void;
}) => {
  return (
    <ul className="py-2 text-sm overflow-auto" style={{ height: "10rem" }}>
      {list.map(({ comment, default_version, installed_version, name }) => (
        <>
          <li
            key={name}
            className="flex w-full text-sm leading-normal hover:bg-gray-600 rounded hover:shadow-lg hover:drop-shadow hover:text-gray-100 px-1"
          >
            {/* <button
              className="px-2 font-mono hover:text-green-500"
              // className=" hover:font-bold text-white p-0 font-thin font-mono rounded"
            >
              ⬇️
            </button> */}

            <span className="flex-1">
              {name}
              <span className="font-thin">{` : ${comment}`}</span>
            </span>

            <a
              className="text-green-50 hover:cursor-pointer"
              data-tip
              data-for={`install-extension-${name}`}
              onClick={() => onInstallOrUninstall(name, installed_version)}
            >{`${
              installed_version ?? "not installed"
            } / ${default_version}`}</a>
          </li>
          <ReactTooltip id={`install-extension-${name}`} type="info">
            <span>
              Click to {installed_version ? "unintall" : "install"} the
              extension {name} on the connected database,
              <br /> This will open SQL editor with the{" "}
              {installed_version ? "unintallation" : "installation"} query, you
              can then execute the query manually. <br />
            </span>
          </ReactTooltip>
        </>
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
