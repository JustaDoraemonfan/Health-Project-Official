const StatsCard = ({ title, value, color }) => {
  return (
    <div className="bg-transparent rounded-xl p-4 sm:p-6 text-center">
      <div
        className={`text-2xl sm:text-3xl font-bold google-sans-code-400 mb-1 ${color}`}
      >
        {value}
      </div>
      <div className="text-xs sm:text-sm text-zinc-500 google-sans-code-400 uppercase tracking-wider">
        {title}
      </div>
    </div>
  );
};
export default StatsCard;
