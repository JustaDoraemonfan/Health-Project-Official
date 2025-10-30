import React, { useState, useMemo } from "react";
import {
  Search,
  Users,
  Calendar,
  Activity,
  Loader2, // Import a loader icon
} from "lucide-react";
import PatientCard from "../DoctorPatientConnection/PatientCard";
import FilterPanel from "../DoctorPatientConnection/FilterPanel";
import StatsCard from "../DoctorPatientConnection/StatsCard";
// import { useDoctor } from "../../hooks/useDoctors"; // This is no longer needed
import { useUser } from "../../hooks/useUser";

const PatientDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ gender: "all", status: "all" });

  // --- FIX 1: Get all the data you need from your hook ---
  // We now get isLoading and the already-separated doctorProfile
  const { user, doctorProfile, isLoading } = useUser();

  // --- FIX 4: Remove the redundant useEffect ---
  // Your useUser() hook already fetches the user on mount,
  // so this useEffect is no longer needed.
  // useEffect(() => {
  //   getCurrentUser();
  // }, []);

  // Safely get the patient list, defaulting to an empty array
  const patientList = doctorProfile?.patients || [];

  // Filter patients based on search and filters
  const filteredPatients = useMemo(() => {
    // We use `patientList` from above
    return patientList.filter((patient) => {
      const matchesSearch =
        patient.userId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.userId?.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesGender =
        filters.gender === "all" || patient.gender === filters.gender;

      // Logic for status looks correct
      const matchesStatus =
        filters.status === "all" ||
        (filters.status === "active" && patient.symptoms?.length > 0) ||
        (filters.status === "no-symptoms" && patient.symptoms?.length === 0);

      return matchesSearch && matchesGender && matchesStatus;
    });
  }, [searchTerm, filters, patientList]); // <-- FIX: Depend on patientList

  // Calculate stats
  const stats = useMemo(() => {
    // We use `patientList` from above
    const totalPatients = patientList.length;
    const activeSymptoms = patientList.filter(
      (p) => p.symptoms?.length > 0
    ).length;
    const totalAppointments = patientList.reduce(
      (sum, p) => sum + (p.appointments?.length || 0),
      0
    );

    return { totalPatients, activeSymptoms, totalAppointments };
  }, [patientList]); // <-- FIX: Depend on patientList

  // --- FIX 2: Add a loading state ---
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
          <p className="text-lg text-gray-700">Loading Patient Data...</p>
        </div>
      </div>
    );
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

  // --- FIX 3: Update data paths in JSX ---
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Patient Management
              </h1>
              <p className="mt-1 text-gray-600">
                {/* Use user.name and doctorProfile.specialization */}
                Dr. {user.name} - {doctorProfile.specialization}
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Users className="h-5 w-5" />
              <span>
                {/* Use patientList.length */}
                {filteredPatients.length} of {patientList.length} patients
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Section */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatsCard
            title="Total Patients"
            value={stats.totalPatients}
            icon={Users}
            color="bg-blue-500"
          />
          <StatsCard
            title="Active Symptoms"
            value={stats.activeSymptoms}
            icon={Activity}
            color="bg-yellow-500"
          />
          <StatsCard
            title="Total Appointments"
            value={stats.totalAppointments}
            icon={Calendar}
            color="bg-green-500"
          />
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="hidden lg:block">
            <FilterPanel filters={filters} setFilters={setFilters} />
          </div>
        </div>

        {/* Mobile Filter */}
        <div className="mb-6 lg:hidden">
          <FilterPanel filters={filters} setFilters={setFilters} />
        </div>

        {/* Patient Cards Grid */}
        {filteredPatients.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPatients.map((patient) => (
              <PatientCard key={patient._id} patient={patient} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg bg-white p-12 text-center shadow-md">
            <Users className="mx-auto mb-4 h-16 w-16 text-gray-300" />
            <h3 className="mb-2 text-xl font-semibold text-gray-700">
              No Patients Found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
