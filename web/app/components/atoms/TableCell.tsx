import React, { ReactText, useState } from 'react';
import ReactTooltip from 'react-tooltip';

interface TableCellProps {
  value: unknown;
  rowId: string;
  columnName: string;
}

const TableCell = ({ value, rowId, columnName }: TableCellProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  let displaytext;
  let toolTipValue;
  let shouldShowExpandButton = false;
  let fullContent = '';

  if (value instanceof Date) {
    displaytext = new Date(value).toLocaleString();
  } else if (typeof value === 'object' && value !== null) {
    const jsonString = JSON.stringify(value, null, 2);
    toolTipValue = jsonString;
    displaytext = JSON.stringify(value);
    fullContent = jsonString;
    shouldShowExpandButton = true;
  } else if (typeof value === 'string') {
    displaytext = value;
    if (value.length > 50) {
      toolTipValue = value;
      fullContent = value;
      shouldShowExpandButton = true;
      displaytext = value.substring(0, 50) + '...';
    }
  } else {
    displaytext = value;
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fullContent);
    } catch (err) {
      console.warn('Failed to copy to clipboard:', err);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleExpanded();
    }
  };

  return (
    <td className="border-l border-b border-gray-600 px-2 text-white relative">
      <div className="flex items-start justify-between min-h-[24px]">
        <div className="flex-1 min-w-0">
          {!isExpanded ? (
            <div className="break-all">
              {shouldShowExpandButton ? (
                <span className="truncate block" style={{ maxWidth: '200px' }}>
                  {(displaytext ?? '') as string}
                </span>
              ) : (
                <span>{(displaytext ?? '') as string}</span>
              )}
            </div>
          ) : (
            <div className="mt-1">
              <div className="p-3 bg-gray-700 rounded-md border border-gray-500 transition-all duration-200 ease-in-out">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs text-gray-300 font-medium">
                    {typeof value === 'object' ? 'JSON Object' : 'Full Content'}
                  </span>
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors duration-150"
                    title="Copy to clipboard"
                  >
                    📋 Copy
                  </button>
                </div>
                <pre className="whitespace-pre-wrap text-sm text-gray-100 font-mono max-h-64 overflow-y-auto">
                  {fullContent}
                </pre>
              </div>
            </div>
          )}
        </div>

        {shouldShowExpandButton && (
          <button
            type="button"
            onClick={toggleExpanded}
            onKeyDown={handleKeyDown}
            className="ml-2 text-blue-400 hover:text-blue-300 transition-colors duration-150 flex-shrink-0 p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            title={isExpanded ? 'Collapse content' : 'Expand content'}
            aria-label={isExpanded ? 'Collapse content' : 'Expand content'}
          >
            {isExpanded ? '−' : '+'}
          </button>
        )}
      </div>

      {/* Keep the original tooltip for backward compatibility */}
      {toolTipValue && !isExpanded && (
        <>
          <span data-tip data-for={`btn-run-${rowId}-${columnName}`} className="sr-only">
            Tooltip trigger
          </span>
          <ReactTooltip id={`btn-run-${rowId}-${columnName}`} type="dark">
            <pre className="font-mono" style={{ height: '40%' }}>
              {toolTipValue as ReactText}
            </pre>
          </ReactTooltip>
        </>
      )}
    </td>
  );
};

export default React.memo(TableCell);
