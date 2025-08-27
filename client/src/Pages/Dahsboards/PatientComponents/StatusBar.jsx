import React from "react";
import { User, AlertCircle } from "lucide-react";

export default function StatusBar({ name, email }) {
  return (
    <section>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-mono font-bold text-gray-100 mb-4">
          Patient <span className="text-blue-400">Dashboard</span>
        </h1>
        <p className="text-slate-50 font-mono text-lg mb-2">
          Welcome back, <span className="text-green-400">{name}</span>
        </p>
        <p className="text-gray-400 font-mono text-sm">
          Manage your healthcare journey from one central location
        </p>
      </div>

      {/* Status Bar */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-stone-900 to-slate-900 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between font-mono">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-green-400 text-sm">
                  Health Status: Good
                </span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-400" />
                <span className="text-slate-50 text-sm">{email}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-amber-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>2 reminders pending</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
