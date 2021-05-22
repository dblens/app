import React, { useState } from 'react';
import utils from './utils/utils';

const SqlExecuter = ({ session = '' }) => {
  const [state, setstate] = useState();
  const [loading, setLoading] = useState<boolean>(false);
  const [sql, setSql] = useState('SELECT NOW()');

  const post = async () => {
    setLoading(true);
    const { status, result } = await utils.executeSQL(sql, session);
    setLoading(false);
    if (status === 'SUCCESS') {
      setstate(result);
    }
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
