import { useState, useEffect, useCallback } from 'react';
import { IDashboardState } from '@/pages/car/models/model';
import { robotService } from '@/services/robot.service';
import { directionWebRobot, directionWebRemote } from "@/services/planta.service";

export const useRobotControl = () => {
  // Convert http/https to ws/wss
  const urlRobot = directionWebRobot.replace(/^http/, 'ws') + '/ws';
  const urlRemote = directionWebRemote.replace(/^http/, 'ws') + '/ws';

  console.log('[useRobotControl] URLs:', { urlRobot, urlRemote });

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

  const [connectedRobot, setConnectedRobot] = useState(false);
  const [connectedRemote, setConnectedRemote] = useState(false);
  const [wsRobot, setWsRobot] = useState<WebSocket | null>(null);
  const [color, setColor] = useState("#00d2ff");
  const [lastCmd, setLastCmd] = useState<string>("");
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isMock, setIsMock] = useState(import.meta.env.VITE_MOCK_SERVER === 'true');

  // Generic Socket Connector
  const setupSocket = useCallback((
    url: string,
    onOpen: () => void,
    onClose: () => void,
    onMessage: (data: any) => void,
    setSocketCallback?: (socket: WebSocket | null) => void
  ) => {
    // Mixed Content / HTTPS Detection
    if ((window.location.protocol === 'https:' && url.startsWith('ws:')) || import.meta.env.VITE_MOCK_SERVER === 'true') {
      console.warn(`[MockMode] Activation Request. Secure: ${window.location.protocol === 'https:'}, Env: ${import.meta.env.VITE_MOCK_SERVER}`);
      setIsMock(true);
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
    setConnectedRemote(true);
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
        },
        remote: {
          ...prev.remote,
          remoteGyroscopeValues: [
            Math.sin(time * 0.8) * 10,
            Math.cos(time * 0.8) * 10,
            0
          ]
        }
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
  }, [urlRobot, setupSocket]);

  // Remote Socket
  useEffect(() => {
    const { cleanup } = setupSocket(
      urlRemote,
      () => setConnectedRemote(true),
      () => setConnectedRemote(false),
      (data) => {
        setDashboardState(prev => {
          const remoteUpdate = { ...prev.remote };
          let hasChanges = false;

          if (data.direction !== undefined) {
            remoteUpdate.joystickDirection = (data.direction === "Sin Movimiento") ? "IDLE" : data.direction;
            hasChanges = true;
          }
          if (data.gx !== undefined || data.gy !== undefined) {
            remoteUpdate.remoteGyroscopeValues = [data.gx || 0, data.gy || 0, 0];
            hasChanges = true;
          }
          if (data.button !== undefined) {
            remoteUpdate.buttonJostick = data.button;
            hasChanges = true;
          }
          if (data.temp !== undefined) {
            remoteUpdate.temperature = data.temp;
            hasChanges = true;
          }
          if (data.altitude !== undefined) {
            remoteUpdate.altitude = data.altitude;
            hasChanges = true;
          }
          if (data.gyro_direction !== undefined) {
            remoteUpdate.remoteGyroscope = data.gyro_direction;
            hasChanges = true;
          }

          if (!hasChanges) return prev;

          return { ...prev, remote: remoteUpdate };
        });
      },
    );
    return cleanup;
  }, [urlRemote, setupSocket]);

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
