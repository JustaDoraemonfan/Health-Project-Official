// components/consultation/EmptyState.jsx
import { Search } from "lucide-react";

const EmptyState = ({ location, onReset }) => {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 bg-gray-900 border border-gray-700 rounded-lg flex items-center justify-center mx-auto mb-6">
        <Search className="w-10 h-10 text-gray-500" />
      </div>
      <h3 className="text-2xl font-bold text-gray-100 mb-3">
        // No doctors found
      </h3>
      <p className="text-gray-400 mb-6">
        {location
          ? `/* No doctors found in "${location}". Try a different location */`
          : "/* No doctors available at the moment */"}
      </p>
      <button
        onClick={onReset}
        className="px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 rounded-md text-gray-100 font-medium transition-all duration-200"
      >
        reset_filters()
      </button>
    </div>
  );
};

export default EmptyState;
