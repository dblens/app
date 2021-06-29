import React, { useEffect } from 'react';
import { useAppState } from '../state/AppProvider';

const SqlHistory = ({
  setSelectedSql,
}: {
  setSelectedSql: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [state] = useAppState();
  useEffect(() => {
    localStorage.setItem('SQL_HISTORY', JSON.stringify(state.history));
  }, [state.history]);
  return (
    <ul className="h-full overflow-auto p-2">
      {state?.history?.map((i) => (
        <li className="w-full text-left hover:bg-gray-700" key={+i?.time}>
          <button
            type="button"
            className="w-full text-left"
            onClick={() => setSelectedSql(i?.sql)}
          >
            {i?.sql}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default SqlHistory;
