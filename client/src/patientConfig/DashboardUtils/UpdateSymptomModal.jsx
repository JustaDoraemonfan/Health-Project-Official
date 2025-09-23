// components/UpdateSymptomModal.js
import { X } from "lucide-react";
import Toast from "../../components/Toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
} from "../Symptom/index";
import {
  DescriptionSection,
  SeverityDateSection,
  CategorySection,
  NotesSection,
} from "../Symptom/SymptomFormSections";
import FileUploadSection from "../Symptom/FileUploadSection";
import { useSymptomForm } from "../../hooks/useSymptomForm";

const UpdateSymptomModal = ({
  open = false,
  onOpenChange,
  onSubmit,
  onClose,
  initialData = {},
}) => {
  const {
    formData,
    existingAttachments,
    newFiles,
    loading,
    toast,
    isFormValid,
    fileInputRef,
    handleInputChange,
    handleFileUpload,
    removeExisting,
    removeNew,
    submitForm,
    setToast,
  } = useSymptomForm(initialData, open);

  const handleSubmit = () => {
    submitForm(onSubmit, handleClose);
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  const isEditMode = initialData && Object.keys(initialData).length > 0;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                {isEditMode ? "Update Symptom" : "Add New Symptom"}
              </DialogTitle>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleClose}
                className="bg-transparent"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="px-6 py-4 space-y-4">
            <DescriptionSection
              value={formData.description}
              onChange={handleInputChange}
            />

            <SeverityDateSection
              formData={formData}
              onChange={handleInputChange}
            />

            <CategorySection
              value={formData.category}
              onChange={handleInputChange}
            />

            <NotesSection value={formData.notes} onChange={handleInputChange} />

            <FileUploadSection
              fileInputRef={fileInputRef}
              existingAttachments={existingAttachments}
              newFiles={newFiles}
              onFileUpload={handleFileUpload}
              onRemoveExisting={removeExisting}
              onRemoveNew={removeNew}
            />

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2 border-t">
              <Button
                type="button"
                onClick={handleClose}
                className="flex-1 sm:flex-none text-white bg-[var(--color-secondary)] hover:cursor-pointer hover:bg-zinc-800"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={!isFormValid || loading}
                className="flex-1 sm:flex-none"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {isEditMode ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  <>{isEditMode ? "Update Symptom" : "Add Symptom"}</>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};

export default UpdateSymptomModal;
