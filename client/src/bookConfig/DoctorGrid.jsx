// components/consultation/DoctorGrid.jsx - Clean Professional Version
import { Users, MapPin, X } from "lucide-react";
import DoctorCard from "./DoctorCard";

const DoctorGrid = ({
  doctors,
  location,
  searchPerformed,
  expandedCards,
  onReset,
  onBookNow,
  onCall,
  onToggleExpansion,
  isLoading,
}) => {
  if (doctors.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-5">
        <div className="flex items-center justify-between">
          {/* Left - Results */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-md border border-green-500/20">
              <Users className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-100">
                Available Doctors
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>Found</span>
                <span className="px-2 py-0.5 bg-green-500/20 text-green-300 rounded text-xs font-medium">
                  {doctors.length}
                </span>
                <span>{doctors.length === 1 ? "doctor" : "doctors"}</span>
              </div>
            </div>
          </div>

          {/* Right - Location and Controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-md border border-gray-700">
              <MapPin className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-300 google-sans-code-400">
                {location || "all locations"}
              </span>
            </div>

            {searchPerformed && (
              <button
                onClick={onReset}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-md border border-transparent hover:border-blue-500/30 transition-colors disabled:opacity-50"
              >
                <X className="w-3 h-3" />
                <span className="text-xs font-medium">Clear</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        {doctors.map((doctor) => (
          <DoctorCard
            key={doctor.id}
            doctor={doctor}
            isExpanded={expandedCards.has(doctor.id)}
            onToggleExpansion={() => onToggleExpansion(doctor.id)}
            onBookNow={onBookNow}
            onCall={onCall}
          />
        ))}
      </div>
    </div>
  );
};

export default DoctorGrid;
