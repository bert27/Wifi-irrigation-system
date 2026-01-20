import { useState, useEffect } from "react";
import { Cocktail, TabType } from "@/pages/drinks/models/drinks-model";
import { drinksService } from "@/services/drinks.service";
import { directionWebDrinks } from "@/config/api.config";

// Sub-hooks
import { useCocktails } from "./use-cocktails";
import { usePumpManager } from "./use-pump-manager";
import { useSocketSync } from "./use-socket-sync";

export const useDrinksPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>("drinks");
  const [selectedCocktailForConfirm, setSelectedCocktailForConfirm] = useState<Cocktail | null>(null);

  // Simulation Mode Detection
  const isMock = import.meta.env.VITE_MOCK_SERVER === 'true' ||
    (window.location.protocol === 'https:' && directionWebDrinks.startsWith('http:'));
  const {
    cocktails,
    updateCocktail,
    message: cocktailMessage,
    showMessage: showCocktailMessage,
    setShowMessage: setShowCocktailMessage,
    loading
  } = useCocktails();

  // 2. Hardware Synchronization (WebSocket)
  const {
    selectedIndex,
    wsMessage,
    showWsMessage,
    setShowWsMessage
  } = useSocketSync({
    cocktails,
    selectedCocktailForConfirm,
    setSelectedCocktailForConfirm,
    loading
  });

  // 3. Pump & Bottle Management
  const {
    bottles,
    updatePump,
    sendPumpCommand,
    pumpMessage,
    showPumpMessage,
    setShowPumpMessage
  } = usePumpManager();

  // Reset ESP8266 state when entering the page
  useEffect(() => {
    const resetEsp = async () => {
      try {
        await drinksService.sendControlCommand("cancel");
      } catch (e) {
        console.error("Failed to reset ESP state:", e);
      }
    };
    resetEsp();
  }, []);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const sendCommand = async (direction: string) => {
    try {
      await drinksService.sendControlCommand(direction);
    } catch (e) {
      console.error("Error sending command", e);
    }
  };

  const selectCocktail = (cocktail: Cocktail) => {
    setSelectedCocktailForConfirm(cocktail);
    drinksService.sendControlCommand(`goto:${cocktail.id}`);
  };

  const confirmCocktail = async () => {
    if (selectedCocktailForConfirm) {
      await sendCommand("accept");
      setSelectedCocktailForConfirm(null);
    }
  };

  const cancelCocktailSelection = async () => {
    await sendCommand("back");
    setSelectedCocktailForConfirm(null);
  };

  // Aggregate Messages (Simple priority logic: WS > Pump > Cocktail)
  const displayMessage = wsMessage || pumpMessage || cocktailMessage;
  const displayShowMessage = showWsMessage || showPumpMessage || showCocktailMessage;

  // Unified closer
  const setDisplayShowMessage = (show: boolean) => {
    if (!show) {
      setShowWsMessage(false);
      setShowPumpMessage(false);
      setShowCocktailMessage(false);
    }
  };

  return {
    activeTab,
    bottles,
    cocktails,
    message: displayMessage,
    showMessage: displayShowMessage,
    setShowMessage: setDisplayShowMessage,
    handleTabChange,
    selectCocktail,
    updatePump,
    updateCocktail,
    sendPumpCommand,
    sendCommand,
    selectedIndex,
    selectedCocktailForConfirm,
    confirmCocktail,
    cancelCocktailSelection,
    loading,
    isMock
  };
};
