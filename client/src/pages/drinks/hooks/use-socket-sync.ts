import { useState, useEffect } from "react";
import useWebSocket from 'react-use-websocket';
import { directionWebDrinks } from "@/config/api.config";
import { Cocktail } from "@/pages/drinks/models/drinks-model";

interface UseSocketSyncProps {
    cocktails: Cocktail[];
    selectedCocktailForConfirm: Cocktail | null;
    setSelectedCocktailForConfirm: (c: Cocktail | null) => void;
}

export const useSocketSync = ({
    cocktails,
    selectedCocktailForConfirm,
    setSelectedCocktailForConfirm
}: UseSocketSyncProps) => {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [message, setMessage] = useState<string | undefined>(undefined);
    const [showMessage, setShowMessage] = useState(false);

    const socketUrl = directionWebDrinks.replace(/^http/, 'ws') + '/ws/drinks';

    const { lastJsonMessage } = useWebSocket(socketUrl, {
        shouldReconnect: () => true,
        reconnectInterval: 3000,
    });

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
