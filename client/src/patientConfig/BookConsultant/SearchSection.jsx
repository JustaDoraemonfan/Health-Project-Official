// components/consultation/SearchSection.jsx
import { Search, MapPin } from "lucide-react";
import Button from "../../ui/Button";

const SearchSection = ({ location, setLocation, onSearch, isLoading }) => {
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isLoading) {
      onSearch();
    }
  };

  return (
    <div className="mb-8 spline-sans-mono-400">
      {/* UPDATED: flex-col sm:flex-row */}
      <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-300" />
          <input
            type="text"
            placeholder="Enter your location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[var(--color-secondary)] border border-gray-700 rounded-md text-gray-100 placeholder-slate-500 focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-600 transition-colors"
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
        </div>
        <Button
          variant="secondary"
          onClick={onSearch}
          disabled={isLoading}
          loading={isLoading}
        >
          <Search className="w-4 h-4" />
          {isLoading ? "Searching..." : "Search"}
        </Button>
      </div>
    </div>
  );
};

export default SearchSection;
