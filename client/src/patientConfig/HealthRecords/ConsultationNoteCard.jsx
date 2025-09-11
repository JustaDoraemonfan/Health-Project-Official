import React from "react";
import { Stethoscope, Check } from "lucide-react";
import { notesAPI } from "../../services/api";

const ConsultationNoteCard = ({ note }) => {
  const acknowledge = async () => {
    await notesAPI.markNoteAsRead(note._id);
    await notesAPI.acknowledgeNote(note._id);
  };

  return (
    <div className="bg-[var(--color-secondary)] rounded-xl shadow-sm border google-sans-code-400 border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start space-x-4">
        <div className="bg-orange-50 p-3 rounded-lg mt-1">
          <Stethoscope className="w-5 h-5 text-orange-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-lg font-semibold text-[var(--color-primary)]">
                {note.title}
              </span>
              <span className="text-red-400 ml-2">
                ({note.category} | {note.priority})
              </span>
            </div>
            <span className="text-[var(--color-primary)] text-sm">
              {new Date(note.createdAt).toLocaleString()}
            </span>
          </div>
          <p className="text-[var(--color-primary)]/80 leading-relaxed mb-4">
            {note.content}
          </p>
          <div className="flex justify-between items-center">
            <div className="text-gray-500 text-sm">
              <div>
                Doctor:{" "}
                <span className="font-medium">{note.doctorId.name}</span>
              </div>
              <div className="text-xs mt-1 opacity-75">
                {note.doctorId.email}
              </div>
            </div>
            <button
              onClick={acknowledge}
              className="bg-[var(--color-primary)] hover:cursor-pointer hover:bg-[var(--color-primary)]/90 text-black px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:ring-offset-1"
            >
              <Check className="w-4 h-4" />
              <span>Acknowledge</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationNoteCard;
