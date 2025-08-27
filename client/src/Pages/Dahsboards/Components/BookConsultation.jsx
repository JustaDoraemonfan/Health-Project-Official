import { useState } from "react";
import { Search, MapPin, User, Clock } from "lucide-react";

const BookConsultation = () => {
  const [location, setLocation] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);

  // Mock doctor data
  const doctors = [
    {
      id: 1,
      name: "Dr. Sarah Chen",
      specialty: "Cardiologist",
      experience: 12,
      location: "Downtown Medical Center",
      availability: " Today",
      image: "SC",
    },
    {
      id: 2,
      name: "Dr. Michael Rodriguez",
      specialty: "Neurologist",
      experience: 8,
      location: "City General Hospital",
      availability: " Tomorrow",
      image: "MR",
    },
    {
      id: 3,
      name: "Dr. Emily Johnson",
      specialty: "Dermatologist",
      experience: 15,
      location: "Wellness Clinic",
      availability: " Today",
      image: "EJ",
    },
    {
      id: 4,
      name: "Dr. David Kim",
      specialty: "Orthopedic",
      experience: 10,
      location: "Sports Medicine Center",
      availability: "Next Week",
      image: "DK",
    },
    {
      id: 5,
      name: "Dr. Lisa Thompson",
      specialty: "Pediatrician",
      experience: 18,
      location: "Children's Health Clinic",
      availability: " Today",
      image: "LT",
    },
    {
      id: 6,
      name: "Dr. James Wilson",
      specialty: "Psychiatrist",
      experience: 14,
      location: "Mental Health Center",
      availability: " Tomorrow",
      image: "JW",
    },
  ];

  const handleSearch = () => {
    setSearchPerformed(true);
  };

  const handleBookNow = (doctorName) => {
    alert(`Booking consultation with ${doctorName}`);
  };

  // Get availability status styling
  const getAvailabilityStyle = (availability) => {
    switch (availability) {
      case " Today":
        return "bg-green-900/40 text-green-300 border border-green-700 shadow-green-900/20";
      case " Tomorrow":
        return "bg-blue-900/40 text-blue-300 border border-blue-700 shadow-blue-900/20";
      case "Next Week":
        return "bg-yellow-900/40 text-yellow-300 border border-yellow-700 shadow-yellow-900/20";
      default:
        return "bg-gray-900/40 text-gray-400 border border-gray-700";
    }
  };

  // Get specialty color
  const getSpecialtyColor = (specialty) => {
    const colors = {
      Cardiologist: "text-red-400",
      Neurologist: "text-purple-400",
      Dermatologist: "text-pink-400",
      Orthopedic: "text-orange-400",
      Pediatrician: "text-green-400",
      Psychiatrist: "text-blue-400",
    };
    return colors[specialty] || "text-gray-400";
  };

  return (
    <div
      className="min-h-screen p-6"
      style={{
        backgroundColor: "#161515",
        fontFamily:
          'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-100 mb-2">
            Book Consultation
          </h1>
          <p className="text-gray-400">
            Find and book appointments with qualified healthcare professionals
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <div className="flex gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Enter your location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-600 transition-colors"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 rounded-md text-gray-100 transition-all duration-200 hover:shadow-lg hover:shadow-gray-900/20 flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Search
            </button>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-100">
            Available doctors:{" "}
            <span className="text-green-400">{doctors.length}</span>
          </h2>
          <div className="text-sm text-gray-400">
            /* {location || "all_locations"} */
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-gray-900 border border-gray-800 rounded-lg p-6 transition-all duration-200 hover:border-gray-600 hover:shadow-lg hover:shadow-gray-900/30 group"
            >
              {/* Doctor Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center mr-3 group-hover:bg-amber-500 transition-colors">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-100">
                      {doctor.name}
                    </h3>
                  </div>
                </div>
                {/* Availability Badge */}
                <div
                  className={`px-3 py-1 rounded-md text-xs font-medium ${getAvailabilityStyle(
                    doctor.availability
                  )} shadow-md whitespace-nowrap`}
                >
                  {doctor.availability}
                </div>
              </div>

              {/* Doctor Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-300">
                  <span className="font-medium">Specialty:</span>
                  <span
                    className={`ml-2 ${getSpecialtyColor(doctor.specialty)}`}
                  >
                    {doctor.specialty}
                  </span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-gray-400">
                    {doctor.experience} years experience
                  </span>
                </div>
                <div className="flex items-center text-gray-300">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-gray-400 text-sm">
                    {doctor.location}
                  </span>
                </div>
              </div>

              {/* Book Now Button */}
              <button
                onClick={() => handleBookNow(doctor.name)}
                className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 border border-slate-300 hover:border-slate-400 rounded-md text-black font-medium transition-all duration-200 hover:shadow-md"
              >
                Book Now
              </button>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {searchPerformed && doctors.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-900 border border-gray-700 rounded-lg flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-100 mb-3">
              // No doctors found
            </h3>
            <p className="text-gray-400 mb-6">
              /* Try searching in a different location */
            </p>
            <button
              onClick={() => {
                setLocation("");
                setSearchPerformed(false);
              }}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 rounded-md text-gray-100 font-medium transition-all duration-200"
            >
              reset_filters()
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookConsultation;
