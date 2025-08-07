// SqlExecutor.tsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import { QueryResultRow } from "pg";
import SqlDataViewer from "./SqlDataViewer";
import ErrorViewer from "./ErrorViewer";
import SqlEditor from "./SqlEditor";
import CopyBtn from "../components/atoms/CopyBtn";
import ReactTooltip from "react-tooltip";
import { useAppState } from "../state/AppProvider";
import { hashString } from "@/utils";
import PgSession from "../sessions/PgSession";
import DbSession from "../sessions/DbSession";
import { useIsAiAvailable } from "@/api/query";
import { useSidebar } from "../contexts/SidebarContext";

const getSize = (ss?: QueryResultRow[] | string) => {
  if (!ss) return "";
  const resultString = JSON.stringify(ss);
  const { size } = new Blob([resultString]);
  if (size > 1026) return `${size / 1026} kb`;
  return `${size} bytes`;
};

const getTimeHeat = (duration = 0) => {
  if (duration > 30000) return "text-red-600";
  if (duration < 30000 && duration > 10000) return "text-yellow-600";
  return "text-green-600";
};
const session = new PgSession("PG");

const SqlExecutor = ({
  selectedSql,
  activeTabId,
}: {
  selectedSql?: string;
  activeTabId?: number;
}) => {
  const [state, setState] = useState({
    status: "",
    description: null as any,
    rows: null as QueryResultRow[] | string | null,
    duration: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [sql, setSql] = useState("SELECT NOW();");
  const [, dispatch] = useAppState();
  const [viewMode, setViewMode] = useState("table");
  const sqlRef = useRef(sql);
  const { toggleLeftSidebar, isLeftSidebarOpen } = useSidebar();

  useEffect(() => {
    if (selectedSql) {
      setSql(selectedSql);
    }
  }, [selectedSql]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      localStorage.setItem(`sql_${activeTabId}`, sql);
    }, 500);

    return () => clearTimeout(debounce);
  }, [sql]);

  useEffect(() => {
    const sql = localStorage.getItem(`sql_${activeTabId}`);
    if (sql) {
      setSql(sql);
      setState({
        status: "",
        description: null as any,
        rows: null as QueryResultRow[] | string | null,
        duration: 0,
      });
    }
  }, [activeTabId]);

  useEffect(() => {
    sqlRef.current = sql;
  }, [sql]);

  const post = useCallback(async () => {
    const currentSql = sqlRef.current;
    setLoading(true);
    session
      .executeSQL(currentSql)
      .then((data) => {
        setLoading(false);
        if (data.status === "SUCCESS") {
          setState({
            description: data?.description,
            status: data?.status,
            rows: data?.rows ?? null,
            duration: data?.duration ?? 0,
          });

          dispatch({
            type: "ADD_HISTORY",
            payload: {
              time: new Date(),
              sql: currentSql,
              uuid: hashString(currentSql),
            },
          });
        } else {
          setState({
            status: "ERROR",
            rows: [],
            description: data,
            duration: 0,
          });
        }
      })
      .catch((e) => {
        setLoading(false);
        setState({
          status: "ERROR",
          rows: [],
          description: e,
          duration: 0,
        });
        console.error(e);
      });
  }, [session, dispatch]);

  const handleFixQuery = useCallback(async () => {
    const currentSql = sqlRef.current;
    const { query, reason } = await session.getAiFix(
      currentSql,
      state?.description
    );
    console.log("Fixing query", query, reason);

    if (
      confirm(
        `AI Suggestion:\n${formatMultilineReason(
          reason
        )}\n\nDo you want to paste this suggestion on to your SQL editor?`
      )
    ) {
      console.log("Fixing query", query);
      setSql(
        `-- AI Generated SQL Below\n-- Reasoning:\n${formatMultilineReason(
          reason
        )}
-- WARNING: Please review the generated SQL before executing. AI suggestions may not always be accurate.

${query}`
      );
      setState({
        status: "",
        description: null as any,
        rows: null as QueryResultRow[] | string | null,
        duration: 0,
      });
      return { query, reason };
    }
    return false;
  }, [session, state?.description]);

  // Function to format multiline reason with '-- ' at the beginning of each line
  const formatMultilineReason = (reason) => {
    return reason
      .split("\n")
      .map((line) => `-- ${line}`)
      .join("\n");
  };

  const toggleViewMode = () => {
    setViewMode((prevMode) => (prevMode === "table" ? "json" : "table"));
  };

  return (
    <div className="flex flex-col pl-2 h-full w-full bg-gray-800 max-h-full">
      <div className="h-1/3">
        <SqlEditor sql={sql} setSql={setSql} post={post} loading={loading} />
      </div>
      <div className="h-2/3">
        <div className="flex flex-1 max-h-10 w-full justify-between text-gray-200">
          <div className="flex items-center">
            {/* Sidebar Toggle Button */}
            <button
              type="button"
              className="mr-3 px-2 py-1 text-gray-100 hover:text-white transition-colors"
              onClick={toggleLeftSidebar}
              data-tip
              data-for="btn-toggle-sidebar"
              title={isLeftSidebarOpen ? 'Hide sidebar (Cmd+B)' : 'Show sidebar (Cmd+B)'}
            >
              {isLeftSidebarOpen ? '◀' : '▶'}
            </button>
            <ReactTooltip id="btn-toggle-sidebar" type="dark" place="bottom">
              <span>{isLeftSidebarOpen ? 'Hide sidebar (Cmd+B)' : 'Show sidebar (Cmd+B)'}</span>
            </ReactTooltip>

            <div className="align-center text-xs px-2 pt-2">
              Status:
            <span
              className={`px-2 ${
                state?.status === "SUCCESS" && "text-green-600"
              } ${state?.status === "ERROR" && "text-red-600"}`}
            >
              {state?.status ?? ""}
            </span>
            Time:
            <span className={`px-2 ${getTimeHeat(state?.duration)}`}>
              {state?.duration ? `${state?.duration} ms` : ""}
            </span>
            {state?.rows !== null ? (
              <>
                Size:
                <span
                  className={`px-2 ${
                    state?.status === "SUCCESS" && "text-green-600"
                  }`}
                >
                  {state?.rows !== null ? getSize(state?.rows) : ""}
                </span>
              </>
            ) : null}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <CopyBtn textToCopy={state?.rows} />
            <button
              type="button"
              onClick={toggleViewMode}
              className={`p-2 hover:bg-gray-700 hover:text-gray-100`}
              data-tip
              data-for="btn-toggle-view"
            >
              {viewMode === "table" ? "{}" : "📄"}
            </button>
            <ReactTooltip id="btn-toggle-view" type="info">
              <span> {viewMode === "table" ? "Show JSON" : "Show Table"}</span>
            </ReactTooltip>
            <button
              onClick={post}
              type="button"
              disabled={loading}
              className={`p-2 hover:bg-gray-700 hover:text-gray-100 ${
                loading && "cursor-wait"
              }`}
              data-tip
              data-for="btn-run"
            >
              {loading ? (
                <span role="img" className="font-mono" aria-label="run_icon">
                  ⚡️
                </span>
              ) : (
                "Run"
              )}
            </button>
            <ReactTooltip id="btn-run" type="info">
              <span>Tip: Ctrl+ Enter to execute SQL</span>
            </ReactTooltip>
          </div>
        </div>
        {state?.status === "ERROR" ? (
          <ErrorViewer error={state?.description} onFixQuery={handleFixQuery} />
        ) : (
          <SqlDataViewer
            description={state?.description}
            status={state?.status}
            rows={state?.rows}
            loading={loading}
            viewMode={viewMode}
          />
        )}
      </div>
    </div>
  );
};

export default SqlExecutor;
