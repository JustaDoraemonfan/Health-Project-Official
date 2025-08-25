import React from "react";
import { ChevronRight } from "lucide-react";

const RoleCard = ({ role, onRoleSelect, isAnimating, index }) => {
  const IconComponent = role.icon;

  return (
    <div
      key={role.id}
      className={`group relative bg-[#7c7c7c] rounded-2xl shadow-lg hover:shadow-2xl border border-gray-600/50 p-8 transition-all duration-500 hover:-translate-y-2 ${
        isAnimating ? "opacity-0 translate-y-8" : "opacity-100 translate-y-0"
      }`}
      style={{
        animationDelay: isAnimating ? "0ms" : `${index * 150}ms`,
        animation: isAnimating ? "none" : "fadeInUp 0.6s ease-out forwards",
      }}
    >
      {/* Gradient Background Effect */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}
      ></div>

      {/* Icon */}
      <div
        className={`relative inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${role.gradient} rounded-2xl mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
      >
        <IconComponent className="w-8 h-8 text-white" />
      </div>

      {/* Content */}
      <div className="relative">
        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-emerald-300 transition-colors">
          {role.title}
        </h3>
        <p className="text-gray-200 mb-6 leading-relaxed">{role.description}</p>

        {/* Features List */}
        <ul className="space-y-3 mb-8">
          {role.features.map((feature, idx) => (
            <li key={idx} className="flex items-start text-sm text-gray-100">
              <div className="w-2 h-2 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full mr-3 mt-2 flex-shrink-0"></div>
              <span className="leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>

        {/* Demo Info */}
        <div className="mb-6 p-3 bg-[#6b6b6b] rounded-lg border border-gray-500/60">
          <p className="text-xs text-gray-200 font-medium">
            <span className="text-teal-400">Demo:</span> {role.demo}
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onRoleSelect(role.id)}
          className={`w-full ${role.buttonColor} text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl ${role.ringColor} focus:outline-none focus:ring-2 focus:ring-offset-2 group-hover:scale-[1.02]`}
        >
          Access {role.title} Portal
          <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default RoleCard;
