import React from "react";
import { PumpConfigPanel } from "./components/pump-config-panel";
import { IBottle, ICocktail } from "@/pages/drinks/models/drinks-model";

interface CocktailsConfigTabPageProps {
    cocktails: ICocktail[];
    bottles: IBottle[];
    onUpdatePump: (id: number, data: { pwm: number; timeCalibration: number }) => void;
    onUpdateCocktail: (name: string, ingredients: { name: string; quantity: number }[]) => void;
}

export const CocktailsConfigTabPage: React.FC<CocktailsConfigTabPageProps> = ({
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

