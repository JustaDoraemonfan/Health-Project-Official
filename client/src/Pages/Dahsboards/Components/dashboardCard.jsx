import { ChevronRight } from "lucide-react";
const DashboardCard = ({
  title,
  description,
  icon: Icon,
  color,
  onClick,
  badge = null,
  isLarge = false,
}) => {
  // Color classes function from LoginSection
  const getColorClasses = (color) => {
    const colors = {
      blue: "from-blue-500 to-blue-600 border-blue-500",
      green: "from-green-500 to-green-600 border-green-500",
      purple: "from-purple-500 to-purple-600 border-purple-500",
      red: "from-red-500 to-red-600 border-red-500",
      amber: "from-amber-500 to-amber-600 border-amber-500",
    };
    return colors[color];
  };

  return (
    <div
      className={`bg-gradient-to-r from-stone-900 to-slate-900 rounded-lg overflow-hidden border border-gray-700 hover:border-gray-600 transition-all duration-200 transform hover:scale-[1.02] cursor-pointer ${
        isLarge ? "col-span-2" : ""
      }`}
      onClick={onClick}
    >
      {/* Card Header with gradient */}
      <div
        className={`flex items-center justify-between px-4 py-3 bg-gradient-to-r ${
          getColorClasses(color).split(" ")[0]
        } ${getColorClasses(color).split(" ")[1]}`}
      >
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-white" />
          <span className="text-white text-sm font-mono font-semibold">
            {title}
          </span>
        </div>
        {badge && (
          <span className="bg-amber-50 bg-opacity-20 text-red-950 text-xs font-mono px-2 py-1 rounded-full">
            {badge}
          </span>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 space-y-3">
        <p className="text-slate-50 text-sm font-mono leading-relaxed">
          {description}
        </p>

        <div className="flex items-center justify-between">
          <button
            className={`text-xs font-mono px-3 py-1 rounded border bg-gradient-to-r ${getColorClasses(
              color
            )} text-white hover:opacity-90 transition-opacity`}
          >
            Access
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </div>
  );
};
export default DashboardCard;
