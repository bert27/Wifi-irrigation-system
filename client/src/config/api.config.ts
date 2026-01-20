/**
 * Global API Configuration
 * Reads from .env variables to set up backend connection URLs.
 */

export const directionWebRemote = import.meta.env.VITE_REMOTE_IP || import.meta.env.REACT_APP_REMOTE_IP || "";
export const directionWebRobot = import.meta.env.VITE_ROBOT_IP || import.meta.env.REACT_APP_ROBOT_IP || "";

// Default direction for generic calls (backward compatibility)
export const directionWeb = directionWebRobot;

export const getRequestOptions = (method: string) => {
    return {
        headers: { "Content-Type": "application/json" },
    };
};

export const handleResponse = (response: any) => {
    if (response.status >= 400) {
        throw new Error(response.statusText);
    }
    return response.data;
};
