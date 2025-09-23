import React from "react";
import { Calendar, FileText, AlertCircle, Activity } from "lucide-react";
import { Input, Textarea, Select, SelectItem, Label } from "./index";
import { SEVERITY_OPTIONS, CATEGORY_OPTIONS } from "./Constants";

export const DescriptionSection = ({ value, onChange }) => (
  <div className="space-y-3">
    <Label htmlFor="description" className="flex items-center gap-2">
      <FileText className="h-4 w-4 text-blue-400" />
      Symptom Description <span className="text-red-400">*</span>
    </Label>
    <Textarea
      id="description"
      placeholder="Please describe your symptom in detail. Include when it occurs, how it feels, and any patterns you've noticed..."
      value={value}
      onChange={(e) => onChange("description", e.target.value)}
      className="min-h-[100px] resize-none"
      required
    />
  </div>
);

export const SeverityDateSection = ({ formData, onChange }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div className="space-y-3">
      <Label htmlFor="severity" className="flex items-center gap-2">
        <AlertCircle className="h-4 w-4 text-orange-400" />
        Severity Level <span className="text-red-400">*</span>
      </Label>
      <Select
        value={formData.severity}
        onValueChange={(value) => onChange("severity", value)}
        placeholder="How severe is your symptom?"
      >
        {SEVERITY_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </Select>
    </div>

    <div className="space-y-3">
      <Label htmlFor="onsetDate" className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-green-400" />
        When did this start? <span className="text-red-400">*</span>
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
  <div className="space-y-3">
    <Label htmlFor="category" className="flex items-center gap-2">
      <Activity className="h-4 w-4 text-purple-400" />
      Symptom Category
    </Label>
    <Select
      value={value}
      onValueChange={(value) => onChange("category", value)}
      placeholder="Select a category (optional)"
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
  <div className="space-y-3">
    <Label htmlFor="notes" className="flex items-center gap-2">
      <FileText className="h-4 w-4 text-indigo-400" />
      Additional Notes
    </Label>
    <Textarea
      id="notes"
      placeholder="Any additional information, triggers, medications taken, or other observations that might be helpful..."
      value={value}
      onChange={(e) => onChange("notes", e.target.value)}
      className="min-h-[80px] resize-none"
    />
  </div>
);
