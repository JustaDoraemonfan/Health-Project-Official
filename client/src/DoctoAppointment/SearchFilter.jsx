import { Search, Filter } from "lucide-react";
const SearchFilter = ({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
}) => {
  return (
    <div className="bg-zinc-950/50 px-8 py-6 border-b border-zinc-800/30">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900/50 border border-zinc-700/50 rounded-xl pl-12 pr-4 py-3 text-white google-sans-code-400 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center space-x-3">
          <span className="text-sm text-zinc-400 google-sans-code-400">
            Filter:
          </span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-zinc-900/50 border border-zinc-700/50 rounded-xl px-4 py-3 text-white google-sans-code-400 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200 cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>
    </div>
  );
};
export default SearchFilter;
