import React, { useEffect } from "react";
import DeleteIcon from "../components/atoms/DeleteIcon";
import { useAppState } from "../state/AppProvider";
import { stat } from "fs";

const SqlHistory = ({
  setSelectedSql,
}: {
  setSelectedSql: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [state, dispatch] = useAppState();
  useEffect(() => {
    if (localStorage)
      localStorage.setItem("SQL_HISTORY", JSON.stringify(state.history));
  }, [state.history]);

  return (
    <ul className="h-full overflow-auto p-2">
      {state?.history?.map((i, ix) => (
        <li className="w-full text-left hover:bg-gray-700 flex" key={i?.uuid}>
          <button
            type="button"
            className="mr-2 p-1 text-red-600 hover:bg-red-800 hover:text-gray-50 rounded"
            onClick={() =>
              dispatch({
                type: "REMOVE_HISTORY",
                payload: ix,
              })
            }
          >
            <DeleteIcon />
          </button>
          <button
            type="button"
            className="w-full text-left truncate"
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
