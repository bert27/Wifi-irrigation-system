import { directionWebDrinks, directionWebRobot, directionWebIrrigation } from "@/config/api.config";

/**
 * Unified logic to detect if the application should run in Simulation (Mock) mode.
 */
export const isSimulationMode = (): boolean => {
    // 1. Env Var Force
    if (import.meta.env.VITE_MOCK_SERVER === 'true') {
        console.log("[SimulationMode] Activated by VITE_MOCK_SERVER");
        return true;
    }

    // 2. Reactive Fallback (Address Unreachable)
    if (typeof window !== 'undefined' && window.localStorage.getItem('simulation_mode_active') === 'true') {
        console.log("[SimulationMode] Activated by localStorage flag");
        return true;
    }

    // 3. HTTPS Environment Detection (Vercel/Production)
    if (typeof window !== 'undefined') {
        const isHttps = window.location.protocol === 'https:';

        // If on HTTPS (like Vercel), we need simulation mode since we can't reach local HTTP hardware
        if (isHttps) {
            const hardwareUrls = [directionWebDrinks, directionWebRobot, directionWebIrrigation];

            // Check if any hardware URL is missing or not HTTPS
            const needsSimulation = hardwareUrls.some(url => {
                if (!url) return true; // Empty URL = needs simulation
                if (!url.startsWith('https:')) return true; // HTTP or WS = needs simulation
                return false;
            });

            if (needsSimulation) {
                console.warn("[SimulationMode] HTTPS context forced simulation. Local non-HTTPS hardware is unreachable.");
                return true;
            }
        }
    }

    console.log("[SimulationMode] Hardware direct connection mode active.");
    return false;
};

/**
 * Call this when a network error indicates the hardware is unreachable.
 */
export const activateReactiveSimulation = () => {
    if (typeof window !== 'undefined' && window.localStorage.getItem('simulation_mode_active') !== 'true') {
        console.error("[SimulationMode] Connection failed. Activating Reactive Mock Mode.");
        window.localStorage.setItem('simulation_mode_active', 'true');
        window.location.reload();
    }
};

/**
 * Utility to wrap a promise with a timeout.
 */
export const withTimeout = <T,>(promise: Promise<T>, timeoutMs = 3000): Promise<T> => {
    return Promise.race([
        promise,
        new Promise<T>((_, reject) =>
            setTimeout(() => reject(new Error('IP unreachable or request timeout')), timeoutMs)
        )
    ]);
};

/**
 * Call this to reset simulation mode.
 */
export const resetSimulationMode = () => {
    if (typeof window !== 'undefined') {
        window.localStorage.removeItem('simulation_mode_active');
        window.location.reload();
    }
};

/**
 * Common text for the simulation alert.
 */
export const SIMULATION_MESSAGE = "Error de IP: El hardware local no es accesible desde entornos seguros (HTTPS/Vercel) o ha fallado la conexión. Usando Modo Simulación.";
