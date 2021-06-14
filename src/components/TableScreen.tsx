import React, { useEffect, useState } from 'react';
import DbSession, { ColumnName, TableType } from '../sessions/DbSession';
import SideHeader from './atoms/SideHeader';
import TableCell from './atoms/TableCell';
import SqlExecuter from './SqlExecuter';

interface SchemaListProps {
  schemas: string[];
  selectedSchema?: string;
  setSelectedSchema: React.Dispatch<React.SetStateAction<string | undefined>>;
}
const Schemalist: React.FC<SchemaListProps> = ({
  schemas = [],
  selectedSchema = '',
  setSelectedSchema,
}: SchemaListProps) => {
  return (
    <div className="relative inline-block w-full text-gray-700">
      <select
        className="w-full p-1 text-xs placeholder-gray-600 border  appearance-none focus:shadow-outline"
        placeholder="Regular input"
        value={selectedSchema}
        onChange={(e) => setSelectedSchema(e.target.value)}
      >
        {schemas.map((i) => (
          <option key={i}>{i}</option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
          <path
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
            fillRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
};
Schemalist.defaultProps = {
  selectedSchema: 'false',
};
interface TableListProps {
  tables: TableType[];
  selectedTable: string;
  setSelectedTable: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const TableList = ({
  tables,
  selectedTable,
  setSelectedTable,
}: TableListProps) => {
  return (
    <div className="autoscroll h-full max-h-full flex flex-col">
      {tables?.map((t) => (
        <button
          className={`pl-4 pr-4 text-xs text-left text-gray-200  hover:bg-gray-400 hover:text-gray-800 cursor-pointer ${
            selectedTable === t?.table_name && 'hover:bg-blue-400 bg-blue-400'
          }`}
          key={t?.table_name}
          onClick={() => setSelectedTable(t?.table_name)}
          type="button"
        >
          {t?.table_name}
        </button>
      ))}
    </div>
  );
};

const TableComp = ({
  session,
  selectedSchema,
  selectedTable,
}: {
  session: DbSession;
  selectedSchema: string | undefined;
  selectedTable: string;
}) => {
  const [tableData, setTableData] = useState<{
    tableData?: Record<string, unknown>[];
    columnNames?: ColumnName[];
  }>({});

  useEffect(() => {
    const loadData = async () => {
      let tableRows;
      let columnNames;
      if (selectedSchema) {
        columnNames = await session.getColumnNames({
          schema: selectedSchema,
          table: selectedTable,
        });

        tableRows = await session.getTableData({
          schema: selectedSchema,
          table: selectedTable,
          offset: 0,
          pagenumber: 1,
          size: 50,
        });
        if (columnNames?.status === 'SUCCESS') {
          setTableData({
            tableData: tableRows?.rows,
            columnNames: columnNames?.rows,
          });
        }
      }
    };
    loadData();
  }, [selectedSchema, selectedTable, session]);

  useEffect(() => {
    console.log({ tableData });
  }, [tableData]);

  return (
    <div className="w-full h-full max-h-full  bg-gray-800 border-l border-gray-300 text-gray-300 text-sm overflow-auto">
      <table className="w-full table-fixed border border-gray-500">
        <tr className="bg-gray-900">
          {tableData?.columnNames?.map(({ column_name: colName = '' }) => (
            <th
              key={colName}
              className={`p-3 px-4 border border-gray-500 ${colName}`}
            >
              {colName}
            </th>
          ))}
        </tr>
        {tableData?.tableData?.map((row, ix) => (
          <tr
            className="hover:bg-gray-700 hover:text-gray-100"
            key={(row?.id ?? `col_${ix}`) as string}
          >
            {tableData?.columnNames?.map(({ column_name }) => {
              const cell = row?.[column_name];
              if (ix === 0) console.log({ column_name, cell, row });
              return (
                <TableCell
                  key={`${selectedSchema}_${selectedTable}_${column_name}_${
                    typeof cell === 'object'
                      ? JSON.stringify(cell)
                      : (cell as string)
                  }`}
                  value={cell}
                />
              );
            })}
          </tr>
        ))}
      </table>
    </div>
  );
};

const TableScreen = ({
  session,
  selectedTab,
}: {
  session: DbSession;
  selectedTab: string;
}) => {
  const [schemaList, setSchemaList] = useState<string[]>([]);
  const [selectedSchema, setSelectedSchema] = useState<string>();

  const [tables, settables] = useState<TableType[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>();

  useEffect(() => {
    session
      ?.getDBSchemas()
      .then((list) => {
        if (list?.[0]) setSelectedSchema(list[0]);
        return setSchemaList(list);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedSchema) {
      session.getAllTables(selectedSchema).then(settables).catch(console.error);
    }
  }, [selectedSchema, session]);
  return (
    <div className="flex w-full h-full">
      {selectedTab === 'TABLE' && (
        <div className="h-full bg-gray-700" style={{ width: 300 }}>
          {/* {selectedTab === 'SQL' && <SideHeader title="Queries" />} */}
          {selectedTab === 'TABLE' && (
            <>
              <SideHeader title="SCHEMAS" />
              <Schemalist
                {...{ schemas: schemaList, selectedSchema, setSelectedSchema }}
              />

              <SideHeader title="TABLES" />
              {tables && (
                <TableList
                  {...{
                    tables,
                    selectedTable: selectedTable || tables?.[0]?.table_name,
                    setSelectedTable,
                  }}
                />
              )}
            </>
          )}
        </div>
      )}
      <div className="h-full w-full max-h-full">
        {/* Tabs Section */}
        {/* <div className="w-full bg-gray-800 flex" style={{ height: 25 }}>
          {new Array(3).fill('Tab').map((t, ix) => (
            // eslint-disable-next-line react/no-array-index-key
            <div className="border border-gray-500" key={`${t}_${ix}`}>
              <button type="button" className="pl-4 pr-4 text-gray-100">
                Test Tab
              </button>
              <button type="button" className="ml-4 mr-4 text-gray-100">
                X
              </button>
            </div>
          ))}
        </div> */}
        {selectedTab === 'SQL' && <SqlExecuter session={session} />}
        {selectedTab === 'TABLE' && (
          <TableComp {...{ session, selectedTable, selectedSchema }} />
        )}
      </div>
    </div>
  );
};

export default TableScreen;
