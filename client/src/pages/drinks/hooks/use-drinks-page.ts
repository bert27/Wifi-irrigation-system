import { useState, useEffect } from "react";
import { ICocktail, TabType } from "@/pages/drinks/models/drinks-model";
import { drinksService } from "@/pages/drinks/services/drinks.service";

// Sub-hooks
import { useCocktails } from "./use-cocktails";
import { usePumpManager } from "./use-pump-manager";
import { useSocketSync } from "./use-socket-sync";

import { isSimulationMode } from "@/utils/simulation";

export const useDrinksPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>("drinks");
  const [selectedCocktailForConfirm, setSelectedCocktailForConfirm] = useState<ICocktail | null>(null);

  // Simulation Mode Detection
  const isMock = isSimulationMode();
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
    if (isMock) {
      console.log("[useDrinksPage] Skipping ESP reset in simulation mode");
      return;
    }
    const resetEsp = async () => {
      try {
        await drinksService.sendControlCommand("cancel");
      } catch (e) {
        console.error("Failed to reset ESP state:", e);
      }
    };
    resetEsp();
  }, [isMock]);

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

  const selectCocktail = (cocktail: ICocktail) => {
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
