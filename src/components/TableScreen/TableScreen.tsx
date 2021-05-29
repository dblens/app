import React, { useEffect, useReducer } from 'react';
import Table from '../Table/Table';
import { shortId, randomColor } from '../utils/ui_utils';

function fakeData() {
  const data = [];
  const options = [];
  for (let i = 0; i < 10; i += 1) {
    const row = {
      ID: 1,
      firstName: 'temp_firstname',
      lastName: 'temp_lastname',
      email: 'temp_email@example.com',
      age: 1 + i * i + i,
      district: 'example_address',
    };
    options.push({ label: row.district, backgroundColor: randomColor() });

    data.push(row);
  }

  const columns = [
    {
      id: 'firstName',
      label: 'First Name',
      accessor: 'firstName',
      minWidth: 100,
      dataType: 'text',
      options: [],
    },
    {
      id: 'lastName',
      label: 'Last Name',
      accessor: 'lastName',
      minWidth: 100,
      dataType: 'text',
      options: [],
    },
    {
      id: 'age',
      label: 'Age',
      accessor: 'age',
      width: 80,
      dataType: 'number',
      options: [],
    },
    {
      id: 'email',
      label: 'E-Mail',
      accessor: 'email',
      width: 300,
      dataType: 'text',
      options: [],
    },
    {
      id: 'district',
      label: 'District',
      accessor: 'district',
      dataType: 'select',
      width: 200,
      options,
    },
    {
      id: 999999,
      width: 20,
      label: '+',
      disableResizing: true,
      dataType: 'null',
    },
  ];

  return { columns, data, skipReset: false };
}

function reducer(state, action) {
  switch (action.type) {
    case 'add_option_to_column': {
      const optionIndex = state.columns.findIndex(
        (column) => column.id === action.columnId
      );
      return {
        ...state,
        skipReset: true,
        columns: [
          ...state.columns.slice(0, optionIndex),
          {
            ...state.columns[optionIndex],
            options: [
              ...state.columns[optionIndex].options,
              { label: action.option, backgroundColor: action.backgroundColor },
            ],
          },
          ...state.columns.slice(optionIndex + 1, state.columns.length),
        ],
      };
    }
    case 'add_row':
      return {
        ...state,
        skipReset: true,
        data: [...state.data, {}],
      };
    case 'update_column_type': {
      const typeIndex = state.columns.findIndex(
        (column) => column.id === action.columnId
      );
      switch (action.dataType) {
        case 'number':
          if (state.columns[typeIndex].dataType === 'number') {
            return state;
          }
          return {
            ...state,
            columns: [
              ...state.columns.slice(0, typeIndex),
              { ...state.columns[typeIndex], dataType: action.dataType },
              ...state.columns.slice(typeIndex + 1, state.columns.length),
            ],
            data: state.data.map((row) => ({
              ...row,
              [action.columnId]: Number.isNaN(row[action.columnId])
                ? ''
                : Number.parseInt(row[action.columnId], 10),
            })),
          };

        case 'select': {
          if (state.columns[typeIndex].dataType === 'select') {
            return {
              ...state,
              columns: [
                ...state.columns.slice(0, typeIndex),
                { ...state.columns[typeIndex], dataType: action.dataType },
                ...state.columns.slice(typeIndex + 1, state.columns.length),
              ],
              skipReset: true,
            };
          }
          const options = [];
          state.data.forEach((row) => {
            if (row[action.columnId]) {
              options.push({
                label: row[action.columnId],
                backgroundColor: randomColor(),
              });
            }
          });
          return {
            ...state,
            columns: [
              ...state.columns.slice(0, typeIndex),
              {
                ...state.columns[typeIndex],
                dataType: action.dataType,
                options: [...state.columns[typeIndex].options, ...options],
              },
              ...state.columns.slice(typeIndex + 1, state.columns.length),
            ],
            skipReset: true,
          };
        }
        case 'text':
          if (state.columns[typeIndex].dataType === 'text') {
            return state;
          }
          if (state.columns[typeIndex].dataType === 'select') {
            return {
              ...state,
              skipReset: true,
              columns: [
                ...state.columns.slice(0, typeIndex),
                { ...state.columns[typeIndex], dataType: action.dataType },
                ...state.columns.slice(typeIndex + 1, state.columns.length),
              ],
            };
          }
          return {
            ...state,
            skipReset: true,
            columns: [
              ...state.columns.slice(0, typeIndex),
              { ...state.columns[typeIndex], dataType: action.dataType },
              ...state.columns.slice(typeIndex + 1, state.columns.length),
            ],
            data: state.data.map((row) => ({
              ...row,
              [action.columnId]: `${row[action.columnId]}`,
            })),
          };

        default:
          return state;
      }
    }
    case 'update_column_header': {
      const index = state.columns.findIndex(
        (column) => column.id === action.columnId
      );
      return {
        ...state,
        skipReset: true,
        columns: [
          ...state.columns.slice(0, index),
          { ...state.columns[index], label: action.label },
          ...state.columns.slice(index + 1, state.columns.length),
        ],
      };
    }
    case 'update_cell':
      return {
        ...state,
        skipReset: true,
        data: state.data.map((row, ridx) => {
          if (ridx === action.rowIndex) {
            return {
              ...state.data[action.rowIndex],
              [action.columnId]: action.value,
            };
          }
          return row;
        }),
      };
    case 'add_column_to_left': {
      const leftIndex = state.columns.findIndex(
        (column) => column.id === action.columnId
      );
      const leftId = shortId();
      return {
        ...state,
        skipReset: true,
        columns: [
          ...state.columns.slice(0, leftIndex),
          {
            id: leftId,
            label: 'Column',
            accessor: leftId,
            dataType: 'text',
            created: action.focus && true,
            options: [],
          },
          ...state.columns.slice(leftIndex, state.columns.length),
        ],
      };
    }
    case 'add_column_to_right': {
      const rightIndex = state.columns.findIndex(
        (column) => column.id === action.columnId
      );
      const rightId = shortId();
      return {
        ...state,
        skipReset: true,
        columns: [
          ...state.columns.slice(0, rightIndex + 1),
          {
            id: rightId,
            label: 'Column',
            accessor: rightId,
            dataType: 'text',
            created: action.focus && true,
            options: [],
          },
          ...state.columns.slice(rightIndex + 1, state.columns.length),
        ],
      };
    }
    case 'delete_column': {
      const deleteIndex = state.columns.findIndex(
        (column) => column.id === action.columnId
      );
      return {
        ...state,
        skipReset: true,
        columns: [
          ...state.columns.slice(0, deleteIndex),
          ...state.columns.slice(deleteIndex + 1, state.columns.length),
        ],
      };
    }
    case 'enable_reset':
      return {
        ...state,
        skipReset: false,
      };
    default:
      return state;
  }
}

function TableScreen() {
  const [state, dispatch] = useReducer(reducer, fakeData());

  useEffect(() => {
    dispatch({ type: 'enable_reset' });
  }, [state.data, state.columns]);

  return (
    <div className="w-screen h-screen overflow-x-hidden">
      <div
        className="flex items-center justify-center flex-col"
        style={{
          height: 120,
        }}
      >
        <h1 style={{ color: '#424242' }}>Table View</h1>
      </div>
      <div className="overflow-auto flex">
        <div
          className="flex-auto p-4 ml-auto mr-auto"
          style={{
            maxWidth: 1000,
          }}
        >
          <Table
            columns={state.columns}
            data={state.data}
            dispatch={dispatch}
            skipReset={state.skipReset}
          />
        </div>
      </div>
    </div>
  );
}

export default TableScreen;
