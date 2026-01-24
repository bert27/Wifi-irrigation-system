import { useReducer, useEffect } from 'react';
import { IDashboardState, IRobotSendStatus } from '../models/model';
import { useRemoteControl } from '@/context/remote-control-context';
import { ROBOT_CONFIG } from '../config/robot-config';

// Incoming data from WebSocket might have different keys than our internal model
interface RobotTelemetryPayload extends Partial<IRobotSendStatus> {
    giroscopeValues?: number[];
    giroscope?: string;
}

type DashboardAction =
    | { type: 'UPDATE_ROBOT_DATA'; payload: RobotTelemetryPayload }
    | { type: 'SYNC_REMOTE_DATA'; payload: any } // Remote data structure is complex, keeping any or could use IRemoteControlReceiveStatus
    | { type: 'SET_ROBOT_ORIENTATION'; payload: { pitch: number; roll: number } }
    | { type: 'TOGGLE_LED_MOCK' };

const initialState: IDashboardState = {
    robot: {
        ledState: false,
        motorState: "STOP",
        robotGyroscopeValues: [0, 0, 0]
    },
    remote: {
        joystickDirection: "IDLE",
        buttonJostick: "IDLE",
        remoteGyroscopeValues: [0, 0, 0]
    }
};

const dashboardReducer = (state: IDashboardState, action: DashboardAction): IDashboardState => {
    switch (action.type) {
        case 'UPDATE_ROBOT_DATA':
            return {
                ...state,
                robot: {
                    ...state.robot,
                    ...action.payload,
                    // Map legacy keys if present
                    robotGyroscopeValues: action.payload.giroscopeValues ?? action.payload.robotGyroscopeValues ?? state.robot.robotGyroscopeValues,
                    robotGyroscope: action.payload.giroscope ?? action.payload.robotGyroscope ?? state.robot.robotGyroscope,
                }
            };
        case 'SYNC_REMOTE_DATA':
            return { ...state, remote: { ...action.payload } };
        case 'SET_ROBOT_ORIENTATION':
            return {
                ...state,
                robot: {
                    ...state.robot,
                    robotGyroscopeValues: [action.payload.pitch, action.payload.roll, state.robot.robotGyroscopeValues?.[2] || 0]
                }
            };
        case 'TOGGLE_LED_MOCK':
            return {
                ...state,
                robot: { ...state.robot, ledState: !state.robot.ledState }
            };
        default:
            return state;
    }
};

export const useRobotDashboard = (isMock: boolean) => {
    const { remoteState } = useRemoteControl();
    const [dashboardState, dispatch] = useReducer(dashboardReducer, initialState);

    const updateRobotTelemetry = (data: RobotTelemetryPayload) => {
        dispatch({ type: 'UPDATE_ROBOT_DATA', payload: data });
    };

    const setRobotOrientation = (pitch: number, roll: number) => {
        dispatch({ type: 'SET_ROBOT_ORIENTATION', payload: { pitch, roll } });
    };

    const toggleLedMock = () => {
        dispatch({ type: 'TOGGLE_LED_MOCK' });
    };

    // Sync Remote Actions to Dashboard
    useEffect(() => {
        dispatch({ type: 'SYNC_REMOTE_DATA', payload: remoteState });
    }, [remoteState]);

    // Mock Animation
    useEffect(() => {
        if (!isMock) return;
        const interval = setInterval(() => {
            const time = Date.now() / 1000;
            dispatch({
                type: 'UPDATE_ROBOT_DATA',
                payload: {
                    robotGyroscopeValues: [
                        Math.sin(time * 0.3) * 0.6,
                        Math.cos(time * 0.2) * 0.4,
                        0
                    ]
                }
            });
        }, ROBOT_CONFIG.MOCK_UPDATE_INTERVAL);
        return () => clearInterval(interval);
    }, [isMock]);

    return {
        dashboardState,
        updateRobotTelemetry,
        setRobotOrientation,
        toggleLedMock
    };
};

