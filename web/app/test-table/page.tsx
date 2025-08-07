"use client";
import React from "react";
import Table from "../components/molecules/Table";
import { ColumnName } from "../sessions/DbSession";

import RightSidebar from "../components/organisms/RightSidebar";

function TestTablePageContent() {
  // Test data with various data types
  const testData = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      short_text: "Hello",
      long_text: "This is a very long text that should trigger the expandable functionality. It contains more than 50 characters and should show a truncated version with an expand button.",
      json_object: {
        user: {
          id: 123,
          profile: {
            name: "John Doe",
            preferences: {
              theme: "dark",
              notifications: true,
              languages: ["en", "es", "fr"]
            }
          },
          metadata: {
            created_at: "2023-01-01T00:00:00Z",
            last_login: "2024-08-07T07:00:00Z"
          }
        }
      },
      array_data: ["apple", "banana", "cherry", "date", "elderberry"],
      date_field: new Date("2024-08-07T07:00:00Z"),
      number_field: 42,
      boolean_field: true,
      null_field: null
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      short_text: "Hi",
      long_text: "Another example of long text content that demonstrates the expandable table cell functionality. This text is intentionally long to test the truncation and expansion features.",
      json_object: {
        settings: {
          display: {
            resolution: "1920x1080",
            color_depth: 24,
            refresh_rate: 60
          },
          audio: {
            volume: 75,
            muted: false,
            output_device: "speakers"
          }
        }
      },
      array_data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      date_field: new Date("2024-07-15T14:30:00Z"),
      number_field: 3.14159,
      boolean_field: false,
      null_field: null
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob.johnson@example.com",
      short_text: "Hey",
      long_text: "Short text",
      json_object: {
        complex_nested: {
          level1: {
            level2: {
              level3: {
                level4: {
                  deep_value: "This is deeply nested",
                  array_in_deep: [
                    { item: 1, description: "First item" },
                    { item: 2, description: "Second item" }
                  ]
                }
              }
            }
          }
        }
      },
      array_data: [],
      date_field: new Date(),
      number_field: 0,
      boolean_field: true,
      null_field: null
    }
  ];

  const columnNames: ColumnName[] = [
    { column_name: "id", visible: true },
    { column_name: "name", visible: true },
    { column_name: "email", visible: true },
    { column_name: "short_text", visible: true },
    { column_name: "long_text", visible: true },
    { column_name: "json_object", visible: true },
    { column_name: "array_data", visible: true },
    { column_name: "date_field", visible: true },
    { column_name: "number_field", visible: true },
    { column_name: "boolean_field", visible: true },
    { column_name: "null_field", visible: true }
  ];

  return (
    <div className="min-h-screen bg-gray-800 p-8 relative">
      <div className="max-w-full mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">
          VS Code-Style Sidebar Table Test
        </h1>

        <div className="mb-6 text-gray-300">
          <h2 className="text-xl font-semibold mb-3">Test Features:</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>✅ <strong>Row Selection:</strong> Click any row to view details in right sidebar</li>
            <li>✅ <strong>Keyboard Navigation:</strong> Use ↑↓ arrow keys to navigate between rows</li>
            <li>✅ <strong>Detailed View:</strong> JSON objects and long text displayed with formatting</li>
            <li>✅ <strong>Copy to Clipboard:</strong> Copy individual field values</li>
            <li>✅ <strong>Keyboard Shortcuts:</strong> Esc to close, Cmd+B to toggle left sidebar</li>
            <li>✅ <strong>Various Data Types:</strong> Strings, numbers, booleans, dates, arrays, objects, null</li>
          </ul>
        </div>

        <div className="bg-gray-900 rounded-lg p-4">
          <Table
            columnNames={columnNames}
            tableData={testData}
            selectedSchema="test"
            selectedTable="sidebar_demo"
            onSort={() => {}}
          />
        </div>

        <div className="mt-6 text-gray-400 text-sm">
          <p>
            <strong>Instructions:</strong> Click any row to open the details sidebar.
            Use ↑↓ keys to navigate rows when sidebar is open. Press Esc to close sidebar.
          </p>
        </div>
      </div>

      <RightSidebar />
    </div>
  );
}

export default function TestTablePage() {
  return <TestTablePageContent />;
}
