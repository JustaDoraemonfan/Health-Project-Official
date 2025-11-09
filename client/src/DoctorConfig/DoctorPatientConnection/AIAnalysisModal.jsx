import {
  X,
  Brain,
  Loader2,
  TrendingUp,
  Shield,
  Activity,
  Pill,
} from "lucide-react";
import { useState, useEffect } from "react";

const AIAnalysisModal = ({ isOpen, onClose, patient }) => {
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (isOpen && patient) {
      analyzeWithAI();
    }
  }, [isOpen, patient]);

  const analyzeWithAI = async () => {
    setIsAnalyzing(true);
    setAiAnalysis(null);

    try {
      const userName = patient.userId?.name || "Unknown Patient";

      // Prepare patient data for AI analysis
      const patientData = {
        name: userName,
        age: patient.age,
        gender: patient.gender,
        symptoms: patient.symptoms || [],
        allergies: patient.allergies || [],
        medicalHistory: patient.medicalHistory || [],
        medications: patient.medications || [],
        surgeries: patient.surgeries || [],
        bloodGroup: patient.bloodGroup,
      };

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `You are a medical AI assistant. Analyze this patient's health data and provide insights in JSON format ONLY (no markdown, no preamble).

Patient Data:
${JSON.stringify(patientData, null, 2)}

Respond with ONLY a JSON object with this structure:
{
  "riskLevel": "low|moderate|high",
  "keyFindings": ["finding 1", "finding 2", "finding 3"],
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"],
  "drugInteractions": ["interaction 1" or "None identified"],
  "preventiveCare": ["care 1", "care 2"]
}`,
            },
          ],
        }),
      });

      const data = await response.json();
      const analysisText = data.content[0].text;

      // Parse the JSON response
      const cleanText = analysisText.replace(/```json|```/g, "").trim();
      const analysis = JSON.parse(cleanText);

      setAiAnalysis(analysis);
    } catch (error) {
      console.error("AI Analysis error:", error);
      setAiAnalysis({
        riskLevel: "moderate",
        keyFindings: ["Unable to complete full analysis at this time"],
        recommendations: [
          "Please consult with healthcare provider for detailed assessment",
        ],
        drugInteractions: ["Analysis unavailable"],
        preventiveCare: ["Regular check-ups recommended"],
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!isOpen) return null;

  const userName = patient?.userId?.name || "Unknown Patient";

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
      <div className="bg-[var(--color-secondary)] rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* AI Modal Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-3">
            <Brain className="w-10 h-10" />
            <div>
              <h2 className="text-2xl font-bold">AI Health Analysis</h2>
              <p className="text-blue-100 text-sm">Patient: {userName}</p>
            </div>
          </div>
        </div>

        {/* AI Modal Body */}
        <div className="p-6 overflow-y-auto no-scrollbar flex-1">
          {isAnalyzing ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
              <p className="text-white text-lg">Analyzing patient data...</p>
              <p className="text-gray-400 text-sm mt-2">
                This may take a few moments
              </p>
            </div>
          ) : aiAnalysis ? (
            <div className="space-y-6">
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
                        ? "text-red-600"
                        : aiAnalysis.riskLevel === "moderate"
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-white">
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
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-blue-600" />
                  Key Findings
                </h3>
                <div className="space-y-2">
                  {aiAnalysis.keyFindings.map((finding, index) => (
                    <div key={index} className="bg-slate-800 p-3 rounded-lg">
                      <p className="text-sm text-white flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        {finding}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Recommendations */}
              <section>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                  Recommendations
                </h3>
                <div className="space-y-2">
                  {aiAnalysis.recommendations.map((rec, index) => (
                    <div
                      key={index}
                      className="bg-green-900/20 border border-green-800 p-3 rounded-lg"
                    >
                      <p className="text-sm text-green-100 flex items-start">
                        <span className="text-green-600 mr-2 font-bold">
                          {index + 1}.
                        </span>
                        {rec}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Drug Interactions */}
              <section>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <Pill className="w-5 h-5 mr-2 text-orange-600" />
                  Drug Interactions
                </h3>
                <div className="space-y-2">
                  {aiAnalysis.drugInteractions.map((interaction, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg ${
                        interaction.toLowerCase().includes("none")
                          ? "bg-green-900/20 border border-green-800"
                          : "bg-orange-900/20 border border-orange-800"
                      }`}
                    >
                      <p
                        className={`text-sm ${
                          interaction.toLowerCase().includes("none")
                            ? "text-green-100"
                            : "text-orange-100"
                        }`}
                      >
                        {interaction}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Preventive Care */}
              <section>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-purple-600" />
                  Preventive Care Suggestions
                </h3>
                <div className="space-y-2">
                  {aiAnalysis.preventiveCare.map((care, index) => (
                    <div
                      key={index}
                      className="bg-purple-900/20 border border-purple-800 p-3 rounded-lg"
                    >
                      <p className="text-sm text-purple-100 flex items-start">
                        <span className="text-purple-600 mr-2">✓</span>
                        {care}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Disclaimer */}
              <div className="bg-yellow-900/20 border border-yellow-800 p-4 rounded-lg">
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

        {/* AI Modal Footer */}
        <div className="bg-[var(--color-secondary)] border-t border-slate-700 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysisModal;
