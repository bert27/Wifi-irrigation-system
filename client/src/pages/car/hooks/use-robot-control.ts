import { useState, useEffect, useCallback } from 'react';
import { RobotStatus } from '@/pages/car/models/robot-model';
import { robotService } from '@/services/robot.service';
import { directionWeb } from "@/services/planta.service";

export const useRobotControl = () => {
  // Convert http/https to ws/wss and append /ws/remote
  const urlEsp8266 = directionWeb.replace(/^http/, 'ws') + '/ws';
  
  const [robotStatus, setRobotStatus] = useState<RobotStatus>({
    ledState: false,
    jostickDirection: "CENTER",
    giroscope: "LEVEL",
    giroscopeValues: [0, 0, 0],
    buttonState: "IDLE",
  });

  const [connected, setConnected] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [color, setColor] = useState("#00d2ff");

  const [lastCmd, setLastCmd] = useState<string>("Waiting...");

  // WebSocket Setup with Auto-Reconnection
  useEffect(() => {
    let socket: WebSocket | null = null;
    let timeoutId: NodeJS.Timeout;
    let shouldReconnect = true;

    const connect = () => {
      console.log("Attempting WebSocket Connection to:", urlEsp8266);
      socket = new WebSocket(urlEsp8266);
      
      socket.onopen = () => {
        console.log("WebSocket Connected!");
        setConnected(true);
        setLastCmd("Connected!");
        if (socket) {
             socket.send(JSON.stringify({ type: "CONNECT", client: "React-Dashboard" }));
        }
      };

      socket.onclose = (event) => {
        console.log("WebSocket Closed (Code: " + event.code + "). Retrying in 2s...");
        setConnected(false);
        setLastCmd("Disconnected. Retrying...");
        
        if (shouldReconnect) {
          timeoutId = setTimeout(() => {
             console.log("Reconnecting...");
             connect();
          }, 2000);
        }
      };

      socket.onerror = (error) => {
          console.error("WebSocket Error:", error);
          setLastCmd("Connection Error");
          // socket.close() will be called automatically or manually, triggering onclose
      };

      socket.onmessage = (event) => {
        setLastCmd(typeof event.data === 'string' ? event.data : "Binary Data");
        try {
          const data = JSON.parse(event.data);
          setRobotStatus(prev => ({ ...prev, ...data }));
        } catch (e) {
          console.warn("Non-parsable message received:", event.data);
        }
      };

      setWs(socket);
    };

    connect();

    // Cleanup
    return () => {
      shouldReconnect = false;
      if (timeoutId) clearTimeout(timeoutId);
      if (socket) {
        socket.onclose = null; // Prevent reconnect on unmount
        socket.close();
      }
    };
  }, [urlEsp8266]);

  // Actions
  const handleColorChange = useCallback(async (newColor: string) => {
    setColor(newColor);
    // Debounce the websocket sending if needed, but for now direct
    // Assuming throttledSendColor is defined elsewhere or this is a placeholder
    // For now, we'll keep the original service call structure if throttledSendColor is not defined.
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
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ action, ...payload }));
    }
  }, [ws]);

  const handleDirection = useCallback(async (directionName: string) => {
    try {
      await robotService.sendOutputRobotUI({ name: directionName });
    } catch (e) {
      console.error("Failed to send direction", e);
    }
  }, []);

  const setOrientation = useCallback((pitch: number, roll: number) => {
    setRobotStatus(prev => ({
      ...prev,
      giroscopeValues: [pitch, roll, prev.giroscopeValues?.[2] || 0]
    }));
  }, []);

  return {
    robotStatus,
    connected,
    color,
    handleColorChange,
    toggleLED,
    sendWSMessage,
    handleDirection,
    setOrientation,
    lastCmd
  };
};
