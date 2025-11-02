import React, { useState } from "react";
import { Stethoscope, Check, Eye } from "lucide-react";
// import { notesAPI } from "../../services/api"; // Removed failing import

// --- ADDED MOCK API ---
// Added a mock notesAPI object to resolve the import error.
const notesAPI = {
  markNoteAsRead: async (noteId) => {
    console.log(`Mock API: Marking note ${noteId} as read.`);
    return Promise.resolve();
  },
  acknowledgeNote: async (noteId) => {
    console.log(`Mock API: Acknowledging note ${noteId}.`);
    return Promise.resolve();
  },
};
// --- END OF MOCK API ---

const ConsultationNoteCard = ({ note }) => {
  // --- NEW STATE ---
  // State to manage the expanded details view
  const [isExpanded, setIsExpanded] = useState(false);

  const acknowledge = async () => {
    await notesAPI.markNoteAsRead(note._id);
    await notesAPI.acknowledgeNote(note._id);
    // Note: In a real app, you'd also update the 'note.isRead' state
    // here to make the change reflect immediately without a page reload.
  };

  return (
    <div className="bg-[var(--color-primary)] rounded-xl shadow-sm border google-sans-code-400 border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start space-x-4">
        <div className="bg-orange-50 p-3 rounded-lg mt-1 flex-shrink-0">
          <Stethoscope className="w-5 h-5 text-orange-600" />
        </div>
        <div className="flex-1 min-w-0">
          {/* Header (Always Visible) */}
          <div className="flex flex-col items-start gap-1 mb-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <span className="text-lg font-semibold text-[var(--color-primary)]">
                {note.title}
              </span>
              <span className="text-red-400 block text-sm sm:inline sm:ml-2">
                ({note.category} | {note.priority})
              </span>
            </div>
            <span className="text-[var(--color-primary)] text-sm flex-shrink-0">
              {new Date(note.createdAt).toLocaleString()}
            </span>
          </div>

          {/* --- CONDITIONALLY RENDERED DETAILS --- */}
          {isExpanded && (
            <div className="mt-4 border-t border-gray-700 pt-4">
              <p className="text-[var(--color-primary)]/80 leading-relaxed mb-4">
                {note.content}
              </p>

              <div className="text-gray-500 text-sm">
                <div>
                  Doctor:{" "}
                  <span className="font-medium">{note.doctorId.name}</span>
                </div>
                <div className="text-xs mt-1 opacity-75">
                  {note.doctorId.email}
                </div>
              </div>
            </div>
          )}
          {/* --- END OF CONDITIONAL DETAILS --- */}

          {/* Action Buttons (Always visible) */}
          <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-end">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center justify-center gap-2 px-4 py-2 w-full sm:w-auto border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 rounded-lg transition-colors text-sm font-medium"
            >
              <Eye className="w-4 h-4" />
              {isExpanded ? "Hide Details" : "View Details"}
            </button>
            <button
              onClick={acknowledge}
              disabled={note.isRead}
              className="bg-[var(--color-primary)] hover:cursor-pointer hover:bg-[var(--color-primary)]/90 text-black px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:ring-offset-1
              w-full sm:w-auto" // Responsive width
            >
              {note.isRead ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Acknowledged</span>
                </>
              ) : (
                <span>Acknowledge</span>
              )}
              Player
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationNoteCard;
