import { useState, useEffect, useMemo } from "react";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { directionWebDrinks } from "@/config/api.config";
import { Cocktail } from "@/pages/drinks/models/drinks-model";
import { useConnectivity } from "@/context/connectivity-context";

interface UseSocketSyncProps {
    cocktails: Cocktail[];
    selectedCocktailForConfirm: Cocktail | null;
    setSelectedCocktailForConfirm: (c: Cocktail | null) => void;
    loading: boolean;
}

export const useSocketSync = ({
    cocktails,
    selectedCocktailForConfirm,
    setSelectedCocktailForConfirm,
    loading
}: UseSocketSyncProps) => {
    const { setConnectionStatus } = useConnectivity();
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [message, setMessage] = useState<string | undefined>(undefined);
    const [showMessage, setShowMessage] = useState(false);

    const socketUrl = directionWebDrinks.replace(/^http/, 'ws') + '/ws/drinks';

    const [delayedConnect, setDelayedConnect] = useState(false);

    useEffect(() => {
        if (!loading) {
            console.log("Starting WS Connection Delay...");
            const timer = setTimeout(() => {
                console.log("WS Delayed Connect > TRUE");
                setDelayedConnect(true);
            }, 500);
            return () => clearTimeout(timer);
        } else {
            setDelayedConnect(false);
        }
    }, [loading]);

    const socketOptions = useMemo(() => ({
        shouldReconnect: () => true,
        reconnectInterval: 1000,
        reconnectAttempts: 100,
        onOpen: () => console.log("WS Open"),
        onClose: (e: CloseEvent) => console.log("WS Close", e),
        onError: (e: Event) => console.log("WS Error", e),
    }), []);

    const { lastJsonMessage, readyState } = useWebSocket(socketUrl, socketOptions, delayedConnect); // Connect only after delay

    useEffect(() => {
        const connectionStatus = {
            [ReadyState.CONNECTING]: 'connecting',
            [ReadyState.OPEN]: 'connected',
            [ReadyState.CLOSING]: 'disconnected',
            [ReadyState.CLOSED]: 'disconnected',
            [ReadyState.UNINSTANTIATED]: 'disconnected',
        }[readyState] as 'connected' | 'disconnected' | 'connecting';

        // Extract clean IP/Host for display
        const displayIp = directionWebDrinks.replace(/^http:\/\//, '').replace(/\/$/, '');

        setConnectionStatus('drinks', connectionStatus, displayIp);
    }, [readyState, setConnectionStatus]);

    useEffect(() => {
        if (lastJsonMessage) {
            const data = lastJsonMessage as any;
            if (data.type === "drinks_state") {
                console.log("WS Recv:", data);
                setSelectedIndex(data.index);

                // Sync Modal with Hardware Selection Screen (actualScreen == 1)
                // If hardware enters screen 1 (Selection) and we don't have a modal open, open it for the current index
                if (data.screen === 1 && !selectedCocktailForConfirm) {
                    const cocktail = cocktails[data.index - 1]; // Firmware 1-based index to 0-based array
                    if (cocktail) setSelectedCocktailForConfirm(cocktail);
                }

                // If hardware leaves confirmation screen (screen != 1), close modal if it's open
                if (data.screen !== 1 && selectedCocktailForConfirm) {
                    setSelectedCocktailForConfirm(null);
                }

                if (data.serving) {
                    setMessage(`Sirviendo: ${data.name}`);
                    setShowMessage(true);
                }
            }
        }
    }, [lastJsonMessage, cocktails, selectedCocktailForConfirm, setSelectedCocktailForConfirm]);

    return {
        selectedIndex,
        wsMessage: message,
        showWsMessage: showMessage,
        setShowWsMessage: setShowMessage
    };
};
