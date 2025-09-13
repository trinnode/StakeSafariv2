// Main App component - MANDATORY event-driven architecture

import React from "react";
import { Layout } from "./components/common/Layout.jsx";
import { ErrorBoundary } from "./components/common/ErrorBoundary.jsx";
// import { TestComponent } from "./TestComponent.jsx";
import { useAppState } from "./hooks/useAppState.js";
import { LandingPage } from "./pages/LandingPage.jsx";
import { FaucetPage } from "./pages/FaucetPage.jsx";
import { StakingPage } from "./pages/StakingPage.jsx";
import { WithdrawPage } from "./pages/WithdrawPage.jsx";
import { EmergencyPage } from "./pages/EmergencyPage.jsx";
import { RewardsPage } from "./pages/RewardsPage.jsx";
import { FAQPage } from "./pages/FAQPage.jsx";
// import { DevSummary } from "./components/DevSummary.jsx";
import { UI_CONSTANTS } from "./utils/constants.js";

function App() {
  // console.log("App component rendering"); // Debug log
  // Event-driven state management
  const appState = useAppState();
  try {
    // console.log("appState:", appState); // Debug log

    // Simple fallback for debugging
    if (!appState) {
      return (
        <div style={{ color: "white", padding: "20px" }}>
          Loading app state...
        </div>
      );
    }
  } catch (error) {
    console.error("Error in App component:", error);
    return (
      <div style={{ color: "red", padding: "20px" }}>
        Error: {error.message}
      </div>
    );
  }

  // Route rendering based on current page
  const renderCurrentPage = () => {
    switch (appState.currentPage) {
      case UI_CONSTANTS.ROUTES.HOME:
        return <LandingPage appState={appState} />;
      case UI_CONSTANTS.ROUTES.FAUCET:
        return <FaucetPage appState={appState} />;
      case UI_CONSTANTS.ROUTES.STAKE:
        return <StakingPage appState={appState} />;
      case UI_CONSTANTS.ROUTES.WITHDRAW:
        return <WithdrawPage appState={appState} />;
      case UI_CONSTANTS.ROUTES.EMERGENCY:
        return <EmergencyPage appState={appState} />;
      case UI_CONSTANTS.ROUTES.REWARDS:
        return <RewardsPage appState={appState} />;
      case UI_CONSTANTS.ROUTES.FAQ:
        return <FAQPage appState={appState} />;
      default:
        return <LandingPage appState={appState} />;
    }
  };

  return (
    <ErrorBoundary>
      {/* <TestComponent /> */}
      <div className="App">
        <Layout currentPage={appState.currentPage} appState={appState}>
          {renderCurrentPage()}
        </Layout>
        {/* {import.meta.env.DEV && <DevSummary appState={appState} />} */}
      </div>
    </ErrorBoundary>
  );
}

export default App;
