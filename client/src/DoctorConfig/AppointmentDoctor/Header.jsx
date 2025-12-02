import { Calendar } from "lucide-react";

const Header = ({
  currentDate,
  totalAppointments,
  confirmedCount,
  pendingCount,
}) => {
  return (
    <header className="bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-800/50 px-4 sm:px-8 py-4  sm:py-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between max-w-7xl mx-auto space-y-4 sm:space-y-0">
        {/* Left - Clean Logo & Title */}
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-white spline-sans-mono-400 tracking-tight">
              Appointments
            </h1>
            <p className="text-sm text-zinc-400 spline-sans-mono-400">
              {currentDate}
            </p>
          </div>
        </div>

        {/* Right - Simple Stats */}
        {/* On mobile, this div will be below the title, full-width, with content pushed to the right */}
        <div className="flex items-center justify-end w-full sm:w-auto space-x-4 sm:space-x-6">
          <div className="text-right">
            <div className="text-xl sm:text-2xl font-bold text-white spline-sans-mono-400">
              {totalAppointments}
            </div>
            <div className="text-xs text-zinc-500 spline-sans-mono-400 uppercase tracking-wider">
              Today
            </div>
          </div>

          {/* Hide divider on mobile */}
          <div className="w-px h-8 bg-zinc-700 hidden sm:block"></div>

          <div className="flex items-center space-x-1.5">
            <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
            <span className="text-sm text-zinc-300 spline-sans-mono-400">
              {confirmedCount}
            </span>
          </div>

          <div className="flex items-center space-x-1.5">
            <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
            <span className="text-sm text-zinc-300 spline-sans-mono-400">
              {pendingCount}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
