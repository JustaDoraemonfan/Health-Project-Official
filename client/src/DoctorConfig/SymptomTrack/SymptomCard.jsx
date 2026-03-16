import React, { useState } from "react";
import { formatDate, getTimeAgo } from "../../utils/dateUtils";
import { getPriorityIndicator } from "../../utils/symptomUtils";
import { FileText, Eye, Paperclip, Loader2 } from "lucide-react";
import { symptomAPI } from "../../services/api";

const SymptomCard = ({ symptom, isExpanded, onToggle }) => {
  const attachments = symptom.attachments || [];
  const [loadingKey, setLoadingKey] = useState(null); // tracks which attachment is loading

  const isImage = (mime) => mime?.startsWith("image/");

  const openAttachment = async (e, att) => {
    e.stopPropagation();
    if (!att.filePath) return;

    try {
      setLoadingKey(att.filePath);
      const res = await symptomAPI.getAttachmentUrl(att.filePath);
      const signedUrl = res.data.data.url;
      window.open(signedUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      console.error("Failed to get attachment URL", err);
    } finally {
      setLoadingKey(null);
    }
  };

  return (
    <div
      className={`group relative border border-black/10 rounded-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 ${
        isExpanded ? "shadow-xl scale-[1.02]" : "hover:shadow-lg"
      }`}
      style={{ backgroundColor: "var(--color-secondary)" }}
      onClick={onToggle}
    >
      {/* Priority indicator bar */}
      <div
        className="absolute top-0 left-6 w-12 h-0.5 rounded-full"
        style={{
          backgroundColor: "var(--color-primary)",
          opacity:
            symptom.priority === "severe" || symptom.priority === "high"
              ? 1
              : symptom.priority === "moderate" || symptom.priority === "medium"
                ? 0.6
                : 0.3,
        }}
      ></div>

      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          {/* Block 1: Main Content */}
          <div className="flex-1 min-w-0">
            {/* Priority/Category Row */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-4">
              <div className="flex items-center gap-2">
                {getPriorityIndicator(symptom.priority)}
                <span
                  className="text-sm font-medium opacity-60 capitalize"
                  style={{ color: "var(--color-primary)" }}
                >
                  {symptom.priority || "medium"} severity
                </span>
              </div>
              {symptom.category && (
                <>
                  <span className="text-sm opacity-30">•</span>
                  <span
                    className="text-sm font-medium opacity-60 capitalize"
                    style={{ color: "var(--color-primary)" }}
                  >
                    {symptom.category}
                  </span>
                </>
              )}
              {/* Attachment count badge — visible even when collapsed */}
              {attachments.length > 0 && (
                <>
                  <span className="text-sm opacity-30">•</span>
                  <span
                    className="flex items-center gap-1 text-sm font-medium opacity-60"
                    style={{ color: "var(--color-primary)" }}
                  >
                    <Paperclip className="w-3 h-3" />
                    {attachments.length} attachment
                    {attachments.length !== 1 ? "s" : ""}
                  </span>
                </>
              )}
            </div>

            {/* Description & Notes */}
            <div className="mb-6">
              <p
                className={`text-base md:text-lg leading-relaxed transition-all duration-300 ${
                  isExpanded ? "prose" : "line-clamp-2"
                }`}
                style={{ color: "var(--color-primary)" }}
              >
                {symptom.symptomDescription}
              </p>
              {!isExpanded && symptom.symptomDescription.length > 100 && (
                <button className="text-sm font-medium mt-2 opacity-60 hover:opacity-100 transition-opacity">
                  Read more...
                </button>
              )}

              {/* Notes when expanded */}
              {isExpanded && symptom.notes && (
                <div className="mt-4 p-4 bg-black/5 rounded-lg">
                  <p
                    className="text-sm font-medium opacity-70 mb-1"
                    style={{ color: "var(--color-primary)" }}
                  >
                    Patient Notes:
                  </p>
                  <p
                    className="text-sm opacity-80"
                    style={{ color: "var(--color-primary)" }}
                  >
                    {symptom.notes}
                  </p>
                </div>
              )}

              {/* Attachments — shown when expanded */}
              {isExpanded && attachments.length > 0 && (
                <div
                  className="mt-4 p-4 bg-black/5 rounded-lg"
                  onClick={(e) => e.stopPropagation()} // prevent card toggle when clicking links
                >
                  <p
                    className="flex items-center gap-2 text-sm font-medium opacity-70 mb-3"
                    style={{ color: "var(--color-primary)" }}
                  >
                    <Paperclip className="w-4 h-4" />
                    Patient Attachments ({attachments.length})
                  </p>

                  {/* Image previews */}
                  {attachments.some((a) => isImage(a.mime)) && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {attachments
                        .filter((a) => isImage(a.mime))
                        .map((att, i) => (
                          <button
                            key={att._id || i}
                            onClick={(e) => openAttachment(e, att)}
                            className="relative block w-24 h-24 rounded-lg overflow-hidden border bg-amber-50 border-white hover:opacity-90 transition-opacity flex-shrink-0 cursor-pointer"
                            title={att.originalName}
                            disabled={loadingKey === att.filePath}
                          >
                            <img
                              src={att.url}
                              alt={att.originalName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                            {loadingKey === att.filePath && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                <Loader2 className="w-5 h-5 text-white animate-spin" />
                              </div>
                            )}
                          </button>
                        ))}
                    </div>
                  )}

                  {/* Non-image files */}
                  {attachments
                    .filter((a) => !isImage(a.mime))
                    .map((att, i) => (
                      <div
                        key={att._id || i}
                        className="flex items-center justify-between gap-2 p-2 bg-black/5 rounded-lg mb-1"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText
                            className="w-4 h-4 opacity-50 flex-shrink-0"
                            style={{ color: "var(--color-primary)" }}
                          />
                          <div className="min-w-0">
                            <p
                              className="text-sm font-medium truncate"
                              style={{ color: "var(--color-primary)" }}
                            >
                              {att.originalName}
                            </p>
                            <p
                              className="text-xs opacity-50"
                              style={{ color: "var(--color-primary)" }}
                            >
                              {(att.size / 1024).toFixed(1)} KB • {att.mime}
                            </p>
                          </div>
                        </div>
                        {att.filePath && (
                          <button
                            onClick={(e) => openAttachment(e, att)}
                            disabled={loadingKey === att.filePath}
                            className="flex items-center justify-center w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 transition-colors flex-shrink-0"
                            title="Open file"
                          >
                            {loadingKey === att.filePath ? (
                              <Loader2
                                className="w-4 h-4 animate-spin"
                                style={{ color: "var(--color-primary)" }}
                              />
                            ) : (
                              <Eye
                                className="w-4 h-4"
                                style={{ color: "var(--color-primary)" }}
                              />
                            )}
                          </button>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Expanded Action Buttons */}
            {isExpanded && (
              <div className="flex flex-wrap gap-3 mb-4 animate-in slide-in-from-top-2 duration-300">
                <button
                  className="px-6 py-3 text-sm font-medium rounded-xl border-2 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                  style={{
                    color: "var(--color-secondary)",
                    borderColor: "var(--color-secondary)",
                  }}
                >
                  View History
                </button>
                <button
                  className="px-6 py-3 text-sm font-medium rounded-xl transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                  style={{
                    backgroundColor: "var(--color-secondary)",
                    color: "var(--color-primary)",
                  }}
                >
                  Add Notes
                </button>
                <button
                  className="px-6 py-3 text-sm font-medium rounded-xl border-2 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                  style={{
                    color: "var(--color-secondary)",
                    borderColor: "var(--color-secondary)",
                  }}
                >
                  Prescribe Treatment
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col items-start md:items-end gap-2 flex-shrink-0">
            <div className="text-left md:text-right">
              <p
                className="text-lg md:text-xl font-medium"
                style={{ color: "var(--color-primary)" }}
              >
                {formatDate(symptom.dateLogged)}
              </p>
              <p
                className="text-sm opacity-50"
                style={{ color: "var(--color-primary)" }}
              >
                {symptom.timeLogged}
              </p>
            </div>
            <div
              className="text-xs font-medium opacity-40"
              style={{ color: "var(--color-primary)" }}
            >
              {getTimeAgo(symptom.dateLogged)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymptomCard;
