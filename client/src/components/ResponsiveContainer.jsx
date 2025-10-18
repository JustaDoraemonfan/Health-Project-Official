import React from "react";

export default function ResponsiveContainer({ children, className = "" }) {
  return (
    <div className={`w-full ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
    </div>
  );
}
