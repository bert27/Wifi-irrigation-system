import { directionWebDrinks, directionWebRobot, directionWebIrrigation } from "@/config/api.config";

/**
 * Unified logic to detect if the application should run in Simulation (Mock) mode.
 */
export const isSimulationMode = (): boolean => {
    // 1. Env Var Force
    const envForce = import.meta.env.VITE_MOCK_SERVER === 'true';
    if (envForce) return true;

    // 2. Reactive Fallback (Address Unreachable or Mixed Content)
    const reactiveForce = window.localStorage.getItem('simulation_mode_active') === 'true';
    if (reactiveForce) return true;

    // 3. HTTPS to HTTP Fallback (Mixed Content Prevention)
    const isHttps = window.location.protocol === 'https:';

    // We check if any of the configured IPs are pure HTTP
    const hasHttpHardware = [directionWebDrinks, directionWebRobot, directionWebIrrigation]
        .some(url => url && url.startsWith('http:'));

    const mixedContentFallback = isHttps && hasHttpHardware;

    if (mixedContentFallback) {
        console.warn("[SimulationMode] Active due to HTTPS + Local Hardware (Mixed Content)");
    }

    return mixedContentFallback;
};

/**
 * Call this when a network error indicates the hardware is unreachable.
 */
export const activateReactiveSimulation = () => {
    if (window.localStorage.getItem('simulation_mode_active') !== 'true') {
        console.error("[SimulationMode] Reactive activation triggered due to connection failure.");
        window.localStorage.setItem('simulation_mode_active', 'true');
        // Force a reload to ensure all hooks and services pick up the change
        window.location.reload();
    }
};

/**
 * Call this to reset simulation mode if needed.
 */
export const resetSimulationMode = () => {
    window.localStorage.removeItem('simulation_mode_active');
    window.location.reload();
};

/**
 * Common text for the simulation alert.
 */
export const SIMULATION_MESSAGE = "Error de IP: No se pudo contactar con el hardware local. Activando Modo Simulación para permitir la navegación.";
