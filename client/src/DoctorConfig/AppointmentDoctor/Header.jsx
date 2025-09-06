import { Calendar } from "lucide-react";

const Header = ({
  currentDate,
  totalAppointments,
  confirmedCount,
  pendingCount,
}) => {
  return (
    <header className="bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-800/50 px-8 py-6">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left - Clean Logo & Title */}
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white google-sans-code-400 tracking-tight">
              Appointments
            </h1>
            <p className="text-sm text-zinc-400 google-sans-code-400">
              {currentDate}
            </p>
          </div>
        </div>

        {/* Right - Simple Stats */}
        <div className="flex items-center space-x-6">
          <div className="text-right">
            <div className="text-2xl font-bold text-white google-sans-code-400">
              {totalAppointments}
            </div>
            <div className="text-xs text-zinc-500 google-sans-code-400 uppercase tracking-wider">
              Today
            </div>
          </div>

          <div className="w-px h-8 bg-zinc-700"></div>

          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
            <span className="text-sm text-zinc-300 google-sans-code-400">
              {confirmedCount}
            </span>
          </div>

          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
            <span className="text-sm text-zinc-300 google-sans-code-400">
              {pendingCount}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
