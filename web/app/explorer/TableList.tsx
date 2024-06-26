import React, { useEffect } from 'react';
import { TableType } from '../sessions/DbSession';

interface TableListProps {
  tables: TableType[];
  selectedTable: TableType;
  setSelectedTable: React.Dispatch<React.SetStateAction<TableType>>;
}

const hasTableInCurrentSchema = (
  selected: string,
  tables: TableType[]
): boolean => {
  const found = tables?.find((t) => t.table_name === selected);
  if (found) return true;
  return false;
};

const TableList = ({
  tables,
  selectedTable,
  setSelectedTable,
}: TableListProps) => {
  useEffect(() => {
    if (
      !selectedTable ||
      !hasTableInCurrentSchema(selectedTable?.table_name, tables)
    )
      setSelectedTable(tables?.[0]);
  }, [selectedTable, setSelectedTable, tables]);
  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className="autoscroll h-full max-h-full flex flex-col text-gray-200 text-xs"
      style={{ minWidth: 250 }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowUp') {
          if (selectedTable?.index && selectedTable?.index >= 0)
            setSelectedTable(tables[selectedTable?.index - 1]);
        } else if (e.key === 'ArrowDown') {
          if (
            selectedTable?.index !== undefined &&
            tables?.length &&
            selectedTable?.index < tables?.length
          )
            setSelectedTable(tables[selectedTable?.index + 1]);
        }
      }}
    >
      {tables?.map((t) => (
        <button
          className={`pl-4 pr-4 text-left hover:bg-gray-600 hover:text-gray-200 cursor-pointer ${
            selectedTable?.table_name === t?.table_name &&
            'hover:bg-gray-600 bg-gray-600'
          }`}
          key={t?.table_name}
          onClick={() => setSelectedTable(t)}
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
