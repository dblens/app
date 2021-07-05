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

const parseResponseToSchema = (cols: ErdDataType[]) => {
  //todo
};

interface ErdContainerProps {
  session: DbSession;
}

const ErdContainer: React.FC<ErdContainerProps> = ({
  session,
}: ErdContainerProps) => {
  const [erdData, setErdData] = useState();
  useEffect(() => {
    session
      ?.getErdData()
      .then((list) => {
        const newRows = list?.rows?.map(({ table_name, table_schema }) => ({
          table_name,
          table_schema,
          columns: [{ name: 'columnD', type: 'integer' }],
          foreign_keys: [],
        }));
        console.log(newRows);
        setErdData(newRows as any);
      })
      // eslint-disable-next-line no-console
      .catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  console.log(erdData);

  return !!erdData ? (
    <div className="h-full w-full">
      <ERD schema={erdData} />
    </div>
  ) : (
    'Loading...'
  );
};

export default ErdContainer;
