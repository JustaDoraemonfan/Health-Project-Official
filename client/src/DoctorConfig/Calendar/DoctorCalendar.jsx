import React, { useState, useMemo, useEffect, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Calendar,
  Clock,
  User,
  FileText,
  AlertCircle,
  CheckCircle,
  WifiOff,
  RefreshCw,
  X,
} from "lucide-react";
import { doctorAPI } from "../../services/api";
import { useAppointments } from "../../hooks/useAppointments";

// ─── Helpers ────────────────────────────────────────────────────────────────

const DAY_ORDER = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const safeString = (val, fallback = "") =>
  typeof val === "string" && val.trim() ? val.trim() : fallback;

const safeNumber = (val, fallback = 0) =>
  typeof val === "number" && isFinite(val) ? val : fallback;

function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
}

function parseAppointmentTime(dateVal, timeStr) {
  try {
    const base = new Date(dateVal);
    if (isNaN(base.getTime())) return null;

    const parts = String(timeStr || "")
      .split(":")
      .map(Number);
    if (parts.length < 2 || parts.some(isNaN)) return null;

    const [hours, minutes] = parts;
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;

    base.setHours(hours, minutes, 0, 0);
    return base;
  } catch {
    return null;
  }
}

function parseSlotTime(dateBase, timeStr) {
  try {
    const [h, m] = String(timeStr || "")
      .split(":")
      .map(Number);
    if (isNaN(h) || isNaN(m)) return null;
    const d = new Date(dateBase);
    d.setHours(h, m, 0, 0);
    return d;
  } catch {
    return null;
  }
}

function getAppointmentColor(type, status) {
  const s = safeString(status).toLowerCase();
  if (s === "urgent") return "#dc2626";
  if (s === "pending") return "#ea580c";
  if (s === "cancelled") return "#6b7280";

  switch (safeString(type).toLowerCase()) {
    case "emergency":
      return "#dc2626";
    case "consultation":
      return "#2563eb";
    case "follow-up":
      return "#7c3aed";
    case "surgery":
      return "#be123c";
    default:
      return "#6b7280";
  }
}

function getAppointmentBorderColor(type, status) {
  const s = safeString(status).toLowerCase();
  if (s === "urgent") return "#991b1b";
  if (s === "pending") return "#c2410c";
  if (s === "cancelled") return "#4b5563";

  switch (safeString(type).toLowerCase()) {
    case "emergency":
      return "#991b1b";
    case "consultation":
      return "#1d4ed8";
    case "follow-up":
      return "#6d28d9";
    case "surgery":
      return "#9f1239";
    default:
      return "#4b5563";
  }
}

function getStatusIcon(status) {
  switch (safeString(status).toLowerCase()) {
    case "scheduled":
    case "confirmed":
      return <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />;
    case "pending":
      return <Clock className="w-4 h-4 text-amber-500 shrink-0" />;
    case "urgent":
      return <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />;
    case "cancelled":
      return <AlertCircle className="w-4 h-4 text-gray-400 shrink-0" />;
    default:
      return <Clock className="w-4 h-4 text-gray-400 shrink-0" />;
  }
}

function formatEventTime(dateVal) {
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "—";
  }
}

function formatEventDateTime(dateVal) {
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleString([], {
      weekday: "long",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

// ─── Error boundary ──────────────────────────────────────────────────────────

class CalendarErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error("DoctorCalendar error boundary caught:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center p-8">
          <AlertCircle className="w-12 h-12 text-red-400" />
          <p className="text-gray-600 text-sm max-w-sm">
            The calendar encountered an unexpected error. Please refresh the
            page.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SummaryCard({ total, urgent }) {
  return (
    <div className="google-sans-code-400 bg-white rounded-xl border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        Today's Summary
      </h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Total appointments</span>
          <span className="font-medium text-gray-900">{total}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Urgent / emergency</span>
          <span
            className={`font-medium ${urgent > 0 ? "text-red-600" : "text-gray-900"}`}
          >
            {urgent}
          </span>
        </div>
      </div>
    </div>
  );
}

function UpcomingCard({ appointments, onSelect }) {
  return (
    <div className="google-sans-code-400 bg-white rounded-xl border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        Next appointments
      </h3>
      {appointments.length === 0 ? (
        <p className="text-gray-400 text-sm">No upcoming appointments.</p>
      ) : (
        <div className="space-y-2">
          {appointments.map((appt) => (
            <button
              key={appt.id}
              onClick={() => onSelect?.(appt)}
              className="w-full text-left border border-gray-100 hover:border-gray-300 rounded-lg p-3 transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-900 truncate pr-2">
                  {appt.patientName}
                </span>
                {getStatusIcon(appt.status)}
              </div>
              <div className="text-xs text-gray-500 space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 shrink-0" />
                  <span>{formatEventTime(appt.start)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FileText className="w-3 h-3 shrink-0" />
                  <span className="truncate">
                    {[appt.type, appt.mode].filter(Boolean).join(" · ")}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function EventModal({ event, onClose, onEdit }) {
  if (!event) return null;
  const p = event.extendedProps || {};

  // Close on backdrop click
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="google-sans-code-400 fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={handleBackdrop}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">
            Appointment details
          </h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal body */}
        <div className="px-6 py-5 space-y-4">
          {/* Patient */}
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-xs font-medium text-blue-600 shrink-0">
              {getInitials(p.patientName)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {safeString(p.patientName, "Unknown patient")}
              </p>
              {p.patientEmail && (
                <p className="text-xs text-blue-500 truncate">
                  {p.patientEmail}
                </p>
              )}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Time & type */}
          <div className="flex items-start gap-3">
            <Clock className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-gray-900">
                {formatEventDateTime(event.start)}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {[p.mode, p.type].filter(Boolean).join(" · ")}
              </p>
            </div>
          </div>

          {/* Status & payment */}
          <div className="flex items-start gap-3">
            {getStatusIcon(p.status)}
            <div>
              <p className="text-sm text-gray-900 capitalize">
                {safeString(p.status, "Unknown")}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Payment:{" "}
                {p.isPaid ? (
                  <span className="text-emerald-600">Paid</span>
                ) : (
                  <span className="text-amber-600">Pending</span>
                )}
                {p.paymentReference ? ` · ${p.paymentReference}` : ""}
              </p>
            </div>
          </div>

          {/* Location */}
          {p.location && (
            <div className="flex items-start gap-3">
              <FileText className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Location</p>
                <p className="text-sm text-gray-900">{p.location}</p>
              </div>
            </div>
          )}

          {/* Notes */}
          {p.notes && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Reason for visit</p>
              <p className="text-sm text-gray-700 leading-relaxed">{p.notes}</p>
            </div>
          )}
        </div>

        {/* Modal footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onEdit}
            className="flex-1 bg-blue-600 text-white text-sm py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Edit appointment
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-white text-gray-700 text-sm py-2 px-4 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

const DoctorCalendarInner = () => {
  const { appointments = [] } = useAppointments() ?? {};

  const [doctorAvailability, setDoctorAvailability] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const fetchAvailability = useCallback(async () => {
    setFetchError(null);
    setIsRetrying(true);
    try {
      const response = await doctorAPI.getAvailability();
      const data = response?.data?.data;
      setDoctorAvailability(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch availability:", error);
      setFetchError(
        error?.response?.data?.message ||
          error?.message ||
          "Could not load availability. Check your connection.",
      );
    } finally {
      setIsRetrying(false);
    }
  }, []);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  // ── Transform appointments ─────────────────────────────────────────────────
  const transformedAppointments = useMemo(() => {
    if (!Array.isArray(appointments)) return [];

    return appointments.reduce((acc, appt) => {
      if (!appt || typeof appt !== "object") return acc;

      const startTime = parseAppointmentTime(
        appt.appointmentDate,
        appt.appointmentTime,
      );
      if (!startTime) {
        console.warn("Skipping appointment with invalid date/time:", appt._id);
        return acc;
      }

      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + 30);

      const type = safeString(appt.type);
      const capitalizedType = type
        ? type[0].toUpperCase() + type.slice(1)
        : "Unknown";

      acc.push({
        id: safeString(appt._id, `appt-${acc.length}`),
        patientName: safeString(appt.patient?.name, "Unknown patient"),
        patientEmail: safeString(appt.patient?.email),
        type: capitalizedType,
        start: startTime.toISOString(),
        end: endTime.toISOString(),
        status: safeString(appt.status, "pending"),
        notes: safeString(appt.reasonForVisit || appt.notes),
        mode: safeString(appt.mode),
        isPaid: Boolean(appt.isPaid),
        paymentReference: safeString(appt.paymentReference),
        location: safeString(appt.location),
        doctorSpecialization: safeString(appt.doctorProfile?.specialization),
        doctorExperience: safeNumber(appt.doctorProfile?.experience),
      });

      return acc;
    }, []);
  }, [appointments]);

  // ── Availability events ───────────────────────────────────────────────────
  const availabilityEvents = useMemo(() => {
    if (!Array.isArray(doctorAvailability)) return [];

    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    weekStart.setHours(0, 0, 0, 0);

    return doctorAvailability.flatMap((dayData) => {
      if (!dayData?.day || !Array.isArray(dayData.slots)) return [];

      const dayIndex = DAY_ORDER.indexOf(dayData.day);
      if (dayIndex === -1) return [];

      const targetDate = new Date(weekStart);
      targetDate.setDate(weekStart.getDate() + dayIndex);

      return dayData.slots.reduce((acc, slot) => {
        if (typeof slot !== "string" || !slot.includes("-")) return acc;

        const [startStr, endStr] = slot.split("-");
        const startDT = parseSlotTime(targetDate, startStr);
        const endDT = parseSlotTime(targetDate, endStr);

        if (!startDT || !endDT || endDT <= startDT) return acc;

        acc.push({
          title: "Available",
          start: startDT.toISOString(),
          end: endDT.toISOString(),
          display: "background",
          backgroundColor: "#dcfce7",
          borderColor: "#16a34a",
        });
        return acc;
      }, []);
    });
  }, [doctorAvailability]);

  // ── Appointment calendar events ───────────────────────────────────────────
  const appointmentEvents = useMemo(
    () =>
      transformedAppointments.map((appt) => ({
        id: appt.id,
        title: appt.patientName,
        start: appt.start,
        end: appt.end,
        backgroundColor: getAppointmentColor(appt.type, appt.status),
        borderColor: getAppointmentBorderColor(appt.type, appt.status),
        textColor: "#ffffff",
        extendedProps: {
          patientName: appt.patientName,
          patientEmail: appt.patientEmail,
          type: appt.type,
          status: appt.status,
          notes: appt.notes,
          mode: appt.mode,
          isPaid: appt.isPaid,
          paymentReference: appt.paymentReference,
          location: appt.location,
        },
      })),
    [transformedAppointments],
  );

  const allEvents = useMemo(
    () => [...availabilityEvents, ...appointmentEvents],
    [availabilityEvents, appointmentEvents],
  );

  // ── Derived stats ──────────────────────────────────────────────────────────
  const todayCount = useMemo(() => {
    const todayStr = new Date().toDateString();
    return transformedAppointments.filter(
      (a) => new Date(a.start).toDateString() === todayStr,
    ).length;
  }, [transformedAppointments]);

  const urgentCount = useMemo(
    () =>
      transformedAppointments.filter(
        (a) =>
          a.status.toLowerCase() === "urgent" ||
          a.type.toLowerCase() === "emergency",
      ).length,
    [transformedAppointments],
  );

  const upcomingThree = useMemo(
    () =>
      [...transformedAppointments]
        .sort((a, b) => new Date(a.start) - new Date(b.start))
        .slice(0, 3),
    [transformedAppointments],
  );

  const specialization = useMemo(
    () =>
      transformedAppointments.find((a) => a.doctorSpecialization)
        ?.doctorSpecialization || "",
    [transformedAppointments],
  );

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleEventClick = useCallback((clickInfo) => {
    try {
      if (clickInfo?.event?.extendedProps?.patientName) {
        setSelectedEvent(clickInfo.event);
      }
    } catch (err) {
      console.error("Event click handler error:", err);
    }
  }, []);

  const handleUpcomingSelect = useCallback((appt) => {
    // Reconstruct a minimal event-like object from the transformed appointment
    setSelectedEvent({
      start: appt.start,
      end: appt.end,
      extendedProps: {
        patientName: appt.patientName,
        patientEmail: appt.patientEmail,
        type: appt.type,
        status: appt.status,
        notes: appt.notes,
        mode: appt.mode,
        isPaid: appt.isPaid,
        paymentReference: appt.paymentReference,
        location: appt.location,
      },
    });
  }, []);

  const handleCloseModal = useCallback(() => setSelectedEvent(null), []);

  const handleEditAppointment = useCallback(() => {
    if (!selectedEvent) return;
    // Extend with real routing / drawer logic as needed
    console.info("Edit appointment:", selectedEvent.extendedProps);
  }, [selectedEvent]);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="google-sans-code-400 min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-5">
        {/* Availability fetch error banner */}
        {fetchError && (
          <div className="flex items-center justify-between gap-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm">
            <div className="flex items-center gap-2 text-red-700">
              <WifiOff className="w-4 h-4 shrink-0" />
              <span>{fetchError}</span>
            </div>
            <button
              onClick={fetchAvailability}
              disabled={isRetrying}
              className="flex items-center gap-1.5 text-red-600 hover:text-red-800 font-medium transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isRetrying ? "animate-spin" : ""}`}
              />
              Retry
            </button>
          </div>
        )}

        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-blue-600 shrink-0" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Doctor Dashboard
                </h1>
                <p className="text-sm text-gray-500">
                  {[specialization, "Today's Schedule"]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500">
              {[
                {
                  color: "bg-green-100 border border-green-400",
                  label: "Available",
                },
                { color: "bg-blue-600", label: "Consultation" },
                { color: "bg-purple-600", label: "Follow-up" },
                { color: "bg-red-600", label: "Emergency" },
                { color: "bg-gray-400", label: "Cancelled" },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-sm shrink-0 ${color}`} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          {/* Calendar */}
          <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 p-3 sm:p-4 overflow-hidden">
            <FullCalendar
              plugins={[timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "timeGridWeek,timeGridDay",
              }}
              slotMinTime="08:00:00"
              slotMaxTime="19:00:00"
              slotDuration="00:15:00"
              slotLabelInterval="01:00:00"
              events={allEvents}
              eventClick={handleEventClick}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              weekends={false}
              height="680px"
              eventClassNames="cursor-pointer"
              slotLabelFormat={{
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              }}
              eventTimeFormat={{
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              }}
              // Swallow FullCalendar's own uncaught event errors
              eventDidMount={(info) => {
                if (!info?.event) return;
              }}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <SummaryCard total={todayCount} urgent={urgentCount} />
            <UpcomingCard
              appointments={upcomingThree}
              onSelect={handleUpcomingSelect}
            />
          </div>
        </div>
      </div>

      {/* Details modal */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={handleCloseModal}
          onEdit={handleEditAppointment}
        />
      )}
    </div>
  );
};

const DoctorCalendar = () => (
  <CalendarErrorBoundary>
    <DoctorCalendarInner />
  </CalendarErrorBoundary>
);

export default DoctorCalendar;
