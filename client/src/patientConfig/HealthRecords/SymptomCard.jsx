import React from "react";
import { useState } from "react";
import {
  Calendar,
  Eye,
  AlertTriangle,
  FileText,
  Clock,
  Brain,
} from "lucide-react";
import { symptomAPI } from "../../services/api";
import SymptomAnalysisModal from "./SymptomAnalysisModal";

// --- NEW HELPER FUNCTION ---
/**
 * Returns a Tailwind background color class based on the category.
 */
const getCategoryColor = (category) => {
  const colors = {
    cardiovascular: "bg-red-500",
    respiratory: "bg-blue-500",
    digestive: "bg-green-500",
    neurological: "bg-purple-500",
    musculoskeletal: "bg-yellow-500",
  };
  return colors[category?.toLowerCase()] || "bg-gray-400";
};

// Helper functions (getSeverityBadge is unchanged)
const getSeverityBadge = (severity) => {
  const severityStyles = {
    Mild: "bg-green-100 text-green-800 border-green-200",
    Moderate: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Severe: "bg-red-100 text-red-800 border-red-200",
  };
  return `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
    severityStyles[severity] || "bg-gray-100 text-gray-800 border-gray-200"
  }`;
};

// getCategoryIcon is no longer used, so it can be removed.

const formatDate = (dateString) => {
  const date = new Date(dateString);
  // Corrected typo from 'toLocaleDateDateString'
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const SymptomCard = ({ symptom, handleDownload }) => {
  const {
    description,
    severity,
    onsetDate,
    notes,
    category,
    attachments = [],
    createdAt,
    updatedAt,
  } = symptom;

  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    // ... (analysis handler logic is unchanged)
    setIsModalOpen(true);
    setIsLoading(true);
    try {
      const result = await symptomAPI.analyzeSymptom(symptom._id);
      setAnalysis(result.data.data.analysis);
    } catch (error) {
      console.error("Analysis failed:", error);
      setAnalysis(
        "Sorry, I couldn't analyze your symptom at this time. Please try again later or consult with a healthcare provider."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[var(--color-secondary)] rounded-xl shadow-sm border google-sans-code-400 border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start space-x-4">
        {/* --- CHANGED: Icon replaced with Color Line --- */}
        <div className="flex-shrink-0 pt-1">
          <div
            className={`w-1.5 h-10 rounded-full ${getCategoryColor(category)}`}
            title={category} // A tooltip for accessibility
          ></div>
        </div>

        <div className="flex-1 min-w-0">
          {/* Header (Always visible) */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-2 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-slate-200 mb-1">
                {description}
              </h3>

              {/* --- REMOVED: Category text span --- */}
              {/* The category text span was here */}
            </div>
            <div className="flex-shrink-0">
              <span className={getSeverityBadge(severity)}>
                <AlertTriangle className="w-3 h-3 mr-1" />
                {severity}
              </span>
            </div>
          </div>

          {/* --- CONDITIONALLY RENDERED DETAILS (Unchanged) --- */}
          {isExpanded && (
            <div className="mt-4 border-t border-gray-100 pt-4">
              {/* Notes */}
              {notes && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-slate-300 mb-1">
                    Notes
                  </h4>
                  <p className="text-slate-200 text-sm leading-relaxed">
                    {notes}
                  </p>
                </div>
              )}

              {/* Date Information */}
              <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1.5" />
                  <span className="font-medium text-red-300">Onset:</span>
                  <span className="ml-1 text-red-200">
                    {formatDate(onsetDate)}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1.5" />
                  <span className="font-medium">Recorded:</span>
                  <span className="ml-1">{formatDate(createdAt)}</span>
                </div>
              </div>

              {/* Attachments (Unchanged) */}
              {attachments.length > 0 && (
                // ... attachment JSX ...
                <div className="mt-4">
                  <div className="flex items-center mb-2">
                    <FileText className="w-4 h-4 mr-1.5 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                      Attachments ({attachments.length})
                    </span>
                  </div>
                  <div className="space-y-2">
                    {attachments.map((attachment, index) => (
                      <div
                        key={attachment._id || index}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-2 bg-gray-50 rounded-lg border"
                      >
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {attachment.originalName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(attachment.size / 1024).toFixed(1)} KB •{" "}
                              {attachment.mime}
                            </p>
                          </div>
                        </div>
                        {attachment.url && (
                          <div className="flex space-x-2 self-end sm:self-center">
                            <button
                              onClick={() => handleDownload(attachment)}
                              className="flex items-center justify-center w-8 h-8 rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                              title="View attachment"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Updated timestamp (Unchanged) */}
              {updatedAt !== createdAt && (
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 text-center sm:text-left">
                    Last updated: {formatDate(updatedAt)}
                  </p>
                </div>
              )}
            </div>
          )}
          {/* --- END OF CONDITIONAL DETAILS --- */}

          {/* Action Buttons (Unchanged) */}
          <div className="mt-4 flex flex-wrap gap-2 justify-end">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center justify-center gap-2 px-4 py-2 w-full sm:w-auto border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 rounded-lg transition-colors text-sm font-medium"
            >
              <Eye className="w-4 h-4" />
              {isExpanded ? "Hide Details" : "View Details"}
            </button>
            <button
              onClick={handleAnalyze}
              className="flex items-center justify-center gap-2 px-4 py-2 w-full sm:w-auto bg-black hover:bg-zinc-800 text-white hover:cursor-pointer rounded-lg transition-colors text-sm font-medium"
            >
              <Brain className="w-4 h-4" />
              Analyze Symptom
            </button>
          </div>
        </div>
      </div>

      {/* Modal (Unchanged) */}
      <SymptomAnalysisModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        analysis={analysis}
        symptomData={symptom}
        isLoading={isLoading}
      />
    </div>
  );
};

export default SymptomCard;
