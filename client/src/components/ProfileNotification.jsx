import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertTriangle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfileNotification = ({
  type = "success",
  title,
  message,
  onClose,
  autoClose = false,
  duration = 3000,
}) => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 10);

    if (autoClose) {
      const timer = setTimeout(() => handleClose(), duration);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      navigate(-1);
      if (onClose) onClose();
    }, 250);
  };

  const configs = {
    success: {
      icon: CheckCircle,
      accent: "text-emerald-400",
      bgAccent: "bg-emerald-500/20",
    },
    error: {
      icon: XCircle,
      accent: "text-red-400",
      bgAccent: "bg-red-500/20",
    },
    warning: {
      icon: AlertTriangle,
      accent: "text-amber-300",
      bgAccent: "bg-amber-500/20",
    },
  };

  const config = configs[type] || configs.success;
  const Icon = config.icon;

  if (!message) return null;

  return (
    <div
      className={`fixed inset-0 z-[999] flex items-center justify-center spline-sans-mono-400
        transition-opacity duration-300
        ${visible && !closing ? "opacity-100" : "opacity-0"}
      `}
    >
      {/* Background overlay */}
      <div
        className={`absolute inset-0 bg-[var(--color-secondary)]/70 backdrop-blur-sm
          transition-opacity duration-300
          ${visible && !closing ? "opacity-100" : "opacity-0"}
        `}
        onClick={handleClose}
      ></div>

      {/* Modal */}
      <div
        className={`relative w-full max-w-lg mx-4 rounded-2xl overflow-hidden shadow-2xl
          bg-[var(--color-primary)] border border-[var(--color-secondary)]/30
          transform transition-all duration-300
          ${
            visible && !closing ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }
        `}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1 hover:bg-black/10 rounded-lg transition"
        >
          <X className="h-6 w-6 text-[var(--color-secondary)]/80" />
        </button>

        <div className="p-8 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className={`p-4 rounded-full ${config.bgAccent}`}>
              <Icon className={`h-10 w-10 ${config.accent}`} />
            </div>
          </div>

          {/* Title */}
          {title && (
            <h2 className="text-xl font-medium mb-3 text-[var(--color-secondary)]">
              {title}
            </h2>
          )}

          {/* Message */}
          <p className="text-base leading-relaxed text-[var(--color-secondary)]/80">
            {message}
          </p>

          {/* Action Button */}
          <button
            onClick={handleClose}
            className="mt-6 w-full py-3 rounded-xl 
              bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/80
              text-[var(--color-primary)] font-medium transition-all"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileNotification;
