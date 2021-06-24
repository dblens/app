import React, { useEffect, useState } from 'react';
import DbSession, { ColumnName, SortColumnType } from '../sessions/DbSession';
import Table from './molecules/Table';

const pageSizes = [10, 50, 100, 1000];

const TableComp = ({
  session,
  selectedSchema,
  selectedTable,
}: {
  session: DbSession;
  selectedSchema: string | undefined;
  selectedTable: string;
}) => {
  const [pagination, setPagination] = useState<{
    currentPage: number;
    currentPageSize: number;
    sortedColumns?: SortColumnType;
  }>({
    currentPage: 1,
    currentPageSize: pageSizes[1],
  });
  // const [currentPage, setCurrentPage] = useState({1});
  // const [currentPageSize, setCurrentPageSize] = useState<number>(pageSizes[0]);
  const [tableData, setTableData] = useState<{
    tableData?: Record<string, unknown>[];
    columnNames?: ColumnName[];
  }>({});

  useEffect(() => {
    const loadData = async () => {
      let tableRows;
      let columnNames;
      if (selectedSchema && selectedTable) {
        columnNames = await session.getColumnNames({
          schema: selectedSchema,
          table: selectedTable,
        });
        const { currentPage, currentPageSize } = pagination;

        tableRows = await session.getTableData({
          schema: selectedSchema,
          table: selectedTable,
          offset: 0,
          pagenumber: currentPage,
          size: currentPageSize,
          sortedColumns: pagination?.sortedColumns,
        });

        if (columnNames?.status === 'SUCCESS') {
          setTableData({
            tableData: tableRows?.rows,
            columnNames: columnNames?.rows?.map((i) => ({
              ...i,
              sort: pagination?.sortedColumns?.[i?.column_name],
            })),
          });
        }
      }
    };
    loadData();
  }, [selectedSchema, selectedTable, session, pagination]);

  const onSort = (newSort: SortColumnType) => {
    setPagination((currentPagination) => {
      let newVals = {};
      Object.entries({
        ...(currentPagination?.sortedColumns ?? {}),
        ...newSort,
      }).forEach(([c, s]) => {
        if (s === 'asc' || s === 'desc') newVals = { ...newVals, [c]: s };
      });

      return {
        ...currentPagination,
        sortedColumns: newVals,
      };
    });
  };

  if (!selectedTable)
    return (
      <div className="w-full h-full max-h-full max-w-full bg-gray-800 border-l border-gray-600 text-gray-300 text-sm overflow-auto overflow-x-auto height-adjust-25 flex justify-items-center items-center">
        <span className="h-full w-full text-center m-auto p-6">
          Please select a table from the sidebar
        </span>
      </div>
    );

  const { currentPage, currentPageSize } = pagination;
  const setCurrentPage = (page: number) =>
    setPagination((prevPage) => ({ ...prevPage, currentPage: page }));
  const setCurrentPageSize = (pageSize: number) =>
    setPagination({ currentPage: 1, currentPageSize: pageSize }); // onPageSizeChange => set pageNo to 1

  return (
    <div className="w-full h-full max-h-full max-w-full bg-gray-800 border-l border-gray-600 text-gray-300 text-sm overflow-auto overflow-x-auto height-adjust-25">
      {/* PaginationSection */}
      <div className="w-full bg-gray-800 flex border border-gray-700 header-fixed">
        <div
          className="w-full bg-gray-800 flex my-auto px-4 text-base font-normal truncate"
          style={{ height: 25 }}
        >
          {selectedSchema ?? ''}
          {' / '}
          {selectedTable ?? ''}
        </div>
        <div
          className="w-auto items-center flex justify-end rounded-md my-2"
          style={{ height: 25 }}
        >
          <button
            type="button"
            className="h-full pl-4 pr-4 text-gray-100"
            onClick={() =>
              setCurrentPage(currentPage > 1 ? Number(currentPage) - 1 : 1)
            }
          >
            {`<`}
          </button>
          <input
            type="number"
            min={1}
            className="h-full px-2 text-gray-100 bg-transparent focus:outline-none border-b-2 font-bold"
            style={{ width: 25 + 5 * `${currentPage}`.length }}
            value={currentPage}
            // onChange={({ e: { target: { value = currentPage } = {} } = {} }) =>
            onChange={(e) =>
              e.target.value && setCurrentPage(Number(e.target.value))
            }
            //   !Number.isNaN(Number(value)) && setCurrentPage(value)
            // }
          />
          <button
            type="button"
            className="h-full pl-4 pr-4 text-gray-100"
            onClick={() => setCurrentPage(Number(currentPage) + 1)}
          >
            {`>`}
          </button>
          <select
            className="pl-4 mr-2 bg-transparent focus:shadow-outline px-4"
            onChange={(e) =>
              setCurrentPageSize(Number.parseInt(e.target.value, 10))
            }
            value={currentPageSize}
          >
            {pageSizes.map((i) => (
              <option key={i} value={i}>
                {i} rows/page
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="table-wrapper">
        <Table
          {...{
            columnNames: tableData?.columnNames ?? [],
            tableData: tableData?.tableData ?? [],
            selectedSchema: selectedSchema ?? '',
            selectedTable: selectedTable ?? '',
            onSort,
          }}
        />
      </div>
    </div>
  );
};

export default TableComp;
