import React from "react";
import { PumpConfigPanel } from "./components/pump-config-panel";
import { Bottle, Cocktail } from "@/pages/drinks/models/drinks-model";

interface ConfigTabPageProps {
    cocktails: Cocktail[];
    bottles: Bottle[];
    onUpdatePump: (id: number, data: { pwm: number; timeCalibration: number }) => void;
    onUpdateCocktail: (name: string, ingredients: { name: string; quantity: number }[]) => void;
}

export const ConfigTabPage: React.FC<ConfigTabPageProps> = ({
    cocktails,
    bottles,
    onUpdatePump,
    onUpdateCocktail,
}) => {
    return (
        <PumpConfigPanel
            cocktails={cocktails}
            bottles={bottles}
            onUpdatePump={onUpdatePump}
            onUpdateCocktail={onUpdateCocktail}
        />
    );
};
