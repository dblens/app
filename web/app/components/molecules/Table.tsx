import React from "react";
import { ColumnName, SortColumnType, SortType } from "../../sessions/DbSession";
import SortIcon from "../atoms/SortIcon";
import TableCell from "../atoms/TableCell";

interface TableCompProps {
  columnNames: ColumnName[];
  tableData?: Record<string, unknown>[];
  selectedSchema?: string;
  selectedTable?: string;
  onSort?: (sort: SortColumnType) => void;
}

const Table: React.FC<TableCompProps> = ({
  columnNames = [],
  tableData = [],
  selectedSchema = "",
  selectedTable = "",
  // eslint-disable-next-line no-console
  onSort = console.warn,
}: TableCompProps) => {
  const onSortColumn = (ix: number) => {
    const column = columnNames[ix];
    let newSort: SortType;
    if (!column?.sort) newSort = "asc";
    else if (column?.sort === "asc") newSort = "desc";
    else newSort = "none";
    onSort({ [column?.column_name]: newSort });
  };

  return (
    <div className="">
      <table className="border border-gray-600 h-full w-full table-fixed overflow-x-scroll">
        <thead>
          <tr className="bg-gray-900">
            {columnNames?.map(
              ({ visible = true, column_name: colName = "", sort }, index) =>
                visible && (
                  <th
                    key={colName}
                    className={`border bg-gray-900 border-gray-600 ${colName} ${
                      !sort && "text-transparent"
                    } hover:text-gray-200 cursor-pointer`}
                    style={{
                      minWidth: 200,
                      width: 200,
                      position: 'sticky',
                      top: 0,
                      zIndex: 10,
                    }} // Fixed minimum width and sticky position
                    onClick={() => onSortColumn(index)}
                  >
                    <div
                      className={`relative p-1 ${sort ? "text-blue-600" : ""}`}
                    >
                      <SortIcon mode={sort} />
                    </div>
                    <div className="w-full p-3 px-4 text-gray-200">
                      {colName}
                    </div>
                  </th>
                )
            )}
          </tr>
        </thead>
        <tbody>
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
                        typeof cell === "object"
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
        </tbody>
      </table>
    </div>
  );
};
Table.defaultProps = {
  tableData: [],
};

export default Table;
