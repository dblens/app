import React, { useEffect, useState } from 'react';
import DbSession, { TableType } from '../sessions/DbSession';
import SideHeader from './atoms/SideHeader';
// import SqlExecuter from './SqlExecuter';
import SchemaList from './SchemaList';
import TableList from './TableList';
import TableComp from './TableComp';
import Tabs from './Tabs';

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
  }, [selectedTab]);

  useEffect(() => {
    if (selectedSchema) {
      session
        .getAllTables(selectedSchema)
        .then((tbls) => settables(tbls?.map((t, tx) => ({ ...t, index: tx }))))
        // eslint-disable-next-line no-console
        .catch(console.error);
    }
  }, [selectedSchema, session, selectedTab]);
  return (
    <div className="flex w-full h-full">
      {selectedTab === 'TABLE' && (
        <div className="h-full bg-gray-800" style={{ width: 300 }}>
          {/* {selectedTab === 'SQL' && <SideHeader title="Queries" />} */}
          {selectedTab === 'TABLE' && (
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
          )}
        </div>
      )}
      <div className="h-full w-full max-h-full">
        {/* Tabs Section */}
        {/* <Tabs /> */}
        {/* {selectedTab === 'SQL' && <SqlExecuter session={session} />} */}
        {selectedTab === 'TABLE' && (
          <TableComp
            {...{
              session,
              key: `${selectedSchema}_${selectedTable?.table_name}`,
              selectedTable: selectedTable?.table_name,
              selectedSchema,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default TableScreen;
