import { ChevronRight } from "lucide-react";

const DashboardCard = ({
  title,
  description,
  icon: Icon,
  color,
  onClick,
  badge = null,
  stats = null,
  isLarge = false,
}) => {
  const getColorClasses = (color) => {
    const colors = {
      blue: "from-blue-500 to-blue-600 border-blue-500",
      green: "from-green-500 to-green-600 border-green-500",
      purple: "from-purple-500 to-purple-600 border-purple-500",
      red: "from-red-500 to-red-600 border-red-500",
      amber: "from-amber-500 to-amber-600 border-amber-500",
      teal: "from-teal-500 to-teal-600 border-teal-500",
      indigo: "from-indigo-500 to-indigo-600 border-indigo-500",
    };
    return colors[color] || colors.blue;
  };

  return (
    <div
      className={`bg-[var(--color-secondary)] overflow-hidden rounded-lg transition-all duration-200 transform hover:scale-[1.02] cursor-pointer ${
        isLarge ? "sm:col-span-2" : ""
      }`}
      onClick={onClick}
    >
      {/* Card Header with gradient - Responsive */}
      <div
        className={`flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r ${
          getColorClasses(color).split(" ")[0]
        } ${getColorClasses(color).split(" ")[1]}`}
      >
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" />
          <span className="text-white text-xs sm:text-sm spline-sans-mono-400 font-semibold truncate">
            {title}
          </span>
        </div>
        <div className="flex items-center flex-col">
          {stats && (
            <span className="bg-transparent bg-opacity-20 text-white text-xs spline-sans-mono-400 px-2 py-1 rounded-full whitespace-nowrap">
              {stats}
            </span>
          )}
        </div>
      </div>

      {/* Card Content - Responsive */}
      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
        <p className="text-slate-50 text-xs sm:text-sm spline-sans-mono-400 leading-relaxed line-clamp-2">
          {description}
        </p>

        <div className="flex items-center justify-between">
          <button
            className={`text-xs spline-sans-mono-400 px-2.5 sm:px-3 py-1 rounded border bg-gradient-to-r ${getColorClasses(
              color
            )} text-white hover:opacity-90 transition-opacity`}
          >
            Access
          </button>
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
