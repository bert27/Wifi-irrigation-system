/**
 * Shared API Service Logic
 * Contains backend connection URLs and helper functions.
 */

export const directionWebRemote = import.meta.env.VITE_REMOTE_IP || "";
export const directionWebRobot = import.meta.env.VITE_ROBOT_IP || "";
export const directionWebDrinks = import.meta.env.VITE_DRINKS_IP || "";
export const directionWebIrrigation = import.meta.env.VITE_IRRIGATION_IP || "";


export const handleResponse = (response: any) => {
    if (response.status >= 400) {
        throw new Error(response.statusText);
    }
    return response.data;
};
