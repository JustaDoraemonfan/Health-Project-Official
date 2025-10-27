import React from "react";

export const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-50 w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export const DialogContent = ({ children, className = "" }) => (
  <div
    className={`bg-zinc-900 backdrop-blur-md rounded-xl shadow-2xl border border-gray-600 overflow-hidden ${className}`}
    style={{
      msOverflowStyle: "none",
      scrollbarWidth: "none",
    }}
  >
    <style jsx>{`
      div::-webkit-scrollbar {
        display: none;
      }
    `}</style>
    {children}
  </div>
);

export const DialogHeader = ({ children }) => (
  <div className="px-6 py-5 border-b border-gray-600 bg-[var(--color-primary)]">
    {children}
  </div>
);

export const DialogTitle = ({ children }) => (
  <h2 className="text-2xl font-light text-[var(--color-secondary)] flex items-center gap-2">
    {children}
  </h2>
);

export const Button = ({
  variant = "default",
  size = "default",
  className = "",
  children,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    default:
      "bg-[var(--color-primary)] text-[var(--color-secondary)] hover:bg-white shadow-sm hover:shadow-md focus:ring-blue-500",
    secondary:
      "bg-transparent text-black hover:text-zinc-700 hover:cursor-pointer",
    outline:
      "border border-gray-500 bg-transparent text-gray-300 hover:bg-gray-800 focus:ring-gray-500",
    destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };

  const sizes = {
    default: "h-10 px-4 py-2 text-sm",
    sm: "h-8 px-3 text-xs",
    lg: "h-12 px-6 text-base",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Input = ({ className = "", ...props }) => (
  <input
    className={`w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-md focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50 text-white placeholder-slate-400 google-sans-code-400 text-sm transition-colors disabled:opacity-50 ${className}`}
    {...props}
  />
);

export const Textarea = ({ className = "", ...props }) => (
  <textarea
    className={`w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-md focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50 text-white placeholder-slate-400 google-sans-code-400 text-sm transition-colors disabled:opacity-50 ${className}`}
    style={{
      msOverflowStyle: "none",
      scrollbarWidth: "none",
    }}
    {...props}
  />
);

export const Select = ({ children, value, onValueChange, placeholder }) => {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-md focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50 text-white placeholder-slate-400 google-sans-code-400 text-sm transition-colors disabled:opacity-50"
    >
      {placeholder && (
        <option value="" className="text-gray-400">
          {placeholder}
        </option>
      )}
      {children}
    </select>
  );
};

export const SelectItem = ({ value, children }) => (
  <option
    value={value}
    className="bg-[var(--color-primary)] text-[var(--color-secondary)]"
  >
    {children}
  </option>
);

export const Label = ({ htmlFor, children, className = "" }) => (
  <label
    htmlFor={htmlFor}
    className={`text-sm font-medium text-gray-300 flex items-center gap-2 ${className}`}
  >
    {children}
  </label>
);
