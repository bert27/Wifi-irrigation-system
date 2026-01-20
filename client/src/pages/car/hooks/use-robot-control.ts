import { useState, useEffect, useCallback, useMemo } from 'react';
import { IDashboardState } from '@/pages/car/models/model';
import { robotService } from '@/services/robot.service';
import { directionWebRobot } from "@/config/api.config";
import { useRemoteControl } from '@/context/remote-control-context';
import { isSimulationMode } from '@/utils/simulation';

export const useRobotControl = () => {
  // Convert http/https to ws/wss - memoized to prevent infinite loops
  const urlRobot = useMemo(() => directionWebRobot.replace(/^http/, 'ws') + '/ws', []);

  // Use Global Remote Context
  const { remoteState, connectedRemote } = useRemoteControl();

  const [dashboardState, setDashboardState] = useState<IDashboardState>({
    robot: {
      ledState: false,
      motorState: "STOP",
      robotGyroscopeValues: [0, 0, 0]
    },
    remote: {
      joystickDirection: "IDLE",
      buttonJostick: "IDLE",
      remoteGyroscopeValues: [0, 0, 0]
    }
  });

  // Sync Global Remote State to Local Dashboard State
  useEffect(() => {
    setDashboardState(prev => ({
      ...prev,
      remote: {
        ...prev.remote,
        joystickDirection: remoteState.joystickDirection,
        buttonJostick: remoteState.buttonJostick,
        remoteGyroscopeValues: remoteState.remoteGyroscopeValues,
        temperature: remoteState.temperature,
        altitude: remoteState.altitude,
        remoteGyroscope: remoteState.remoteGyroscope
      }
    }));
  }, [remoteState]);

  const [connectedRobot, setConnectedRobot] = useState(false);
  const [wsRobot, setWsRobot] = useState<WebSocket | null>(null);
  const [color, setColor] = useState("#00d2ff");
  const [lastCmd, setLastCmd] = useState<string>("");
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isMock, setIsMock] = useState(isSimulationMode());

  // Generic Socket Connector
  const setupSocket = useCallback((
    url: string,
    onOpen: () => void,
    onClose: () => void,
    onMessage: (data: any) => void,
    setSocketCallback?: (socket: WebSocket | null) => void
  ) => {
    // Mixed Content / HTTPS Detection
    if ((window.location.protocol === 'https:' && url.startsWith('ws:')) || isSimulationMode()) {
      console.warn(`[MockMode] WebSocket Setup Blocked. Protocol: ${window.location.protocol}, Mock: ${isSimulationMode()}`);
      setConnectedRobot(true);
      return { cleanup: () => { } };
    }

    let socket: WebSocket | null = null;
    let timeoutId: NodeJS.Timeout;
    let shouldReconnect = true;

    const connect = () => {
      console.log(`[WS] Attempting Connection to: ${url}`);
      try {
        socket = new WebSocket(url);
      } catch (e) {
        console.error(`[WS] Failed to construct WebSocket:`, e);
        return;
      }

      if (setSocketCallback) setSocketCallback(socket);

      socket.onopen = () => {
        console.log(`[WS] Connected to ${url}`);
        onOpen();
        setConnectionError(null);
        if (socket?.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ type: "CONNECT", client: "React-Dashboard" }));
        }
      };

      socket.onclose = () => {
        console.log(`[WS] Disconnected from ${url}. Retrying...`);
        onClose();
        if (shouldReconnect) {
          timeoutId = setTimeout(connect, 3000);
        }
      };

      socket.onerror = (err) => {
        console.error(`[WS] Error on ${url}:`, err);
        // Fallback detection
        if (window.location.protocol === 'https:' && url.startsWith('ws:')) {
          setIsMock(true);
        }
      }

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch (e) {
          console.warn("[WS] Parse error:", event.data);
        }
      };
    };

    connect();

    return {
      cleanup: () => {
        shouldReconnect = false;
        if (timeoutId) clearTimeout(timeoutId);
        if (socket) {
          if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
            socket.close();
          }
        }
      }
    };
  }, []);

  // Mock Mode Simulation Effect
  useEffect(() => {
    if (!isMock) return;

    setConnectedRobot(true);
    setConnectionError(null);

    const interval = setInterval(() => {
      const time = Date.now() / 1000;
      setDashboardState(prev => ({
        ...prev,
        robot: {
          ...prev.robot,
          robotGyroscopeValues: [
            Math.sin(time) * 15,
            Math.cos(time * 0.5) * 10,
            0
          ]
        }
        // Remote is now handled by context even in mock?
        // Context mock logic should be in Context provider if needed,
        // but for now let's assume Context handles its own mock or connection.
      }));
    }, 100);

    return () => clearInterval(interval);
  }, [isMock]);

  // Robot Socket
  useEffect(() => {
    const { cleanup } = setupSocket(
      urlRobot,
      () => setConnectedRobot(true),
      () => setConnectedRobot(false),
      (data) => {
        setDashboardState(prev => ({
          ...prev,
          robot: {
            ...prev.robot,
            ledState: data.ledState !== undefined ? data.ledState : prev.robot.ledState,
            motorState: data.motorState !== undefined ? data.motorState : prev.robot.motorState,
            robotGyroscopeValues: data.giroscopeValues !== undefined ? data.giroscopeValues : prev.robot.robotGyroscopeValues,
            robotGyroscope: data.giroscope !== undefined ? data.giroscope : prev.robot.robotGyroscope,
          }
        }));
      },
      setWsRobot
    );
    return cleanup;
  }, [urlRobot, setupSocket, isMock]);

  // Actions
  const handleColorChange = useCallback(async (newColor: string) => {
    setColor(newColor);
    if (!isMock) {
      try {
        await robotService.sendDataColorToServer({ color: newColor });
      } catch (e) {
        console.error("Failed to sync color", e);
      }
    }
  }, [isMock]);

  const toggleLED = useCallback(async () => {
    if (!isMock) {
      try {
        await robotService.toggleLED();
      } catch (e) {
        console.error("Failed to toggle LED", e);
      }
    } else {
      setDashboardState(prev => ({
        ...prev,
        robot: { ...prev.robot, ledState: !prev.robot.ledState }
      }));
    }
  }, [isMock]);

  const sendWSMessage = useCallback((action: string, payload?: any) => {
    if (isMock) {
      console.log(`[Mock] Action: ${action}`, payload);
      return;
    }
    if (wsRobot && wsRobot.readyState === WebSocket.OPEN) {
      wsRobot.send(JSON.stringify({ action, ...payload }));
    } else {
      console.warn("WS Robot not ready. State:", wsRobot?.readyState);
    }
  }, [wsRobot, isMock]);

  const handleDirection = useCallback(async (directionName: string) => {
    if (isMock) return;
    try {
      await robotService.sendOutputRobotUI({ name: directionName });
    } catch (e) {
      console.error("Failed to send direction", e);
    }
  }, [isMock]);

  const setOrientation = useCallback((pitch: number, roll: number) => {
    setDashboardState(prev => ({
      ...prev,
      robot: {
        ...prev.robot,
        robotGyroscopeValues: [pitch, roll, prev.robot.robotGyroscopeValues?.[2] || 0]
      }
    }));
  }, []);

  return {
    dashboardState,
    connected: connectedRobot,
    connectedRemote,
    color,
    handleColorChange,
    toggleLED,
    sendWSMessage,
    handleDirection,
    setOrientation,
    lastCmd,
    connectionError,
    isMock
  };
};
