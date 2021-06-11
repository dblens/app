import React, { useEffect, useState } from 'react';
import DbSession, { TableType } from '../sessions/DbSession';

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
        className="w-full h-6 pl-3 pr-6 text-base placeholder-gray-600 border rounded-lg appearance-none focus:shadow-outline"
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
    <div className=" overflow-auto h-full flex flex-col">
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
  selectedSchema: string;
  selectedTable: string;
}) => {
  useEffect(() => {
    session
      .getTableData(selectedSchema, selectedTable, 0, 10)
      .then(console.log)
      .catch(console.error);
  }, [selectedSchema, selectedTable]);
  return (
    <div className="flex-1 m-auto w-full text-center">
      <span role="img" aria-label="under construction label">
        🚧 Under Construction
      </span>
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
    <div className="flex w-ful">
      <div className="h-full bg-gray-700 w-60">
        <div className="m-4 pt-2 flex">
          <span className="text-gray-200 pr-2">Schema</span>
          <Schemalist
            {...{ schemas: schemaList, selectedSchema, setSelectedSchema }}
          />
        </div>
        <h2 className="text-gray-200 pl-2 font-bold text-xs border-gray-400 border">
          TABLES
        </h2>
        <TableList {...{ tables, selectedTable, setSelectedTable }} />
      </div>
      <TableComp
        {...{ session, selectedTable, selectedSchema, selectedTable }}
      />
    </div>
  );
};

export default TableScreen;
