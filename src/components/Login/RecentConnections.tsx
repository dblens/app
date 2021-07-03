/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import Utils from '../utils/utils';

interface RecentConnectionsProps {
  send: (v?: string) => void;
  setConnectionString: React.Dispatch<React.SetStateAction<string>>;
}

const RecentConnections: React.FC<RecentConnectionsProps> = ({
  send,
  setConnectionString,
}: RecentConnectionsProps) => {
  const recents = Utils.getRecentConnections();
  return (
    recents &&
    recents?.length > 0 && (
      <div className="text-gray-500 pl-1">
        <br />
        <h1 className="text-md ">Recent Connections </h1>
        <ul className="pl-2 overflow-auto" style={{ maxHeight: 250 }}>
          {recents?.map((i: string) => (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
            <li
              key={i}
              className="truncate cursor-pointer hover:text-gray-800"
              onClick={() => {
                send(i);
                setConnectionString(i);
              }}
            >
              · {i}
            </li>
          ))}
        </ul>
      </div>
    )
  );
};

export default RecentConnections;
