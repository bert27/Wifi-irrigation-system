import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ROBOT_CONFIG } from '../config/robot-config';
import { IOutputData } from '../models/model';

export const useRobotSettings = () => {
    const { t } = useTranslation();
    const [pulseDuration, setPulseDuration] = useState(ROBOT_CONFIG.DEFAULT_PULSE_DURATION);
    const [throttle, setThrottle] = useState(ROBOT_CONFIG.DEFAULT_THROTTLE);
    const [color, setColor] = useState(ROBOT_CONFIG.DEFAULT_COLOR);

    // Single source of truth with optional nameKey
    const [outputs, setOutputs] = useState<IOutputData[]>([
        { nameKey: 'car.actuators.front_left', colorLabel: "black", pin: ROBOT_CONFIG.PINS.FRONT_LEFT, state: 0 },
        { nameKey: 'car.actuators.front_right', colorLabel: "black", pin: ROBOT_CONFIG.PINS.FRONT_RIGHT, state: 0 },
        { nameKey: 'car.actuators.rear_left', colorLabel: "yellow", pin: ROBOT_CONFIG.PINS.REAR_LEFT, state: 0 },
        { nameKey: 'car.actuators.rear_right', colorLabel: "yellow", pin: ROBOT_CONFIG.PINS.REAR_RIGHT, state: 0 },
        { nameKey: 'car.actuators.fl_reverse', colorLabel: "blue", pin: ROBOT_CONFIG.PINS.FL_REVERSE, state: 0 },
        { nameKey: 'car.actuators.fr_reverse', colorLabel: "blue", pin: ROBOT_CONFIG.PINS.FR_REVERSE, state: 0 },
        { nameKey: 'car.actuators.rl_reverse', colorLabel: "white", pin: ROBOT_CONFIG.PINS.RL_REVERSE, state: 0 },
        { nameKey: 'car.actuators.rr_reverse', colorLabel: "white", pin: ROBOT_CONFIG.PINS.RR_REVERSE, state: 0 },
    ]);

    // Apply translations on render (if nameKey exists)
    const translatedOutputs = outputs.map(out => ({
        ...out,
        name: out.nameKey ? t(out.nameKey) : out.name
    }));

    return {
        pulseDuration, setPulseDuration,
        throttle, setThrottle,
        color, setColor,
        outputs: translatedOutputs,
        setOutputs
    };
};
