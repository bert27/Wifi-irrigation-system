import { useState, useEffect } from "react";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { PumpConfig, Drink, TabType } from "../models/drinks-model";
import { irrigationService } from "../../../services/irrigation.service";
import { drinksService } from "../../../services/drinks.service";
import { directionWebDrinks } from "../../../config/api.config";

const initialPumps: PumpConfig[] = [
  { id: 1, title: "Pump 1", liquid: "Cocacola", pwm: 20, timeCalibration: 0 },
  { id: 2, title: "Pump 2", liquid: "Naranja", pwm: 20, timeCalibration: 0 },
  { id: 3, title: "Pump 3", liquid: "Vodka", pwm: 20, timeCalibration: 0 },
  { id: 4, title: "Pump 4", liquid: "Granadina", pwm: 20, timeCalibration: 0 },
];

const availableDrinks: Drink[] = [
  { id: "1", name: "Cocacola" },
  { id: "2", name: "Sex on the beach" },
  { id: "3", name: "Zumo de naranja" },
  { id: "4", name: "Vodka con cocacola" },
  { id: "5", name: "Granadina" },
  { id: "6", name: "Vodka" },
];

export const useDrinksPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>("drinks");
  const [pumps, setPumps] = useState<PumpConfig[]>(initialPumps);
  const [drinks] = useState<Drink[]>(availableDrinks);
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [showMessage, setShowMessage] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedDrinkForConfirm, setSelectedDrinkForConfirm] = useState<Drink | null>(null);

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
        if (data.screen === 1 && !selectedDrinkForConfirm) {
          const drink = drinks[data.index - 1];
          if (drink) setSelectedDrinkForConfirm(drink);
        }

        // If hardware leaves confirmation screen, close modal
        if (data.screen !== 1 && selectedDrinkForConfirm) {
          setSelectedDrinkForConfirm(null);
        }

        if (data.serving) {
          setMessage(`Sirviendo: ${data.name}`);
          setShowMessage(true);
        }
      }
    }
  }, [lastJsonMessage, drinks, selectedDrinkForConfirm]);

  // Reset ESP8266 state when entering the page
  useEffect(() => {
    sendCommand("cancel");
  }, []);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const selectDrink = (drink: Drink) => {
    setSelectedDrinkForConfirm(drink);
    // Send command to jump to this index on ESP
    drinksService.sendControlCommand(`goto:${drink.id}`);
  };

  const confirmDrink = async () => {
    if (selectedDrinkForConfirm) {
      await sendCommand("accept");
      setSelectedDrinkForConfirm(null);
    }
  };

  const cancelDrinkSelection = async () => {
    await sendCommand("back");
    setSelectedDrinkForConfirm(null);
  };

  const updatePump = async (id: number, data: { pwm: number; timeCalibration: number }) => {
    try {
      // Direct update of local state
      setPumps(prev => prev.map(p =>
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
    pumps,
    drinks,
    message,
    showMessage,
    setShowMessage,
    handleTabChange,
    selectDrink,
    updatePump,
    sendPumpCommand,
    sendCommand,
    selectedIndex,
    selectedDrinkForConfirm,
    confirmDrink,
    cancelDrinkSelection,
  };
};
