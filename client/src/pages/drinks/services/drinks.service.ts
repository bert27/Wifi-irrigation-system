import axios from "axios";
import { directionWebDrinks, handleResponse } from "@/services/api.service";
import { isSimulationMode, activateReactiveSimulation, withTimeout } from "@/utils/simulation";
import { MOCK_COCKTAILS } from "@/pages/drinks/mocks/cocktails.data";
import { MOCK_BOTTLES } from "@/pages/drinks/mocks/bottles.data";
import { ICocktail, IHardwareCocktail, IBottle } from "@/pages/drinks/models/drinks-model";

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
                5000  // Increased timeout for hardware response
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
                6000  // Increased timeout for cocktails fetch
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
    },

    getBottles: async (): Promise<IBottle[]> => {
        if (USE_MOCK) {
            return MOCK_BOTTLES;
        }
        try {
            const response = await withTimeout(
                axios.get(`${directionWebDrinks}/drinks/bottles`),
                6000  // Increased timeout for bottles fetch
            );
            const bottles = handleResponse(response);
            // Convert timeCalibration from milliseconds (backend) to seconds (frontend)
            return bottles.map((bottle: IBottle) => ({
                ...bottle,
                timeCalibration: bottle.timeCalibration / 1000
            }));
        } catch (error) {
            console.error("Failed to fetch bottles:", error);
            throw error;
        }
    },

    resetRecipes: async (): Promise<void> => {
        if (USE_MOCK) {
            console.log("Mock mode: Reset recipes (no-op)");
            return;
        }
        try {
            const response = await withTimeout(
                axios.post(`${directionWebDrinks}/drinks/reset-recipes`),
                5000
            );
            return handleResponse(response);
        } catch (error) {
            console.error("Failed to reset recipes:", error);
            throw error;
        }
    }
};
