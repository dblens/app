import { QueryResultRow } from 'pg';
import React, { useState } from 'react';
import DbSession from '../sessions/DbSession';

const SqlExecuter = ({ session }: { session: DbSession }) => {
  const [state, setstate] = useState<string | QueryResultRow>();
  const [loading, setLoading] = useState<boolean>(false);
  const [sql, setSql] = useState('SELECT NOW()');

  const post = async () => {
    setLoading(true);
    session
      .executeSQL(sql)
      .then(({ status, rows }) => {
        setLoading(false);
        // eslint-disable-next-line no-console
        console.log(rows);
        if (status === 'SUCCESS') setstate(rows);
        return true;
      })
      .catch((e) => {
        setLoading(false);
        // eslint-disable-next-line no-console
        console.error(e);
      });
  };

  return (
    <div className="p-4 w-full">
      <div className="flex flex-1 w-full justify-between">
        <p className="text-green-600 align-center">Connected</p>
        <button
          onClick={post}
          type="button"
          disabled={loading}
          className="bg-gray-700 p-2 text-gray-200 hover:bg-gray-800 hover:text-gray-100 text-xs"
        >
          {loading ? 'loading...' : 'Run'}
        </button>
      </div>
      <br />
      <textarea
        className="w-full h-1/2 font-mono p-2"
        value={sql}
        onChange={(e) => setSql(e?.target?.value)}
      />
      <pre className="h-1/3 overflow-y-auto text-gray-600 font-mono bg-gray-200">
        {state && JSON.stringify(state, null, 2)}
      </pre>
    </div>
  );
};

export default SqlExecuter;
