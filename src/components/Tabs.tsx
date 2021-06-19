import React from 'react';

const Tabs = () => {
  return (
    <div className="w-full bg-gray-800 flex" style={{ height: 25 }}>
      {new Array(3).fill('Tab').map((t, ix) => (
        // eslint-disable-next-line react/no-array-index-key
        <div className="border border-gray-600" key={`${t}_${ix}`}>
          <button type="button" className="pl-4 pr-4 text-gray-100">
            Test Tab
          </button>
          <button type="button" className="ml-4 mr-4 text-gray-100">
            X
          </button>
        </div>
      ))}
    </div>
  );
};

export default Tabs;
