import React from "react";
import { Box, Paper, Tooltip } from "@mui/material";
import { IRemoteControlReceiveStatus } from "@/pages/car/models/model";

import "./jostick-styles.css";

// Icons
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import AdjustIcon from '@mui/icons-material/Adjust';

interface JostickControllerProps {
    recibedMessage: IRemoteControlReceiveStatus;
    id?: string;
    onDirection: (name: string) => void;
}

export const JostickController: React.FC<JostickControllerProps> = ({ recibedMessage, id, onDirection }) => {

    const handleDirection = async (name: string) => {
        onDirection(name);
    };

    const isActive = (dir: string) =>
        recibedMessage.joystickDirection === dir ||
        recibedMessage.remoteGyroscope === dir;

    const ControlBtn = ({ dir, icon: Icon, label }: { dir: string; icon: any; label: string }) => (
        <Tooltip title={label} arrow placement="top">
            <Paper
                onClick={() => handleDirection(dir)}
                className={`glass-card control-btn ${isActive(dir) ? 'active' : ''}`}
                data-testid={`joystick-${dir.toLowerCase()}`}
            >
                <Icon sx={{ fontSize: 32 }} />
            </Paper>
        </Tooltip>
    );

    return (
        <Box id={id} className="jostick-container">
            {/* Connection Lines Decor */}
            <Box className="connection-lines" />

            {/* Controls Layout */}
            <Box className="controls-layout">
                <Box mb={2} display="flex" justifyContent="center">
                    <ControlBtn dir="Arriba" icon={KeyboardArrowUpIcon} label="FORWARD" />
                </Box>
                <Box display="flex" gap={2} alignItems="center">
                    <ControlBtn dir="Izquierda" icon={KeyboardArrowLeftIcon} label="TURN LEFT" />
                    <Box
                        className={`glass-card center-btn ${recibedMessage.buttonJostick === "on" ? 'active' : ''}`}
                        onClick={() => handleDirection("CENTER")}
                        data-testid="joystick-center"
                    >
                        <AdjustIcon sx={{ fontSize: 40 }} />
                    </Box>
                    <ControlBtn dir="Derecha" icon={KeyboardArrowRightIcon} label="TURN RIGHT" />
                </Box>
                <Box mt={2} display="flex" justifyContent="center">
                    <ControlBtn dir="Abajo" icon={KeyboardArrowDownIcon} label="REVERSE" />
                </Box>
            </Box>
        </Box>
    );
};
