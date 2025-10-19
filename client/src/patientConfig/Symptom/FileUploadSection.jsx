import React from "react";
import { Upload, Paperclip, X, ExternalLink } from "lucide-react";
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
    <div className="space-y-4">
      <Label className="flex items-center gap-2">
        <Paperclip className="h-4 w-4 text-cyan-400" />
        Attachments (optional)
      </Label>

      <div className="space-y-4">
        {/*
          CHANGE: Added 'sm:items-center' for better vertical alignment on desktop screens.
          The flex-col sm:flex-row pattern ensures it stacks on mobile and goes side-by-side on larger screens.
        */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 sm:flex-none"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Files
          </Button>
          <p className="text-xs text-gray-400">
            Supported: Images, PDFs, Documents (Max 10MB each)
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ACCEPTED_FILE_TYPES}
          onChange={onFileUpload}
          className="hidden"
        />

        {/* Existing attachments */}
        {existingAttachments.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Paperclip className="h-4 w-4" />
              Current Files:
            </h4>
            {/*
              CHANGE: Added 'sm:grid-cols-2'.
              This makes the list a single column on mobile and a two-column grid on screens sm and wider.
            */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {existingAttachments.map((att, i) => (
                <div
                  key={att._id || att.filePath || i}
                  className="flex items-center justify-between p-3 bg-[var(--color-primary)]/60 rounded-lg border border-gray-600"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Paperclip className="h-4 w-4 text-blue-400 flex-shrink-0" />
                    <a
                      href={att.url}
                      target="_blank"
                      rel="noreferrer"
                      className="truncate text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                    >
                      {att.originalName || att.url}
                      <ExternalLink className="h-3 w-3 flex-shrink-0" />
                    </a>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onRemoveExisting(i)}
                    className="ml-2 flex-shrink-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Newly selected files */}
        {newFiles.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Upload className="h-4 w-4" />
              New Files:
            </h4>
            {/*
              CHANGE: Added 'sm:grid-cols-2' for a responsive two-column layout on larger screens.
            */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {newFiles.map((file, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-green-900/20 rounded-lg border border-green-800/50"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Upload className="h-4 w-4 text-green-400 flex-shrink-0" />
                    <span className="truncate text-sm text-green-300">
                      {file.name}
                    </span>
                    <span className="text-xs text-gray-400 flex-shrink-0">
                      ({(file.size / 1024 / 1024).toFixed(1)}MB)
                    </span>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onRemoveNew(i)}
                    className="ml-2 flex-shrink-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadSection;
