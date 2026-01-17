import React, { useEffect } from "react";
import { Box, useTheme, useMediaQuery, Theme, Alert } from "@mui/material";
import "@/pages/car/styles.css";
import { useRobotControl } from "./hooks/use-robot-control";

// Atomic Components
import { CarHeader } from "./components/car-header";
import { TelemetryCard } from "./components/kpi-cards/telemetry-card";
import { ActuatorsCard } from "./components/kpi-cards/actuators-card";
import { RgbCard } from "@/components/rgb-card/rgb-card";
import { KineticCard } from "./components/kpi-cards/kinetic-card";

export const CarPage: React.FC = () => {
  const {
    dashboardState,
    connected: connectedRobot,
    connectedRemote,
    color,
    handleColorChange,
    toggleLED,
    sendWSMessage,
    setOrientation,
    lastCmd,
    handleDirection,
    connectionError,
    isMock
  } = useRobotControl();

  const [globalPwm, setGlobalPwm] = React.useState(140);
  const theme = useTheme<Theme>();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  useEffect(() => {
    document.title = "RobotCore";
  }, []);

  // Centralized Layout Configuration (Bento Grid Config)
  const layoutConfig = {
    header: { height: '80px' },
    grid: { desktopHeight: 'calc(100vh - 120px)' },
    // Simplified structure for the new specific layout
  };

  const panelStyle = {
    p: 3,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  };

  return (
    <Box sx={{
      height: isDesktop ? '100vh' : 'auto',
      minHeight: '100vh',
      width: '100%',
      background: 'var(--bg-deep)',
      overflow: isDesktop ? 'hidden' : 'auto',
      p: 2,
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box'
    }}>

      {isMock && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Modo Simulación Activado: Navegando en Vercel (HTTPS). Conexión real deshabilitada por seguridad.
        </Alert>
      )}

      {!isMock && connectionError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {connectionError}
        </Alert>
      )}

      <CarHeader
        connectedRobot={connectedRobot}
        connectedRemote={connectedRemote}
        ledState={dashboardState.robot.ledState || false}
        onToggleLed={toggleLED}
        onPing={() => sendWSMessage("ping")}
        height={layoutConfig.header.height}
      />

      {/* Main Bento Grid */}
      <Box sx={{
        flexGrow: 1,
        display: 'grid',
        // 70% Left / 30% Right Split
        gridTemplateColumns: isDesktop ? 'minmax(0, 0.7fr) minmax(0, 0.3fr)' : '1fr',
        gap: 2,
        height: isDesktop ? layoutConfig.grid.desktopHeight : 'auto',
        overflow: isDesktop ? 'hidden' : 'visible',
        minHeight: 0
      }}>

        {/* --- LEFT COLUMN (70%) --- */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          height: '100%',
          minHeight: 0,
          minWidth: 0,
          overflow: 'hidden'
        }}>

          {/* TOP ROW: Telemetry + RGB (45% Height) */}
          <Box sx={{
            display: 'flex',
            gap: 2,
            height: '45%',
            minHeight: 0,
            overflow: 'hidden'
          }}>
            {/* Telemetry (Flexible Width) */}
            <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
              <TelemetryCard
                id="card-telemetry"
                robotStatus={dashboardState.robot}
                remoteStatus={dashboardState.remote}
                setOrientation={setOrientation}
                panelStyle={panelStyle}
              />
            </Box>

            {/* RGB (Square, Auto Width) */}
            <Box sx={{ height: '100%', aspectRatio: '1/1' }}>
              <RgbCard
                id="card-rgb"
                color={color}
                handleColorChange={handleColorChange}
                panelStyle={panelStyle}
                sx={{ height: '100%', width: '100%' }}
              />
            </Box>
          </Box>

          {/* BOTTOM ROW: Actuators (55% Height) */}
          <Box sx={{ height: '55%', minHeight: 0 }}>
            <ActuatorsCard
              id="card-actuators"
              globalPwm={globalPwm}
              setGlobalPwm={setGlobalPwm}
              panelStyle={panelStyle}
              sx={{ height: '100%' }}
            />
          </Box>

        </Box>

        {/* --- RIGHT COLUMN (30%) --- */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          height: '100%',
          minHeight: 0,
          minWidth: 0,
          overflow: 'hidden'
        }}>
          <Box sx={{ flex: 1, minHeight: 0 }}>
            <KineticCard
              id="card-kinetic-control"
              remoteStatus={dashboardState.remote}
              panelStyle={panelStyle}
              sx={{ height: '100%' }}
              lastCmd={lastCmd}
              onDirection={handleDirection}
            />
          </Box>
        </Box>

      </Box>
    </Box>
  );
};
