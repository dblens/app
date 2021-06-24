import React from 'react';

type SideHeaderProps = {
  title: string;
};

const SideHeader: React.FC<SideHeaderProps> = ({ title }: SideHeaderProps) => {
  return (
    <h2 className="text-gray-400 pl-2 py-1 font-bold text-xs border-gray-400 border">
      {title}
    </h2>
  );
};

export default SideHeader;
