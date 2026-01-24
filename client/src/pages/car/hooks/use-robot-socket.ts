import { useState, useEffect } from 'react';
import { directionWebRobot } from "@/services/api.service";
import { isSimulationMode } from '@/utils/simulation';
import { ROBOT_CONFIG } from '../config/robot-config';

export const useRobotSocket = () => {
    const urlRobot = directionWebRobot.replace(/^http/, 'ws') + '/ws';
    const [connected, setConnected] = useState(false);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isMock, setIsMock] = useState(isSimulationMode());

    useEffect(() => {
        if ((window.location.protocol === 'https:' && urlRobot.startsWith('ws:')) || isSimulationMode()) {
            console.warn(`[MockMode] WebSocket Setup Blocked.`);
            setConnected(true);
            return;
        }

        let ws: WebSocket | null = null;
        let timeoutId: NodeJS.Timeout;
        let shouldReconnect = true;

        const startConnection = () => {
            console.log(`[WS] Connecting to: ${urlRobot}`);
            try {
                ws = new WebSocket(urlRobot);
                setSocket(ws);
            } catch (e) {
                console.error(`[WS] Connection failed:`, e);
                return;
            }

            ws.onopen = () => {
                setConnected(true);
                setError(null);
                ws?.send(JSON.stringify({ type: "CONNECT", client: "React-Dashboard" }));
            };

            ws.onclose = () => {
                setConnected(false);
                if (shouldReconnect) {
                    timeoutId = setTimeout(startConnection, ROBOT_CONFIG.RECONNECT_INTERVAL);
                }
            };

            ws.onerror = (err) => {
                console.error(`[WS] Error:`, err);
                if (window.location.protocol === 'https:' && urlRobot.startsWith('ws:')) {
                    setIsMock(true);
                }
            };
        };

        startConnection();

        return () => {
            shouldReconnect = false;
            if (timeoutId) clearTimeout(timeoutId);
            if (ws) ws.close();
        };
    }, [urlRobot]);

    const sendMessage = (action: string, payload?: any) => {
        if (isMock) {
            console.log(`[Mock] Message: ${action}`, payload);
            return;
        }
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ action, ...payload }));
        }
    };

    return { connected, sendMessage, error, isMock, setIsMock, socket };
};
