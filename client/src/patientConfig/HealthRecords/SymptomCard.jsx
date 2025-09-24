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

const getCategoryIcon = (category) => {
  const icons = {
    cardiovascular: "❤️",
    respiratory: "🫁",
    digestive: "🔄",
    neurological: "🧠",
    musculoskeletal: "🦴",
  };

  return icons[category?.toLowerCase()] || "🏥";
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start space-x-4">
        {/* Category Icon */}
        <div className="bg-purple-50 p-3 rounded-lg flex-shrink-0">
          <span className="text-xl">{getCategoryIcon(category)}</span>
        </div>

        <div className="flex-1 min-w-0">
          {/* Header with description and severity */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {description}
              </h3>
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                {category}
              </span>
            </div>
            <div className="flex-shrink-0 ml-2">
              <span className={getSeverityBadge(severity)}>
                <AlertTriangle className="w-3 h-3 mr-1" />
                {severity}
              </span>
            </div>
          </div>

          {/* Notes */}
          {notes && (
            <p className="text-gray-700 mb-3 text-sm leading-relaxed">
              {notes}
            </p>
          )}

          {/* Date Information */}
          <div className="flex flex-wrap gap-4 mb-3 text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <span className="font-medium">Onset:</span>
              <span className="ml-1">{formatDate(onsetDate)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span className="font-medium">Recorded:</span>
              <span className="ml-1">{formatDate(createdAt)}</span>
            </div>
          </div>

          {/* Attachments */}
          {attachments.length > 0 && (
            <div className="mt-3">
              <div className="flex items-center mb-2">
                <FileText className="w-4 h-4 mr-1 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  Attachments ({attachments.length})
                </span>
              </div>
              <div className="space-y-2">
                {attachments.map((attachment, index) => (
                  <div
                    key={attachment._id || index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border"
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
                      <div className="flex space-x-2">
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

          {/* Updated timestamp */}
          {updatedAt !== createdAt && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Last updated: {formatDate(updatedAt)}
              </p>
            </div>
          )}
          <div className="flex justify-end">
            <button
              onClick={handleAnalyze}
              className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-zinc-800 text-white hover:cursor-pointer rounded-lg transition-colors text-sm font-medium"
            >
              <Brain className="w-4 h-4" />
              Analyze Symptom
            </button>
          </div>
        </div>
      </div>
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
