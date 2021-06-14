import React from 'react';

const TableCell = ({ value }: { value: unknown }) => {
  let displaytext;
  if (typeof value === 'object') {
    displaytext = JSON.stringify(value);
  } else {
    displaytext = value;
  }
  return (
    <td className="border-l border-b border-gray-600 px-2">
      {(displaytext ?? '') as string}
    </td>
  );
};

export default TableCell;
