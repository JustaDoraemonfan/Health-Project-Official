export const getPriorityIndicator = (priority) => {
  const normalizedPriority = priority?.toLowerCase();

  const getColor = () => {
    if (normalizedPriority === "severe" || normalizedPriority === "high") {
      return "#ef4444"; // red-500
    }
    if (normalizedPriority === "moderate" || normalizedPriority === "medium") {
      return "#f59e0b"; // amber-500
    }
    return "#10b981"; // emerald-500 (for low/mild)
  };

  return (
    <div
      className="w-1 h-8 rounded-full"
      style={{ backgroundColor: getColor() }}
    ></div>
  );
};
