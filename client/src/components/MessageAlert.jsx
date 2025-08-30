// src/components/Profile/components/MessageAlert.jsx
import React from "react";
import { CheckCircle, AlertCircle } from "lucide-react";

const MessageAlert = ({ message }) => {
  if (!message.content) return null;

  return (
    <div
      className={`mb-6 p-4 rounded-lg flex items-center ${
        message.type === "success"
          ? "bg-green-900/50 border border-green-700 text-green-300"
          : "bg-red-900/50 border border-red-700 text-red-300"
      }`}
    >
      {message.type === "success" ? (
        <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0" />
      ) : (
        <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
      )}
      {message.content}
    </div>
  );
};

export default MessageAlert;
