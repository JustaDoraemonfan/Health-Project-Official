import React, { useState, useEffect } from "react";

const ProfilePhotoUpload = ({ initialPhoto, onFileSelect }) => {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    setPreview(initialPhoto);
  }, [initialPhoto]);

  const handleSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
    onFileSelect(file);
  };

  return (
    <div className="mb-10">
      <h4 className="text-lg font-semibold text-slate-200 mb-4 tracking-tight">
        Profile Photo
      </h4>

      <div className="flex flex-col items-start gap-4">
        <label
          className="
            relative w-36 h-36 rounded-full overflow-hidden cursor-pointer
            border border-slate-700 shadow-lg
            group transition-all
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
              absolute inset-0 bg-black/60 flex items-center justify-center 
              opacity-0 group-hover:opacity-100 transition-opacity
              text-white text-sm font-medium
            "
          >
            Change Photo
          </div>

          {/* File input */}
          <input
            type="file"
            accept="image/*"
            onChange={handleSelect}
            className="hidden"
          />
        </label>

        <p className="text-xs text-gray-400">
          JPG or PNG, max 5MB — keep it clear and professional
        </p>
      </div>
    </div>
  );
};

export default ProfilePhotoUpload;
