// components/consultation/BookConsultation.jsx
import { useState } from "react";
import SearchSection from "../BookConsultant/SearchSection";
import DoctorGrid from "../BookConsultant/DoctorGrid";
import LoadingState from "../BookConsultant/LoadingState";
import EmptyState from "../BookConsultant/EmptyStates";
import { useDoctor } from "../../hooks/useDoctors";
import { useAppointments } from "../../hooks/useAppointments";
import { authAPI } from "../../services/api";
import Header from "../../components/Header";

const BookConsultation = () => {
  const [location, setLocation] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [expandedCards, setExpandedCards] = useState(new Set());

  const {
    doctors,
    isLoadingList,
    isLoadingDetails,
    searchVerifiedDoctors,
    resetSearch,
    assignPatient,
  } = useDoctor();

  const { bookAppointment } = useAppointments();

  const isLoadingState = isLoadingList || isLoadingDetails;

  const handleSearch = async () => {
    setSearchPerformed(true);
    await searchVerifiedDoctors(location);
  };

  const handleReset = async () => {
    setLocation("");
    setSearchPerformed(false);
    setExpandedCards(new Set());
    await resetSearch();
  };

  const handleBookNow = async (data) => {
    try {
      const user = await authAPI.getCurrentUser();
      const payload = {
        ...data,
        patient: user.data._id,
        createdBy: "patient",
      };
      console.log("BookConsultation - Booking payload:", payload);

      const result = bookAppointment(payload);

      assignPatient(payload.doctor, payload.patient);

      // Return the result with success info for the modal to handle
      return {
        success: true,
        message: result?.message || "Appointment booked successfully!",
        data: result,
      };
    } catch (error) {
      console.error("BookConsultation - Booking error:", error);

      // Return error info for the modal to handle
      return {
        success: false,
        message:
          error?.response?.data?.message ||
          "Failed to book appointment. Please try again.",
        error: error,
      };
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
    <section>
      <Header isNotDashboard={true} />
      <div className="min-h-screen p-6 bg-[var(--color-primary)]">
        <div className="max-w-6xl mx-auto py-20">
          {/* Header */}

          <div className="text-center mb-8">
            <h1 className="text-3xl font-light text-[var(--color-secondary)] mb-2">
              BOOK CONSULTATION
            </h1>
            <p className="text-gray-400">
              Find and book appointments with qualified healthcare{" "}
              <span className="text-purple-300">professionals</span>
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
            <LoadingState
              loading={isLoadingList}
              searchLoading={isLoadingDetails}
            />
          ) : (
            <>
              <DoctorGrid
                doctors={doctors.filter(
                  (doc) => doc.isAvailable === "Available"
                )}
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
    </section>
  );
};

export default BookConsultation;
