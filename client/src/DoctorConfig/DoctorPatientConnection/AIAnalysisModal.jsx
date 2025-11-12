import {
  X,
  Brain,
  Loader2,
  TrendingUp,
  Shield,
  Activity,
  Pill,
  AlertTriangle,
  FileText,
} from "lucide-react";
import { useState, useEffect } from "react";
import { doctorAPI } from "../../services/api";

// This helper component renders simple markdown (bold text)
const SimpleMarkdown = ({ text }) => {
  const parts = text.split("**");
  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <strong key={index}>{part}</strong>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
};

const AIAnalysisModal = ({ isOpen, onClose, patient }) => {
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (isOpen && patient) {
      analyzeWithAI();
    }
    // Reset state when modal is closed
    if (!isOpen) {
      setAiAnalysis(null);
    }
  }, [isOpen, patient]);

  const analyzeWithAI = async () => {
    setIsAnalyzing(true);
    setAiAnalysis(null);

    try {
      // Use the (mock) backend API
      const response = await doctorAPI.analyzePatientProfile(
        patient.userId._id
      );

      const apiResponse = response.data;

      if (apiResponse.success && apiResponse.data) {
        // Access the inner 'data' object
        const analysisText = apiResponse.data.analysis;
        const parsed = parseAnalysisText(analysisText);
        setAiAnalysis({
          rawAnalysis: analysisText,
          patientInfo: apiResponse.data.patient,
          ...parsed,
        });
      }
    } catch (error) {
      console.error("AI Analysis error:", error);
      setAiAnalysis({
        riskLevel: "moderate",
        keyFindings: ["Unable to complete analysis at this time"],
        recommendations: [
          "Please consult with healthcare provider for detailed assessment",
        ],
        rawAnalysis: "Error loading analysis",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const parseAnalysisText = (text) => {
    // Helper function to extract full list items from a markdown section
    const extractListItems = (sectionText) => {
      if (!sectionText) {
        return [];
      }
      const lines = sectionText.split("\n");
      const items = lines
        .filter(
          (line) => line.trim().startsWith("*") || line.trim().startsWith("-")
        )
        .map((line) => line.trim().substring(1).trim().replace(/^ /, "")); // Remove bullet and any leading non-breaking spaces
      return items;
    };

    // Extract risk level
    let riskLevel = "moderate";
    if (
      text.toLowerCase().includes("high-risk") ||
      text.toLowerCase().includes("serious") ||
      text.toLowerCase().includes("aggressive management")
    ) {
      riskLevel = "high";
    } else if (
      text.toLowerCase().includes("low-risk") ||
      text.toLowerCase().includes("mild")
    ) {
      riskLevel = "low";
    }

    // Extract key findings from "Symptom Interpretation"
    const symptomsMatch = text.match(
      /\*\*Symptom Interpretation\*\*([\s\S]*?)(?=\*\*|$)/
    );
    const keyFindings = extractListItems(symptomsMatch ? symptomsMatch[1] : "");

    // Extract recommendations from "Next Steps"
    const nextStepsMatch = text.match(
      /\*\*Next Steps\*\*([\s\S]*?)(?=Note:|$)/
    );
    const recommendations = extractListItems(
      nextStepsMatch ? nextStepsMatch[1] : ""
    );

    // Extract risks from "Risks / Alerts"
    const risksMatch = text.match(
      /\*\*Risks \/ Alerts\*\*([\s\S]*?)(?=\*\*|$)/
    );
    const risks = extractListItems(risksMatch ? risksMatch[1] : "");

    return {
      riskLevel,
      keyFindings:
        keyFindings.length > 0
          ? keyFindings
          : ["Comprehensive analysis completed"],
      recommendations:
        recommendations.length > 0
          ? recommendations
          : ["Follow up with healthcare provider"],
      risks: risks.length > 0 ? risks : ["Standard monitoring recommended"],
    };
  };

  if (!isOpen) return null;

  const userName = patient?.userId?.name || "Unknown Patient";

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
      <div className="bg-slate-900 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-3">
            <Brain className="w-10 h-10" />
            <div>
              <h2 className="text-2xl font-semibold">AI Health Analysis</h2>
              <p className="text-blue-100 text-sm">Patient: {userName}</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-900">
          {isAnalyzing ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
              <p className="text-white text-lg">Analyzing patient data...</p>
              <p className="text-gray-400 text-sm mt-2">
                This may take a few moments
              </p>
            </div>
          ) : aiAnalysis ? (
            <div className="space-y-6">
              {/* Patient Info Card */}
              {aiAnalysis.patientInfo && (
                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                  <h3 className="text-lg font-semibold text-blue-300 mb-2 flex items-center">
                    {/* CHANGELOG: text-white changed to text-blue-300 */}
                    <FileText className="w-5 h-5 mr-2 text-blue-500" />
                    Patient Information
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-400">Name:</span>
                      <span className="text-white ml-2">
                        {aiAnalysis.patientInfo.name}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Age:</span>
                      <span className="text-white ml-2">
                        {aiAnalysis.patientInfo.age} years
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Gender:</span>
                      <span className="text-white ml-2 capitalize">
                        {aiAnalysis.patientInfo.gender}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Blood Group:</span>
                      <span className="text-white ml-2">
                        {aiAnalysis.patientInfo.bloodGroup}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Risk Level */}
              <div
                className={`p-4 rounded-lg border-2 ${
                  aiAnalysis.riskLevel === "high"
                    ? "bg-red-900/20 border-red-600"
                    : aiAnalysis.riskLevel === "moderate"
                    ? "bg-yellow-900/20 border-yellow-600"
                    : "bg-green-900/20 border-green-600"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Shield
                    className={`w-6 h-6 ${
                      aiAnalysis.riskLevel === "high"
                        ? "text-red-500"
                        : aiAnalysis.riskLevel === "moderate"
                        ? "text-yellow-500"
                        : "text-green-500"
                    }`}
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {/* CHANGELOG: Kept text-white for contrast on colored bg */}
                      Risk Assessment
                    </h3>
                    <p
                      className={`text-sm font-bold uppercase ${
                        aiAnalysis.riskLevel === "high"
                          ? "text-red-400"
                          : aiAnalysis.riskLevel === "moderate"
                          ? "text-yellow-400"
                          : "text-green-400"
                      }`}
                    >
                      {aiAnalysis.riskLevel} Risk
                    </p>
                  </div>
                </div>
              </div>

              {/* Key Findings */}
              <section>
                <h3 className="text-lg font-semibold text-blue-300 mb-3 flex items-center">
                  {/* CHANGELOG: text-white changed to text-blue-300 */}
                  <Activity className="w-5 h-5 mr-2 text-blue-500" />
                  Key Findings
                </h3>
                <div className="space-y-2">
                  {aiAnalysis.keyFindings.map((finding, index) => (
                    <div
                      key={index}
                      className="bg-slate-800 p-3 rounded-lg border border-slate-700"
                    >
                      <p className="text-sm text-gray-200 flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <SimpleMarkdown text={finding} />
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Risks & Alerts */}
              {aiAnalysis.risks && aiAnalysis.risks.length > 0 && (
                <section>
                  <h3 className="text-lg font-semibold text-orange-300 mb-3 flex items-center">
                    {/* CHANGELOG: text-white changed to text-orange-300 */}
                    <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
                    Risks & Alerts
                  </h3>
                  <div className="space-y-2">
                    {aiAnalysis.risks.map((risk, index) => (
                      <div
                        key={index}
                        className="bg-orange-900/20 border border-orange-800 p-3 rounded-lg"
                      >
                        <p className="text-sm text-orange-100 flex items-start">
                          <span className="text-orange-500 mr-2">⚠</span>
                          <SimpleMarkdown text={risk} />
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Recommendations */}
              <section>
                <h3 className="text-lg font-semibold text-green-300 mb-3 flex items-center">
                  {/* CHANGELOG: text-white changed to text-green-300 */}
                  <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                  Recommendations & Next Steps
                </h3>
                <div className="space-y-2">
                  {aiAnalysis.recommendations.map((rec, index) => (
                    <div
                      key={index}
                      className="bg-green-900/20 border border-green-800 p-3 rounded-lg"
                    >
                      <p className="text-sm text-green-100 flex items-start">
                        <span className="text-green-500 mr-2 font-bold">
                          {index + 1}.
                        </span>
                        <SimpleMarkdown text={rec} />
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Full Analysis */}
              <section className="google-sans-code-400">
                <h3 className="text-lg  font-semibold text-purple-300 mb-3 flex items-center">
                  {/* CHANGELOG: text-white changed to text-purple-300 */}
                  <FileText className="w-5 h-5 mr-2 text-purple-500" />
                  Complete Analysis
                </h3>
                <div className="bg-slate-800 border border-slate-700 p-4 rounded-lg">
                  <div className="text-sm text-gray-300 font-sans leading-relaxed">
                    {aiAnalysis.rawAnalysis.split("\n").map((line, index) => {
                      if (line.trim() === "---") {
                        return (
                          <hr key={index} className="my-4 border-slate-600" />
                        );
                      }
                      if (line.trim() === "") {
                        return <div key={index} className="h-3" />; // Spacer
                      }
                      return (
                        <p key={index} className="mb-1">
                          <SimpleMarkdown text={line} />
                        </p>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* Disclaimer */}
              <div className="bg-yellow-900/20 border border-yellow-700 p-4 rounded-lg">
                <p className="text-xs text-yellow-100">
                  <strong>Disclaimer:</strong> This AI analysis is for
                  informational purposes only and should not replace
                  professional medical advice. Always consult with qualified
                  healthcare providers for medical decisions.
                </p>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="bg-slate-800 border-t border-slate-700 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysisModal;
