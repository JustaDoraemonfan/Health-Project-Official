import {
  Brain,
  X,
  Calendar,
  AlertTriangle,
  Activity,
  Clock,
  Loader2,
} from "lucide-react";

const SymptomAnalysisModal = ({
  isOpen,
  onClose,
  analysis,
  symptomData,
  isLoading,
}) => {
  if (!isOpen) return null;

  const formatAnalysis = (text) => {
    const sections = text.split("\n\n");

    return sections.map((section, index) => {
      section = section.trim();

      // Handle emergency warning
      if (section.startsWith("⚠️")) {
        return (
          <div
            key={index}
            className="bg-red-900/30 border border-red-600 rounded-lg p-4 mb-4"
          >
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="text-red-200 text-sm">
                {section.replace("⚠️", "")}
              </div>
            </div>
          </div>
        );
      }

      // Handle bullet lists
      if (section.startsWith("*") || section.includes("\n*")) {
        const items = section.split("\n").map((line, idx) => {
          if (!line.trim().startsWith("*")) return null;
          return (
            <li key={idx} className="ml-4 list-disc text-gray-200">
              {line.replace(/^\*\s*/, "")}
            </li>
          );
        });

        return (
          <ul key={index} className="mb-4 space-y-2">
            {items}
          </ul>
        );
      }
      if (
        section
          .toLowerCase()
          .includes("this information is for educational purposes only")
      ) {
        return (
          <div
            key={index}
            className="bg-blue-900/30 border border-blue-600 rounded-lg p-4 mb-4"
          >
            <p className="text-blue-200 text-sm font-medium">{section}</p>
          </div>
        );
      }

      // Handle section headers in bold (**text**)
      const formatted = section.replace(
        /\*\*(.*?)\*\*/g,
        "<strong class='font-semibold text-gray-100'>$1</strong>"
      );

      return (
        <div
          key={index}
          className="text-gray-300 text-sm leading-relaxed mb-4"
          dangerouslySetInnerHTML={{ __html: formatted }}
        />
      );
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className="bg-[var(--color-secondary)] rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
        style={{
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {/* Header */}
        <div className="sticky top-0 bg-[var(--color-primary)] border-b border-gray-600 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-light text-[var(--color-secondary)]">
                  AI Symptom Analysis
                </h2>
                <p className="text-sm text-gray-400">
                  Educational information about your symptoms
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div
          className="overflow-y-auto bg-[var(--color-primary)] max-h-[calc(90vh-120px)]"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="p-6 space-y-6">
            {/* Symptom Summary */}
            {symptomData && (
              <div className="bg-[var(--color-secondary)] rounded-lg p-4 border border-gray-600">
                <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Your Symptom Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-400" />
                    <span className="text-gray-400">Severity:</span>
                    <span
                      className={`font-medium ${
                        symptomData.severity === "Severe"
                          ? "text-red-400"
                          : symptomData.severity === "Moderate"
                          ? "text-orange-400"
                          : "text-green-400"
                      }`}
                    >
                      {symptomData.severity}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-purple-400" />
                    <span className="text-gray-400">Category:</span>
                    <span className="text-[var(--color-primary)] font-medium capitalize">
                      {symptomData.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-400">Started:</span>
                    <span className="text-[var(--color-primary)] font-medium">
                      {new Date(symptomData.onsetDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-600">
                  <p className="text-[var(--color-primary)] text-sm">
                    "{symptomData.description}"
                  </p>
                </div>
              </div>
            )}

            {/* Analysis Content */}
            <div className="bg-[var(--color-secondary)]/90 rounded-lg p-6 border border-gray-600">
              <h3 className="text-sm font-medium text-gray-300 mb-4 flex items-center gap-2">
                <Brain className="w-4 h-4" />
                AI Analysis & Recommendations
              </h3>

              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-blue-400 animate-spin mr-3" />
                  <span className="text-blue-200">
                    Analyzing your symptoms...
                  </span>
                </div>
              ) : analysis ? (
                <div className="space-y-4">{formatAnalysis(analysis)}</div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No analysis available</p>
                </div>
              )}
            </div>

            {/* Timestamp */}
            {!isLoading && analysis && (
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>Analysis generated on {new Date().toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default SymptomAnalysisModal;
