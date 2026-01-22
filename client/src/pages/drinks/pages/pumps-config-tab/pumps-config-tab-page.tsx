import React from "react";
import { PumpsControls } from "./components/pumps-controls";
import { Bottle } from "@/pages/drinks/models/drinks-model";

interface PumpsConfigTabPageProps {
    onPumpCommand: (pumpId: number) => void;
    bottles: Bottle[];
    onUpdatePump: (id: number, data: { pwm: number; timeCalibration: number }) => void;
}

export const PumpsConfigTabPage: React.FC<PumpsConfigTabPageProps> = ({ onPumpCommand, bottles, onUpdatePump }) => {
    return <PumpsControls onPumpCommand={onPumpCommand} bottles={bottles} onUpdatePump={onUpdatePump} />;
};
