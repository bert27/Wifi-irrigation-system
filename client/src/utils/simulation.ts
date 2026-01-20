import { directionWebDrinks, directionWebRobot, directionWebIrrigation } from "@/config/api.config";

/**
 * Unified logic to detect if the application should run in Simulation (Mock) mode.
 */
export const isSimulationMode = (): boolean => {
    // 1. Env Var Force
    const envForce = import.meta.env.VITE_MOCK_SERVER === 'true';
    if (envForce) return true;

    // 2. HTTPS to HTTP Fallback (Mixed Content Prevention)
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
 * Common text for the simulation alert to ensure consistency.
 */
export const SIMULATION_MESSAGE = "Modo Simulación Activado: Navegando bajo HTTPS (Vercel). Las conexiones reales a hardware local están deshabilitadas por seguridad del navegador.";
