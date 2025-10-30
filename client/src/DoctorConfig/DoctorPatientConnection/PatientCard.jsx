import {
  Users,
  Calendar,
  Phone,
  MapPin,
  Droplet,
  Activity,
} from "lucide-react";

const PatientCard = ({ patient }) => {
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getStatusColor = (hasSymptoms) => {
    return hasSymptoms
      ? "bg-yellow-100 text-yellow-800"
      : "bg-green-100 text-green-800";
  };

  const userName = patient.userId?.name || "Unknown Patient";
  const userEmail = patient.userId?.email || "No email";

  return (
    <div className="bg-[var(--color-secondary)] rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200">
      {/* Card Header */}
      <div className="bg-[var(--color-secondary)] p-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-blue-600 font-bold text-lg">
            {getInitials(userName)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-lg truncate">
              {userName}
            </h3>
            <p className="text-blue-100 text-sm truncate">{userEmail}</p>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 space-y-3">
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-[var(--color-primary)]" />
            <div>
              <p className="text-xs text-[var(--color-primary)]">Age</p>
              <p className="text-sm text-white  font-medium">
                {patient.age} years
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-[var(--color-primary)]" />
            <div>
              <p className="text-xs text-[var(--color-primary)]">Gender</p>
              <p className="text-sm text-white font-medium capitalize">
                {patient.gender}
              </p>
            </div>
          </div>
        </div>

        {/* Blood Group & Location */}
        <div className="grid grid-cols-2 gap-3">
          {patient.bloodGroup && (
            <div className="flex items-center space-x-2">
              <Droplet className="w-4 h-4 text-red-500" />
              <div>
                <p className="text-xs text-[var(--color-primary)]">
                  Blood Group
                </p>
                <p className="text-sm text-white font-medium">
                  {patient.bloodGroup}
                </p>
              </div>
            </div>
          )}
          {patient.location && (
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-red-100" />
              <div>
                <p className="text-xs text-[var(--color-primary)]">Location</p>
                <p className="text-sm text-white font-medium truncate">
                  {patient.location}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Contact */}
        {patient.contactNumber && (
          <div className="flex items-center space-x-2 pt-2 ">
            <Phone className="w-4 h-4 text-green-500" />
            <div>
              <p className="text-xs text-[var(--color-primary)]">Contact</p>
              <p className="text-sm text-white font-medium">
                {patient.contactNumber}
              </p>
            </div>
          </div>
        )}

        {/* Status Badge */}
        <div className="flex items-center justify-between pt-2">
          <span
            className={`px-3 py-1 rounded-full text-white text-xs font-medium ${getStatusColor(
              patient.symptoms?.length > 0
            )}`}
          >
            {patient.symptoms?.length > 0 ? "Active Symptoms" : "No Symptoms"}
          </span>
          <div className="flex items-center space-x-1 text-[var(--color-primary)]">
            <Calendar className="w-4 h-4" />
            <span className="text-xs">
              {patient.appointments?.length || 0} Appts
            </span>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="bg-[var(--color-secondary)] px-4 py-3 flex space-x-2">
        <button className="flex-1 bg-blue-600 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
          View Details
        </button>
        <button className="px-4 bg-white border border-gray-300 text-gray-700 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
          Contact
        </button>
      </div>
    </div>
  );
};
export default PatientCard;
