import React from "react";
import { Grid } from "@mui/material";
import { IBottle } from "@/pages/drinks/models/drinks-model";
import { PumpConfigCard } from "./pump-config-card";

interface PumpConfigCardsProps {
    bottles: IBottle[];
    onUpdatePump: (id: number, data: { pwm: number; timeCalibration: number }) => void;
}

export const PumpConfigCards: React.FC<PumpConfigCardsProps> = ({ bottles, onUpdatePump }) => {
    return (
        <Grid container spacing={3}>
            {bottles.map((bottle) => (
                <Grid size={{ xs: 12, sm: 6 }} key={bottle.id}>
                    <PumpConfigCard bottle={bottle} onUpdatePump={onUpdatePump} />
                </Grid>
            ))}
        </Grid>
    );
};
