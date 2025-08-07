import React, { useEffect, useState } from "react";
import DbSession, { TableType } from "../sessions/DbSession";
// import SqlExecuter from './SqlExecuter';
import SchemaList from "./SchemaList";
import TableList from "./TableList";
import TableComp from "./TableComp";
import SideHeader from "../components/atoms/SideHeader";
import { SidebarProvider, useSidebar } from "../contexts/SidebarContext";
import RightSidebar from "../components/organisms/RightSidebar";

const TableScreenContent = ({ session }: { session: DbSession }) => {
  const [schemaList, setSchemaList] = useState<string[]>([]);
  const [selectedSchema, setSelectedSchema] = useState<string>();

  const [tables, settables] = useState<TableType[]>([]);
  const [selectedTable, setSelectedTable] = useState<TableType>({} as any);

  const { isLeftSidebarOpen, isRightSidebarOpen } = useSidebar();

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
    <div className="flex w-full h-full relative">
      {/* Left Sidebar */}
      {isLeftSidebarOpen && (
        <div className="h-full bg-gray-800 flex-shrink-0" style={{ width: 300 }}>
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
        </div>
      )}

      {/* Main Content */}
      <div
        className="h-full flex-1 max-h-full"
        style={{
          marginRight: isRightSidebarOpen ? '384px' : '0' // 384px = 24rem (w-96)
        }}
      >
        <TableComp
          {...{
            session,
            key: `${selectedSchema}_${selectedTable?.table_name}`,
            selectedTable: selectedTable?.table_name,
            selectedSchema,
          }}
        />
      </div>

      {/* Right Sidebar */}
      <RightSidebar />
    </div>
  );
};

const TableScreen = ({ session }: { session: DbSession }) => {
  return (
    <SidebarProvider>
      <TableScreenContent session={session} />
    </SidebarProvider>
  );
};

export default TableScreen;
