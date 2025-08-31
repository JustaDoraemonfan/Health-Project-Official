const StatsCard = ({ title, value, color }) => {
  return (
    <div className="bg-zinc-900/30 border border-zinc-800/40 rounded-xl p-6 text-center">
      <div className={`text-3xl font-bold font-mono mb-1 ${color}`}>
        {value}
      </div>
      <div className="text-sm text-zinc-500 font-mono uppercase tracking-wider">
        {title}
      </div>
    </div>
  );
};
export default StatsCard;
