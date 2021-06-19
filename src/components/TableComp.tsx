import React, { useEffect, useState } from 'react';
import DbSession, { ColumnName } from '../sessions/DbSession';
import Table from './molecules/Table';

const TableComp = ({
  session,
  selectedSchema,
  selectedTable,
}: {
  session: DbSession;
  selectedSchema: string | undefined;
  selectedTable: string;
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [tableData, setTableData] = useState<{
    tableData?: Record<string, unknown>[];
    columnNames?: ColumnName[];
  }>({});

  useEffect(() => {
    const loadData = async () => {
      let tableRows;
      let columnNames;
      if (selectedSchema) {
        columnNames = await session.getColumnNames({
          schema: selectedSchema,
          table: selectedTable,
        });

        tableRows = await session.getTableData({
          schema: selectedSchema,
          table: selectedTable,
          offset: 0,
          pagenumber: currentPage,
          size: 50,
        });
        if (columnNames?.status === 'SUCCESS') {
          setTableData({
            tableData: tableRows?.rows,
            columnNames: columnNames?.rows,
          });
        }
      }
    };
    loadData();
  }, [selectedSchema, selectedTable, session, currentPage]);

  useEffect(() => {
    console.log({ tableData });
  }, [tableData]);

  return (
    <div className="w-full h-full max-h-full max-w-full bg-gray-800 border-l border-gray-600 text-gray-300 text-sm overflow-auto overflow-x-auto height-adjust-25">
      {/* PaginationSection */}
      <div className="w-full bg-gray-800 flex border border-gray-700 header-fixed">
        <div
          className="w-full bg-gray-800 flex my-auto px-4 text-base font-normal"
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
            onClick={() => setCurrentPage((p) => (p > 1 ? Number(p) - 1 : 1))}
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
            onClick={() => setCurrentPage((p) => Number(p) + 1)}
          >
            {`>`}
          </button>
        </div>
      </div>
      <div className="table-wrapper">
        <Table
          {...{
            columnNames: tableData?.columnNames ?? [],
            tableData: tableData?.tableData ?? [],
            selectedSchema: selectedSchema ?? '',
            selectedTable: selectedTable ?? '',
          }}
        />
      </div>
    </div>
  );
};

export default TableComp;
