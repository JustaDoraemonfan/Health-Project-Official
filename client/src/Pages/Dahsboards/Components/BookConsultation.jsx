import { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  User,
  Clock,
  Star,
  GraduationCap,
  Award,
  Calendar,
  Phone,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Mail,
} from "lucide-react";
import { doctorAPI } from "../../../services/api";
const BookConsultation = () => {
  const [location, setLocation] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [expandedCards, setExpandedCards] = useState(new Set());

  // Load all doctors initially
  useEffect(() => {
    const fetchAllDoctors = async () => {
      setLoading(true);
      try {
        const response = await doctorAPI.getDoctors();
        const data = response.data.data;
        console.log(data);
        setDoctors(data);
      } catch (err) {
        console.error("Failed to fetch doctors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllDoctors();
  }, []);

  const handleSearch = async () => {
    setSearchPerformed(true);

    if (!location.trim()) {
      // If no location entered, reload all doctors
      try {
        setSearchLoading(true);
        const response = await doctorAPI.getDoctors();
        const data = response.data.data;
        setDoctors(data);
      } catch (err) {
        console.error("Failed to fetch all doctors:", err);
      } finally {
        setSearchLoading(false);
      }
      return;
    }

    try {
      setSearchLoading(true);
      // Use the searchDoctors API endpoint
      const response = await doctorAPI.searchDoctors(location);
      const data = response.data.data || response.data; // Handle different response structures
      console.log("Search results:", data);
      setDoctors(data);
    } catch (err) {
      console.error("Failed to search doctors:", err);
      // If search fails, you might want to show an error message
      setDoctors([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleReset = async () => {
    setLocation("");
    setSearchPerformed(false);
    setExpandedCards(new Set()); // Reset expanded cards

    try {
      setSearchLoading(true);
      const response = await doctorAPI.getDoctors();
      const data = response.data.data;
      setDoctors(data);
    } catch (err) {
      console.error("Failed to fetch all doctors:", err);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleBookNow = (doctorName) => {
    alert(`Booking consultation with ${doctorName}`);
  };

  const handleCall = (phone) => {
    window.open(`tel:${phone}`);
  };

  const toggleCardExpansion = (doctorId) => {
    const newExpandedCards = new Set(expandedCards);
    if (expandedCards.has(doctorId)) {
      newExpandedCards.delete(doctorId);
    } else {
      newExpandedCards.add(doctorId);
    }
    setExpandedCards(newExpandedCards);
  };

  // Get availability status styling
  const getAvailabilityStyle = (isAvailable) => {
    return isAvailable
      ? "bg-green-900/40 text-green-300 border border-green-700 shadow-green-900/20"
      : "bg-red-900/40 text-red-300 border border-red-700 shadow-red-900/20";
  };

  // Get specialty color
  const getSpecialtyColor = (specialty) => {
    const colors = {
      Cardiologist: "text-red-400",
      Neurologist: "text-purple-400",
      Dermatologist: "text-pink-400",
      "Orthopedic Surgeon": "text-orange-400",
      Pediatrician: "text-green-400",
      Psychiatrist: "text-blue-400",
    };
    return colors[specialty] || "text-gray-400";
  };

  const isLoadingState = loading || searchLoading;

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
                onKeyPress={(e) =>
                  e.key === "Enter" && !isLoadingState && handleSearch()
                }
                disabled={isLoadingState}
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={isLoadingState}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 rounded-md text-gray-100 transition-all duration-200 hover:shadow-lg hover:shadow-gray-900/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Search className="w-4 h-4" />
              {searchLoading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-100">
            Available doctors:{" "}
            <span className="text-green-400">{doctors.length}</span>
          </h2>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-400">
              Location Key: {location || "all_locations"}
            </div>
            {searchPerformed && (
              <button
                onClick={handleReset}
                disabled={isLoadingState}
                className="text-sm text-blue-400 hover:text-blue-300 underline disabled:opacity-50"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoadingState && (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-2 border-gray-700 border-t-gray-400 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">
              {loading ? "Loading doctors..." : "Searching..."}
            </p>
          </div>
        )}

        {/* Doctors Grid */}
        {!isLoadingState && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {doctors.map((doc) => {
              const isExpanded = expandedCards.has(doc.id);

              return (
                <div
                  key={doc.id}
                  className="bg-gray-900 border border-gray-800 rounded-lg p-6 transition-all duration-200 hover:border-gray-600 hover:shadow-lg hover:shadow-gray-900/30 group"
                >
                  {/* Doctor Header - Always Visible */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center mr-3 group-hover:bg-amber-500 transition-colors">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-100">
                          {doc.userId?.name}
                        </h3>
                        <div className="flex items-center mt-1 text-gray-300">
                          <Mail className="w-4 h-4 mr-1" />
                          <span className="text-sm">{doc.userId?.email}</span>
                        </div>
                      </div>
                    </div>
                    {/* Availability Badge - Always Visible */}
                    <div
                      className={`px-3 py-1 rounded-md text-xs font-medium ${getAvailabilityStyle(
                        doc.isAvailable
                      )} shadow-md whitespace-nowrap`}
                    >
                      {doc.isAvailable ? "Available" : "Busy"}
                    </div>
                  </div>

                  {/* Expand/Collapse Button */}
                  <button
                    onClick={() => toggleCardExpansion(doc.id)}
                    className="w-full flex items-center justify-center gap-2 py-2 mb-4 text-gray-400 hover:text-gray-300 transition-colors border border-gray-700 hover:border-gray-600 rounded-md"
                  >
                    <span className="text-sm">
                      {isExpanded ? "Hide Details" : "View Details"}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  {/* Expandable Content */}
                  {isExpanded && (
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-gray-300">
                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-2" />
                        <span className="text-yellow-400 font-medium">
                          {doc.rating}
                        </span>
                        <span className="text-gray-400 ml-2 text-xs">
                          ({doc.reviewCount} reviews)
                        </span>
                      </div>

                      <div className="flex items-center text-gray-300">
                        <span className="font-medium">Specialty:</span>
                        <span
                          className={`ml-2 ${getSpecialtyColor(
                            doc.specialization
                          )}`}
                        >
                          {doc.specialization}
                        </span>
                      </div>

                      <div className="flex items-center text-gray-300">
                        <Clock className="w-4 h-4 mr-2" />
                        <span className="text-gray-400 text-sm">
                          {doc.experience} years experience
                        </span>
                      </div>

                      <div className="flex items-center text-gray-300">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="text-gray-400 text-sm">
                          {doc.location}
                        </span>
                      </div>

                      <div className="flex items-center text-gray-300">
                        <GraduationCap className="w-4 h-4 mr-2" />
                        <span className="text-gray-400 text-sm">
                          {doc.education}
                        </span>
                      </div>

                      <div className="flex items-center text-gray-300">
                        <DollarSign className="w-4 h-4 mr-2" />
                        <span className="text-gray-400 text-sm">
                          ${doc.consultationFee} consultation
                        </span>
                      </div>

                      <div className="flex items-center text-gray-300">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="text-gray-400 text-sm">
                          Next: {doc.nextAvailable}
                        </span>
                      </div>

                      <div className="flex items-center text-gray-300">
                        <Phone className="w-4 h-4 mr-2" />
                        <span className="text-gray-400 text-sm">
                          {doc.phone}
                        </span>
                      </div>

                      {doc.languages && doc.languages.length > 0 && (
                        <div className="mt-3">
                          <div className="text-xs text-gray-500 mb-1">
                            Languages:
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {doc.languages.map((lang, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded border border-gray-700"
                              >
                                {lang}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {doc.certifications && doc.certifications.length > 0 && (
                        <div className="mt-3">
                          <div className="text-xs text-gray-500 mb-1">
                            Certifications:
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {doc.certifications.map((cert, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-900/30 text-blue-300 text-xs rounded border border-blue-800"
                              >
                                <Award className="w-3 h-3 inline mr-1" />
                                {cert}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {doc.about && (
                        <div className="mt-3 p-3 bg-gray-800/50 rounded border border-gray-700">
                          <p className="text-gray-400 text-sm leading-relaxed">
                            {doc.about}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons - Always Visible */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleBookNow(doc.userId?.name)}
                      disabled={!doc.isAvailable}
                      className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
                        doc.isAvailable
                          ? "bg-slate-100 hover:bg-slate-200 border border-slate-300 hover:border-slate-400 text-black hover:shadow-md"
                          : "bg-gray-800 border border-gray-700 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {doc.isAvailable ? "Book Now" : "Not Available"}
                    </button>
                    <button
                      onClick={() => handleCall(doc.phone)}
                      className="px-3 py-2 bg-green-800 hover:bg-green-700 border border-green-700 hover:border-green-600 rounded-md text-green-100 transition-all duration-200 hover:shadow-md"
                    >
                      <Phone className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoadingState && searchPerformed && doctors.length === 0 && (
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
              onClick={handleReset}
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
