import { Search } from "lucide-react";

const SearchFilter = ({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
}) => {
  return (
    <div className="bg-transparent px-4 sm:px-8 py-6 ">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
        {/* Search Input */}
        <div className="relative w-full sm:flex-1 sm:max-w-md">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[var(--color-secondary)] border border-zinc-700/50 rounded-xl pl-12 pr-4 py-3 text-white spline-sans-mono-400 placeholder-[var(--color-primary)]/60 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
          <span className="text-sm text-zinc-700 spline-sans-mono-400 hidden sm:inline">
            Filter:
          </span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full sm:w-auto bg-[var(--color-secondary)]/70 border border-zinc-700/50 rounded-xl px-4 py-3 text-white spline-sans-mono-400 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200 cursor-pointer"
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
