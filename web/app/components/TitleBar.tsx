import React from "react";

const Titlebar = () => {
  return (
    <div
      className="w-screen bg-gray-900 text-center text-gray-400 cursor-move titlebar-drag-region font-mono hover:bg-gray-800 hover:text-gray-200 fixed top-0 left-0 z-10"
      style={{ height: 25 }}
    >
      DB Lens
    </div>
  );
};

export default Titlebar;
