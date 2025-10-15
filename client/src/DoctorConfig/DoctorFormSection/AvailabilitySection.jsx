import React from "react";
import { Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AvailabilitySection = ({ formData, handleChange }) => {
  const navigate = useNavigate();

  const handleChangeSlot = () => {
    navigate("/doctor/slots");
  };

  return (
    <div className="mb-8">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center mr-4">
          <Calendar className="h-5 w-5 text-indigo-400" />
        </div>
        <h4 className="text-xl font-semibold text-black">
          Weekly Availability
        </h4>
      </div>

      <div>
        <label
          htmlFor="availability"
          className="block text-sm font-medium text-zinc-700 mb-2"
        >
          Available Time Slots
        </label>
        <textarea
          id="availability"
          name="availability"
          value={formData.availability || ""}
          onChange={handleChange}
          rows="7"
          className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-vertical font-mono text-sm"
          placeholder={"Select your slots"}
          readOnly
        />
        <button
          type="button"
          onClick={handleChangeSlot}
          className="mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
        >
          <Calendar className="h-4 w-4" />
          Change Time Slots
        </button>
      </div>
    </div>
  );
};

export default AvailabilitySection;
