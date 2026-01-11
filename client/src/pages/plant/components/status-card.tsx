import React from "react";
import { Box, Typography } from "@mui/material";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WaterIcon from "@mui/icons-material/Water";
import { ChartTemperature } from "./chart-temperature";
import "./../plant.css";

interface StatusCardProps {
  temperature: number | null;
  clock: string | null;
  stateWaterPump: boolean;
}

import { useTranslation } from "react-i18next";

export const StatusCard: React.FC<StatusCardProps> = ({ temperature, clock, stateWaterPump }) => {
  const { t } = useTranslation();
  return (
    <div className="cardPlanta" style={{ height: '100%' }}>
      <Typography className="subtitle_plant" sx={{ mb: 1 }}>{t('plant.status.title')}</Typography>
      
      <Box display="flex" justifyContent="space-around" mb={2}>
        <Box textAlign="center">
          <ThermostatIcon sx={{ color: 'var(--accent)', fontSize: '2rem' }} />
          <Typography variant="h5" sx={{ fontFamily: 'var(--font-tech)' }}>
            {temperature ? `${temperature}°C` : "--"}
          </Typography>
          <Typography variant="caption" color="var(--text-muted)">{t('plant.status.temp')}</Typography>
        </Box>
        <Box textAlign="center">
          <AccessTimeIcon sx={{ color: 'var(--secondary)', fontSize: '2rem' }} />
          <Typography variant="h5" sx={{ fontFamily: 'var(--font-tech)' }}>
            {clock || "--:--"}
          </Typography>
          <Typography variant="caption" color="var(--text-muted)">{t('plant.status.clock')}</Typography>
        </Box>
      </Box>
 
      <Box 
        sx={{ 
          p: 1.5, 
          borderRadius: '16px', 
          background: 'rgba(255,255,255,0.03)', 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography fontWeight={700}>{t('plant.status.pump1')}: {stateWaterPump ? t('common.on') : t('common.off')}</Typography>
        {stateWaterPump ? <WaterIcon color="info" /> : <WaterIcon sx={{ opacity: 0.3 }} />}
      </Box>

      <Box mt={2}>
        <ChartTemperature />
      </Box>
    </div>
  );
};
