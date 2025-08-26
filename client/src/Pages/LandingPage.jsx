import React from "react";
import { StatsSection } from "../sections/StatsSection";
import { LoginSection } from "../sections/LoginSection";
import { RegisterSection } from "../sections/RegisterSection";
import Header from "../components/Header";
import HeroSection from "../sections/HeroSection";
import { Footer } from "../components/Footer";

export default function LandingPage() {
  return (
    <div>
      <Header />
      <HeroSection />
      <StatsSection />
      <LoginSection />
      <RegisterSection />
      <Footer />
    </div>
  );
}
