import { useState } from "react";

import HeroSection from "./components/HeroSection";
import ClinicalDashboard from "./pages/ClinicalDashboard";

export default function App() {

  const [showDashboard, setShowDashboard] =
    useState(false);

  if (showDashboard) {
    return <ClinicalDashboard />;
  }

  return (
    <HeroSection
      onLaunch={() =>
        setShowDashboard(true)
      }
    />
  );
}