import React from 'react';
import ReactTooltip from 'react-tooltip';

interface TableCellProps {
  value: unknown;
  rowId: string;
  columnName: string;
}

const TableCell = ({ value, rowId, columnName }: TableCellProps) => {
  let displaytext: string;
  let toolTipValue: string | undefined;

  if (value instanceof Date) {
    displaytext = new Date(value).toLocaleString();
  } else if (typeof value === 'object' && value !== null) {
    const jsonString = JSON.stringify(value, null, 2);
    toolTipValue = jsonString;
    displaytext = JSON.stringify(value);
  } else if (typeof value === 'string') {
    displaytext = value;
    if (value.length > 50) {
      toolTipValue = value;
      displaytext = value.substring(0, 50) + '...';
    }
  } else {
    displaytext = String(value ?? '');
  }

  return (
    <td className="border-l border-b border-gray-600 px-2 text-white" style={{ minWidth: 200 }}>
      <div className="break-all truncate">
        <span data-tip data-for={`btn-run-${rowId}-${columnName}`}>
          {displaytext}
        </span>
      </div>

      {/* Keep tooltip for quick preview */}
      {toolTipValue && (
        <ReactTooltip id={`btn-run-${rowId}-${columnName}`} type="dark">
          <pre className="font-mono max-w-md max-h-32 overflow-auto">
            {toolTipValue}
          </pre>
        </ReactTooltip>
      )}
    </td>
  );
};

export default React.memo(TableCell);
