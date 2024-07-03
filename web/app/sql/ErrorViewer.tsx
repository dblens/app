// ErrorViewer.tsx
import React, { useState } from "react";
import { useIsAiAvailable } from "@/api/query";

const ErrorViewer = ({
  error,
  onFixQuery,
}: {
  error: any;
  onFixQuery: () => Promise<{ query: string; reason: string } | null>;
}) => {
  const { aiAvailable } = useIsAiAvailable();
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<{
    query: string;
    reason: string;
  } | null>(null);

  const fetchAiSuggestion = async () => {
    setLoading(true);
    const suggestion = await onFixQuery();
    setLoading(false);
    if (suggestion) {
      setAiResponse(suggestion);
    } else {
      setAiResponse(null);
    }
  };

  return (
    <div className="bg-red-100 text-red-800 p-4 rounded text-sm">
      <pre>{JSON.stringify(error, null, 2)}</pre>
      {aiAvailable && (
        <div className="mt-2">
          {!aiResponse && (
            <button
              onClick={fetchAiSuggestion}
              className={`bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 ${
                loading && "cursor-wait"
              }`}
              disabled={loading}
            >
              {loading ? "🪄 Fetching AI suggestion..." : "Get AI Suggestion 🪄"}
            </button>
          )}
          {aiResponse && (
            <div className="ai-suggestion">
              <div className="suggestion-info">
                <div className="suggestion-reason">{aiResponse.reason}</div>
                <div className="suggestion-query">{aiResponse.query}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ErrorViewer;
