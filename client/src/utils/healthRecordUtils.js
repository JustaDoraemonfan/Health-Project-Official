// Utility functions for Health Records

export const getStatusBadge = (status) => {
  const baseClasses = "py-2 px-3 rounded-full text-xs font-medium";
  switch (status) {
    case "completed":
      return `${baseClasses} bg-green-100 text-green-800`;
    case "upcoming":
      return `${baseClasses} bg-blue-100 text-blue-800`;
    case "cancelled":
      return `${baseClasses} bg-red-100 text-red-800`;
    default:
      return `${baseClasses} bg-gray-100 text-gray-800`;
  }
};

export const getLabStatusBadge = (status) => {
  const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
  if (status.toLowerCase().includes("normal")) {
    return `${baseClasses} bg-green-100 text-green-800`;
  } else {
    return `${baseClasses} bg-yellow-100 text-yellow-800`;
  }
};

export const filterAppointments = (appointments, filter) => {
  if (filter === "all") return appointments;
  return appointments.filter((appointment) => appointment.status === filter);
};

export const getUpcomingAppointmentsCount = (appointments) => {
  return appointments.filter((a) => a.status === "scheduled").length;
};

export const getActivePrescriptionsCount = (prescriptions) => {
  return prescriptions.filter((p) => p.refills > 0).length;
};

export const getSymptomCount = (symptoms) => {
  return symptoms.length;
};
export const getNotesCount = (note) => {
  return note.filter((n) => n.isRead == false).length;
};
