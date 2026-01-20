import { useState } from "react";
import { Bottle } from "@/pages/drinks/models/drinks-model";
import { initialBottles } from "@/pages/drinks/data/bottles.data";
import { drinksService } from "@/services/drinks.service";

export const usePumpManager = () => {
    const [bottles, setBottles] = useState<Bottle[]>(initialBottles);
    const [message, setMessage] = useState<string | undefined>(undefined);
    const [showMessage, setShowMessage] = useState(false);

    const updatePump = async (id: number, data: { pwm: number; timeCalibration: number }) => {
        try {
            setBottles(prev => prev.map(p =>
                p.id === id ? { ...p, pwm: data.pwm, timeCalibration: data.timeCalibration } : p
            ));
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

    return {
        bottles,
        updatePump,
        sendPumpCommand,
        pumpMessage: message,
        showPumpMessage: showMessage,
        setShowPumpMessage: setShowMessage
    };
};
