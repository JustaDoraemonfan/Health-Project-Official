// components/consultation/BookConsultation.jsx
import { useState } from "react";
import SearchSection from "../../bookConfig/SearchSection";
import DoctorGrid from "../../bookConfig/DoctorGrid";
import LoadingState from "../../bookConfig/LoadingState";
import EmptyState from "../../bookConfig/EmptyStates";
import { useDoctors } from "../../hooks/useDoctors";
import { appointmentAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const BookConsultation = () => {
  const [location, setLocation] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [expandedCards, setExpandedCards] = useState(new Set());
  const { user } = useAuth();

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

  const handleBookNow = async (data) => {
    try {
      const payload = {
        ...data,
        patient: user._id,
        createdBy: "patient",
      };
      console.log(payload);

      await appointmentAPI.bookAppointment(payload);
      alert("Appointment booked successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to book appointment. Please try again.");
    }
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
