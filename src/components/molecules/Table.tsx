import React from 'react';
import { ColumnName } from '../../sessions/DbSession';
import TableCell from '../atoms/TableCell';

interface TableCompProps {
  columnNames: ColumnName[];
  tableData?: Record<string, unknown>[];
  selectedSchema: string;
  selectedTable: string;
}

const Table: React.FC<TableCompProps> = ({
  columnNames = [],
  tableData = [],
  selectedSchema = '',
  selectedTable = '',
}: TableCompProps) => {
  return (
    <table className="w-full border border-gray-600">
      <tr className="bg-gray-900">
        {columnNames?.map(
          ({ visible = true, column_name: colName = '' }) =>
            visible && (
              <th
                key={colName}
                className={`p-3 px-4 border bg-gray-900 border-gray-600 ${colName}`}
                style={{ minWidth: 200 }}
              >
                {colName}
              </th>
            )
        )}
      </tr>
      {tableData?.map((row, ix) => (
        <tr
          className="hover:bg-gray-700 hover:text-gray-100"
          key={(row?.id ?? `col_${ix}`) as string}
        >
          {columnNames?.map(({ visible = true, column_name }) => {
            const cell = row?.[column_name];
            return (
              visible && (
                <TableCell
                  key={`${selectedSchema}_${selectedTable}_${column_name}_${
                    typeof cell === 'object'
                      ? JSON.stringify(cell)
                      : (cell as string)
                  }`}
                  value={cell}
                />
              )
            );
          })}
        </tr>
      ))}
    </table>
  );
};
Table.defaultProps = {
  tableData: [],
};

export default Table;
