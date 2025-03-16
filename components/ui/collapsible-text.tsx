"use client";

import { useState } from "react";

interface CollapsibleTextProps {
  text: string;
  maxLength: number;
}

export function CollapsibleText({ text, maxLength }: CollapsibleTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // If text is shorter than maxLength, just return it
  if (text.length <= maxLength) {
    return <p className="text-sm text-gray-600 whitespace-pre-line">{text}</p>;
  }

  const displayText = isExpanded
    ? text
    : `${text.substring(0, maxLength).trim()}...`;

  return (
    <div>
      <p className="text-sm text-gray-600 whitespace-pre-line">{displayText}</p>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-sm underline underline-offset-4 text-zinc-900 hover:text-zinc-700 transition-colors mt-1"
      >
        {isExpanded ? "Show less" : "Show more"}
      </button>
    </div>
  );
}
