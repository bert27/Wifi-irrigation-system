import React from "react";
import { Box, Paper, Tooltip } from "@mui/material";
import { ResponseWebSocketInterface } from "@/pages/car/models/robot-model";
import { robotService } from "@/services/robot.service";
import "./styles.css";

// Icons
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import AdjustIcon from '@mui/icons-material/Adjust';

interface JostickControllerProps {
    recibedMessage: ResponseWebSocketInterface;
    id?: string;
}

export const JostickController: React.FC<JostickControllerProps> = ({ recibedMessage, id }) => {

    const handleDirection = async (name: string) => {
        try {
            await robotService.sendOutputRobotUI({ name });
        } catch (e) {
            console.error(e);
        }
    };

    const isActive = (dir: string) => recibedMessage.jostickDirection === dir;

    const ControlBtn = ({ dir, icon: Icon, label }: { dir: string; icon: any; label: string }) => (
        <Tooltip title={label} arrow placement="top">
            <Paper
                onClick={() => handleDirection(dir)}
                className={`glass-card control-btn ${isActive(dir) ? 'active' : ''}`}
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
                        className={`glass-card center-btn ${isActive("CENTER") ? 'active' : ''}`}
                        onClick={() => handleDirection("CENTER")}
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
