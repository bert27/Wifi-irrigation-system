import React, { useEffect } from "react";
import { Box, Typography, Tabs, Tab, Alert, Snackbar } from "@mui/material";
import { useDrinksPage } from "./hooks/use-drinks-page";
import { DrinksGrid } from "./components/drinks-grid";
import { PumpConfigPanel } from "./components/pump-config-panel";
import { ManualControls } from "./components/manual-controls";
import LocalBarIcon from "@mui/icons-material/LocalBar";
import SettingsIcon from "@mui/icons-material/Settings";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";

import { useTranslation } from "react-i18next";

export const DrinksPage = () => {
  const { t } = useTranslation();
  const {
    activeTab,
    pumps,
    drinks,
    message,
    showMessage,
    setShowMessage,
    handleTabChange,
    selectDrink,
    updatePump,
    sendPumpCommand,
    sendCommand,
  } = useDrinksPage();

  useEffect(() => {
    document.title = "RobotCore - Drinks";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeTab !== 'drinks' && activeTab !== 'manual') return; // Only control in relevant tabs? Or globally?
      // User asked for "controlar con el teclado", usually implies navigation context.
      // Let's allow it globally on the page for now.

      switch (e.key) {
        case "ArrowUp":
          sendCommand("up");
          e.preventDefault();
          break;
        case "ArrowDown":
          sendCommand("down");
          e.preventDefault();
          break;
        case "Enter":
        case " ": // Spacebar
          sendCommand("accept");
          e.preventDefault();
          break;
        case "ArrowLeft":
          sendCommand("back");
          e.preventDefault();
          break;
        case "ArrowRight":
          sendCommand("next");
          e.preventDefault();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sendCommand, activeTab]);

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
      {/* Background gradient overlay */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.15) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(217, 70, 239, 0.1) 0px, transparent 50%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Main content */}
      <Box sx={{ position: "relative", zIndex: 1, maxWidth: "1400px", mx: "auto" }}>
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            className="tech-text"
            sx={{
              fontSize: { xs: "2rem", md: "3.5rem" },
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "4px",
              background: "linear-gradient(90deg, var(--primary), var(--accent))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 0 40px var(--primary-glow)",
              mb: 1,
            }}
          >
            {t('drinks.title')}
          </Typography>
          <Typography
            sx={{
              fontSize: "0.9rem",
              color: "var(--text-muted)",
              letterSpacing: "3px",
            }}
          >
            {t('drinks.subtitle')}
          </Typography>
        </Box>

        {/* Navigation Tabs */}
        <Box
          sx={{
            mb: 4,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(_: React.SyntheticEvent, v: string) => handleTabChange(v as any)}
            sx={{
              "& .MuiTabs-indicator": {
                height: "3px",
                background: "linear-gradient(90deg, var(--primary), var(--accent))",
                boxShadow: "0 0 10px var(--primary-glow)",
              },
              "& .MuiTab-root": {
                color: "rgba(255,255,255,0.6)",
                fontWeight: 700,
                letterSpacing: "2px",
                fontSize: "0.9rem",
                minWidth: { xs: "auto", sm: 120 },
                px: { xs: 2, sm: 3 },
                transition: "all 0.3s ease",
                "&:hover": {
                  color: "var(--text-main)",
                  background: "rgba(255,255,255,0.05)",
                },
              },
              "& .Mui-selected": {
                color: "var(--primary) !important",
                textShadow: "0 0 10px var(--primary-glow)",
              },
            }}
          >
            <Tab value="drinks" label={t('drinks.tabs.drinks')} icon={<LocalBarIcon />} iconPosition="start" />
            <Tab value="config" label={t('drinks.tabs.config')} icon={<SettingsIcon />} iconPosition="start" />
            <Tab value="manual" label={t('drinks.tabs.manual')} icon={<SportsEsportsIcon />} iconPosition="start" />
          </Tabs>
        </Box>

        {/* Tab Content */}
        <Box
          sx={{
            position: "relative",
            minHeight: "500px",
          }}
        >
          {/* Drinks Tab */}
          {activeTab === "drinks" && (
            <Box
              sx={{
                position: "relative",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: -40,
                  left: -40,
                  right: -40,
                  bottom: -40,
                  backgroundImage: `url(/cocktail-machine-bg.png)`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  opacity: 0.15,
                  borderRadius: "20px",
                  zIndex: -1,
                  filter: "blur(2px)",
                },
              }}
            >
              <DrinksGrid drinks={drinks} onSelectDrink={selectDrink} />
            </Box>
          )}

          {/* Config Tab */}
          {activeTab === "config" && <PumpConfigPanel pumps={pumps} onUpdatePump={updatePump} />}

          {/* Manual Tab */}
          {activeTab === "manual" && <ManualControls onPumpCommand={sendPumpCommand} />}
        </Box>
      </Box>

      {/* Notification */}
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
    </Box>
  );
};
