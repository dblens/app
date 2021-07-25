import React, { ReactText } from 'react';
import ReactTooltip from 'react-tooltip';

const TableCell = ({ value }: { value: unknown }) => {
  let displaytext;
  let toolTipValue;

  if (value instanceof Date) {
    displaytext = new Date(value).toLocaleString();
  } else if (typeof value === 'object') {
    toolTipValue = JSON.stringify(value, null, 2);
    displaytext = JSON.stringify(value);
  } else {
    displaytext = value;
    toolTipValue = value;
  }
  return (
    <td
      className="border-l border-b border-gray-600 px-2 break-all truncate"
      style={{ maxWidth: 100 }}
    >
      <span data-tip data-for={`btn-run-${value}`}>
        {(displaytext ?? '') as string}
      </span>
      {toolTipValue && (
        <ReactTooltip id={`btn-run-${value}`} type="dark">
          <pre className="font-mono" style={{ height: '40%' }}>
            {toolTipValue as ReactText}
          </pre>
        </ReactTooltip>
      )}
    </td>
  );
};

export default TableCell;
