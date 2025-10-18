import { useEffect, useState } from "react";
import { Users, Stethoscope, Building2 } from "lucide-react";
import { dashboardAPI } from "../services/api";

export const StatsSection = () => {
  const [statsData, setStatsData] = useState({
    patients: 0,
    doctors: 0,
    frontline: 0,
    admin: 0,
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
      icon: <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />,
      number: statsData.patients,
      label: "Registered Patients",
      metric: "Patients",
    },
    {
      icon: <Users className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />,
      number: statsData.doctors,
      label: "Verified Doctors",
      metric: "Doctors",
    },
    {
      icon: <Stethoscope className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />,
      number: statsData.frontline,
      label: "Frontline Workers",
      metric: "FWL",
    },
    {
      icon: <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />,
      number: statsData.admin,
      label: "Partner Hospitals",
      metric: "Hospitals",
    },
  ];

  return (
    <section
      id="stats"
      className="w-full py-12 sm:py-16 lg:py-20 bg-[var(--color-primary)] relative"
    >
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

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl google-sans-code-400 font-bold text-[var(--color-secondary)] mb-3 sm:mb-4">
            Platform Analytics
          </h2>
          <p className="text-sm sm:text-base text-gray-400 google-sans-code-400">
            Real-time insights about our platform
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="group">
              <div className="bg-[var(--color-secondary)] border border-gray-700 rounded-lg sm:rounded-xl p-4 sm:p-6 hover:border-blue-500/50 transition-all duration-300 transform hover:-translate-y-1">
                {/* Metric */}
                <div className="google-sans-code-400 text-xs uppercase tracking-wider text-gray-400 mb-2">
                  {stat.metric}
                </div>

                {/* Icon + Number */}
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="text-blue-400 mr-2 sm:mr-3 group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-2xl sm:text-3xl google-sans-code-400 font-bold text-white">
                    {stat.number}
                  </div>
                </div>

                {/* Label */}
                <div className="text-gray-400 google-sans-code-400 text-xs sm:text-sm">
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
