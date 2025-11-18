import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertTriangle, X } from "lucide-react";

const ProfileNotification = ({
  type = "success",
  title,
  message,
  onClose,
  duration = 5000,
  autoClose = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 10);

    // Auto close if enabled
    if (autoClose && duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300);
  };

  const configs = {
    success: {
      icon: CheckCircle,
      bgGradient: "from-emerald-500/20 to-green-500/20",
      borderColor: "border-emerald-500/50",
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-500/20",
      titleColor: "text-emerald-100",
      messageColor: "text-emerald-200/80",
      progressBar: "bg-emerald-500",
    },
    error: {
      icon: XCircle,
      bgGradient: "from-red-500/20 to-rose-500/20",
      borderColor: "border-red-500/50",
      iconColor: "text-red-400",
      iconBg: "bg-red-500/20",
      titleColor: "text-red-100",
      messageColor: "text-red-200/80",
      progressBar: "bg-red-500",
    },
    warning: {
      icon: AlertTriangle,
      bgGradient: "from-amber-500/20 to-yellow-500/20",
      borderColor: "border-amber-500/50",
      iconColor: "text-amber-400",
      iconBg: "bg-amber-500/20",
      titleColor: "text-amber-100",
      messageColor: "text-amber-200/80",
      progressBar: "bg-amber-500",
    },
  };

  const config = configs[type] || configs.success;
  const Icon = config.icon;

  if (!message) return null;

  return (
    <div className="fixed top-4 right-4 z-50 w-full max-w-md px-4">
      <div
        className={`
          transform transition-all duration-300 ease-out
          ${
            isVisible && !isExiting
              ? "translate-x-0 opacity-100"
              : "translate-x-full opacity-0"
          }
        `}
      >
        <div className="relative overflow-hidden">
          {/* Background blur effect */}
          <div className="absolute inset-0 backdrop-blur-xl bg-slate-900/80 rounded-2xl"></div>

          {/* Main notification card */}
          <div
            className={`
            relative bg-gradient-to-br ${config.bgGradient}
            rounded-2xl border ${config.borderColor}
            shadow-2xl
          `}
          >
            {/* Content */}
            <div className="p-5">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className={`
                  ${config.iconBg} rounded-xl p-2.5 flex-shrink-0
                  animate-pulse
                `}
                >
                  <Icon className={`h-6 w-6 ${config.iconColor}`} />
                </div>

                {/* Text content */}
                <div className="flex-1 min-w-0">
                  {title && (
                    <h4
                      className={`
                      text-base font-semibold ${config.titleColor} mb-1
                    `}
                    >
                      {title}
                    </h4>
                  )}
                  <p
                    className={`
                    text-sm ${config.messageColor} leading-relaxed
                  `}
                  >
                    {message}
                  </p>
                </div>

                {/* Close button */}
                <button
                  onClick={handleClose}
                  className="flex-shrink-0 p-1 hover:bg-white/10 rounded-lg transition-colors duration-200"
                  aria-label="Close notification"
                >
                  <X className="h-5 w-5 text-slate-300 hover:text-white" />
                </button>
              </div>
            </div>

            {/* Progress bar for auto-close */}
            {autoClose && duration > 0 && (
              <div className="h-1 bg-slate-800/50">
                <div
                  className={`h-full ${config.progressBar} transition-all ease-linear`}
                  style={{
                    width: "100%",
                    animation: `shrink ${duration}ms linear forwards`,
                  }}
                ></div>
              </div>
            )}
          </div>

          {/* Glow effect */}
          <div
            className={`
            absolute inset-0 bg-gradient-to-br ${config.bgGradient}
            rounded-2xl blur-xl opacity-50 -z-10
          `}
          ></div>
        </div>
      </div>

      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};
export default ProfileNotification;
