import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CarPage } from './car-page';
import { useRobotControl } from './hooks/use-robot-control';
import "@testing-library/jest-dom";

// Mock the hook
vi.mock('./hooks/use-robot-control');
const mockedUseRobotControl = useRobotControl as import('vitest').Mock;

vi.mock('@/components/rgb-card/rgb-card', () => ({
    RgbCard: () => <div data-testid="rgb-card" />
}));

vi.mock('./components/car-header', () => ({
    CarHeader: () => <div data-testid="car-header" />
}));

vi.mock('./components/kpi-cards/telemetry-card', () => ({
    TelemetryCard: () => <div data-testid="telemetry-card" />
}));

// Mock i18next
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

describe('CarPage Joystick to Actuator Test', () => {
    const mockOutputs = [
        { name: 'Front Left', colorLabel: "black", pin: 25, state: 0 },
        { name: 'Front Right', colorLabel: "black", pin: 4, state: 0 },
        { name: 'Rear Left', colorLabel: "yellow", pin: 14, state: 0 },
        { name: 'Rear Right', colorLabel: "yellow", pin: 19, state: 0 },
    ];

    const defaultHookValue = {
        dashboardState: {
            robot: {
                ledState: false,
                robotGyroscopeValues: [0, 0, 0],
                orientation: [0, 0]
            },
            remote: {
                temperature: 25,
                humidity: 50,
                pressure: 1013,
                altitude: 100,
                remoteGyroscope: 'IDLE',
                joystickDirection: 'IDLE',
                buttonJostick: 'off',
                remoteGyroscopeValues: [0, 0, 0]
            }
        },
        connected: true,
        connectedRemote: true,
        color: '#00d2ff',
        handleColorChange: vi.fn(),
        toggleLED: vi.fn(),
        sendWSMessage: vi.fn(),
        handleDirection: vi.fn(),
        setOrientation: vi.fn(),
        lastCmd: '',
        connectionError: null,
        isMock: true,
        outputs: mockOutputs,
        setOutputs: vi.fn(),
        pulseDuration: 1000,
        setPulseDuration: vi.fn(),
        throttle: 140,
        setThrottle: vi.fn()
    };

    beforeEach(() => {
        vi.clearAllMocks();
        mockedUseRobotControl.mockReturnValue(defaultHookValue);
    });

    it('should call handleDirection when joystick Up is clicked', () => {
        render(<CarPage />);

        const upButton = screen.getByTestId('joystick-arriba');
        fireEvent.click(upButton);

        expect(defaultHookValue.handleDirection).toHaveBeenCalledWith('Arriba');
    });

    it('should show actuators state correctly based on outputs', () => {
        // Mocking active output for Front Left (PIN 25)
        const activeOutputs = [...mockOutputs];
        activeOutputs[0] = { ...activeOutputs[0], state: 140 };

        mockedUseRobotControl.mockReturnValue({
            ...defaultHookValue,
            outputs: activeOutputs
        });

        render(<CarPage />);

        const flActuator = screen.getByTestId('actuator-pin-25');
        // Check if it has the active styling (it uses border/background based on state)
        // In the component: border: item.state ? `1px solid ...` : ...
        expect(flActuator).toHaveStyle('background: #10b98110'); // Based on colorLabel: black -> #10b981
    });

    it('should test full interaction: clicking joystick calls handleDirection', async () => {
        const handleDirectionMock = vi.fn();
        mockedUseRobotControl.mockReturnValue({
            ...defaultHookValue,
            handleDirection: handleDirectionMock
        });

        render(<CarPage />);

        const downButton = screen.getByTestId('joystick-abajo');
        fireEvent.click(downButton);

        expect(handleDirectionMock).toHaveBeenCalledWith('Abajo');
    });
});
