import axios from "axios";
import {
    directionWeb,
    directionWebDrinks,
    handleResponse,
    getRequestOptions
} from "../config/api.config";

const USE_MOCK = import.meta.env.VITE_MOCK_SERVER === 'true';

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
        if (USE_MOCK) return [];
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
