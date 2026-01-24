import { Box, Alert } from "@mui/material";
import "@/pages/car/car-page.css";
import { useRobotControl } from "./hooks/use-robot-control";
import { SimulationAlert } from "@/components/simulation-alert/simulation-alert";
import { robotService } from "@/pages/car/services/robot.service";

// Atomic Components
import { CarHeader } from "@/pages/car/components/car-header/car-header";
import { TelemetryCard } from "@/pages/car/components/kpi-cards/telemetry-card";
import { ActuatorsCard } from "@/pages/car/components/kpi-cards/actuators-card/actuators-card";
import { RgbCard } from "@/pages/car/components/rgb-card/rgb-card";
import { KineticCard } from "@/pages/car/components/kpi-cards/kinetic-card";

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
  return (
    <Box className="car-page-container">

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
        height="80px" // Header height can be fixed or handled by CSS if component supports className
      />

      {/* Main Bento Grid */}
      <Box className="car-page-grid">

        {/* --- LEFT COLUMN (70%) --- */}
        <Box className="left-column">

          {/* TOP ROW: Telemetry + RGB */}
          <Box className="top-row">
            {/* Telemetry */}
            <Box className="telemetry-wrapper">
              <TelemetryCard
                id="card-telemetry"
                robotStatus={dashboardState.robot}
                remoteStatus={dashboardState.remote}
                setOrientation={setOrientation}
                panelStyle={{}} // panelStyle handled by className inside card if applied, or wrapper CSS
                headlightColor={color}
              />
            </Box>

            {/* RGB Picker */}
            <Box className="rgb-wrapper">
              <RgbCard
                id="card-rgb"
                color={color}
                handleColorChange={handleColorChange}
                panelStyle={{}}
                sx={{ height: '100%', width: '100%' }}
              />
            </Box>
          </Box>

          {/* BOTTOM ROW: Actuators */}
          <Box className="actuators-wrapper">
            <ActuatorsCard
              id="card-actuators"
              globalPwm={throttle}
              setGlobalPwm={setThrottle}
              panelStyle={{}}
              sx={{ height: '100%' }}
              outputs={outputs}
              onToggle={handleActuatorToggle}
            />
          </Box>

        </Box>

        {/* --- RIGHT COLUMN (30%) --- */}
        <Box className="right-column">
          <Box className="kinetic-wrapper">
            <KineticCard
              id="card-kinetic-control"
              remoteStatus={dashboardState.remote}
              panelStyle={{}}
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
