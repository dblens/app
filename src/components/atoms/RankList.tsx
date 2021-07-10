import React, { ReactText } from 'react';

export type RankListProps = {
  list: {
    field: ReactText;
    value: ReactText;
  }[];
};

const RankList = ({
  list = new Array(5).fill({ field: 'Test', value: 1 }),
}: RankListProps) => {
  return (
    <ul className="py-2 text-sm overflow-auto" style={{ height: '10rem' }}>
      {list.map(({ field, value }) => (
        <li
          key={field}
          className="flex w-full text-sm leading-normal hover:bg-gray-600 rounded hover:shadow-lg hover:drop-shadow hover:text-gray-100 px-1"
        >
          <span className="flex-1 truncate">{field}</span>
          <span className="text-green-50">{value}</span>
        </li>
      ))}
      {list?.length === 0 && (
        <li className="flex w-full text-sm leading-normal">
          <span className="flex-1 truncate">Insufficient Data</span>
        </li>
      )}
    </ul>
  );
};

export default RankList;
