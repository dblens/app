import React, { useState } from "react";
import ReactTooltip from "react-tooltip";

interface CopyBtnProps {
  textToCopy: any;
}

const CopyBtn: React.FC<CopyBtnProps> = ({ textToCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = typeof textToCopy === 'string' ? textToCopy : JSON.stringify(textToCopy, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);

    // Reset the copied state after a short delay
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <button
        onClick={handleCopy}
        className="p-2 hover:bg-gray-700 hover:text-gray-100"
        data-tip
        data-for={`btn-copy-${textToCopy}`}
      >
        📋
      </button>
      <ReactTooltip id={`btn-copy-${textToCopy}`} type="info">
        <span>{copied ? "Copied!" : "Copy to Clipboard"}</span>
      </ReactTooltip>
    </div>
  );
};

export default CopyBtn;
