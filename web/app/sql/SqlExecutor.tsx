"use client";
import { QueryResultRow } from "pg";
import React, { useState, useRef, useEffect } from "react";

import SqlDataViewer from "./SqlDataViewer";
import PgSession from "../sessions/PgSession";
import ReactTooltip from "react-tooltip";
import DbSession from "../sessions/DbSession";
import { useAppState } from "../state/AppProvider";
import { hashString } from "@/utils";

// import { v4 as uuidv4 } from "uuid";

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
}: {
  session: DbSession;
  selectedSql?: string;
}) => {
  const [state, setstate] = useState({
    status: "",
    rows: null as QueryResultRow[] | string | null,
    duration: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [sql, setSql] = useState("SELECT NOW();");
  const [, dispatch] = useAppState();

  const ctrlRef = useRef<boolean>(false);

  useEffect(() => {
    // current sql value from text area gets replaced when the user select a SQL value from hostory sidebar
    if (selectedSql) {
      setSql(selectedSql);
    }
  }, [selectedSql]);

  const post = async () => {
    setLoading(true);
    console.log(process.env.CONNECTION_STRING);
    session
      .executeSQL(sql)
      .then((data) => {
        setLoading(false);
        if (data.status) {
          console.log(data);
          setstate({
            status: data?.status,
            rows: data?.rows ?? null,
            duration: data?.duration ?? 0,
          });
        }

        dispatch({
          type: "ADD_HISTORY",
          payload: {
            time: new Date(),
            sql,
            uuid: hashString(sql),
          },
        });
        // eslint-disable-next-line no-console
        // console.log(status, rows);
        // if (status === "SUCCESS") setstate({ status, rows, duration });
        // else setstate({ rows, status, duration });
        return true;
      })
      .catch((e) => {
        setLoading(false);
        setstate({
          status: "ERROR",
          rows: "Failed to execute query",
          duration: 0,
        });
        // eslint-disable-next-line no-console
        console.error(e);
      });
  };

  return (
    <div className="flex flex-col p-4 h-full w-full bg-gray-800">
      <textarea
        className="h-1/3 w-full font-mono p-2 bg-gray-700 text-gray-200"
        value={sql}
        onChange={(e) => setSql(e?.target?.value)}
        onKeyDown={(e) => {
          if (e.key === "Control" || e.key === "Meta") ctrlRef.current = true;
          else if (e.key === "Enter" && ctrlRef.current && !loading) post();
        }}
        onKeyUp={(e) => {
          if (e.key === "Control" || e.key === "Meta") ctrlRef.current = false;
        }}
        tabIndex={0}
      />
      <div>
        <div className="flex flex-1 max-h-10 w-full justify-between text-gray-200">
          <div className="align-center text-xs px-2 pt-2">
            Status:
            <span
              className={`px-2 ${
                state?.status === "SUCCESS" && "text-green-600"
              }`}
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

        <SqlDataViewer rows={state?.rows} loading={loading} />
      </div>
    </div>
  );
};

export default SqlExecutor;
