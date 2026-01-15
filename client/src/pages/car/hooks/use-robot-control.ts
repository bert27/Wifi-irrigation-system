import { useState, useEffect, useCallback } from 'react';
import { IDashboardState } from '@/pages/car/models/model';
import { robotService } from '@/services/robot.service';
import { directionWeb } from "@/services/planta.service";

export const useRobotControl = () => {
  // Convert http/https to ws/wss and append /ws/remote
  const urlEsp8266 = directionWeb.replace(/^http/, 'ws') + '/ws';
  
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
      };

      socket.onmessage = (event) => {
        setLastCmd(typeof event.data === 'string' ? event.data : "Binary Data");
        try {
          const data = JSON.parse(event.data);
          
          setDashboardState(prev => {
             const newState = { ...prev };

             // --- REMOTE CONTROL DATA MAPPING ---
             // Default ESP32 remote sends: { gx, gy, direction, button }
             if (data.direction !== undefined) {
                 newState.remote.joystickDirection = (data.direction === "Sin Movimiento") ? "CENTER" : data.direction;
             }
             if (data.kx !== undefined || data.ky !== undefined) { // Assuming remote sends gx/gy or similar, need to confirm keys from firmware
                // The firmware sends gx, gy. See WebSocketManager.hpp: doc["gx"] = gx;
                newState.remote.remoteGyroscopeValues = [data.gx || 0, data.gy || 0, 0];
             }
              if (data.gx !== undefined || data.gy !== undefined) {
                 newState.remote.remoteGyroscopeValues = [data.gx || 0, data.gy || 0, 0];
             }
             if (data.button !== undefined) {
                 newState.remote.buttonState = data.button;
             }

             // --- ROBOT DATA MAPPING ---
             // Assuming robot sends ledState, motorState, etc.
             if (data.ledState !== undefined) newState.robot.ledState = data.ledState;
             if (data.motorState !== undefined) newState.robot.motorState = data.motorState;
             if (data.giroscopeValues !== undefined) newState.robot.robotGyroscopeValues = data.giroscopeValues;
             if (data.giroscope !== undefined) newState.robot.robotGyroscope = data.giroscope;

             return newState;
          });

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
    // This looks like it was updating local state for simulation/testing?
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
