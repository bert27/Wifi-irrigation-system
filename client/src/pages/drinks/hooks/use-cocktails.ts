import { useState, useEffect } from "react";
import { ICocktail } from "@/pages/drinks/models/drinks-model";
import { drinksService } from "@/pages/drinks/services/drinks.service";
import { useTranslation } from "react-i18next";
import { MOCK_COCKTAILS } from "@/pages/drinks/mocks/cocktails.data";
import { isSimulationMode } from "@/utils/simulation";

export const useCocktails = () => {
    const { t } = useTranslation();
    const [cocktails, setCocktails] = useState<ICocktail[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | undefined>(undefined);
    const [showMessage, setShowMessage] = useState(false);

    const fetchCocktails = async () => {
        setLoading(true);
        try {
            const data = await drinksService.getCocktails();
            if (data && Array.isArray(data)) {
                console.log("Hardware Cocktails:", data);
                const mapped: ICocktail[] = data.map((c: any, idx: number) => ({
                    id: String(idx + 1),
                    name: c.name,
                    recipe: c.ingredients.map((ing: any) => ({
                        liquid: ing.name,
                        quantity: ing.quantity
                    }))
                }));
                setCocktails(mapped);
                setError(null); // Clear error on success
            } else if (isSimulationMode()) {
                setCocktails(MOCK_COCKTAILS);
                setError(null); // Clear error on success
            }
        } catch (err) {
            console.error("Failed to fetch cocktails", err);
            setError("Error loading cocktails"); // Set error message
            if (isSimulationMode()) {
                setCocktails(MOCK_COCKTAILS);
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

            setMessage(t('drinks.messages.cocktailUpdated'));
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 2000);
            setError(null); // Clear error on success
        } catch (err) {
            console.error("Failed to update cocktail", err);
            setMessage("Error saving recipe"); // Keep original message for error
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 2000);
            setError("Error updating recipe"); // Set error message
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
        setMessage,
        error
    };
};
