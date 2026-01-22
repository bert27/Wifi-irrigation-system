import { useState, useEffect } from "react";
import { Cocktail } from "@/pages/drinks/models/drinks-model";
import { drinksService } from "@/pages/drinks/services/drinks.service";
import { availableCocktails } from "@/pages/drinks/data/cocktails.data";
import { isSimulationMode } from "@/utils/simulation";

export const useCocktails = () => {
    const [cocktails, setCocktails] = useState<Cocktail[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<string | undefined>(undefined);
    const [showMessage, setShowMessage] = useState(false);

    const fetchCocktails = async () => {
        setLoading(true);
        try {
            const data = await drinksService.getCocktails();
            if (data && Array.isArray(data)) {
                console.log("Hardware Cocktails:", data);
                const mapped: Cocktail[] = data.map((c: any, idx: number) => ({
                    id: String(idx + 1),
                    name: c.name,
                    recipe: c.ingredients.map((ing: any) => ({
                        liquid: ing.name,
                        quantity: ing.quantity
                    }))
                }));
                setCocktails(mapped);
            } else if (isSimulationMode()) {
                setCocktails(availableCocktails);
            }
        } catch (err) {
            console.error("Failed to fetch cocktails", err);
            if (isSimulationMode()) {
                setCocktails(availableCocktails);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCocktails();
    }, []);

    const updateCocktail = async (name: string, ingredients: { name: string; quantity: number }[]) => {
        try {
            await drinksService.saveCocktail(name, ingredients);
            await fetchCocktails();

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

    return {
        cocktails,
        loading,
        setCocktails,
        updateCocktail,
        fetchCocktails,
        message,
        showMessage,
        setShowMessage,
        setMessage
    };
};
