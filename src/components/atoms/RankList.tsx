import React, { ReactText } from 'react';

type RankListProps = {
  list: {
    field: ReactText;
    value: ReactText;
  }[];
};

const RankList = ({
  list = new Array(5).fill({ field: 'Test', value: 1 }),
}: RankListProps) => {
  return (
    <ul className="py-4 text-sm p-2">
      {list.map(({ field, value }) => (
        <li
          key={field}
          className="flex w-full text-sm leading-loose hover:bg-gray-600 rounded-lg hover:shadow-lg hover:drop-shadow hover:text-gray-100 px-1"
        >
          <span className="flex-1">{field}</span>
          <span className="text-green-50">{value}</span>
        </li>
      ))}
    </ul>
  );
};

export default RankList;
