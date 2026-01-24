import { useRef, useEffect } from 'react';
import { robotService } from '@/pages/car/services/robot.service';
import { useRemoteControl } from '@/context/remote-control-context';
import { ACTUATOR_MAP } from '../config/robot-config';

// Sub-hooks
import { useRobotSocket } from './use-robot-socket';
import { useRobotSettings } from './use-robot-settings';
import { useRobotDashboard } from './use-robot-dashboard';

export const useRobotControl = () => {
  const { connectedRemote } = useRemoteControl();

  // 1. Connection & Commands Logic
  const { connected, sendMessage, error: connectionError, isMock, socket } = useRobotSocket();

  // 2. Settings & Local States
  const { pulseDuration, setPulseDuration, throttle, setThrottle, color, setColor, outputs, setOutputs } = useRobotSettings();

  // 3. Telemetry & Global State
  const { dashboardState, updateRobotTelemetry, setRobotOrientation, toggleLedMock } = useRobotDashboard(isMock);

  // Sync Socket Messages with Dashboard
  useEffect(() => {
    if (!socket) return;
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        updateRobotTelemetry(data);
      } catch {
        console.warn("[WS] Parse error:", event.data);
      }
    };
    socket.addEventListener('message', handleMessage);
    return () => socket.removeEventListener('message', handleMessage);
  }, [socket, updateRobotTelemetry]);

  // Actions implementation
  const handleColorChange = async (newColor: string) => {
    setColor(newColor);
    if (!isMock) {
      try {
        await robotService.sendDataColorToServer({ color: newColor });
      } catch (e) {
        console.error("Failed to sync color", e);
      }
    }
  };

  const toggleLED = async () => {
    if (!isMock) {
      try {
        await robotService.toggleLED();
      } catch (e) {
        console.error("Failed to toggle LED", e);
      }
    } else {
      toggleLedMock();
    }
  };

  const pulseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const handleDirection = async (directionName: string) => {
    const pinsToActivate = ACTUATOR_MAP[directionName];
    if (!pinsToActivate) return;

    if (pulseTimeoutRef.current) clearTimeout(pulseTimeoutRef.current);

    // Activate Actuators
    setOutputs(prev => prev.map(out =>
      pinsToActivate.includes(out.pin) ? { ...out, state: throttle } : out
    ));

    if (!isMock) {
      try {
        await robotService.sendOutputRobotUI({ name: directionName });
      } catch (e) {
        console.error("Failed to send direction", e);
      }
    }

    // Deactivate after duration
    pulseTimeoutRef.current = setTimeout(() => {
      setOutputs(prev => prev.map(out =>
        pinsToActivate.includes(out.pin) ? { ...out, state: 0 } : out
      ));
      pulseTimeoutRef.current = null;
    }, pulseDuration);
  };

  const setOrientation = (pitch: number, roll: number) => {
    setRobotOrientation(pitch, roll);
  };

  return {
    dashboardState,
    connected,
    connectedRemote,
    color,
    handleColorChange,
    toggleLED,
    sendWSMessage: sendMessage,
    handleDirection,
    setOrientation,
    connectionError,
    isMock,
    outputs,
    setOutputs,
    pulseDuration,
    setPulseDuration,
    throttle,
    setThrottle
  };
};

