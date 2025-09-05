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
    <section id="stats" className="py-20 bg-[#27272A]">
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>
      </div>
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl google-sans-code-400 font-bold text-gray-100 mb-4">
            Platform Analytics
          </h2>
          <p className="text-gray-400 google-sans-code-400">
            Real-time insights about our platform
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="group">
              <div className="bg-gradient-to-br from-[#2F2F32] to-[#1F1F22] border border-gray-700 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300 transform hover:-translate-y-1">
                {/* Metric */}
                <div className="google-sans-code-400 text-xs uppercase tracking-wider text-gray-400 mb-2">
                  {stat.metric}
                </div>

                {/* Icon + Number */}
                <div className="flex items-center mb-4">
                  <div className="text-blue-400 mr-3 text-xl group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-3xl google-sans-code-400 font-bold text-white">
                    {stat.number}
                  </div>
                </div>

                {/* Label */}
                <div className="text-gray-400 google-sans-code-400 text-sm">
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
