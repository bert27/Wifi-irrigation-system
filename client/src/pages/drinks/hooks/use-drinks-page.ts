import { useState, useEffect } from "react";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { Bottle, Cocktail, TabType } from "../models/drinks-model";
import { irrigationService } from "../../../services/irrigation.service";
import { drinksService } from "../../../services/drinks.service";
import { directionWebDrinks } from "../../../config/api.config";

import { initialBottles } from "../data/bottles.data";

export const useDrinksPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>("drinks");
  const [bottles, setBottles] = useState<Bottle[]>(initialBottles);
  const [cocktails, setCocktails] = useState<Cocktail[]>([]);

  // Fetch cocktails from ESP32 on mount
  useEffect(() => {
    const fetchCocktails = async () => {
      try {
        const data = await drinksService.getCocktails();
        if (data && Array.isArray(data)) {
          // Map firmware format to frontend if needed
          const mapped: Cocktail[] = data.map((c: any, idx: number) => ({
            id: String(idx + 1),
            name: c.name,
            recipe: c.ingredients.map((ing: any) => ({
              pumpId: bottles.find(b => b.liquid === ing.name)?.id || 0,
              liquid: ing.name,
              quantity: ing.quantity
            }))
          }));
          setCocktails(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch cocktails", err);
      }
    };
    fetchCocktails();
  }, [bottles]);
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [showMessage, setShowMessage] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedCocktailForConfirm, setSelectedCocktailForConfirm] = useState<Cocktail | null>(null);

  // WebSocket for real-time feedback from ESP8266
  const socketUrl = directionWebDrinks.replace(/^http/, 'ws') + '/ws/drinks';
  const { lastJsonMessage } = useWebSocket(socketUrl, {
    shouldReconnect: () => true,
    reconnectInterval: 3000,
  });

  useEffect(() => {
    if (lastJsonMessage) {
      const data = lastJsonMessage as any;
      if (data.type === "drinks_state") {
        setSelectedIndex(data.index);

        // Sync Modal with Hardware Selection Screen (actualScreen == 1)
        if (data.screen === 1 && !selectedCocktailForConfirm) {
          const cocktail = cocktails[data.index - 1];
          if (cocktail) setSelectedCocktailForConfirm(cocktail);
        }

        // If hardware leaves confirmation screen, close modal
        if (data.screen !== 1 && selectedCocktailForConfirm) {
          setSelectedCocktailForConfirm(null);
        }

        if (data.serving) {
          setMessage(`Sirviendo: ${data.name}`);
          setShowMessage(true);
        }
      }
    }
  }, [lastJsonMessage, cocktails, selectedCocktailForConfirm]);

  // Reset ESP8266 state when entering the page
  useEffect(() => {
    sendCommand("cancel");
  }, []);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const selectCocktail = (cocktail: Cocktail) => {
    setSelectedCocktailForConfirm(cocktail);
    // Send command to jump to this index on ESP
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

  const updatePump = async (id: number, data: { pwm: number; timeCalibration: number }) => {
    try {
      // Direct update of local state
      setBottles(prev => prev.map(p =>
        p.id === id ? { ...p, pwm: data.pwm, timeCalibration: data.timeCalibration } : p
      ));

      // Sync with hardware: use pump:id:pwm:time format
      await drinksService.sendControlCommand(`pump:${id}:${data.pwm}:${data.timeCalibration}`);

      setMessage("Pump updated successfully");
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
        setMessage(undefined);
      }, 2000);
    } catch (error) {
      setMessage("Error syncing with hardware");
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 2000);
    }
  };

  const updateCocktail = async (name: string, ingredients: { name: string; quantity: number }[]) => {
    try {
      await drinksService.saveCocktail(name, ingredients);

      // Re-fetch to sync
      const data = await drinksService.getCocktails();
      if (data && Array.isArray(data)) {
        const mapped: Cocktail[] = data.map((c: any, idx: number) => ({
          id: String(idx + 1),
          name: c.name,
          recipe: c.ingredients.map((ing: any) => ({
            liquid: ing.name,
            quantity: ing.quantity
          }))
        }));
        setCocktails(mapped);
      }

      setMessage("Recipe updated successfully");
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 2000);
    } catch (err) {
      console.error("Failed to update cocktail", err);
      setMessage("Error saving recipe");
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 2000);
    }
  };

  const sendPumpCommand = async (pumpId: number) => {
    setMessage(`Activating Pump ${pumpId}`);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 1500);
  };

  const sendCommand = async (direction: string) => {
    try {
      await drinksService.sendControlCommand(direction);
    } catch (e) {
      console.error("Error sending command", e);
    }
  };

  return {
    activeTab,
    bottles,
    cocktails,
    message,
    showMessage,
    setShowMessage,
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
  };
};
