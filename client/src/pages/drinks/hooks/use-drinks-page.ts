import { useState } from "react";
import { PumpConfig, Drink, TabType } from "../models/drinks-model";
import { irrigationService } from "../../../services/irrigation.service";
import { drinksService } from "../../../services/drinks.service";

const initialPumps: PumpConfig[] = [
  { id: 1, title: "Water pump 1", liquid: "water", pwm: 20, timeCalibration: 0 },
  { id: 2, title: "Water pump 2", liquid: "cocacola", pwm: 0, timeCalibration: 0 },
  { id: 3, title: "Water pump 3", liquid: "orange", pwm: 20, timeCalibration: 0 },
  { id: 4, title: "Water pump 4", liquid: "lemon", pwm: 20, timeCalibration: 0 },
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

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const selectDrink = async (drink: Drink) => {
    setMessage(`Preparando ${drink.name}...`);
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
      setMessage(undefined);
    }, 2000);
  };

  const updatePump = async (id: number, data: { pwm: number; timeCalibration: number }) => {
    try {
      const response = await irrigationService.getWaterPump1OnOFF({
        id,
        pwm: data.pwm,
        timeCalibration: data.timeCalibration,
      });

      if (response.status === true) {
        setPumps(prev => prev.map(p =>
          p.id === id ? { ...p, pwm: data.pwm, timeCalibration: data.timeCalibration } : p
        ));
        setMessage("Pump updated successfully");
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false);
          setMessage(undefined);
        }, 2000);
      }
    } catch (error) {
      setMessage("Error updating pump");
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
  };
};
