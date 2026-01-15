import { useState, useEffect, useCallback } from 'react';
import { IDashboardState } from '@/pages/car/models/model';
import { robotService } from '@/services/robot.service';
import { directionWebRobot, directionWebRemote } from "@/services/planta.service";

export const useRobotControl = () => {
  // Convert http/https to ws/wss
  const urlRobot = directionWebRobot.replace(/^http/, 'ws') + '/ws';
  const urlRemote = directionWebRemote.replace(/^http/, 'ws') + '/ws';
  
  const [dashboardState, setDashboardState] = useState<IDashboardState>({
    robot: {
      ledState: false,
      motorState: "STOP",
      robotGyroscopeValues: [0, 0, 0]
    },
    remote: {
      joystickDirection: "CENTER",
      buttonState: "IDLE",
      remoteGyroscopeValues: [0, 0, 0]
    }
  });

  const [connectedRobot, setConnectedRobot] = useState(false);
  const [connectedRemote, setConnectedRemote] = useState(false);
  const [wsRobot, setWsRobot] = useState<WebSocket | null>(null);
  const [color, setColor] = useState("#00d2ff");
  const [lastCmd, setLastCmd] = useState<string>("Waiting...");

  // Generic Socket Connector
  const setupSocket = useCallback((url: string, onOpen: () => void, onClose: () => void, onMessage: (data: any) => void) => {
    let socket: WebSocket | null = null;
    let timeoutId: NodeJS.Timeout;
    let shouldReconnect = true;

    const connect = () => {
      console.log(`Attempting Connection to: ${url}`);
      socket = new WebSocket(url);
      
      socket.onopen = () => {
        console.log(`Connected to ${url}`);
        onOpen();
        socket?.send(JSON.stringify({ type: "CONNECT", client: "React-Dashboard" }));
      };

      socket.onclose = () => {
        console.log(`Disconnected from ${url}. Retrying...`);
        onClose();
        if (shouldReconnect) {
          timeoutId = setTimeout(connect, 2000);
        }
      };

      socket.onerror = (err) => console.error(`Error on ${url}:`, err);

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch (e) {
          console.warn("Parse error:", event.data);
        }
      };
    };

    connect();

    return {
      socket,
      cleanup: () => {
        shouldReconnect = false;
        if (timeoutId) clearTimeout(timeoutId);
        if (socket) socket.close();
      }
    };
  }, []);

  // Robot Socket
  useEffect(() => {
    const { socket, cleanup } = setupSocket(
      urlRobot,
      () => setConnectedRobot(true),
      () => setConnectedRobot(false),
      (data) => {
        setLastCmd("Robot: Data received");
        setDashboardState(prev => {
          const newState = { ...prev };
          if (data.ledState !== undefined) newState.robot.ledState = data.ledState;
          if (data.motorState !== undefined) newState.robot.motorState = data.motorState;
          if (data.giroscopeValues !== undefined) newState.robot.robotGyroscopeValues = data.giroscopeValues;
          if (data.giroscope !== undefined) newState.robot.robotGyroscope = data.giroscope;
          return newState;
        });
      }
    );
    setWsRobot(socket);
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
          const newState = { ...prev };
          if (data.direction !== undefined) {
             newState.remote.joystickDirection = (data.direction === "Sin Movimiento") ? "CENTER" : data.direction;
          }
          if (data.gx !== undefined || data.gy !== undefined) {
             newState.remote.remoteGyroscopeValues = [data.gx || 0, data.gy || 0, 0];
          }
          if (data.button !== undefined) newState.remote.buttonState = data.button;
          return newState;
        });
      }
    );
    return cleanup;
  }, [urlRemote, setupSocket]);

  // Actions
  const handleColorChange = useCallback(async (newColor: string) => {
    setColor(newColor);
    try {
      await robotService.sendDataColorToServer({ color: newColor });
    } catch (e) {
      console.error("Failed to sync color", e);
    }
  }, []);

  const toggleLED = useCallback(async () => {
    try {
      await robotService.toggleLED();
    } catch (e) {
      console.error("Failed to toggle LED", e);
    }
  }, []);

  const sendWSMessage = useCallback((action: string, payload?: any) => {
    if (wsRobot && wsRobot.readyState === WebSocket.OPEN) {
      wsRobot.send(JSON.stringify({ action, ...payload }));
    }
  }, [wsRobot]);

  const handleDirection = useCallback(async (directionName: string) => {
    try {
      await robotService.sendOutputRobotUI({ name: directionName });
    } catch (e) {
      console.error("Failed to send direction", e);
    }
  }, []);

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
    connected: connectedRobot, // Primary connection status
    connectedRemote,
    color,
    handleColorChange,
    toggleLED,
    sendWSMessage,
    handleDirection,
    setOrientation,
    lastCmd
  };
};
