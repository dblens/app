import React from 'react';

type Mode = 'none' | 'asc' | 'desc';
interface SortIconProps {
  mode?: Mode;
}

const SortIcon: React.FC<SortIconProps> = ({
  mode = 'none',
}: SortIconProps) => {
  return (
    <svg
      aria-hidden="true"
      role="img"
      className="octicon octicon-filter"
      viewBox="0 0 16 16"
      width="10"
      height="10"
      fill="currentColor"
      style={{ transform: `rotate(${mode === 'desc' ? '0' : '180'}deg)` }}
    >
      <path
        fillRule="evenodd"
        d="M.75 3a.75.75 0 000 1.5h14.5a.75.75 0 000-1.5H.75zM3 7.75A.75.75 0 013.75 7h8.5a.75.75 0 010 1.5h-8.5A.75.75 0 013 7.75zm3 4a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5h-2.5a.75.75 0 01-.75-.75z"
      />
    </svg>
  );
};

SortIcon.defaultProps = {
  mode: 'none',
};

export default SortIcon;
