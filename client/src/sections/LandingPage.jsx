import React, { useState } from "react";
import { StatsSection } from "./StatsSection";
import { LoginSection } from "./LoginSection";
import { RegisterSection } from "./RegisterSection";
import Header from "../components/Header";
import HeroSection from "./HeroSection";
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
