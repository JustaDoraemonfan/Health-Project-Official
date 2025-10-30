import { Filter } from "lucide-react";

const FilterPanel = ({ filters, setFilters }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
      <div className="flex items-center space-x-2 text-gray-700 font-semibold">
        <Filter className="w-5 h-5" />
        <span>Filters</span>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Gender
        </label>
        <select
          value={filters.gender}
          onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All</option>
          <option value="active">Active Symptoms</option>
          <option value="no-symptoms">No Symptoms</option>
        </select>
      </div>

      <button
        onClick={() => setFilters({ gender: "all", status: "all" })}
        className="w-full bg-gray-100 text-gray-700 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
      >
        Reset Filters
      </button>
    </div>
  );
};
export default FilterPanel;
