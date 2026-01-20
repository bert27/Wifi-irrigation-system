import React from "react";
import { ManualControls } from "./components/manual-controls";

interface ManualTabPageProps {
    onPumpCommand: (pumpId: number) => void;
}

export const ManualTabPage: React.FC<ManualTabPageProps> = ({ onPumpCommand }) => {
    return <ManualControls onPumpCommand={onPumpCommand} />;
};
