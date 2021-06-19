import React from 'react';

const Titlebar = () => {
  return (
    <div
      className="w-screen bg-gray-900 text-center text-gray-300 cursor-move titlebar-drag-region"
      style={{ height: 25 }}
    >
      DB View
    </div>
  );
};

export default Titlebar;
