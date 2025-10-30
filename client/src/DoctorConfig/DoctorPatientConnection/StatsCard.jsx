const StatsCard = ({ title, value, icon: Icon, color }) => {
  return (
    <div className="group rounded-xl bg-[var(--color-secondary)] p-6 shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--color-primary)]">
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold text-white">{value}</p>
        </div>
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-full ${color} shadow-md transition-transform duration-300 group-hover:scale-110`}
        >
          <Icon className="h-7 w-7 text-white" />
        </div>
      </div>
      <div className="mt-4">
        <a
          href="#"
          onClick={(e) => e.preventDefault()} // Added to prevent page jump
          className="text-xs font-medium text-blue-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        >
          View details &rarr;
        </a>
      </div>
    </div>
  );
};
export default StatsCard;
