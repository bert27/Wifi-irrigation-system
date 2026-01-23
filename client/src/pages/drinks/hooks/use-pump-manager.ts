import { useState, useEffect } from "react";
import { IBottle } from "@/pages/drinks/models/drinks-model";
import { MOCK_BOTTLES } from "@/pages/drinks/mocks/bottles.data";
import { drinksService } from "@/pages/drinks/services/drinks.service";

export const usePumpManager = () => {
    const [bottles, setBottles] = useState<IBottle[]>(MOCK_BOTTLES);
    const [message, setMessage] = useState<string | undefined>(undefined);
    const [showMessage, setShowMessage] = useState(false);

    useEffect(() => {
        const fetchBottles = async () => {
            try {
                const data = await drinksService.getBottles();
                setBottles(data);
            } catch (error) {
                console.error("Failed to fetch bottles from hardware:", error);
            }
        };
        fetchBottles();
    }, []);

    const updatePump = async (id: number, data: { pwm: number; timeCalibration: number }) => {
        try {
            setBottles(prev => prev.map(p =>
                p.id === id ? { ...p, pwm: data.pwm, timeCalibration: data.timeCalibration } : p
            ));
            await drinksService.sendControlCommand(`pump:${id}:${data.pwm}:${data.timeCalibration * 1000}`);

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
