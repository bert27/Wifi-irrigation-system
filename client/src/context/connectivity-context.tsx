import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting';

export interface ModuleConnectionState {
    status: ConnectionStatus;
    ip?: string;
}

interface ConnectivityContextType {
    getConnectionStatus: (module: string) => ModuleConnectionState;
    setConnectionStatus: (module: string, status: ConnectionStatus, ip?: string) => void;
}

const ConnectivityContext = createContext<ConnectivityContextType | undefined>(undefined);

export const ConnectivityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [connections, setConnections] = useState<Record<string, ModuleConnectionState>>({});

    const setConnectionStatus = (module: string, status: ConnectionStatus, ip?: string) => {
        setConnections(prev => {
            // Only update if changed to prevent re-renders
            if (prev[module]?.status === status && prev[module]?.ip === ip) {
                return prev;
            }
            return {
                ...prev,
                [module]: { status, ip }
            };
        });
    };

    const getConnectionStatus = (module: string): ModuleConnectionState => {
        return connections[module] || { status: 'disconnected' };
    };

    return (
        <ConnectivityContext.Provider value={{ getConnectionStatus, setConnectionStatus }}>
            {children}
        </ConnectivityContext.Provider>
    );
};

export const useConnectivity = () => {
    const context = useContext(ConnectivityContext);
    if (context === undefined) {
        throw new Error('useConnectivity must be used within a ConnectivityProvider');
    }
    return context;
};
