// components/FileUploadSection.js
import React from "react";
import { Upload } from "lucide-react";
import { Button, Label } from "./index";
import { ACCEPTED_FILE_TYPES } from "./Constants";

const FileUploadSection = ({
  fileInputRef,
  existingAttachments,
  newFiles,
  onFileUpload,
  onRemoveExisting,
  onRemoveNew,
}) => {
  return (
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
          accept={ACCEPTED_FILE_TYPES}
          onChange={onFileUpload}
          className="hidden"
        />

        {/* Existing attachments (from server) */}
        {existingAttachments.length > 0 && (
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-gray-700">
              Current Files:
            </h4>
            {existingAttachments.map((att, i) => (
              <div
                key={att._id || att.filePath || i}
                className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
              >
                <a
                  href={att.url}
                  target="_blank"
                  rel="noreferrer"
                  className="truncate mr-2 text-blue-600 hover:text-blue-800"
                >
                  {att.originalName || att.url}
                </a>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onRemoveExisting(i)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Newly selected files */}
        {newFiles.length > 0 && (
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-gray-700">New Files:</h4>
            {newFiles.map((file, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 bg-blue-50 rounded text-sm"
              >
                <span className="truncate mr-2">{file.name}</span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onRemoveNew(i)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadSection;
