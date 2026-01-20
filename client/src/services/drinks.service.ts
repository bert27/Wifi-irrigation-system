import axios from "axios";
import {
    directionWeb,
    directionWebDrinks,
    handleResponse,
    getRequestOptions
} from "../config/api.config";
import { isSimulationMode } from "../utils/simulation";
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
        const response = await axios.get(`${directionWebDrinks}/drinks/navigation`, { params: { direction } });
        return handleResponse(response);
    },

    getCocktails: async (): Promise<any> => {
        if (USE_MOCK) {
            // Map the recipe structure to match hardware response format
            // hardware expects { name, ingredients: [{ name, quantity }] }
            // availableCocktails has { name, recipe: [{ liquid, quantity }] }
            return availableCocktails.map(c => ({
                name: c.name,
                ingredients: (c.recipe || []).map(r => ({
                    name: r.liquid,
                    quantity: r.quantity
                }))
            }));
        }
        const response = await axios.get(`${directionWebDrinks}/drinks/cocktails`);
        return handleResponse(response);
    },

    saveCocktail: async (name: string, ingredients: any[]): Promise<any> => {
        if (USE_MOCK) return { success: true };
        const response = await axios.post(`${directionWebDrinks}/drinks/save-cocktail`, {
            name,
            ingredients
        });
        return handleResponse(response);
    }
};
