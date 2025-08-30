// components/consultation/LoadingState.jsx

const LoadingState = ({ loading, searchLoading }) => {
  const message = loading ? "Loading doctors..." : "Searching...";

  return (
    <div className="text-center py-16">
      <div className="w-8 h-8 border-2 border-gray-700 border-t-gray-400 rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-400">{message}</p>
    </div>
  );
};

export default LoadingState;
