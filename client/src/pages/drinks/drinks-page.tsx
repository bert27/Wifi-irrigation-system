import React, { useEffect } from "react";
import { Box, Alert, Snackbar } from "@mui/material";
import { useDrinksPage } from "./hooks/use-drinks-page";
import { SimulationAlert } from "@/components/simulation-alert/simulation-alert";
import { useKeyboardNavigation } from "./hooks/use-keyboard-navigation";
import { DrinksHeader } from "./components/layout/drinks-header";
import { DrinksBackground } from "./components/layout/drinks-background";
import { DrinksTabs } from "./components/layout/drinks-tabs";
import { CocktailConfirmationModal } from "./pages/drinks-tab/components/cocktail-confirmation-modal";

import { DrinksTabPage } from "./pages/drinks-tab/drinks-tab-page";
import { ConfigTabPage } from "./pages/config-tab/config-tab-page";
import { ManualTabPage } from "./pages/manual-tab/manual-tab-page";

export const DrinksPage = () => {
  const {
    activeTab,
    bottles,
    cocktails,
    message,
    showMessage,
    setShowMessage,
    handleTabChange,
    selectCocktail,
    updatePump,
    updateCocktail,
    sendPumpCommand,
    sendCommand,
    selectedIndex,
    selectedCocktailForConfirm,
    confirmCocktail,
    cancelCocktailSelection,
    isMock
  } = useDrinksPage();

  useEffect(() => {
    document.title = "RobotCore - Drinks";
  }, []);

  // Keyboard navigation extracted
  useKeyboardNavigation({
    activeTab,
    onSend: sendCommand
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        background: "var(--bg-deep)",
        color: "var(--text-main)",
        p: { xs: 2, md: 4 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      <DrinksBackground />

      <Box sx={{ position: "relative", zIndex: 1, maxWidth: "1400px", mx: "auto" }}>

        <DrinksHeader />

        <SimulationAlert isMock={isMock} sx={{ mb: 3 }} />

        <DrinksTabs activeTab={activeTab} onTabChange={handleTabChange} />

        <Box sx={{ position: "relative", minHeight: "500px" }}>

          {activeTab === "drinks" && (
            <DrinksTabPage
              cocktails={cocktails}
              onSelectCocktail={selectCocktail}
              selectedIndex={selectedIndex}
            />
          )}

          {activeTab === "config" && (
            <ConfigTabPage
              cocktails={cocktails}
              bottles={bottles}
              onUpdatePump={updatePump}
              onUpdateCocktail={updateCocktail}
            />
          )}

          {activeTab === "manual" && (
            <ManualTabPage onPumpCommand={sendPumpCommand} />
          )}

        </Box>
      </Box>

      {/* Notifications and Modals */}
      <Snackbar
        open={showMessage}
        autoHideDuration={2000}
        onClose={() => setShowMessage(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="success"
          sx={{
            background: "linear-gradient(135deg, var(--success), var(--accent))",
            color: "#fff",
            fontWeight: 700,
            boxShadow: "0 0 20px var(--success-glow)",
          }}
        >
          {message}
        </Alert>
      </Snackbar>

      <CocktailConfirmationModal
        cocktail={selectedCocktailForConfirm}
        onConfirm={confirmCocktail}
        onCancel={cancelCocktailSelection}
      />
    </Box>
  );
};
