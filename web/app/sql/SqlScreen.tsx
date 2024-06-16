import React, { useState } from "react";
import SqlExecutor from "./SqlExecutor";
import SqlHistory from "./SqlHistory";
import SideHeader from "../components/atoms/SideHeader";
import PgSession from "../sessions/PgSession";

const SqlScreen = () => {
  const [selectedSql, setSelectedSql] = useState<string>("");
  const session = new PgSession("PG");
  return (
    <div className="flex w-full h-full text-gray-200">
      <div className="h-full bg-gray-800" style={{ minWidth: "20%" }}>
        <SideHeader title="Queries" />
        <SqlHistory setSelectedSql={setSelectedSql} />
      </div>
      <div className="border-l border-gray-600 sql-dataview-wrapper w-full">
        <SqlExecutor session={session} selectedSql={selectedSql} />
      </div>
    </div>
  );
};

export default SqlScreen;
