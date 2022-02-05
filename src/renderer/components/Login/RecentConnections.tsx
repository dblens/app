/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import ReactTooltip from 'react-tooltip';
import DeleteIcon from '../atoms/DeleteIcon';
import Utils from '../utils/utils';

interface RecentConnectionsProps {
  send: (v?: string) => void;
  setConnectionString: React.Dispatch<React.SetStateAction<string>>;
}

const RecentConnections: React.FC<RecentConnectionsProps> = ({
  send,
  setConnectionString,
}: RecentConnectionsProps) => {
  const [recents, setRecents] = useState(Utils.getRecentConnections());
  return (
    recents &&
    recents?.length > 0 && (
      <div className="pl-1">
        <br />
        <div className="inline-flex justify-between w-full pb-1">
          <div>
            <h1 className="text-md m-auto">Recent Connections</h1>
          </div>
          <button
            className="p-1 hover:shadow-xl"
            type="button"
            onClick={() => {
              setRecents([]);
              localStorage.setItem('RECENT_CONNECTIONS', JSON.stringify([]));
            }}
          >
            Clear All
          </button>
        </div>
        <ul className="pl-2 overflow-auto" style={{ maxHeight: 250 }}>
          {recents?.map((i: string, ix: number) => (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
            <li key={i} className=" cursor-pointer flex">
              <button
                type="button"
                className=" hover:text-gray-400"
                data-tip
                data-for="btn-remove"
                onClick={(e) => {
                  const newRecents = recents.splice(ix, 0);
                  setRecents(newRecents);
                  localStorage.setItem(
                    'RECENT_CONNECTIONS',
                    JSON.stringify(newRecents)
                  );
                }}
              >
                <DeleteIcon />
              </button>
              <ReactTooltip id="btn-remove" type="dark">
                <span>Remove from recent connections</span>
              </ReactTooltip>
              <button
                type="button"
                onClick={() => {
                  send(i);
                  setConnectionString(i);
                }}
                className="pl-2 truncate hover:text-gray-400"
              >
                {i}
              </button>
            </li>
          ))}
        </ul>
      </div>
    )
  );
};

export default RecentConnections;
