import React, { useState } from "react";
import { StatsSection } from "./StatsSection";
import { LoginSection } from "./LoginSection";
import { RegisterSection } from "./RegisterSection";
import Header from "../components/Header";
import HeroSection from "./HeroSection";
import { Footer } from "../components/Footer";

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);

  const handleToggleAuth = () => setShowLogin((prev) => !prev);

  return (
    <main className="w-full min-h-screen flex flex-col">
      <Header />

      {/* Hero Section: Full width */}
      <HeroSection />

      {/* Stats Section: Full width */}
      <StatsSection />

      {/* Auth Section: Full width - LoginSection and RegisterSection handle their own containers */}
      {showLogin ? (
        <LoginSection onToggleAuth={handleToggleAuth} />
      ) : (
        <RegisterSection onToggleAuth={handleToggleAuth} />
      )}

      {/* Footer: Full width */}
      <Footer />
    </main>
  );
}
