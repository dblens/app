import React, { useState } from 'react';
import utils from './utils/utils';

const MainScreen = ({ session = '' }) => {
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
      <p className="text-green-600">Connected</p>
      <br />
      <textarea
        className="w-full"
        value={sql}
        onChange={(e) => setSql(e?.target?.value)}
      />
      <br />
      <button
        onClick={post}
        type="button"
        disabled={loading}
        className="bg-gray-700 p-2 text-gray-200 hover:bg-gray-800 hover:text-gray-100"
      >
        {loading ? 'loading...' : 'Test'}
      </button>
      <br />
      <pre>{state && JSON.stringify(state, null, 2)}</pre>
    </div>
  );
};

export default MainScreen;
