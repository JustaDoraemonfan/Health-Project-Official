// utils/constants.js

// Color mappings for different medical specialties
export const SPECIALTY_COLORS = {
  Cardiologist: "text-red-400",
  Neurologist: "text-purple-400",
  Dermatologist: "text-pink-400",
  "Orthopedic Surgeon": "text-orange-400",
  Pediatrician: "text-green-400",
  Psychiatrist: "text-blue-400",
  Oncologist: "text-yellow-400",
  Gynecologist: "text-rose-400",
  Urologist: "text-cyan-400",
  Ophthalmologist: "text-indigo-400",
  "ENT Specialist": "text-teal-400",
  Endocrinologist: "text-violet-400",
};

// Default styling classes
export const BUTTON_STYLES = {
  primary:
    "bg-slate-100 hover:bg-slate-200 border border-slate-300 hover:border-slate-400 text-black hover:shadow-md",
  secondary:
    "bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 text-gray-100",
  success:
    "bg-green-800 hover:bg-green-700 border border-green-700 hover:border-green-600 text-green-100",
  disabled:
    "bg-gray-800 border border-gray-700 text-gray-500 cursor-not-allowed",
};

// Card styling
export const CARD_STYLES = {
  base: "bg-gray-900 border border-gray-800 rounded-lg transition-all duration-200",
  hover: "hover:border-gray-600 hover:shadow-lg hover:shadow-gray-900/30",
  expanded: "border-gray-600",
};

// Common spacing and sizing
export const SPACING = {
  cardPadding: "p-6",
  sectionGap: "space-y-3",
  gridGap: "gap-6",
  buttonGap: "gap-2",
};

// Search configuration
export const SEARCH_CONFIG = {
  debounceDelay: 300,
  minSearchLength: 2,
  maxResults: 50,
};

// App theme configuration
export const THEME = {
  backgroundColor: "#161515",
  fontFamily:
    'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
};
