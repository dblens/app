"use client";
import React, { useState } from 'react';
import { useSidebar } from '../../contexts/SidebarContext';

interface DataFieldProps {
  label: string;
  value: unknown;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

const DataField: React.FC<DataFieldProps> = ({ label, value, isExpanded = false, onToggleExpand }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Failed to copy to clipboard:', err);
    }
  };

  const renderValue = () => {
    if (value === null) {
      return <span className="text-gray-500 italic">null</span>;
    }
    
    if (value === undefined) {
      return <span className="text-gray-500 italic">undefined</span>;
    }

    if (typeof value === 'boolean') {
      return <span className={`font-mono ${value ? 'text-green-400' : 'text-red-400'}`}>{String(value)}</span>;
    }

    if (typeof value === 'number') {
      return <span className="text-blue-400 font-mono">{value}</span>;
    }

    if (value instanceof Date) {
      return <span className="text-purple-400 font-mono">{value.toLocaleString()}</span>;
    }

    if (typeof value === 'object') {
      const jsonString = JSON.stringify(value, null, 2);
      const isLarge = jsonString.length > 100;
      
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">JSON Object</span>
            <button
              type="button"
              onClick={() => copyToClipboard(jsonString)}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
              title="Copy JSON"
            >
              {copied ? '✓ Copied' : '📋 Copy'}
            </button>
            {isLarge && onToggleExpand && (
              <button
                type="button"
                onClick={onToggleExpand}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                {isExpanded ? '▼ Collapse' : '▶ Expand'}
              </button>
            )}
          </div>
          <pre 
            className={`bg-gray-800 p-3 rounded text-sm font-mono text-gray-100 border border-gray-600 overflow-auto ${
              !isExpanded && isLarge ? 'max-h-32' : 'max-h-96'
            }`}
          >
            {jsonString}
          </pre>
        </div>
      );
    }

    if (typeof value === 'string') {
      const isLong = value.length > 100;
      
      return (
        <div className="space-y-2">
          {isLong && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Text ({value.length} chars)</span>
              <button
                type="button"
                onClick={() => copyToClipboard(value)}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                title="Copy text"
              >
                {copied ? '✓ Copied' : '📋 Copy'}
              </button>
              {onToggleExpand && (
                <button
                  type="button"
                  onClick={onToggleExpand}
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  {isExpanded ? '▼ Collapse' : '▶ Expand'}
                </button>
              )}
            </div>
          )}
          <div 
            className={`bg-gray-800 p-3 rounded text-sm text-gray-100 border border-gray-600 whitespace-pre-wrap ${
              !isExpanded && isLong ? 'max-h-32 overflow-hidden' : 'max-h-96 overflow-auto'
            }`}
          >
            {value}
          </div>
        </div>
      );
    }

    return <span className="font-mono text-gray-200">{String(value)}</span>;
  };

  return (
    <div className="border-b border-gray-700 pb-3 mb-3 last:border-b-0 last:pb-0 last:mb-0">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-blue-300">{label}</h4>
        <span className="text-xs text-gray-500 capitalize">{typeof value}</span>
      </div>
      {renderValue()}
    </div>
  );
};

const RightSidebar: React.FC = () => {
  const { 
    isRightSidebarOpen, 
    selectedRowData, 
    selectedRowIndex, 
    tableData,
    closeRightSidebar 
  } = useSidebar();

  const [expandedFields, setExpandedFields] = useState<Set<string>>(new Set());

  const toggleFieldExpansion = (fieldName: string) => {
    setExpandedFields(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fieldName)) {
        newSet.delete(fieldName);
      } else {
        newSet.add(fieldName);
      }
      return newSet;
    });
  };

  if (!isRightSidebarOpen || !selectedRowData) {
    return null;
  }

  const fields = Object.entries(selectedRowData);
  const totalRows = tableData.length;
  const currentRowNumber = selectedRowIndex !== null ? selectedRowIndex + 1 : 0;

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-gray-900 border-l border-gray-600 shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-white">Row Details</h3>
          <span className="text-sm text-gray-400">
            {currentRowNumber} of {totalRows}
          </span>
        </div>
        <button
          type="button"
          onClick={closeRightSidebar}
          className="text-gray-400 hover:text-white transition-colors p-1 rounded"
          title="Close sidebar (Esc)"
        >
          ✕
        </button>
      </div>

      {/* Navigation hint */}
      <div className="px-4 py-2 bg-gray-800 border-b border-gray-700">
        <p className="text-xs text-gray-400">
          Use ↑↓ arrow keys to navigate rows • Esc to close • Cmd+B to toggle left sidebar
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {fields.map(([key, value]) => (
          <DataField
            key={key}
            label={key}
            value={value}
            isExpanded={expandedFields.has(key)}
            onToggleExpand={() => toggleFieldExpansion(key)}
          />
        ))}
      </div>

      {/* Footer with row navigation */}
      <div className="p-4 border-t border-gray-700 bg-gray-800">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">
            Row {currentRowNumber} of {totalRows}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Navigate with ↑↓</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
