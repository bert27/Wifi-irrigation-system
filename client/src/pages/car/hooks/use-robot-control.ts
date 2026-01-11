import { useState, useEffect, useCallback } from 'react';
import { RobotStatus } from '@/pages/car/models/robot-model';
import { robotService } from '@/services/robot.service';

export const useRobotControl = () => {
  const urlEsp8266 = "ws://localhost:3001/ws";
  
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

  // WebSocket Setup
  useEffect(() => {
    const socket = new WebSocket(urlEsp8266);
    
    socket.onopen = () => {
      setConnected(true);
      socket.send(JSON.stringify({ type: "CONNECT", client: "React-Dashboard" }));
    };

    socket.onclose = () => {
      setConnected(false);
      // Reconnection logic could go here
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setRobotStatus(prev => ({ ...prev, ...data }));
      } catch (e) {
        console.warn("Non-parsable message received:", event.data);
      }
    };

    setWs(socket);
    return () => socket.close();
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
    setOrientation
  };
};
