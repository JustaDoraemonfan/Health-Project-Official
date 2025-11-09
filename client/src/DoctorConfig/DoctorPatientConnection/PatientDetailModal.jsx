import {
  Users,
  Calendar,
  Phone,
  MapPin,
  X,
  Clock,
  FileText,
  Pill,
  AlertCircle,
  Scissors,
  ClipboardList,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// MODIFICATION 1: Added 'appointments = []' as a new prop
const PatientDetailsModal = ({
  patient,
  appointments = [],
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  if (!isOpen) return null;

  const userName = patient.userId?.name || "Unknown Patient";
  const userEmail = patient.userId?.email || "No email";

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      scheduled: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      pending: "bg-yellow-100 text-yellow-800",
    };
    return statusColors[status] || "bg-gray-100 text-[var(--color-primary)]";
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--color-secondary)] rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="bg-[var(--color-secondary)] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-blue-600 font-bold text-2xl">
              {getInitials(userName)}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{userName}</h2>
              <p className="text-blue-100">{userEmail}</p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto no-scrollbar">
          {/* Basic Information */}
          <section className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-600" />
              Basic Information
            </h3>
            {/* ... Basic info grid ... (no changes) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-800 p-3 rounded-lg">
                <p className="text-xs text-white mb-1">Age</p>
                <p className="text-sm font-semibold text-[var(--color-primary)]">
                  {patient.age} years
                </p>
              </div>
              <div className="bg-slate-800 p-3 rounded-lg">
                <p className="text-xs text-white mb-1">Gender</p>
                <p className="text-sm font-semibold text-[var(--color-primary)] capitalize">
                  {patient.gender}
                </p>
              </div>
              {patient.bloodGroup && (
                <div className="bg-slate-800 p-3 rounded-lg">
                  <p className="text-xs text-white mb-1">Blood Group</p>
                  <p className="text-sm font-semibold text-red-600">
                    {patient.bloodGroup}
                  </p>
                </div>
              )}
              {patient.contactNumber && (
                <div className="bg-slate-800 p-3 rounded-lg">
                  <p className="text-xs text-white mb-1">Contact</p>
                  <p className="text-sm font-semibold text-[var(--color-primary)]">
                    {patient.contactNumber}
                  </p>
                </div>
              )}
              {patient.location && (
                <div className="bg-slate-800 p-3 rounded-lg col-span-2">
                  <p className="text-xs text-white mb-1">Location</p>
                  <p className="text-sm font-semibold text-[var(--color-primary)]">
                    {patient.location}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* MODIFICATION 2: Added Appointments Section */}
          <section className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              Appointments ({appointments.length})
            </h3>
            {appointments && appointments.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto no-scrollbar border border-slate-700 rounded-lg p-2">
                {appointments.map((appointment) => (
                  <div
                    key={appointment._id}
                    className="bg-slate-800 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2 flex-wrap gap-y-1">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(
                              appointment.status
                            )}`}
                          >
                            {appointment.status}
                          </span>
                          <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800 capitalize">
                            {appointment.type}
                          </span>
                          <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                            {appointment.mode}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-white">
                          {appointment.reasonForVisit}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-400">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(appointment.appointmentDate)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {appointment.appointmentTime}
                      </div>
                      {appointment.location && (
                        <div className="flex items-center col-span-2">
                          <MapPin className="w-4 h-4 mr-1" />
                          {appointment.location}
                        </div>
                      )}
                    </div>
                    {appointment.notes && (
                      <p className="text-xs text-gray-300 mt-2 italic">
                        Notes: {appointment.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-white">No appointments scheduled.</p>
            )}
          </section>

          {/* Symptoms */}
          {patient.symptoms && patient.symptoms.length > 0 && (
            <section className="mb-6">
              {/* ... symptoms section (no changes) ... */}
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-yellow-600" />
                Active Symptoms ({patient.symptoms.length})
              </h3>
              <div className="bg-yellow-100 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 flex justify-between">
                  Patient has {patient.symptoms.length} active symptom(s) on
                  record.
                  <button
                    className="text-green-700 hover:text-green-950 hover:cursor-pointer font-medium"
                    onClick={() => navigate("/doctor/symptoms")}
                  >
                    ~Go to Symptoms
                  </button>
                </p>
              </div>
            </section>
          )}

          {/* Allergies */}
          <section className="mb-6">
            {/* ... allergies section (no changes) ... */}
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
              Allergies
            </h3>
            {patient.allergies && patient.allergies.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {patient.allergies.map((allergy, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                  >
                    {allergy}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-white">No known allergies</p>
            )}
          </section>

          {/* Medical History */}
          <section className="mb-6">
            {/* ... medical history section (no changes) ... */}
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <ClipboardList className="w-5 h-5 mr-2 text-blue-600" />
              Medical History
            </h3>
            {patient.medicalHistory && patient.medicalHistory.length > 0 ? (
              <div className="space-y-2">
                {patient.medicalHistory.map((item, index) => (
                  <div
                    key={item._id || index} // Use _id for a more stable key
                    className="bg-slate-800 p-3 rounded-lg text-sm text-white"
                  >
                    <p className="font-semibold capitalize">{item.condition}</p>
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span className="capitalize">Status: {item.status}</span>
                      <span>Diagnosed: {formatDate(item.diagnosedDate)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-white">No medical history recorded</p>
            )}
          </section>

          {/* Current Medications */}
          {/* Current Medications */}
          <section className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Pill className="w-5 h-5 mr-2 text-green-600" />
              Current Medications
            </h3>
            {patient.medications && patient.medications.length > 0 ? (
              <div className="space-y-2">
                {patient.medications.map((med, index) => (
                  <div
                    key={med._id || index} // Use _id for a stable key
                    className="bg-green-100 p-3 rounded-lg text-sm text-green-900"
                  >
                    <p className="font-semibold capitalize">{med.name}</p>
                    <div className="flex justify-between text-xs text-green-800 mt-1">
                      <span className="capitalize">
                        {med.dosage} - {med.frequency}
                      </span>
                      {/* Conditionally render prescribedBy if it exists */}
                      {med.prescribedBy && (
                        <span className="capitalize">
                          Prescribed: {med.prescribedBy}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-white">No current medications</p>
            )}
          </section>

          {/* Surgeries */}
          {/* Surgeries */}
          <section className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Scissors className="w-5 h-5 mr-2 text-purple-600" />
              Surgical History
            </h3>
            {patient.surgeries && patient.surgeries.length > 0 ? (
              <div className="space-y-2">
                {patient.surgeries.map((surgery, index) => (
                  <div
                    key={surgery._id || index} // Use _id for a stable key
                    className="bg-purple-100 p-3 rounded-lg text-sm text-purple-900"
                  >
                    <p className="font-semibold capitalize">{surgery.name}</p>
                    <div className="flex justify-between text-xs text-purple-800 mt-1">
                      <span className="capitalize">
                        {surgery.hospital || "N/A"}
                      </span>
                      <span>
                        {surgery.date ? formatDate(surgery.date) : "N/Note"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-white">No surgical history</p>
            )}
          </section>
          {/* Reports */}
          <section className="mb-6">
            {/* ... reports section (no changes) ... */}
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-indigo-600" />
              Reports
            </h3>
            {patient.reports && patient.reports.length > 0 ? (
              <div className="space-y-2">
                {patient.reports.map((report, index) => (
                  <div
                    key={index}
                    className="bg-indigo-100 p-3 rounded-lg text-sm text-indigo-900"
                  >
                    {report}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-white">No reports available</p>
            )}
          </section>

          {/* Registration Info */}
          {patient.createdAt && patient.updatedAt && (
            <section className="border-t border-slate-700 pt-4 text-xs text-gray-400">
              {/* ... registration info (no changes) ... */}
              <p>Patient since: {formatDate(patient.createdAt)}</p>
              <p>Last updated: {formatDate(patient.updatedAt)}</p>
            </section>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-[var(--color-secondary)] border-t border-slate-700 px-6 py-4 flex justify-end space-x-3">
          {/* ... footer buttons (no changes) ... */}y{" "}
          <button
            onClick={onClose}
            className="px-4 py-2 border text-sm bg-gray-200 hover:cursor-point border-gray-300 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
          <button className="px-4 py-2 text-sm bg-green-600 hover:cursor-point text-white rounded-md hover:bg-green-700 transition-colors">
            Edit Patient
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientDetailsModal;
