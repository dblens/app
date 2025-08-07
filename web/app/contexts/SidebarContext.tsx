"use client";
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export interface RowData {
  [key: string]: unknown;
}

export interface SidebarState {
  // Sidebar visibility
  isRightSidebarOpen: boolean;
  isLeftSidebarOpen: boolean;
  
  // Selected row data
  selectedRowIndex: number | null;
  selectedRowData: RowData | null;
  tableData: RowData[];
  
  // Navigation state
  isNavigationMode: boolean;
  
  // Actions
  openRightSidebar: (rowIndex: number, rowData: RowData, allData: RowData[]) => void;
  closeRightSidebar: () => void;
  toggleRightSidebar: () => void;
  toggleLeftSidebar: () => void;
  
  // Navigation actions
  navigateUp: () => void;
  navigateDown: () => void;
  setNavigationMode: (enabled: boolean) => void;
  
  // Data management
  updateTableData: (data: RowData[]) => void;
}

const SidebarContext = createContext<SidebarState | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

interface SidebarProviderProps {
  children: React.ReactNode;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({ children }) => {
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [selectedRowData, setSelectedRowData] = useState<RowData | null>(null);
  const [tableData, setTableData] = useState<RowData[]>([]);
  const [isNavigationMode, setIsNavigationMode] = useState(false);

  const openRightSidebar = useCallback((rowIndex: number, rowData: RowData, allData: RowData[]) => {
    setSelectedRowIndex(rowIndex);
    setSelectedRowData(rowData);
    setTableData(allData);
    setIsRightSidebarOpen(true);
    setIsNavigationMode(true);
  }, []);

  const closeRightSidebar = useCallback(() => {
    setIsRightSidebarOpen(false);
    setSelectedRowIndex(null);
    setSelectedRowData(null);
    setIsNavigationMode(false);
  }, []);

  const toggleRightSidebar = useCallback(() => {
    if (isRightSidebarOpen) {
      closeRightSidebar();
    } else if (selectedRowData) {
      setIsRightSidebarOpen(true);
      setIsNavigationMode(true);
    }
  }, [isRightSidebarOpen, selectedRowData, closeRightSidebar]);

  const toggleLeftSidebar = useCallback(() => {
    setIsLeftSidebarOpen(prev => !prev);
  }, []);

  const navigateUp = useCallback(() => {
    if (!isNavigationMode || selectedRowIndex === null || tableData.length === 0) return;
    
    const newIndex = selectedRowIndex > 0 ? selectedRowIndex - 1 : tableData.length - 1;
    setSelectedRowIndex(newIndex);
    setSelectedRowData(tableData[newIndex]);
  }, [isNavigationMode, selectedRowIndex, tableData]);

  const navigateDown = useCallback(() => {
    if (!isNavigationMode || selectedRowIndex === null || tableData.length === 0) return;
    
    const newIndex = selectedRowIndex < tableData.length - 1 ? selectedRowIndex + 1 : 0;
    setSelectedRowIndex(newIndex);
    setSelectedRowData(tableData[newIndex]);
  }, [isNavigationMode, selectedRowIndex, tableData]);

  const updateTableData = useCallback((data: RowData[]) => {
    setTableData(data);
    // If we have a selected row but it's out of bounds, reset
    if (selectedRowIndex !== null && selectedRowIndex >= data.length) {
      setSelectedRowIndex(null);
      setSelectedRowData(null);
    }
  }, [selectedRowIndex]);

  const setNavigationModeCallback = useCallback((enabled: boolean) => {
    setIsNavigationMode(enabled);
  }, []);

  // Keyboard event handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isNavigationMode) return;

      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          navigateUp();
          break;
        case 'ArrowDown':
          event.preventDefault();
          navigateDown();
          break;
        case 'Escape':
          event.preventDefault();
          closeRightSidebar();
          break;
        // Future: Add more shortcuts like Cmd+B for left sidebar toggle
        case 'b':
          if (event.metaKey || event.ctrlKey) {
            event.preventDefault();
            toggleLeftSidebar();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isNavigationMode, navigateUp, navigateDown, closeRightSidebar, toggleLeftSidebar]);

  const value: SidebarState = {
    isRightSidebarOpen,
    isLeftSidebarOpen,
    selectedRowIndex,
    selectedRowData,
    tableData,
    isNavigationMode,
    openRightSidebar,
    closeRightSidebar,
    toggleRightSidebar,
    toggleLeftSidebar,
    navigateUp,
    navigateDown,
    setNavigationMode: setNavigationModeCallback,
    updateTableData,
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};
