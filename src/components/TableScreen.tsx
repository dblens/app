import React, { useEffect, useState } from 'react';
import DbSession, { TableType } from '../sessions/DbSession';
import SideHeader from './atoms/SideHeader';
import TableCell from './atoms/TableCell';

interface SchemaListProps {
  schemas: string[];
  selectedSchema: string;
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
        className="w-full text-xs placeholder-gray-600 border  appearance-none focus:shadow-outline"
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
  console.log(selectedTable);
  return (
    <div className=" overflow-auto h-full max-h-full flex flex-col">
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
  const [tableData, setTableData] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    if (selectedSchema)
      session
        .getTableData({
          schema: selectedSchema,
          table: selectedTable,
          offset: 0,
          pagenumber: 1,
          size: 50,
        })
        .then((data) => {
          // eslint-disable-next-line promise/always-return
          if (data?.status === 'SUCCESS') {
            setTableData(data?.rows);
          }
        })
        .catch(console.error);
  }, [selectedSchema, selectedTable, session]);
  useEffect(() => {
    console.log(tableData);
  }, [tableData]);

  const columnNames = Object.keys(tableData?.[0] ?? []);
  return (
    <div className="w-full overflow-y-auto overflow-x-auto">
      <table className="w-full overflow-y-auto overflow-x-auto">
        <tr>
          {columnNames.map((colName) => (
            <th key={colName}>{colName}</th>
          ))}
        </tr>
        {tableData.map((row, ix) => (
          <tr key={(row?.id ?? `col_${ix}`) as string}>
            {Object.values(row).map((cell) => (
              <TableCell
                key={
                  typeof cell === 'object'
                    ? JSON.stringify(cell)
                    : (cell as string)
                }
                value={cell}
              />
            ))}
          </tr>
        ))}
      </table>
    </div>
  );
};

const TableScreen = ({ session }: { session: DbSession }) => {
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
    <div className="flex w-full">
      <div className="h-full bg-gray-700 w-60">
        <SideHeader title="SCHEMAS" />
        <Schemalist
          {...{ schemas: schemaList, selectedSchema, setSelectedSchema }}
        />

        <SideHeader title="TABLES" />
        <TableList {...{ tables, selectedTable, setSelectedTable }} />
      </div>
      <div className="h-full w-full overflow-y-auto overflow-x-auto">
        {/* Tabs Section */}
        <div className="w-full bg-gray-800 flex" style={{ height: 25 }}>
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
        </div>
        <TableComp {...{ session, selectedTable, selectedSchema }} />
      </div>
    </div>
  );
};

export default TableScreen;
