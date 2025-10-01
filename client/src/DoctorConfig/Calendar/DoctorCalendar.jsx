import React, { useState, useMemo, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Calendar,
  Clock,
  User,
  Phone,
  FileText,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { doctorAPI } from "../../services/api";
import { useAppointments } from "../../hooks/useAppointments";

const DoctorCalendar = () => {
  // Get appointments from the hook
  const { appointments } = useAppointments();
  const [doctorAvailability, setDoctorAvailability] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDetails, setShowEventDetails] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const availabilityResponse = await doctorAPI.getAvailability();
        setDoctorAvailability(availabilityResponse.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchAllData();
  }, []);

  // Transform backend appointments to match the calendar format
  const transformedAppointments = useMemo(() => {
    if (!appointments || !Array.isArray(appointments)) {
      return [];
    }

    return appointments.map((appt) => {
      // Combine date and time to create start/end datetime
      const appointmentDate = new Date(appt.appointmentDate);
      const [hours, minutes] = appt.appointmentTime.split(":").map(Number);

      // Create start time
      const startTime = new Date(appointmentDate);
      startTime.setHours(hours, minutes, 0, 0);

      // Create end time (assuming 30-minute appointments)
      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + 30);

      return {
        id: appt._id,
        patientName: appt.patient.name,
        patientEmail: appt.patient.email,
        type: appt.type.charAt(0).toUpperCase() + appt.type.slice(1), // Capitalize first letter
        start: startTime.toISOString(),
        end: endTime.toISOString(),
        phone: "", // Not provided in backend data
        status: appt.status,
        notes: appt.reasonForVisit || appt.notes || "",
        mode: appt.mode,
        isPaid: appt.isPaid,
        paymentReference: appt.paymentReference,
        location: appt.location,
        doctorSpecialization: appt.doctorProfile?.specialization || "",
        doctorExperience: appt.doctorProfile?.experience || 0,
      };
    });
  }, [appointments]);

  // Convert backend availability format to calendar events
  const availabilityEvents = useMemo(() => {
    const events = [];
    const today = new Date();
    const currentWeekStart = new Date(
      today.setDate(today.getDate() - today.getDay())
    );

    doctorAvailability.forEach((dayData) => {
      const dayIndex = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ].indexOf(dayData.day);
      const targetDate = new Date(currentWeekStart);
      targetDate.setDate(currentWeekStart.getDate() + dayIndex);

      dayData.slots.forEach((slot) => {
        const [startTime, endTime] = slot.split("-");
        const startDateTime = new Date(targetDate);
        const endDateTime = new Date(targetDate);

        const [startHour, startMin] = startTime.split(":").map(Number);
        const [endHour, endMin] = endTime.split(":").map(Number);

        startDateTime.setHours(startHour, startMin, 0);
        endDateTime.setHours(endHour, endMin, 0);

        events.push({
          title: "Available",
          start: startDateTime.toISOString(),
          end: endDateTime.toISOString(),
          display: "background",
          backgroundColor: "#dcfce7",
          borderColor: "#16a34a",
          className: "availability-slot",
        });
      });
    });

    return events;
  }, [doctorAvailability]);

  // Convert appointments to calendar events
  const appointmentEvents = transformedAppointments.map((appt) => ({
    id: appt.id,
    title: `${appt.patientName}`,
    start: appt.start,
    end: appt.end,
    backgroundColor: getAppointmentColor(appt.type, appt.status),
    borderColor: getAppointmentBorderColor(appt.type, appt.status),
    textColor: "#ffffff",
    extendedProps: {
      patientName: appt.patientName,
      patientEmail: appt.patientEmail,
      type: appt.type,
      phone: appt.phone,
      status: appt.status,
      notes: appt.notes,
      mode: appt.mode,
      isPaid: appt.isPaid,
      paymentReference: appt.paymentReference,
      location: appt.location,
      doctorSpecialization: appt.doctorSpecialization,
    },
    className: `appointment-${appt.status}`,
  }));

  function getAppointmentColor(type, status) {
    if (status === "urgent") return "#dc2626";
    if (status === "pending") return "#ea580c";
    if (status === "cancelled") return "#6b7280";

    switch (type.toLowerCase()) {
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
    if (status === "urgent") return "#991b1b";
    if (status === "pending") return "#c2410c";
    if (status === "cancelled") return "#4b5563";

    switch (type.toLowerCase()) {
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
    switch (status) {
      case "scheduled":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "confirmed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-orange-500" />;
      case "urgent":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "cancelled":
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  }

  const handleEventClick = (clickInfo) => {
    if (clickInfo.event.extendedProps.patientName) {
      setSelectedEvent(clickInfo.event);
      setShowEventDetails(true);
    }
  };

  const allEvents = [...availabilityEvents, ...appointmentEvents];

  // Calculate summary statistics
  const todayAppointments = transformedAppointments.filter((appt) => {
    const apptDate = new Date(appt.start).toDateString();
    const today = new Date().toDateString();
    return apptDate === today;
  });

  const urgentCases = transformedAppointments.filter(
    (appt) =>
      appt.status === "urgent" || appt.type.toLowerCase() === "emergency"
  ).length;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calendar className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Doctor Dashboard
                </h1>
                <p className="text-gray-600">
                  {transformedAppointments.length > 0 &&
                    transformedAppointments[0].doctorSpecialization}{" "}
                  • Today's Schedule
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-100 border border-green-400 rounded"></div>
                <span className="text-sm text-gray-600">Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-600 rounded"></div>
                <span className="text-sm text-gray-600">Consultation</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-600 rounded"></div>
                <span className="text-sm text-gray-600">Follow-up</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-600 rounded"></div>
                <span className="text-sm text-gray-600">Emergency</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-600 rounded"></div>
                <span className="text-sm text-gray-600">Cancelled</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
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
                height="700px"
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
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Today's Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Today's Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Appointments</span>
                  <span className="font-medium text-gray-900">
                    {todayAppointments.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Available Hours</span>
                  <span className="font-medium text-green-600">6h 30m</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Urgent Cases</span>
                  <span className="font-medium text-red-600">
                    {urgentCases}
                  </span>
                </div>
              </div>
            </div>

            {/* Upcoming Appointments */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Next Appointments
              </h3>
              <div className="space-y-3">
                {transformedAppointments.slice(0, 3).map((appt) => (
                  <div
                    key={appt.id}
                    className="border border-gray-100 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">
                        {appt.patientName}
                      </span>
                      {getStatusIcon(appt.status)}
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-3 h-3" />
                        <span>
                          {new Date(appt.start).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileText className="w-3 h-3" />
                        <span>
                          {appt.type} • {appt.mode}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {transformedAppointments.length === 0 && (
                  <p className="text-gray-500 text-sm">
                    No upcoming appointments
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Event Details Modal */}
        {showEventDetails && selectedEvent && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Appointment Details
                  </h3>
                  <button
                    onClick={() => setShowEventDetails(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {selectedEvent.extendedProps.patientName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedEvent.extendedProps.patientEmail}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-gray-900">
                        {new Date(selectedEvent.start).toLocaleString([], {
                          weekday: "long",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedEvent.extendedProps.mode} •{" "}
                        {selectedEvent.extendedProps.type}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {getStatusIcon(selectedEvent.extendedProps.status)}
                    <div>
                      <p className="text-gray-900 capitalize">
                        {selectedEvent.extendedProps.status}
                      </p>
                      <p className="text-sm text-gray-600">
                        Payment:{" "}
                        {selectedEvent.extendedProps.isPaid
                          ? "Paid"
                          : "Pending"}
                        {selectedEvent.extendedProps.paymentReference &&
                          ` (${selectedEvent.extendedProps.paymentReference})`}
                      </p>
                    </div>
                  </div>

                  {selectedEvent.extendedProps.location && (
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Location:
                        </p>
                        <p className="text-sm text-gray-600">
                          {selectedEvent.extendedProps.location}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedEvent.extendedProps.notes && (
                    <div className="space-y-2">
                      <div className="flex items-start space-x-3">
                        <FileText className="w-5 h-5 text-gray-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Reason for Visit:
                          </p>
                          <p className="text-sm text-gray-600">
                            {selectedEvent.extendedProps.notes}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex space-x-3 mt-6">
                  <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                    Edit Appointment
                  </button>
                  <button
                    onClick={() => setShowEventDetails(false)}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorCalendar;
