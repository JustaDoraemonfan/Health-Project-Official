import React from "react";
import { Stethoscope, ChevronRight, CreditCard } from "lucide-react";

export default function QuickAction() {
  return (
    <section>
      {/* Quick Actions Section */}
      <div className="max-w-4xl mx-auto mt-12">
        <div className="text-center mb-6">
          <h3 className="text-xl font-mono font-semibold text-gray-100 mb-2">
            Quick Actions
          </h3>
          <p className="text-gray-400 font-mono text-sm">
            Frequently used features for faster access
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="bg-gradient-to-r from-stone-900 to-slate-900 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-all duration-200 transform hover:scale-[1.02] text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h4 className="text-slate-50 font-mono font-semibold text-sm">
                    Emergency Contact
                  </h4>
                  <p className="text-gray-400 font-mono text-xs">
                    Call emergency services
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </button>

          <button className="bg-gradient-to-r from-stone-900 to-slate-900 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-all duration-200 transform hover:scale-[1.02] text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-slate-50 font-mono font-semibold text-sm">
                    Insurance Info
                  </h4>
                  <p className="text-gray-400 font-mono text-xs">
                    View coverage details
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
