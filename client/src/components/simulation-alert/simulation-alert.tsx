import React from 'react';
import { Alert, SxProps, Theme } from '@mui/material';
import { SIMULATION_MESSAGE } from '@/utils/simulation';

interface SimulationAlertProps {
    isMock: boolean;
    sx?: SxProps<Theme>;
}

export const SimulationAlert: React.FC<SimulationAlertProps> = ({ isMock, sx }) => {
    if (!isMock) return null;

    return (
        <Alert
            severity="info"
            sx={{
                mb: 2,
                background: "rgba(2, 136, 209, 0.1)",
                border: "1px solid var(--accent, #0288d1)",
                color: "var(--text-main, inherit)",
                fontWeight: 500,
                backdropFilter: "blur(4px)",
                "& .MuiAlert-icon": { color: "var(--accent, #0288d1)" },
                ...sx
            }}
        >
            {SIMULATION_MESSAGE}
        </Alert>
    );
};
