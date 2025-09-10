// components/SymptomFormSections.js
import React from "react";
import { Calendar, FileText } from "lucide-react";
import { Input, Textarea, Select, SelectItem, Label } from "./index";
import { SEVERITY_OPTIONS, CATEGORY_OPTIONS } from "./Constants";

export const DescriptionSection = ({ value, onChange }) => (
  <div className="space-y-2">
    <Label htmlFor="description">
      Symptom Description <span className="text-red-500">*</span>
    </Label>
    <Textarea
      id="description"
      placeholder="Describe your symptom in detail..."
      value={value}
      onChange={(e) => onChange("description", e.target.value)}
      className="min-h-[60px]"
      required
    />
  </div>
);

export const SeverityDateSection = ({ formData, onChange }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div className="space-y-2">
      <Label htmlFor="severity">
        Severity <span className="text-red-500">*</span>
      </Label>
      <Select
        value={formData.severity}
        onValueChange={(value) => onChange("severity", value)}
        placeholder="Select severity"
      >
        {SEVERITY_OPTIONS.map((option) => (
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
        onChange={(e) => onChange("onsetDate", e.target.value)}
        required
      />
    </div>
  </div>
);

export const CategorySection = ({ value, onChange }) => (
  <div className="space-y-2">
    <Label htmlFor="category">Category</Label>
    <Select
      value={value}
      onValueChange={(value) => onChange("category", value)}
      placeholder="Select Category (Optional)"
    >
      {CATEGORY_OPTIONS.map((category) => (
        <SelectItem key={category} value={category.toLowerCase()}>
          {category}
        </SelectItem>
      ))}
    </Select>
  </div>
);

export const NotesSection = ({ value, onChange }) => (
  <div className="space-y-2">
    <Label htmlFor="notes" className="flex items-center gap-1">
      <FileText className="h-4 w-4" />
      Additional Notes
    </Label>
    <Textarea
      id="notes"
      placeholder="Any additional information, triggers, or observations..."
      value={value}
      onChange={(e) => onChange("notes", e.target.value)}
      className="min-h-[60px]"
    />
  </div>
);
