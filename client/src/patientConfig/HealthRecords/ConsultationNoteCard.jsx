import React from "react";
import { Stethoscope } from "lucide-react";

const ConsultationNoteCard = ({ note }) => {
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
          <p className="text-[var(--color-primary)]/80 leading-relaxed mb-2">
            {note.content}
          </p>
          <div className="text-gray-500 text-sm">
            <span>Doctor: {note.doctorId.name}</span>
            <span className="ml-4">Email: {note.doctorId.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationNoteCard;
