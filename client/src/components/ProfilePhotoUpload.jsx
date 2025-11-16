import React, { useState, useEffect } from "react";
import { AlertCircle, CheckCircle, X } from "lucide-react";

const ProfilePhotoUpload = ({ initialPhoto, onFileSelect }) => {
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState(null);

  useEffect(() => {
    setPreview(initialPhoto);
  }, [initialPhoto]);

  const formatFileSize = (bytes) => {
    if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(2) + " KB";
    }
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const validateFile = (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error:
          "Invalid file type. Please upload JPG, PNG, or WebP images only.",
      };
    }

    // Check file size
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size (${formatFileSize(
          file.size
        )}) exceeds the 5MB limit. Please choose a smaller image.`,
      };
    }

    // Check if file size is too small (likely corrupted)
    if (file.size < 1024) {
      return {
        valid: false,
        error: "File size is too small. The image may be corrupted.",
      };
    }

    return { valid: true };
  };

  const handleSelect = (e) => {
    const file = e.target.files[0];

    // Reset states
    setError(null);
    setFileName(null);

    if (!file) return;

    // Validate the file
    const validation = validateFile(file);

    if (!validation.valid) {
      setError(validation.error);
      // Clear the input
      e.target.value = "";
      // Reset preview to initial photo
      setPreview(initialPhoto);
      // Notify parent that no file is selected
      onFileSelect(null);
      return;
    }

    // File is valid, proceed
    try {
      const localPreview = URL.createObjectURL(file);
      setPreview(localPreview);
      setFileName(file.name);
      onFileSelect(file);
    } catch (err) {
      console.error("Error creating preview:", err);
      setError("Failed to load image preview. Please try another file.");
      e.target.value = "";
      setPreview(initialPhoto);
      onFileSelect(null);
    }
  };

  const clearSelection = () => {
    setPreview(initialPhoto);
    setError(null);
    setFileName(null);
    onFileSelect(null);
  };

  return (
    <div className="mb-8 sm:mb-10">
      <h4 className="text-base sm:text-lg font-semibold text-slate-200 mb-4 tracking-tight">
        Profile Photo
      </h4>

      <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
        {/* Photo upload area */}
        <div className="flex items-center gap-3 sm:gap-4">
          <label
            className="
              relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden cursor-pointer
              border-2 border-slate-700 shadow-lg
              group transition-all hover:border-slate-600
            "
          >
            {/* Profile preview */}
            <img
              src={
                preview ||
                "https://cdn-icons-png.flaticon.com/512/3177/3177440.png"
              }
              alt="Profile"
              className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-75"
            />

            {/* Hover overlay */}
            <div
              className="
                absolute inset-0 bg-black/60 flex flex-col items-center justify-center 
                opacity-0 group-hover:opacity-100 transition-opacity
                text-white text-xs sm:text-sm font-medium px-2 text-center
              "
            >
              <span>Change</span>
              <span>Photo</span>
            </div>

            {/* File input */}
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleSelect}
              className="hidden"
            />
          </label>

          {/* Clear button - only show if a new file is selected */}
          {fileName && (
            <button
              type="button"
              onClick={clearSelection}
              className="p-2 sm:p-2.5 bg-red-500/20 hover:bg-red-500/30 rounded-full transition-colors border border-red-500/50 flex-shrink-0"
              title="Remove selected photo"
              aria-label="Remove selected photo"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" />
            </button>
          )}
        </div>

        {/* Info and feedback section */}
        <div className="flex flex-col gap-3 flex-1 min-w-0">
          {/* File info or help text */}
          {!error && !fileName && (
            <div className="space-y-2">
              <p className="text-xs sm:text-sm text-gray-400">
                JPG, PNG, or WebP
              </p>
              <p className="text-xs text-gray-500">
                Maximum size: 5MB • Keep it clear and professional
              </p>
            </div>
          )}

          {/* Selected file info */}
          {fileName && !error && (
            <div className="flex items-start gap-2 px-3 py-2.5 bg-green-500/10 border border-green-500/30 rounded-lg">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-green-300 break-words">
                  <span className="font-medium">Selected:</span> {fileName}
                </p>
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="flex items-start gap-2 px-3 py-2.5 bg-red-500/10 border border-red-500/30 rounded-lg">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-red-300 break-words">
                  {error}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePhotoUpload;
