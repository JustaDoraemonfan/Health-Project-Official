import React, { useState } from "react";
import { StatsSection } from "../sections/StatsSection";
import { LoginSection } from "../sections/LoginSection";
import { RegisterSection } from "../sections/RegisterSection";
import Header from "../components/Header";
import HeroSection from "../sections/HeroSection";
import { Footer } from "../components/Footer";

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);

  const handleToggleAuth = () => {
    setShowLogin(!showLogin);
  };

  return (
    <div>
      <Header />
      <HeroSection />
      <StatsSection />
      {showLogin ? (
        <LoginSection onToggleAuth={handleToggleAuth} />
      ) : (
        <RegisterSection onToggleAuth={handleToggleAuth} />
      )}
      <Footer />
    </div>
  );
}
