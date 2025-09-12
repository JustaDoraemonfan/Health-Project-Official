// utils.js
export const formatTime = (time) => {
  const [hours, minutes] = time.split(":");
  const hour12 = hours % 12 || 12;
  const ampm = hours < 12 ? "AM" : "PM";
  return `${hour12}:${minutes} ${ampm}`;
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

export const isReminderMissed = (reminder) => {
  const now = new Date();
  const reminderDateTime = new Date(`${reminder.date}T${reminder.time}`);
  return reminderDateTime < now && reminder.status === "upcoming";
};

export const isReminderUpcoming = (reminder) => {
  const now = new Date();
  const reminderDateTime = new Date(`${reminder.date}T${reminder.time}`);
  return reminderDateTime >= now && reminder.status === "upcoming";
};
