import React, { useEffect, useState } from 'react';
import DbSession, { ErdDataType } from '../../sessions/DbSession';
import ERD from './ERD';

type ColumnType = { name: string; type: string };
type ForeignKeyType = {
  toTable?: string;
  toTableSchema?: string;
  fromColumn?: string;
  fromColumnType?: string;
  toColumn?: string;
  toColumnType?: string;
};

type TableType = {
  table_name: string;
  table_schema: string;
  columns: ColumnType[];
  primary_keys?: string[];
  foreign_keys: ForeignKeyType[];
};

const schema: TableType[] = [
  {
    table_name: 'table1',
    table_schema: 'hr',
    columns: [
      { name: 'columnA', type: 'integer' },
      { name: 'columnB', type: 'integer' },
      { name: 'columnC', type: 'integer' },
      { name: 'columnD', type: 'integer' },
    ],
    primary_keys: ['columnA'],
    foreign_keys: [
      {
        toTable: 'table2',
        toTableSchema: 'hr',
        fromColumn: 'columnA',
        fromColumnType: 'many',
        toColumn: 'columnC',
        toColumnType: 'zero',
      },
      {
        toTable: 'table3',
        toTableSchema: 'hr',
        fromColumn: 'columnB',
        toColumn: 'columnD',
      },
      {
        toTable: 'table4',
        toTableSchema: 'hr',
        fromColumn: 'columnC',
        toColumn: 'columnD',
      },
    ],
  },
  {
    table_name: 'table2',
    columns: [
      { name: 'columnC', type: 'integer' },
      { name: 'columnD', type: 'varchar' },
    ],
    foreign_keys: [
      {
        toTable: 'table1',
        toTableSchema: 'hr',
        fromColumn: 'columnC',
        toColumn: 'columnC',
      },
    ],
    table_schema: 'hr',
  },
  {
    table_name: 'table3',
    columns: [
      { name: 'columnD', type: 'integer' },
      { name: 'columnF', type: 'varchar' },
    ],
    foreign_keys: [],
    table_schema: 'hr',
  },
  {
    table_name: 'table4',
    columns: [
      { name: 'columnD', type: 'integer' },
      { name: 'columnF', type: 'varchar' },
    ],
    foreign_keys: [
      {
        toTable: 'table5',
        toTableSchema: 'hr',
        fromColumn: 'columnD',
        toColumn: 'columnD',
      },
    ],
    table_schema: 'hr',
  },
  {
    table_name: 'table5',
    columns: [
      { name: 'columnD', type: 'integer' },
      { name: 'columnF', type: 'varchar' },
    ],
    foreign_keys: [
      {
        toTable: 'table4',
        toTableSchema: 'hr',
        fromColumn: 'columnD',
        toColumn: 'columnD',
      },
    ],
    table_schema: 'hr',
  },
  {
    table_name: 'table6',
    columns: [
      { name: 'columnD', type: 'integer' },
      { name: 'columnF', type: 'varchar' },
    ],
    foreign_keys: [
      {
        toTable: 'table4',
        toTableSchema: 'hr',
        fromColumn: 'columnD',
        toColumn: 'columnD',
      },
    ],
    table_schema: 'hr',
  },
  {
    table_name: 'table7',
    columns: [
      { name: 'columnD', type: 'integer' },
      { name: 'columnF', type: 'varchar' },
    ],
    foreign_keys: [
      {
        toTable: 'table4',
        toTableSchema: 'hr',
        fromColumn: 'columnD',
        toColumn: 'columnD',
      },
    ],
    table_schema: 'hr',
  },
  {
    table_name: 'table8',
    columns: [
      { name: 'columnD', type: 'integer' },
      { name: 'columnF', type: 'varchar' },
    ],
    foreign_keys: [
      {
        toTable: 'table1',
        toTableSchema: 'hr',
        fromColumn: 'columnD',
        toColumn: 'columnD',
      },
    ],
    table_schema: 'hr',
  },
  {
    table_name: 'table9',
    columns: [
      { name: 'columnD', type: 'integer' },
      { name: 'columnF', type: 'varchar' },
    ],
    foreign_keys: [
      {
        toTable: 'table1',
        toTableSchema: 'hr',
        fromColumn: 'columnD',
        toColumn: 'columnD',
      },
    ],
    table_schema: 'hr',
  },
  {
    table_name: 'table10',
    columns: [
      { name: 'columnD', type: 'integer' },
      { name: 'columnF', type: 'varchar' },
    ],
    foreign_keys: [
      {
        toTable: 'table1',
        toTableSchema: 'hr',
        fromColumn: 'columnD',
        toColumn: 'columnD',
      },
    ],
    table_schema: 'hr',
  },
  {
    table_name: 'table11',
    columns: [
      { name: 'columnD', type: 'integer' },
      { name: 'columnF', type: 'varchar' },
    ],
    foreign_keys: [
      {
        toTable: 'table1',
        toTableSchema: 'hr',
        fromColumn: 'columnD',
        toColumn: 'columnD',
      },
    ],
    table_schema: 'hr',
  },
  {
    table_name: 'table12',
    columns: [
      { name: 'columnD', type: 'integer' },
      { name: 'columnF', type: 'varchar' },
    ],
    foreign_keys: [
      {
        toTable: 'table1',
        toTableSchema: 'hr',
        fromColumn: 'columnD',
        toColumn: 'columnD',
      },
    ],
    table_schema: 'hr',
  },
  {
    table_name: 'table13',
    columns: [
      { name: 'columnD', type: 'integer' },
      { name: 'columnF', type: 'varchar' },
    ],
    foreign_keys: [
      {
        toTable: 'table1',
        toTableSchema: 'hr',
        fromColumn: 'columnD',
        toColumn: 'columnD',
      },
    ],
    table_schema: 'hr',
  },
  {
    table_name: 'table14',
    columns: [
      { name: 'columnD', type: 'integer' },
      { name: 'columnF', type: 'varchar' },
    ],
    foreign_keys: [
      {
        toTable: 'table1',
        toTableSchema: 'hr',
        fromColumn: 'columnD',
        toColumn: 'columnD',
      },
    ],
    table_schema: 'hr',
  },
  {
    table_name: 'table15',
    columns: [
      { name: 'columnD', type: 'integer' },
      { name: 'columnF', type: 'varchar' },
    ],
    foreign_keys: [
      {
        toTable: 'table1',
        toTableSchema: 'hr',
        fromColumn: 'columnD',
        toColumn: 'columnD',
      },
    ],
    table_schema: 'hr',
  },
  {
    table_name: 'table16',
    columns: [{ name: 'columnD', type: 'integer' }],
    foreign_keys: [],
    table_schema: 'hr',
  },
];

const mergeCols = (
  existingCols: ColumnType[],
  newColName: string
): ColumnType[] => {
  const newCol: ColumnType = { name: newColName, type: 'integer' };
  if (!existingCols || existingCols?.length === 0) return [newCol];
  const found = existingCols.findIndex((i) => i.name === newColName);
  if (found >= 0) {
    return existingCols;
  }
  return [...existingCols, newCol];
};

const parseResponseToSchema = (cols: ErdDataType[]): TableType[] => {
  const result: TableType[] = [];
  // const resultMapper = {};
  cols.forEach((i: ErdDataType) => {
    const found = result.findIndex(
      (j) => j.table_schema === i.table_schema && j.table_name === i.table_name
    );
    // debugger;
    if (found >= 0) {
      let item = { ...result[found] };
      item = {
        table_name: i.table_name,
        columns: mergeCols(item?.columns, i.column_name),
        foreign_keys: [
          ...(item?.foreign_keys ?? []),
          {
            toTable: i.foreign_table_name,
            toTableSchema: i.foreign_table_schema,
            fromColumn: i.column_name,
            fromColumnType: 'integer',
            toColumn: i.foreign_column_name,
            toColumnType: 'integer',
          },
        ],
        table_schema: i.table_schema,
      };
      result[found] = item;
    } else {
      result.push({
        table_name: i.table_name,
        columns: [{ name: i.column_name, type: 'integer' }],
        foreign_keys: [
          {
            toTable: i.foreign_table_name,
            toTableSchema: i.foreign_table_schema,
            fromColumn: i.column_name,
            fromColumnType: 'integer',
            toColumn: i.foreign_column_name,
            toColumnType: 'integer',
          },
        ],
        table_schema: i.table_schema,
      });
    }
  });
  console.log(result);
  return result;
};

interface ErdContainerProps {
  session: DbSession;
}

const ErdContainer: React.FC<ErdContainerProps> = ({
  session,
}: ErdContainerProps) => {
  const [erdData, setErdData] = useState<TableType[]>();
  useEffect(() => {
    session
      ?.getErdData()
      .then((list) => {
        // const newRows = list?.rows?.map(({ table_name, table_schema }) => ({
        //   table_name,
        //   table_schema,
        //   columns: [{ name: 'columnD', type: 'integer' }],
        //   foreign_keys: [],
        // }));
        return setErdData(parseResponseToSchema(list?.rows as ErdDataType[]));
      })
      // eslint-disable-next-line no-console
      .catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return erdData ? (
    <div className="h-full w-full">
      <ERD schema={erdData} />
    </div>
  ) : (
    <div className="h-full w-full m-auto bg-gray-800 text-gray-300 flex justify-center items-center">
      <span>Loading...</span>
    </div>
  );
};

export default ErdContainer;
