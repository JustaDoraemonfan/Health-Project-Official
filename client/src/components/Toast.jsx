import React, { useEffect } from "react";
import { CheckCircle, AlertCircle, X } from "lucide-react";

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm transition-all duration-300 ${
        type === "success"
          ? "bg-green-900/90 border border-green-700 text-green-100"
          : "bg-red-900/90 border border-red-700 text-red-100"
      }`}
    >
      {type === "success" ? (
        <CheckCircle className="h-5 w-5 text-green-400" />
      ) : (
        <AlertCircle className="h-5 w-5 text-red-400" />
      )}
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 p-1 rounded-full hover:bg-white/10 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Toast;
