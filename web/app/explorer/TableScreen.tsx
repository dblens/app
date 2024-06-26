import React, { useEffect, useState } from "react";
import DbSession, { TableType } from "../sessions/DbSession";
// import SqlExecuter from './SqlExecuter';
import SchemaList from "./SchemaList";
import TableList from "./TableList";
import TableComp from "./TableComp";
import SideHeader from "../components/atoms/SideHeader";

const TableScreen = ({ session }: { session: DbSession }) => {
  const [schemaList, setSchemaList] = useState<string[]>([]);
  const [selectedSchema, setSelectedSchema] = useState<string>();

  const [tables, settables] = useState<TableType[]>([]);
  const [selectedTable, setSelectedTable] = useState<TableType>();

  useEffect(() => {
    session
      ?.getDBSchemas()
      .then((list) => {
        if (list?.[0]) setSelectedSchema(list[0]);
        return setSchemaList(list);
      })
      // eslint-disable-next-line no-console
      .catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedSchema) {
      session
        .getAllTables(selectedSchema)
        .then((tbls) => settables(tbls?.map((t, tx) => ({ ...t, index: tx }))))
        // eslint-disable-next-line no-console
        .catch(console.error);
    }
  }, [selectedSchema, session]);
  return (
    <div className="flex w-full h-full">
      <div className="h-full bg-gray-800" style={{ width: 300 }}>
        {/* {selectedTab === 'SQL' && <SideHeader title="Queries" />} */}
        <>
          <SideHeader title="SCHEMAS" />
          <SchemaList
            {...{ schemas: schemaList, selectedSchema, setSelectedSchema }}
          />

          <SideHeader title="TABLES" />
          {tables && (
            <TableList
              {...{
                tables,
                selectedTable,
                setSelectedTable,
              }}
            />
          )}
        </>
      </div>
      <div className="h-full w-full max-h-full">
        {/* Tabs Section */}
        {/* <Tabs /> */}
        <TableComp
          {...{
            session,
            key: `${selectedSchema}_${selectedTable?.table_name}`,
            selectedTable: selectedTable?.table_name,
            selectedSchema,
          }}
        />
      </div>
    </div>
  );
};

export default TableScreen;
