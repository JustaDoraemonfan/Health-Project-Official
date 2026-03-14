import { Clock, User, MailIcon } from "lucide-react";

const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

const STATUS_STYLES = {
  confirmed: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  scheduled: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  completed: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  cancelled: "bg-red-500/10 text-red-500 dark:text-red-400",
};

const AVATAR_STYLES = {
  confirmed: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  scheduled: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  completed: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  cancelled: "bg-red-500/10 text-red-500 dark:text-red-400",
};

const AppointmentCard = ({ appointment, onCardClick }) => {
  const status = appointment.status?.toLowerCase() || "pending";

  const statusStyle = STATUS_STYLES[status] || "bg-slate-500/10 text-slate-400";

  const avatarStyle = AVATAR_STYLES[status] || "bg-slate-500/10 text-slate-400";

  const patientName =
    appointment.patient?.name || appointment.patientName || "Unknown Patient";

  const contactInfo = appointment.patient?.email || appointment.phone || null;

  const formattedTime = appointment.time
    ? appointment.time
    : appointment.appointmentDate
      ? new Date(appointment.appointmentDate).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "Time TBD";

  const formattedDate = appointment.appointmentDate
    ? new Date(appointment.appointmentDate).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div
      onClick={() => onCardClick?.(appointment)}
      className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-xl p-5 cursor-pointer transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-sm"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar with initials */}
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium shrink-0 ${avatarStyle}`}
          >
            {getInitials(patientName)}
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-tight">
              {patientName}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              {formattedTime}
              {appointment.duration && (
                <span className="text-slate-300 dark:text-slate-600">·</span>
              )}
              {appointment.duration && <span>{appointment.duration}</span>}
            </p>
          </div>
        </div>

        {/* Status pill */}
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusStyle}`}
        >
          {appointment.status || "pending"}
        </span>
      </div>

      {/* Body */}
      <div className="space-y-2 text-sm">
        {/* Metadata rows */}
        <div className="grid grid-cols-[72px_1fr] gap-y-2 text-xs">
          {appointment.type && (
            <>
              <span className="text-slate-400 dark:text-slate-500 pt-px">
                Type
              </span>
              <span className="text-slate-700 dark:text-slate-300">
                {appointment.type}
              </span>
            </>
          )}

          {appointment.doctor && (
            <>
              <span className="text-slate-400 dark:text-slate-500 pt-px">
                Doctor
              </span>
              <span className="text-slate-700 dark:text-slate-300">
                Dr. {appointment.doctor.name}
                {appointment.doctorProfile?.specialization && (
                  <span className="text-slate-400 dark:text-slate-500">
                    {" "}
                    · {appointment.doctorProfile.specialization}
                  </span>
                )}
              </span>
            </>
          )}

          {contactInfo && (
            <>
              <span className="text-slate-400 dark:text-slate-500 pt-px">
                Contact
              </span>
              <span className="text-blue-500 dark:text-blue-400 truncate">
                {contactInfo}
              </span>
            </>
          )}

          {formattedDate && (
            <>
              <span className="text-slate-400 dark:text-slate-500 pt-px">
                Date
              </span>
              <span className="text-slate-700 dark:text-slate-300">
                {formattedDate}
              </span>
            </>
          )}
        </div>

        {/* Notes */}
        {appointment.notes && (
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg px-3 py-2.5 mt-3">
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {appointment.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;
