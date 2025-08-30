// components/consultation/BookConsultation.jsx
import { useState } from "react";
import SearchSection from "../../bookConfig/SearchSection";
import DoctorGrid from "../../bookConfig/DoctorGrid";
import LoadingState from "../../bookConfig/LoadingState";
import EmptyState from "../../bookConfig/EmptyStates";
import { useDoctors } from "../../hooks/useDoctors";

const BookConsultation = () => {
  const [location, setLocation] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [expandedCards, setExpandedCards] = useState(new Set());

  const { doctors, loading, searchLoading, searchDoctors, resetSearch } =
    useDoctors();

  const isLoadingState = loading || searchLoading;

  const handleSearch = async () => {
    setSearchPerformed(true);
    await searchDoctors(location);
  };

  const handleReset = async () => {
    setLocation("");
    setSearchPerformed(false);
    setExpandedCards(new Set());
    await resetSearch();
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
        <SearchSection
          location={location}
          setLocation={setLocation}
          onSearch={handleSearch}
          onReset={handleReset}
          isLoading={isLoadingState}
          searchPerformed={searchPerformed}
        />

        {/* Content */}
        {isLoadingState ? (
          <LoadingState loading={loading} searchLoading={searchLoading} />
        ) : (
          <>
            <DoctorGrid
              doctors={doctors}
              location={location}
              searchPerformed={searchPerformed}
              expandedCards={expandedCards}
              onReset={handleReset}
              onBookNow={handleBookNow}
              onCall={handleCall}
              onToggleExpansion={toggleCardExpansion}
              isLoading={isLoadingState}
            />
            {searchPerformed && doctors.length === 0 && (
              <EmptyState location={location} onReset={handleReset} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BookConsultation;
