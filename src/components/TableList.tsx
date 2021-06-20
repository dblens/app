import React from 'react';
import { TableType } from '../sessions/DbSession';

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
    <div
      className="autoscroll h-full max-h-full flex flex-col text-gray-200 text-xs"
      style={{ minWidth: 250 }}
    >
      {tables?.map((t) => (
        <button
          className={`pl-4 pr-4 text-left hover:bg-gray-600 hover:text-gray-200 cursor-pointer ${
            selectedTable === t?.table_name && 'hover:bg-gray-600 bg-gray-600'
          }`}
          key={t?.table_name}
          onClick={() => setSelectedTable(t?.table_name)}
          type="button"
        >
          {t?.table_name}
        </button>
      ))}
      {!tables?.length && (
        <span className="w-full text-center p-2">No tables found</span>
      )}
    </div>
  );
};

export default TableList;
