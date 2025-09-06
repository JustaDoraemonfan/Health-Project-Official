// components/consultation/DoctorCard.jsx - Clean Professional Version
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
  ChevronDown,
  ChevronUp,
  Mail,
  MapPin,
} from "lucide-react";
import { getSpecialtyColor, getDoctorName } from "../../utils/doctorHelpers";
import BookingModal from "./BookingModal";

const DoctorCard = ({
  doctor,
  isExpanded,
  onToggleExpansion,
  onBookNow,
  onCall,
}) => {
  const doc = doctor;
  const doctorName = getDoctorName(doc);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-[var(--color-secondary)] rounded-lg shadow-lg hover:shadow-lg transition-all duration-200">
      {/* Header */}
      <div className="p-5 ">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="w-11 h-11 bg-[var(--color-primary)] rounded-lg flex items-center justify-center mr-3">
              <User className="w-5 h-5 text-[var(--color-secondary)]" />
            </div>
            <div>
              <h3 className="font-light text-[var(--color-primary)] mb-1">
                {doctorName}
              </h3>
              <div className="flex items-center text-gray-400 font-medium text-xs">
                <Mail className="w-3 h-3 mr-1" />
                {doc.userId?.email}
              </div>
              <div
                className={`text-xs mt-1 ${getSpecialtyColor(
                  doc.specialization
                )}`}
              >
                {doc.specialization}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                doc.isAvailable
                  ? "bg-green-900/40 text-green-300 border border-green-800"
                  : "bg-red-900/40 text-red-300 border border-red-800"
              }`}
            >
              {doc.isAvailable ? "Available" : "Busy"}
            </span>

            <div className="flex items-center gap-1 text-xs">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span className="text-yellow-400 font-medium">{doc.rating}</span>
              <span className="text-gray-500">({doc.reviewCount})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Toggle Details */}
      <div className="px-5 py-3">
        <button
          onClick={onToggleExpansion}
          className="w-full flex items-center justify-center gap-2 py-2 text-gray-400 hover:text-[var(--color-secondary)] hover:bg-gray-800/50 rounded-md transition-colors"
        >
          <span className="text-xs">
            {isExpanded ? "Hide Details" : "View Details"}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Expandable Details */}
      {isExpanded && (
        <div className="p-5 space-y-4 bg-[var(--color-primary)] ">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-[var(--color-secondary)]">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>{doc.experience}y exp</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--color-secondary)]">
              <DollarSign className="w-4 h-4 text-gray-400" />
              <span>${doc.consultationFee}</span>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-[var(--color-secondary)]">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>{doc.location}</span>
            </div>

            <div className="flex items-center gap-2 text-[var(--color-secondary)]">
              <GraduationCap className="w-4 h-4 text-gray-400" />
              <span className="truncate">{doc.education}</span>
            </div>

            <div className="flex items-center gap-2 text-[var(--color-secondary)]">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>Next: {doc.nextAvailable}</span>
            </div>

            <div className="flex items-center gap-2 text-[var(--color-secondary)]">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="google-sans-code-400 text-xs">{doc.phone}</span>
            </div>
          </div>

          {/* Languages */}
          {doc.languages && doc.languages.length > 0 && (
            <div>
              <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">
                Languages
              </div>
              <div className="flex flex-wrap gap-1">
                {doc.languages.map((lang, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-800 text-[var(--color-secondary)] text-xs rounded border border-gray-700"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {doc.certifications && doc.certifications.length > 0 && (
            <div>
              <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">
                Certifications
              </div>
              <div className="flex flex-wrap gap-1">
                {doc.certifications.map((cert, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-1 px-2 py-1 bg-blue-900/30 text-blue-300 text-xs rounded border border-blue-800"
                  >
                    <Award className="w-3 h-3" />
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* About */}
          {doc.about && (
            <div className="p-3 bg-gray-800/30 rounded-md border border-gray-700">
              <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
                About
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                {doc.about}
              </p>
            </div>
          )}
        </div>
      )}
      {isModalOpen && (
        <BookingModal
          doctor={doctor}
          onClose={() => setIsModalOpen(false)}
          onConfirm={onBookNow}
        />
      )}

      {/* Action Buttons */}
      <div className="p-5 flex gap-3">
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={!doc.isAvailable}
          className={`flex-1 py-2.5 px-4 font-light rounded-md hover:cursor-pointer transition-all duration-200 ${
            doc.isAvailable
              ? "bg-[var(--color-primary)] hover:bg-white text-gray-900 shadow-sm hover:shadow-md"
              : "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700"
          }`}
        >
          {doc.isAvailable ? "Book Now" : "Not Available"}
        </button>

        <button
          onClick={() => onCall(doc.phone)}
          className="px-4 py-2.5 bg-green-800 hover:bg-green-700 text-green-100 rounded-md transition-colors duration-200"
        >
          <Phone className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default DoctorCard;
