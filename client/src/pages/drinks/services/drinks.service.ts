import axios from "axios";
import {
    directionWebDrinks,
    handleResponse,
} from "@/config/api.config";
import { isSimulationMode, activateReactiveSimulation, withTimeout } from "@/utils/simulation";
import { MOCK_COCKTAILS } from "@/pages/drinks/mocks/cocktails.data";
import { ICocktail, IHardwareCocktail } from "@/pages/drinks/models/drinks-model";

const USE_MOCK = isSimulationMode();

export const drinksService = {
    /**
     * Sends a navigation command to the drinks machine.
     * Supported commands: 'up', 'down', 'next', 'back', 'accept'
     */
    sendControlCommand: async (direction: string): Promise<any> => {
        if (USE_MOCK) {
            console.log("Mock Control Command:", direction);
            return { success: true };
        }
        try {
            const response = await withTimeout(
                axios.get(`${directionWebDrinks}/drinks/navigation`, { params: { direction } }),
                2000
            );
            return handleResponse(response);
        } catch (error) {
            console.error("Drinks navigation error, triggering simulation fallback:", error);
            activateReactiveSimulation();
            throw error;
        }
    },

    getCocktails: async (): Promise<IHardwareCocktail[]> => {
        if (USE_MOCK) {
            return MOCK_COCKTAILS.map((c: ICocktail) => ({
                name: c.name,
                ingredients: (c.recipe || []).map((r: any) => ({
                    name: r.liquid,
                    quantity: r.quantity
                }))
            }));
        }
        try {
            const response = await withTimeout(
                axios.get(`${directionWebDrinks}/drinks/cocktails`),
                3000
            );
            return handleResponse(response);
        } catch (error) {
            console.error("Failed to fetch cocktails, triggering simulation mode:", error);
            activateReactiveSimulation();
            throw error;
        }
    },

    saveCocktail: async (name: string, ingredients: IHardwareCocktail['ingredients']): Promise<any> => {
        if (USE_MOCK) return { success: true };
        try {
            const response = await withTimeout(
                axios.post(`${directionWebDrinks}/drinks/save-cocktail`, {
                    name,
                    ingredients
                }),
                5000
            );
            return handleResponse(response);
        } catch (error) {
            console.error("Failed to save cocktail, triggering simulation mode:", error);
            activateReactiveSimulation();
            throw error;
        }
    }
};
