import {
  X,
  ChevronRight,
  ChevronLeft,
  Check,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";

const ResultModal = ({
  type,
  bookingResult,
  doctor,
  formData,
  onTryAgain,
  onClose,
  onGoToUpcoming,
}) => {
  const isSuccess = type === "success";

  return (
    <div className="spline-sans-mono-400 fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[60] p-4">
      <div
        className={`bg-[var(--color-primary)] rounded-2xl shadow-2xl w-full max-w-md border ${
          isSuccess ? "border-green-500/30" : "border-red-500/30"
        } p-8`}
      >
        <div className="text-center">
          <div className="mb-6">
            {isSuccess ? (
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto animate-scale-in" />
            ) : (
              <XCircle className="w-16 h-16 text-red-500 mx-auto animate-scale-in" />
            )}
          </div>
          <h3 className="text-2xl font-bold text-black mb-2">
            {isSuccess ? "Booking Confirmed!" : "Booking Failed"}
          </h3>
          <p className="text-sm text-gray-700 mb-6">{bookingResult.message}</p>

          {isSuccess && (
            <div className="bg-slate-800 rounded-lg p-4 mb-6 text-left border border-slate-700">
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">
                    Doctor
                  </p>
                  <p className="text-sm font-medium text-white">
                    {doctor?.userId?.name || "Dr. Unknown"}
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                      Date
                    </p>
                    <p className="text-sm font-medium text-white">
                      {new Date(formData.appointmentDate).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                      Time
                    </p>
                    <p className="text-sm font-medium text-white">
                      {formData.appointmentTime}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">
                    Appointment ID
                  </p>
                  <p className="text-sm font-mono font-medium text-green-400">
                    {bookingResult.appointmentId}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {isSuccess ? (
              <>
                <button
                  onClick={onGoToUpcoming}
                  className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white rounded-lg font-medium transition-all duration-200 shadow-lg shadow-green-600/25"
                >
                  View Upcoming Consultations
                </button>
                <button
                  onClick={onClose}
                  className="w-full px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-lg font-medium transition-colors border border-slate-700"
                >
                  Close
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onTryAgain}
                  className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-lg font-medium transition-all duration-200 shadow-lg shadow-red-600/25"
                >
                  Try Again
                </button>
                <button
                  onClick={onClose}
                  className="w-full px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-lg font-medium transition-colors border border-slate-700"
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ResultModal;
