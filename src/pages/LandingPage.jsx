// Landing page - MANDATORY educational content and protocol introduction

import React from "react";
import { HeroSection } from "../components/pages/Landing/HeroSection.jsx";
import { FeaturesGrid } from "../components/pages/Landing/FeaturesGrid.jsx";
import { HowItWorks } from "../components/pages/Landing/HowItWorks.jsx";
import { ProtocolStats } from "../components/pages/Landing/ProtocolStats.jsx";
import { GetStartedCTA } from "../components/pages/Landing/GetStartedCTA.jsx";

export const LandingPage = ({ appState }) => {
  return (
    <div className="min-h-screen text-white">
      {/* All sections use army green and black colors only */}

      {/* Hero Section */}
      <div className="px-4 sm:px-6 lg:px-8">
        <HeroSection appState={appState} />
      </div>

      {/* Protocol Statistics */}
      <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <ProtocolStats appState={appState} />
      </div>

      {/* How It Works */}
      <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <HowItWorks appState={appState} />
      </div>

      {/* Features Grid */}
      <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <FeaturesGrid appState={appState} />
      </div>

      {/* Get Started CTA */}
      <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <GetStartedCTA appState={appState} />
      </div>
    </div>
  );
};
