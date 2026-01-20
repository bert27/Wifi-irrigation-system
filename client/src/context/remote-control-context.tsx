import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { directionWebRemote } from '../config/api.config';

interface RemoteState {
    joystickDirection: string;
    buttonJostick: string; // Keeping the typo "Jostick" to match existing code interfaces if necessary, or fixing it. Let's match existing first.
    remoteGyroscopeValues: number[];
    temperature?: number;
    altitude?: number;
    remoteGyroscope?: string;
}

interface RemoteControlContextType {
    remoteState: RemoteState;
    connectedRemote: boolean;
    lastRemoteMessage: any;
}

const RemoteControlContext = createContext<RemoteControlContextType | undefined>(undefined);

// URL for Remote Control WebSocket
// Verify protcol. If https, we might need wss, but usually local ESPs are ws.
const urlRemote = directionWebRemote.replace(/^http/, 'ws') + '/ws';

export const RemoteControlProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [remoteState, setRemoteState] = useState<RemoteState>({
        joystickDirection: "IDLE",
        buttonJostick: "IDLE",
        remoteGyroscopeValues: [0, 0, 0]
    });

    const { lastJsonMessage, readyState } = useWebSocket(urlRemote, {
        shouldReconnect: () => true,
        reconnectAttempts: 10,
        reconnectInterval: 3000,
        share: true, // Allows multiple components to attach if needed, though Context handles sharing
    });

    const connectedRemote = readyState === ReadyState.OPEN || (import.meta.env.VITE_MOCK_SERVER === 'true');

    // Mock Simulation
    useEffect(() => {
        if (import.meta.env.VITE_MOCK_SERVER !== 'true') return;

        const interval = setInterval(() => {
            const time = Date.now() / 1000;
            setRemoteState(prev => ({
                ...prev,
                joystickDirection: "IDLE",
                remoteGyroscopeValues: [
                    Math.sin(time * 0.8) * 10,
                    Math.cos(time * 0.8) * 10,
                    0
                ],
                temperature: 24 + Math.sin(time) * 2,
                altitude: 10 + Math.cos(time) * 5
            }));
        }, 100);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (lastJsonMessage) {
            const data = lastJsonMessage as any;
            setRemoteState(prev => {
                const newState = { ...prev };
                let hasChanges = false;

                if (data.direction !== undefined) {
                    newState.joystickDirection = (data.direction === "Sin Movimiento") ? "IDLE" : data.direction;
                    hasChanges = true;
                }
                if (data.gx !== undefined || data.gy !== undefined) {
                    // Remote sends degrees, we store as is.
                    newState.remoteGyroscopeValues = [data.gx || 0, data.gy || 0, 0];
                    hasChanges = true;
                }
                if (data.button !== undefined) {
                    newState.buttonJostick = data.button;
                    hasChanges = true;
                }
                if (data.temp !== undefined) {
                    newState.temperature = data.temp;
                    hasChanges = true;
                }
                if (data.altitude !== undefined) {
                    newState.altitude = data.altitude;
                    hasChanges = true;
                }
                if (data.gyro_direction !== undefined) {
                    newState.remoteGyroscope = data.gyro_direction;
                    hasChanges = true;
                }

                return hasChanges ? newState : prev;
            });
        }
    }, [lastJsonMessage]);

    return (
        <RemoteControlContext.Provider value={{ remoteState, connectedRemote, lastRemoteMessage: lastJsonMessage }}>
            {children}
        </RemoteControlContext.Provider>
    );
};

export const useRemoteControl = () => {
    const context = useContext(RemoteControlContext);
    if (context === undefined) {
        throw new Error('useRemoteControl must be used within a RemoteControlProvider');
    }
    return context;
};
