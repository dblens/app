import React from 'react';

const TableCell = ({ value }: { value: unknown }) => {
  let displaytext;
  if (typeof value === 'object') {
    displaytext = JSON.stringify(value);
  } else {
    displaytext = value;
  }
  return <td>{(displaytext ?? '') as string}</td>;
};

export default TableCell;
