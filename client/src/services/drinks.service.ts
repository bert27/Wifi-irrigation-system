import axios from "axios";
import {
    directionWeb,
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
        // Firmware expects GET /drinks/navigation?direction=...
        const response = await axios.get(`${directionWeb}/drinks/navigation`, { params: { direction } });
        return handleResponse(response);
    }
};
