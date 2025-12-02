import React, { useState, useMemo } from "react";
import { Search, Users, Calendar, Activity, Loader2 } from "lucide-react";
import PatientCard from "../DoctorPatientConnection/PatientCard";
import FilterPanel from "../DoctorPatientConnection/FilterPanel";
import { useUser } from "../../hooks/useUser";
import LoadingSpinner from "../../components/LoadingSpinner";
import Header from "../../components/Header";

const PatientDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    gender: "all",
    status: "all",
    location: "all",
  });
  const { user, doctorProfile, isLoading } = useUser();

  // Safely get the patient list, defaulting to an empty array
  const patientList = doctorProfile?.patients || [];

  // Filter patients based on search and filters
  const filteredPatients = useMemo(() => {
    return patientList.filter((patient) => {
      const matchesSearch =
        patient.userId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.userId?.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesGender =
        filters.gender === "all" || patient.gender === filters.gender;

      const matchesStatus =
        filters.status === "all" ||
        (filters.status === "active" && patient.symptoms?.length > 0) ||
        (filters.status === "no-symptoms" && patient.symptoms?.length === 0);

      const matchesLocation =
        filters.location === "all" || patient.location === filters.location;

      return matchesSearch && matchesGender && matchesStatus && matchesLocation;
    });
  }, [searchTerm, filters, patientList]);

  if (isLoading) {
    return <LoadingSpinner message="Loading Patient Data" />;
  }

  // Handle case where user is loaded but isn't a doctor or has no profile
  if (!user || !doctorProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-red-600">
            Error Loading Profile
          </h2>
          <p className="text-gray-600">
            Could not find doctor profile data. Please try logging in again.
          </p>
        </div>
      </div>
    );
  }

  // --- REFACTORED LAYOUT STARTS HERE ---
  return (
    <div className="min-h-screen spline-sans-mono-400 bg-[var(--color-primary)]">
      <Header isNotDashboard={true} />
      {/* Header */}
      <div className="bg-[var(--color-primary)]  pt-20">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Patient Management
              </h1>
              <p className="mt-1 text-base text-purple-600">
                <span className="text-red-400">Dr. {user.name}</span> -{" "}
                {doctorProfile.specialization}
              </p>
            </div>
            <div className="flex items-center space-x-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
              <Users className="h-5 w-5" />
              <span>
                Showing {filteredPatients.length} of {patientList.length}{" "}
                patients
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Section */}

        {/* --- Main Content Grid (Sidebar + Patient List) --- */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* --- 1. Filter Sidebar (Desktop-only) --- */}
          <aside className="hidden lg:col-span-1 lg:block">
            {/* Make the sidebar sticky so filters are always visible */}
            <div className="sticky top-8 space-y-6 rounded-lg bg-white p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                Search & Filter
              </h3>

              {/* Desktop Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-md focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50 text-white placeholder-slate-400 spline-sans-mono-400 text-sm transition-colors disabled:opacity-50"
                />
              </div>

              {/* Desktop Filter Panel */}
              <FilterPanel
                filters={filters}
                setFilters={setFilters}
                patientList={patientList}
                isCollapsible={false} // Always expanded on desktop
              />
            </div>
          </aside>

          {/* --- 2. Main Content Area (Mobile Filters + Patient Grid) --- */}
          <main className="col-span-1 lg:col-span-3">
            {/* --- Mobile Search & Filter (Mobile-only) --- */}
            <div className="mb-6 space-y-4 lg:hidden">
              {/* Mobile Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search patients by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-md focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50 text-white placeholder-slate-400 spline-sans-mono-400 text-sm transition-colors disabled:opacity-50"
                />
              </div>

              {/* Mobile Filter Panel */}
              <FilterPanel
                filters={filters}
                setFilters={setFilters}
                patientList={patientList}
                isCollapsible={true} // Collapsible on mobile
              />
            </div>

            {/* --- Patient Cards Grid --- */}
            {filteredPatients.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-2">
                {filteredPatients.map((patient) => (
                  <PatientCard key={patient._id} patient={patient} />
                ))}
              </div>
            ) : (
              // "No Patients" placeholder
              <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
                <Users className="mx-auto mb-4 h-16 w-16 text-gray-300" />
                <h3 className="mb-2 text-xl font-semibold text-gray-700">
                  No Patients Found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search or filters to find them.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
