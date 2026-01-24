import { useState, useEffect, useMemo } from "react";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { directionWebDrinks } from "@/services/api.service";
import { isSimulationMode } from "@/utils/simulation";
import { ICocktail, IDrinksStateData } from "@/pages/drinks/models/drinks-model";
import { useConnectivity } from "@/context/connectivity-context";
import { useTranslation } from "react-i18next";

interface UseSocketSyncProps {
    cocktails: ICocktail[];
    selectedCocktailForConfirm: ICocktail | null;
    setSelectedCocktailForConfirm: (c: ICocktail | null) => void;
    loading: boolean;
}

export const useSocketSync = ({
    cocktails,
    selectedCocktailForConfirm,
    setSelectedCocktailForConfirm,
    loading
}: UseSocketSyncProps) => {
    const { t } = useTranslation();
    const { setConnectionStatus } = useConnectivity();
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [message, setMessage] = useState<string | undefined>(undefined);
    const [showMessage, setShowMessage] = useState(false);

    const [socketUrl, setSocketUrl] = useState<string | null>(null);

    useEffect(() => {
        // CRITICAL: Never attempt WebSocket connection in simulation mode
        if (isSimulationMode()) {
            console.log("[useSocketSync] Simulation mode detected, skipping WebSocket setup");
            setConnectionStatus('drinks', 'disconnected', 'Offline');
            return;
        }

        if (!loading) {
            console.log("Starting WS Connection Sequence...");
            const timer = setTimeout(() => {
                const url = directionWebDrinks.replace(/^http/, 'ws') + '/ws/drinks';
                console.log("Step 1: Setting WS URL:", url);
                setSocketUrl(url);

                // Step 2: "Nudge" the ESP network stack to force event loop processing
                console.log("Step 2: Nudging ESP network stack (ping)...");
                [100, 400, 800].forEach(delay => {
                    setTimeout(() => {
                        fetch(directionWebDrinks + '/drinks/ping')
                            .catch(() => { });
                    }, delay);
                });
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            setSocketUrl(null);
        }
    }, [loading, setConnectionStatus]);

    const socketOptions = useMemo(() => ({
        shouldReconnect: () => true,
        reconnectInterval: 1000,
        reconnectAttempts: 100,
        onOpen: () => console.log("WS Open ✅"),
        onClose: (e: CloseEvent) => console.log("WS Close ❌", e),
        onError: (e: Event) => console.log("WS Error ⚠️", e),
    }), []);

    const { lastJsonMessage, readyState } = useWebSocket(socketUrl, socketOptions);

    // Debug log for state changes
    useEffect(() => {
        console.log("WebSocket ReadyState Change:", readyState);
    }, [readyState]);

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
            const data = lastJsonMessage as IDrinksStateData;
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
                    const translatedName = t(`drinks.cocktails.${data.name.toLowerCase()}`, { defaultValue: data.name });
                    setMessage(t('drinks.messages.serving', { name: translatedName }));
                    setShowMessage(true);
                }
            }
        }
    }, [lastJsonMessage, cocktails, selectedCocktailForConfirm, setSelectedCocktailForConfirm, t]);

    return {
        selectedIndex,
        wsMessage: message,
        showWsMessage: showMessage,
        setShowWsMessage: setShowMessage
    };
};
