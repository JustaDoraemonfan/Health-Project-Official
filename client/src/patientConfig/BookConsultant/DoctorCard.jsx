// components/consultation/DoctorCard.jsx - With Details Modal
import { useState } from "react";
import {
  User,
  Clock,
  Star,
  GraduationCap,
  Award,
  Calendar,
  Phone,
  DollarSign,
  Mail,
  MapPin,
  Eye,
  X,
} from "lucide-react";
import { getSpecialtyColor, getDoctorName } from "../../utils/doctorHelpers";
import BookingModal from "./BookingModal";

const DoctorDetailsModal = ({ doctor, isOpen, onClose }) => {
  if (!isOpen) return null;

  const doc = doctor;
  const doctorName = getDoctorName(doc);

  return (
    <div className="fixed inset-0 bg-black/50 google-sans-code-400 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className="bg-[var(--color-secondary)] rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        style={{
          msOverflowStyle: "none",
          scrollbarWidth: "none",
          WebkitScrollbar: { display: "none" },
        }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[var(--color-secondary)] border-b border-gray-700 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <div
                className="w-20 h-20 rounded-xl overflow-hidden relative flex items-center justify-center mr-3 flex-shrink-0
                bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 ring-1 ring-white/10 shadow-inner"
              >
                {doctor.profilePhoto ? (
                  <img
                    src={doctor.profilePhoto}
                    alt={doctorName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/default-doctor.png";
                    }}
                  />
                ) : (
                  <User className="w-8 h-8 text-gray-400" />
                )}
              </div>

              <div>
                <h2 className="text-xl font-light text-[var(--color-primary)] mb-1">
                  {doctorName}
                </h2>
                {/* UPDATED: text-purple-400 -> text-gray-400 for a more subtle look */}
                <div className="flex items-center text-gray-400 text-xs mb-2 break-all">
                  <Mail className="w-4 h-4 mr-2 text-red-300 flex-shrink-0" />
                  Email: {doc.userId?.email}
                </div>
                <div
                  className={`text-xs font-medium ${getSpecialtyColor(
                    doc.specialization
                  )}`}
                >
                  {doc.specialization}
                </div>
              </div>
            </div>

            {/* This new div groups the status and close button */}
            <div className="flex flex-col items-end gap-3 ml-4 flex-shrink-0">
              <button
                onClick={onClose}
                className="p-2 -mt-2 -mr-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
              <div className="flex items-center gap-2">
                <span
                  // UPDATED: Made this a proper badge for better UI
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                    doc.isAvailable
                      ? "bg-green-800/30 text-green-300 border border-green-700/50"
                      : "bg-red-800/30 text-red-300 border border-red-700/50"
                  }`}
                >
                  {doc.isAvailable ? "Available" : "Busy"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Quick Stats Grid - Already Responsive */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-gray-500 uppercase tracking-wide">
                  Experience
                </span>
              </div>
              {/* UPDATED: text-white -> text-gray-100 (softer) */}
              <span className="text-gray-100 font-medium">
                {doc.experience} years
              </span>
            </div>

            <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-green-400" />
                <span className="text-xs text-gray-500 uppercase tracking-wide">
                  Fee
                </span>
              </div>
              {/* UPDATED: text-white -> text-gray-100 (softer) */}
              <span className="text-gray-100 font-medium">
                ${doc.consultationFee}
              </span>
            </div>

            <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-gray-500 uppercase tracking-wide">
                  Location
                </span>
              </div>
              {/* UPDATED: text-white -> text-gray-100 (softer) */}
              <span className="text-gray-100 font-medium text-xs">
                {doc.location}
              </span>
            </div>

            <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-orange-400" />
                <span className="text-xs text-gray-500 uppercase tracking-wide">
                  Next Available
                </span>
              </div>
              {/* UPDATED: text-white -> text-gray-100 (softer) */}
              <span className="text-gray-100 font-medium text-xs">
                {doc.nextAvailable}
              </span>
            </div>
          </div>

          {/* Education & Contact - Already Responsive */}
          <div className="space-y-4">
            <div className="bg-gray-800/20 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="w-5 h-5 text-blue-400" />
                <span className="text-xs text-gray-400 uppercase tracking-wide">
                  Education
                </span>
              </div>
              {/* UPDATED: text-white -> text-gray-200 (good for paragraphs) */}
              <p className="text-gray-200">{doc.education}</p>
            </div>

            <div className="bg-gray-800/20 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Phone className="w-5 h-5 text-green-400" />
                <span className="text-xs text-gray-400 uppercase tracking-wide">
                  Contact
                </span>
              </div>
              {/* UPDATED: text-white -> text-gray-200 */}
              <p className="text-gray-200 font-mono">{doc.phone}</p>
            </div>
          </div>

          {/* Languages - Already Responsive (flex-wrap) */}
          {doc.languages && doc.languages.length > 0 && (
            <div>
              <h3 className="text-xs text-gray-400 mb-3 uppercase tracking-wide">
                Languages
              </h3>
              <div className="flex flex-wrap gap-2">
                {doc.languages.map((lang, index) => (
                  <span
                    key={index}
                    // UPDATED: text-white -> text-gray-200 (softer on dark bg)
                    className="px-3 py-1.5 bg-gray-800 text-gray-200 text-xs rounded-lg border border-gray-700"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Certifications - Already Responsive */}
          {doc.certifications && doc.certifications.length > 0 && (
            <div>
              <h3 className="text-xs text-gray-400 mb-3 uppercase tracking-wide">
                Certifications
              </h3>
              <div className="space-y-2">
                {doc.certifications.map((cert, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 px-3 py-2 bg-blue-900/20 text-blue-300 rounded-lg border border-blue-800/50"
                  >
                    <Award className="w-4 h-4 text-yellow-300 flex-shrink-0" />
                    <span className="text-xs text-[var(--color-primary)]">
                      {cert}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* About - Already Responsive */}
          {doc.about && (
            <div>
              <h3 className="text-xs text-gray-400 mb-3 uppercase tracking-wide">
                About
              </h3>
              <div className="bg-gray-800/20 p-4 rounded-lg border border-gray-700">
                {/* text-gray-300 is perfect for body copy, no change */}
                <p className="text-gray-300 leading-7 tracking-wide">
                  {doc.about}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DoctorCard = ({ doctor, onBookNow, onCall }) => {
  const doc = doctor;
  const doctorName = getDoctorName(doc) || "N/A";
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-[var(--color-secondary)] google-sans-code-400 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                {/* Image */}
                <div
                  className="w-11 h-11 rounded-lg overflow-hidden relative flex items-center justify-center mr-3 flex-shrink-0
  bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 ring-1 ring-white/10 shadow-inner"
                >
                  {doctor.profilePhoto ? (
                    <img
                      src={doctor.profilePhoto}
                      alt={doctorName}
                      className="w-full h-full object-cover"
                      onError={(e) => (e.target.src = "/default-doctor.png")}
                    />
                  ) : (
                    <User className="w-5 h-5 text-gray-400" />
                  )}
                </div>

                {/* Name + Email + Specialization */}
                <div>
                  <h3 className="font-light text-[var(--color-primary)] mb-1">
                    {doctorName}
                  </h3>

                  <div className="flex items-center text-gray-400 font-light text-xs break-all">
                    {doc.userId?.email || "N/A"}
                  </div>

                  <div
                    className={`text-xs mt-1 ${getSpecialtyColor(
                      doc.specialization
                    )}`}
                  >
                    {doc.specialization || "N/A"}
                  </div>
                </div>
              </div>

              {/* Verification */}
              <div className="flex flex-col items-end gap-2 ml-2 flex-shrink-0">
                <div className="flex items-center gap-1 text-xs">
                  <Award className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-100">
                    {doc.verification?.status || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Info */}
          <div className="px-5 pb-4">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 text-gray-400">
                <Clock className="w-4 h-4 text-blue-400" />

                <span className="text-gray-100">
                  {doc.experience ? `${doc.experience}y experience` : "N/A"}
                </span>
              </div>

              <div className="flex items-center gap-2 text-gray-400">
                <DollarSign className="w-4 h-4 text-green-400" />

                <span className="text-gray-100">
                  {doc.consultationFee ? `$${doc.consultationFee}` : "N/A"}
                </span>
              </div>

              <div className="flex items-center gap-2 text-gray-400">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="truncate text-blue-300 hover:text-blue-200 cursor-pointer">
                  {doc.phone || "N/A"}
                </span>
              </div>

              <div className="flex items-center gap-2 text-gray-400">
                <MapPin className="w-4 h-4 text-purple-400" />
                <span className="truncate text-amber-300">
                  {doc.location || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-5 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setIsDetailsModalOpen(true)}
            className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            <span className="text-xs">View Details</span>
          </button>

          <button
            onClick={() => setIsBookingModalOpen(true)}
            disabled={!doc.isAvailable}
            className={`flex-1 py-2.5 px-4 font-light rounded-md transition-all duration-200 ${
              doc.isAvailable
                ? "bg-[var(--color-primary)] hover:bg-white text-gray-900 shadow-sm hover:shadow-md"
                : "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700"
            }`}
          >
            {doc.isAvailable ? "Book Now" : "Not Available"}
          </button>

          <button
            onClick={() => onCall(doc.phone)}
            className="px-4 py-2.5 bg-green-800 hover:bg-green-700 text-green-100 rounded-md transition-colors duration-200 flex items-center justify-center"
          >
            <Phone className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modals */}
      <DoctorDetailsModal
        doctor={doctor}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />

      {isBookingModalOpen && (
        <BookingModal
          doctor={doctor}
          onClose={() => setIsBookingModalOpen(false)}
          onConfirm={onBookNow}
        />
      )}
    </>
  );
};

export default DoctorCard;
