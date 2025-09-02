// Components/UpdateSymptomModal.js
import React, { useState, useRef, useEffect } from "react";
import { X, Upload, Calendar, FileText, AlertCircle } from "lucide-react";

// Mock shadcn/ui components with proper styling
const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-50 w-full max-w-lg mx-4">{children}</div>
    </div>
  );
};

const DialogContent = ({ children, className = "" }) => (
  <div
    className={`bg-zinc-950/70 backdrop-blur-md rounded-lg shadow-lg border ${className}`}
  >
    {children}
  </div>
);

const DialogHeader = ({ children }) => (
  <div className="px-6 py-4 border-b">{children}</div>
);

const DialogTitle = ({ children }) => (
  <h2 className="text-lg font-semibold text-white">{children}</h2>
);

const Button = ({
  variant = "default",
  size = "default",
  className = "",
  children,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary:
      "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500",
    outline:
      "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
  };

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-8 px-3 text-sm",
    lg: "h-12 px-8",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({ className = "", ...props }) => (
  <input
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-amber-50 px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

const Textarea = ({ className = "", ...props }) => (
  <textarea
    className={`flex min-h-[80px] w-full rounded-md border border-gray-300 bg-amber-50 px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 resize-none ${className}`}
    {...props}
  />
);

const Select = ({ children, value, onValueChange, placeholder }) => {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className="flex h-10 w-full rounded-md border border-gray-300 bg-amber-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    >
      {placeholder && <option value="">{placeholder}</option>}
      {children}
    </select>
  );
};

const SelectItem = ({ value, children }) => (
  <option value={value}>{children}</option>
);

const Label = ({ htmlFor, children, className = "" }) => (
  <label
    htmlFor={htmlFor}
    className={`text-sm font-medium text-neutral-400 ${className}`}
  >
    {children}
  </label>
);

const UpdateSymptomModal = ({
  open = false,
  onOpenChange,
  onSubmit,
  onClose,
  initialData = {},
}) => {
  const [formData, setFormData] = useState({
    description: "",
    severity: "",
    onsetDate: "",
    notes: "",
    category: "",
    attachments: [],
  });

  const fileInputRef = useRef(null);

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        description: initialData.description || "",
        severity: initialData.severity || "",
        onsetDate: initialData.onsetDate || "",
        notes: initialData.notes || "",
        category: initialData.category || "",
        attachments: initialData.attachments || [],
      });
    } else {
      setFormData({
        description: "",
        severity: "",
        onsetDate: "",
        notes: "",
        category: "",
        attachments: [],
      });
    }
  }, [initialData, open]);

  const severityOptions = [
    { value: "Mild", label: "🟢 Mild", color: "text-green-600" },
    { value: "Moderate", label: "🟡 Moderate", color: "text-yellow-600" },
    { value: "Severe", label: "🔴 Severe", color: "text-red-600" },
  ];

  const categoryOptions = [
    "Respiratory",
    "Digestive",
    "Musculoskeletal",
    "Cardiovascular",
    "Neurological",
    "Dermatological",
    "Other",
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...files],
    }));
  };

  const removeFile = (index) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(formData);
    }
    handleClose();
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  const isFormValid =
    formData.description.trim() && formData.severity && formData.onsetDate;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              {initialData && Object.keys(initialData).length > 0
                ? "Update Symptom"
                : "Add New Symptom"}
            </DialogTitle>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="px-6 py-4 space-y-4">
          {/* Symptom Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Symptom Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Describe your symptom in detail..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="min-h-[100px]"
              required
            />
          </div>

          {/* Severity and Date Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="severity">
                Severity <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.severity}
                onValueChange={(value) => handleInputChange("severity", value)}
                placeholder="Select severity"
              >
                {severityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="onsetDate" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Date of Onset <span className="text-red-500">*</span>
              </Label>
              <Input
                id="onsetDate"
                type="date"
                value={formData.onsetDate}
                onChange={(e) => handleInputChange("onsetDate", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleInputChange("category", value)}
              placeholder="Select Category (optional)"
            >
              {categoryOptions.map((category) => (
                <SelectItem key={category} value={category.toLowerCase()}>
                  {category}
                </SelectItem>
              ))}
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              Additional Notes
            </Label>
            <Textarea
              id="notes"
              placeholder="Any additional information, triggers, or observations..."
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              <Upload className="h-4 w-4" />
              Attachments (optional)
            </Label>
            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full sm:w-auto"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Files
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* File List */}
              {formData.attachments.length > 0 && (
                <div className="space-y-1">
                  {formData.attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
                    >
                      <span className="truncate flex-1 mr-2">
                        {file.name || `Attachment ${index + 1}`}
                      </span>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              className="flex-1 sm:flex-none"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!isFormValid}
              className="flex-1 sm:flex-none"
            >
              {initialData && Object.keys(initialData).length > 0
                ? "Update Symptom"
                : "Add Symptom"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateSymptomModal;
