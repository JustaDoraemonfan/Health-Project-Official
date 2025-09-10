const StatsCard = ({ title, value, color }) => {
  return (
    <div className="bg-trasparent rounded-xl p-6 text-center">
      <div className={`text-3xl font-bold google-sans-code-400 mb-1 ${color}`}>
        {value}
      </div>
      <div className="text-sm text-zinc-500 google-sans-code-400 uppercase tracking-wider">
        {title}
      </div>
    </div>
  );
};
export default StatsCard;
