import { useNavigate } from "react-router-dom";

export default function PopupProfileUpdate({ onClose }) {
  const navigate = useNavigate();

  const handleUpdate = () => {
    navigate("/update-profile");
    onClose();
  };

  return (
    <div className="fixed inset-0 spline-sans-mono-400 bg-black/40 bg-opacity-50 flex justify-center items-center z-[9999]">
      <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-xs w-full">
        <p className="text-lg font-semibold text-gray-800">
          Please update your profile before verification.
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={handleUpdate}
          >
            Update Profile
          </button>

          <button
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
