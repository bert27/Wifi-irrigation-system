import React from 'react';
import { Alert, Button, SxProps, Theme } from '@mui/material';
import { SIMULATION_MESSAGE, resetSimulationMode } from '@/utils/simulation';
import RefreshIcon from '@mui/icons-material/Refresh';

interface SimulationAlertProps {
    isMock: boolean;
    sx?: SxProps<Theme>;
}

export const SimulationAlert: React.FC<SimulationAlertProps> = ({ isMock, sx }) => {
    if (!isMock) return null;

    return (
        <Alert
            severity="info"
            action={
                <Button
                    color="inherit"
                    size="small"
                    startIcon={<RefreshIcon />}
                    onClick={resetSimulationMode}
                    sx={{ fontWeight: 700, textTransform: 'none' }}
                >
                    Reintentar Conexión
                </Button>
            }
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
