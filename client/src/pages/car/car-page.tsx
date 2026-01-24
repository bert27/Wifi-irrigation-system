import React, { useEffect } from "react";
import { Box, useTheme, useMediaQuery, Theme, Alert } from "@mui/material";
import "@/pages/car/car-styles.css";
import { useRobotControl } from "./hooks/use-robot-control";
import { SimulationAlert } from "@/components/simulation-alert/simulation-alert";
import { robotService } from "@/pages/car/services/robot.service";

// Atomic Components
import { CarHeader } from "./components/car-header";
import { TelemetryCard } from "./components/kpi-cards/telemetry-card";
import { ActuatorsCard } from "./components/kpi-cards/actuators-card";
import { RgbCard } from "@/pages/car/components/rgb-card/rgb-card";
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
    handleDirection,
    connectionError,
    isMock,
    // New Actuator Integration
    outputs,
    setOutputs,
    pulseDuration,
    setPulseDuration,
    throttle,
    setThrottle
  } = useRobotControl();

  const handleActuatorToggle = async (index: number) => {
    const newOutputs = [...outputs];
    const target = { ...newOutputs[index] };

    // Toggle state
    target.state = target.state === 0 ? throttle : 0;
    newOutputs[index] = target;

    setOutputs(newOutputs);
    if (!isMock) {
      try {
        await robotService.sendDataOutputSelectedToServer(target);
      } catch (e) {
        console.error(e);
      }
    }
  };
  const theme = useTheme<Theme>();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  useEffect(() => {
    document.title = "RobotCore";
  }, []);

  // Centralized Layout Configuration
  const layoutConfig = {
    header: { height: isDesktop ? '80px' : 'auto' },
    grid: { desktopHeight: 'calc(100vh - 120px)' },
  };

  const panelStyle = {
    p: { xs: 2, md: 3 },
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
      p: { xs: 1, sm: 2 },
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box'
    }}>

      <SimulationAlert isMock={isMock} />

      {!isMock && connectionError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {connectionError}
        </Alert>
      )}

      <CarHeader
        connectedRobot={connectedRobot}
        connectedRemote={connectedRemote}
        isMock={isMock}
        ledState={dashboardState.robot.ledState || false}
        onToggleLed={toggleLED}
        onPing={() => sendWSMessage("ping")}
        height={layoutConfig.header.height}
      />

      {/* Main Bento Grid */}
      <Box sx={{
        flexGrow: 1,
        display: 'grid',
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
          height: isDesktop ? '100%' : 'auto',
          minHeight: 0,
          minWidth: 0,
          overflow: isDesktop ? 'hidden' : 'visible'
        }}>

          {/* TOP ROW: Telemetry + RGB */}
          <Box sx={{
            display: 'flex',
            flexDirection: isDesktop ? 'row' : 'column',
            gap: 2,
            height: isDesktop ? '45%' : 'auto',
            minHeight: 0,
            overflow: isDesktop ? 'hidden' : 'visible'
          }}>
            {/* Telemetry */}
            <Box sx={{ flex: 1, minWidth: 0, overflow: isDesktop ? 'hidden' : 'visible' }}>
              <TelemetryCard
                id="card-telemetry"
                robotStatus={dashboardState.robot}
                remoteStatus={dashboardState.remote}
                setOrientation={setOrientation}
                panelStyle={panelStyle}
                headlightColor={color}
              />
            </Box>

            {/* RGB Picker */}
            <Box sx={{
              height: isDesktop ? '100%' : 'auto',
              aspectRatio: isDesktop ? '1/1' : 'auto',
              minWidth: isDesktop ? '300px' : '100%'
            }}>
              <RgbCard
                id="card-rgb"
                color={color}
                handleColorChange={handleColorChange}
                panelStyle={panelStyle}
                sx={{ height: '100%', width: '100%' }}
              />
            </Box>
          </Box>

          {/* BOTTOM ROW: Actuators */}
          <Box sx={{ height: isDesktop ? '55%' : 'auto', minHeight: 0 }}>
            <ActuatorsCard
              id="card-actuators"
              globalPwm={throttle}
              setGlobalPwm={setThrottle}
              panelStyle={panelStyle}
              sx={{ height: '100%' }}
              outputs={outputs}
              onToggle={handleActuatorToggle}
            />
          </Box>

        </Box>

        {/* --- RIGHT COLUMN (30%) --- */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          height: isDesktop ? '100%' : 'auto',
          minHeight: 0,
          minWidth: 0,
          overflow: isDesktop ? 'hidden' : 'visible'
        }}>
          <Box sx={{ flex: 1, minHeight: 0 }}>
            <KineticCard
              id="card-kinetic-control"
              remoteStatus={dashboardState.remote}
              panelStyle={panelStyle}
              sx={{ height: '100%' }}
              onDirection={handleDirection}
              pulseDuration={pulseDuration}
              onPulseDurationChange={setPulseDuration}
              throttle={throttle}
              onThrottleChange={setThrottle}
            />
          </Box>
        </Box>

      </Box>
    </Box>
  );
};
