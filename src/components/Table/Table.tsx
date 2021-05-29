import React, { useMemo } from 'react';
import {
  useTable,
  useFlexLayout,
  useResizeColumns,
  useSortBy,
} from 'react-table';
import Cell from './Cell';
import Header from './Header';
import getIcon from '../Icons/Icons';
import { shortId } from '../utils/ui_utils';

const defaultColumn = {
  minWidth: 50,
  width: 150,
  maxWidth: 400,
  Cell,
  Header,
  sortType: 'alphanumericFalsyLast',
};

export default function Table({
  columns,
  data,
  dispatch: dataDispatch,
  skipReset,
}) {
  const sortTypes = useMemo(
    () => ({
      alphanumericFalsyLast(rowA, rowB, columnId, desc) {
        if (!rowA.values[columnId] && !rowB.values[columnId]) {
          return 0;
        }

        if (!rowA.values[columnId]) {
          return desc ? -1 : 1;
        }

        if (!rowB.values[columnId]) {
          return desc ? 1 : -1;
        }

        return Number.isNaN(rowA.values[columnId])
          ? rowA.values[columnId].localeCompare(rowB.values[columnId])
          : rowA.values[columnId] - rowB.values[columnId];
      },
    }),
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
        defaultColumn,
        dataDispatch,
        autoResetSortBy: !skipReset,
        autoResetFilters: !skipReset,
        autoResetRowState: !skipReset,
        sortTypes,
      },
      useFlexLayout,
      useResizeColumns,
      useSortBy
    );

  // function isTableResizing() {
  //   for (const headerGroup of headerGroups) {
  //     for (const column of headerGroup.headers) {
  //       if (column.isResizing) {
  //         return true;
  //       }
  //     }
  //   }

  //   return false;
  // }

  return (
    <>
      <div {...getTableProps()} className="border-t border-b">
        <div>
          {headerGroups.map((headerGroup) => (
            <div
              {...headerGroup.getHeaderGroupProps()}
              key={shortId()}
              className="tr"
            >
              {headerGroup.headers.map((column) => column.render('Header'))}
            </div>
          ))}
        </div>
        <div {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <div
                key={shortId()}
                {...row.getRowProps()}
                className="tr bg-gray-50 even:bg-gray-100"
              >
                {row.cells.map((cell) => (
                  <div
                    key={shortId()}
                    {...cell.getCellProps()}
                    className="whitespace-nowrap m-0 border-b border-r border-solid border-gray-300 relative"
                  >
                    {cell.render('Cell')}
                  </div>
                ))}
              </div>
            );
          })}
          <div
            className="tr bg-gray-200 p-2 flex items-center text-sm cursor-pointer hover:bg-gray-300"
            role="presentation"
            onClick={() => dataDispatch({ type: 'add_row' })}
            onKeyPress={() => dataDispatch({ type: 'add_row' })}
          >
            <span
              className="relative stroke-current"
              style={{ marginRight: 4 }}
            >
              {getIcon('plus')}
            </span>
            New
          </div>
        </div>
      </div>
    </>
  );
}
