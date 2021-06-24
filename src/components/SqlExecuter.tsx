import { QueryResultRow } from 'pg';
import React, { useState, useRef } from 'react';
import ReactTooltip from 'react-tooltip';
import DbSession from '../sessions/DbSession';

const SqlExecuter = ({ session }: { session: DbSession }) => {
  // TODO move to sate machine, to implement tabs
  const [state, setstate] = useState<string | QueryResultRow>();
  const [loading, setLoading] = useState<boolean>(false);
  const [sql, setSql] = useState('SELECT NOW()');

  const ctrlRef = useRef<boolean>(false);

  const post = async () => {
    setLoading(true);
    session
      .executeSQL(sql)
      .then(({ status, rows }) => {
        setLoading(false);
        // eslint-disable-next-line no-console
        // console.log(status, rows);
        if (status === 'SUCCESS') setstate(rows);
        else setstate({ status });
        return true;
      })
      .catch((e) => {
        setLoading(false);
        // eslint-disable-next-line no-console
        console.error(e);
      });
  };

  return (
    <div className="p-4 h-full w-full bg-gray-800">
      <div className="flex flex-1 w-full justify-between">
        <p className="text-green-600 align-center">Connected</p>
        <button
          onClick={post}
          type="button"
          disabled={loading}
          className="bg-gray-700 p-2 text-gray-200 hover:bg-gray-800 hover:text-gray-100 text-xs"
          data-tip
          data-for="btn-run"
        >
          {loading ? 'loading...' : 'Run'}
        </button>
        <ReactTooltip id="btn-run" type="info">
          <span>Tip: Ctrl+ Enter to execute SQL</span>
        </ReactTooltip>
      </div>
      <br />
      <textarea
        className="w-full h-1/2 font-mono p-2 bg-gray-700 text-gray-200"
        value={sql}
        onChange={(e) => setSql(e?.target?.value)}
        onKeyDown={(e) => {
          if (e.key === 'Control' || e.key === 'Meta') ctrlRef.current = true;
          else if (e.key === 'Enter' && ctrlRef.current) post();
        }}
        onKeyUp={(e) => {
          if (e.key === 'Control' || e.key === 'Meta') ctrlRef.current = false;
        }}
        tabIndex={0}
      />
      <pre className="h-1/3 overflow-y-auto bg-gray-700 p-2 text-gray-200 font-mono">
        {state && JSON.stringify(state, null, 2)}
      </pre>
    </div>
  );
};

export default SqlExecuter;
