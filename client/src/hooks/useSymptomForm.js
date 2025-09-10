// hooks/useSymptomForm.js - FIXED VERSION
import { useState, useEffect, useRef } from "react";
import { symptomAPI } from "../services/api";

export const useSymptomForm = (initialData = {}, open = false) => {
  // ADD THIS: Create the file input reference
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    description: "",
    severity: "",
    onsetDate: "",
    notes: "",
    category: "",
  });

  const [existingAttachments, setExistingAttachments] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [removedAttachments, setRemovedAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Reset form when initialData or modal open state changes
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        description: initialData.description || "",
        severity: initialData.severity || "",
        onsetDate: initialData.onsetDate
          ? initialData.onsetDate.substring(0, 10)
          : "",
        notes: initialData.notes || "",
        category: initialData.category || "",
      });
      setExistingAttachments(initialData.attachments || []);
    } else {
      setFormData({
        description: "",
        severity: "",
        onsetDate: "",
        notes: "",
        category: "",
      });
      setExistingAttachments([]);
    }

    // Always reset file states when modal opens/closes
    setNewFiles([]);
    setRemovedAttachments([]);

    // ADDED: Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [initialData, open]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = (e) => {
    console.log("File upload triggered", e.target.files); // Debug log

    if (!e.target.files || e.target.files.length === 0) {
      console.log("No files selected");
      return;
    }

    const files = Array.from(e.target.files);
    console.log(
      "Files to upload:",
      files.map((f) => ({ name: f.name, size: f.size, type: f.type }))
    );

    setNewFiles((prev) => {
      const updated = [...prev, ...files];
      console.log(
        "Updated newFiles:",
        updated.map((f) => f.name)
      );
      return updated;
    });

    // Reset input to allow selecting the same file again
    e.target.value = null;
  };

  const removeExisting = (index) => {
    const removed = existingAttachments[index];
    const idOrPath = removed._id
      ? removed._id.toString()
      : removed.filePath || removed.url;
    setRemovedAttachments((prev) => [...prev, idOrPath]);
    setExistingAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNew = (index) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const submitForm = async (onSubmit, onClose) => {
    if (!isFormValid) {
      console.log("Form validation failed");
      return;
    }

    setLoading(true);
    console.log("Submitting form with:", {
      formData,
      newFiles: newFiles.map((f) => f.name),
      removedAttachments,
      needsFormData: newFiles.length > 0 || removedAttachments.length > 0,
    });

    try {
      const needFormData = newFiles.length > 0 || removedAttachments.length > 0;

      if (needFormData) {
        const fd = new FormData();
        fd.append("description", formData.description);
        fd.append("severity", formData.severity);
        fd.append("onsetDate", formData.onsetDate);
        fd.append("notes", formData.notes);
        fd.append("category", formData.category);

        if (removedAttachments.length) {
          fd.append("deletedAttachments", JSON.stringify(removedAttachments));
        }

        newFiles.forEach((file) => {
          fd.append("symptomFiles", file);
          console.log("Appending file:", file.name, file.type, file.size);
        });

        // Debug: Log all FormData entries
        console.log("FormData contents:");
        for (let [key, value] of fd.entries()) {
          if (value instanceof File) {
            console.log(
              `${key}: File(${value.name}, ${value.size} bytes, ${value.type})`
            );
          } else {
            console.log(`${key}: ${value}`);
          }
        }

        if (initialData && initialData._id) {
          await symptomAPI.updateSymptom(initialData._id, fd);
        } else {
          await symptomAPI.addSymptom(fd);
        }
      } else {
        const payload = {
          description: formData.description,
          severity: formData.severity,
          onsetDate: formData.onsetDate,
          notes: formData.notes,
          category: formData.category,
        };

        console.log("Sending JSON payload:", payload);

        if (initialData && initialData._id) {
          await symptomAPI.updateSymptom(initialData._id, payload);
        } else {
          await symptomAPI.addSymptom(payload);
        }
      }

      showToast("Saved successfully", "success");

      if (onSubmit) {
        onSubmit();
      }

      if (onClose) {
        onClose();
      }
    } catch (err) {
      console.error("Submit error:", err);
      console.error("Error response:", err?.response?.data);
      showToast(err?.response?.data?.message || "Save failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    formData.description.trim() && formData.severity && formData.onsetDate;

  return {
    formData,
    existingAttachments,
    newFiles,
    removedAttachments,
    loading,
    toast,
    isFormValid,
    fileInputRef, // ADDED: Return the file input ref
    handleInputChange,
    handleFileUpload,
    removeExisting,
    removeNew,
    showToast,
    submitForm,
    setToast,
  };
};
