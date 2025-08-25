import { Terminal, GitBranch } from "lucide-react";

const HeroSection = () => {
  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#161515]"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:72px_72px]"></div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Terminal Window */}
          <div className="mb-12 mx-auto max-w-2xl">
            <div className="bg-gray-900 rounded-lg border border-gray-700 shadow-2xl">
              <div className="flex items-center justify-between px-4 py-3 bg-gray-800 rounded-t-lg border-b border-gray-700">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-gray-400 text-sm font-mono">
                  System Console
                </div>
                <div className="w-12"></div>
              </div>
              <div className="p-6 font-mono text-left">
                <div className="text-blue-400">
                  ✓ Healthcare platform initialized
                </div>
                <div className="text-gray-400">
                  ✓ Connecting patients, doctors, workers...
                </div>
                <div className="text-purple-400">
                  ✓ Ready to deliver healthcare solutions
                </div>
              </div>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-mono font-bold mb-6 text-gray-100">
            Empowering <span className="text-blue-400">Healthcare</span>
          </h1>
          <h2 className="text-2xl md:text-3xl font-mono font-medium mb-8 text-gray-400">
            Your <span className="text-green-400">trusted</span> digital health
            platform
          </h2>
          <p className="text-lg text-gray-300 mb-12 max-w-3xl mx-auto font-mono leading-relaxed">
            Transforming healthcare with{" "}
            <span className="text-blue-400">modern technology</span>
            <br />
            Connecting <span className="text-green-400">patients</span>,{" "}
            <span className="text-purple-400">doctors</span>,{" "}
            <span className="text-yellow-400">frontline workers</span>, and{" "}
            <span className="text-red-400">administrators</span>.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center font-mono">
            <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition-all duration-200 transform hover:scale-105 border border-blue-500">
              <Terminal className="w-5 h-5 inline mr-2" />
              Get Started
            </button>
            <button className="px-8 py-3 border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 rounded-lg font-semibold transition-all duration-200">
              <GitBranch className="w-5 h-5 inline mr-2" />
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
