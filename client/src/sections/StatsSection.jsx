import { useEffect, useState } from "react";
import { Users, Stethoscope, Building2 } from "lucide-react";
import { dashboardAPI } from "../services/api";

export const StatsSection = () => {
  const [statsData, setStatsData] = useState({
    patients: 0,
    doctors: 0,
    frontline: 0,
  });
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await dashboardAPI.getStats();
        setStatsData(response.data.data);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    };

    fetchStats();
  }, []);
  const stats = [
    {
      icon: <Users className="w-6 h-6 text-blue-500" />,
      number: statsData.patients,
      label: "Registered Patients",
      metric: "Patients",
    },
    {
      icon: <Users className="w-6 h-6 text-green-500" />,
      number: statsData.doctors,
      label: "Verified Doctors",
      metric: "Doctors",
    },
    {
      icon: <Stethoscope className="w-6 h-6 text-purple-500" />,
      number: statsData.frontline,
      label: "Frontline Workers",
      metric: "FWL",
    },
    {
      icon: <Building2 className="w-6 h-6 text-red-500" />,
      number: 500,
      label: "Partner Hospitals",
      metric: "Hospitals",
    },
  ];

  return (
    <section id="stats" className="py-20 bg-[#161515]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-mono font-bold text-gray-100 mb-4">
            Platform Analytics
          </h2>
          <p className="text-gray-400 font-mono">
            Real-time insights about our platform
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="group">
              <div className="bg-gradient-to-r from-stone-900 to-slate-900 border border-gray-700 rounded-lg p-6 hover:border-blue-500/50 transition-all duration-300 transform hover:scale-105">
                <div className="font-mono text-sm text-gray-500 mb-2">
                  {stat.metric}
                </div>
                <div className="flex items-center mb-3">
                  <div className="text-blue-400 mr-3 group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-mono font-bold text-white">
                    {stat.number}
                  </div>
                </div>
                <div className="text-gray-400 font-mono text-sm">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
