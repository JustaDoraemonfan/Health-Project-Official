import { User, Stethoscope, Building2, HeartPulse } from "lucide-react";

const StatsSection = ({ patients, doctors, hospitals, treatments }) => {
  const stats = [
    {
      label: "Patients",
      value: patients,
      icon: <User className="w-10 h-10 text-blue-400" />,
    },
    {
      label: "Doctors",
      value: doctors,
      icon: <Stethoscope className="w-10 h-10 text-green-400" />,
    },
    {
      label: "Hospitals",
      value: hospitals,
      icon: <Building2 className="w-10 h-10 text-purple-400" />,
    },
    {
      label: "Successful Treatments",
      value: treatments,
      icon: <HeartPulse className="w-10 h-10 text-pink-400" />,
    },
  ];

  return (
    <section className="w-full bg-[#1c1c1c] py-16 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">
          Trusted by Thousands
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center bg-[#444444] p-6 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition transform duration-300"
            >
              <div className="mb-4">{stat.icon}</div>
              <h3 className="text-3xl font-extrabold text-amber-100">
                {stat.value}
              </h3>
              <p className="text-slate-50 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
