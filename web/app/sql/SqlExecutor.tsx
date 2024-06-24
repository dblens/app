"use client";
import { QueryResultRow } from "pg";
import React, { useState, useRef, useEffect, useCallback } from "react";
import SqlDataViewer from "./SqlDataViewer";
import PgSession from "../sessions/PgSession";
import ReactTooltip from "react-tooltip";
import DbSession from "../sessions/DbSession";
import { useAppState } from "../state/AppProvider";
import { hashString } from "@/utils";
import SqlEditor from "./SqlEditor";
import CopyBtn from "../components/atoms/CopyBtn";

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
  session,
  selectedSql,
  activeTabId,
}: {
  session: DbSession;
  selectedSql?: string;
  activeTabId?: number;
}) => {
  const [state, setstate] = useState({
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

  useEffect(() => {
    // current sql value from text area gets replaced when the user select a SQL value from hostory sidebar
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
      setstate({
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
    console.log("post", currentSql);
    setLoading(true);
    session
      .executeSQL(currentSql)
      .then((data) => {
        setLoading(false);
        if (data.status) {
          console.log(data);
          setstate({
            description: data?.description,
            status: data?.status,
            rows: data?.rows ?? null,
            duration: data?.duration ?? 0,
          });
        }

        dispatch({
          type: "ADD_HISTORY",
          payload: {
            time: new Date(),
            sql: currentSql,
            uuid: hashString(currentSql),
          },
        });
        return true;
      })
      .catch((e) => {
        setLoading(false);
        setstate({
          status: "ERROR",
          rows: [],
          description:
            "Failed to execute query, check your command is still running",
          duration: 0,
        });
        console.error(e);
      });
  }, [session, dispatch]);

  const toggleViewMode = () => {
    setViewMode((prevMode) => (prevMode === "table" ? "json" : "table"));
  };

  return (
    <div className="flex flex-col p-4 h-full w-full bg-gray-800">
      <SqlEditor sql={sql} setSql={setSql} post={post} loading={loading} />
      <div>
        <div className="flex flex-1 max-h-10 w-full justify-between text-gray-200">
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
          <div className="flex items-center space-x-2">
            <CopyBtn textToCopy={state?.rows} />
            <button
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

        <SqlDataViewer
          description={state?.description}
          status={state?.status}
          rows={state?.rows}
          loading={loading}
          viewMode={viewMode}
        />
      </div>
    </div>
  );
};

export default SqlExecutor;
