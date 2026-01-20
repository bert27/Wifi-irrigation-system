import axios from "axios";
import {
    directionWebDrinks,
    handleResponse,
} from "../config/api.config";
import { isSimulationMode, activateReactiveSimulation } from "../utils/simulation";
import { availableCocktails } from "../pages/drinks/data/cocktails.data";

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
            const response = await axios.get(`${directionWebDrinks}/drinks/navigation`, { params: { direction } });
            return handleResponse(response);
        } catch (error) {
            console.error("Drinks navigation error, triggering simulation fallback:", error);
            activateReactiveSimulation();
            throw error;
        }
    },

    getCocktails: async (): Promise<any> => {
        if (USE_MOCK) {
            return availableCocktails.map(c => ({
                name: c.name,
                ingredients: (c.recipe || []).map(r => ({
                    name: r.liquid,
                    quantity: r.quantity
                }))
            }));
        }
        try {
            const response = await axios.get(`${directionWebDrinks}/drinks/cocktails`);
            return handleResponse(response);
        } catch (error) {
            console.error("Failed to fetch cocktails, triggering simulation mode:", error);
            activateReactiveSimulation();
            throw error;
        }
    },

    saveCocktail: async (name: string, ingredients: any[]): Promise<any> => {
        if (USE_MOCK) return { success: true };
        try {
            const response = await axios.post(`${directionWebDrinks}/drinks/save-cocktail`, {
                name,
                ingredients
            });
            return handleResponse(response);
        } catch (error) {
            console.error("Failed to save cocktail, triggering simulation mode:", error);
            activateReactiveSimulation();
            throw error;
        }
    }
};
