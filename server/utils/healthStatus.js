export const calculateHealthStatus = (
  recentAppointments,
  upcomingAppointments
) => {
  if (recentAppointments.length === 0 && upcomingAppointments === 0) {
    return "Check-up Due";
  }
  return "Healthy";
};
