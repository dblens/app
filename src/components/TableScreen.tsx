import React, { useEffect, useState } from 'react';
import DbSession, { TableType } from '../sessions/DbSession';
import SideHeader from './atoms/SideHeader';
import SqlExecuter from './SqlExecuter';
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
  const [selectedTable, setSelectedTable] = useState<string>();

  useEffect(() => {
    session
      ?.getDBSchemas()
      .then((list) => {
        if (list?.[0]) setSelectedSchema(list[0]);
        return setSchemaList(list);
      })
      .catch(console.error);
  }, [selectedTab]);

  useEffect(() => {
    if (selectedSchema) {
      session.getAllTables(selectedSchema).then(settables).catch(console.error);
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
        {/* <Tabs /> */}
        {selectedTab === 'SQL' && <SqlExecuter session={session} />}
        {selectedTab === 'TABLE' && (
          <TableComp
            {...{
              session,
              key: `${selectedSchema}_${selectedTable}`,
              selectedTable,
              selectedSchema,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default TableScreen;
