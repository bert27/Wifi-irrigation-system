import { Box, Paper, Typography, Slider, SxProps, Theme, Chip } from "@mui/material";
import PsychologyIcon from '@mui/icons-material/Psychology';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { MpuGraphic } from "../giroscope/mpu-graphic";
import { ValuesEchart } from "../giroscope/values-echart";
import { IRobotSendStatus, IRemoteControlReceiveStatus } from "../../models/model";

interface TelemetryCardProps {
  robotStatus: IRobotSendStatus;
  remoteStatus: IRemoteControlReceiveStatus;
  setOrientation: (pitch: number, roll: number) => void;
  panelStyle: any;
  sx?: SxProps<Theme>;
  id?: string;
}

import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export const TelemetryCard: React.FC<TelemetryCardProps> = ({ robotStatus, remoteStatus, setOrientation, panelStyle, sx, id }) => {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<'CAR' | 'CONTROLLER'>('CAR');

  // Select Data Source
  // Conversion functions
  const radToDeg = (rad: number) => (rad * 180) / Math.PI;
  const degToRad = (deg: number) => (deg * Math.PI) / 180;

  // Select Data Source & Normalize to RADIANS
  // Robot sends Radians, Remote sends Degrees.
  const currentGyro = viewMode === 'CAR'
    ? (robotStatus.robotGyroscopeValues || [0, 0, 0])
    : (remoteStatus.remoteGyroscopeValues?.map(d => degToRad(d)) || [0, 0, 0]);

  return (
    <Paper id={id || "telemetry-card"} className="glass-effect" sx={{ ...panelStyle, p: 2, overflow: 'hidden', ...sx }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1} flexShrink={0}>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="subtitle2" className="tech-text" sx={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 1 }}>
            <PsychologyIcon fontSize="small" /> {t('car.telemetry.title')}
          </Typography>
          <Chip
            icon={<DirectionsCarIcon style={{ color: viewMode === 'CAR' ? '#fff' : 'inherit' }} />}
            label="CAR"
            size="small"
            clickable
            onClick={() => setViewMode('CAR')}
            sx={{
              ml: 2,
              height: 24,
              fontSize: '0.7rem',
              backgroundColor: viewMode === 'CAR' ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
              color: viewMode === 'CAR' ? '#fff' : 'text.secondary'
            }}
          />
          <Chip
            icon={<SportsEsportsIcon style={{ color: viewMode === 'CONTROLLER' ? '#fff' : 'inherit' }} />}
            label="CTRL"
            size="small"
            clickable
            onClick={() => setViewMode('CONTROLLER')}
            sx={{
              height: 24,
              fontSize: '0.7rem',
              backgroundColor: viewMode === 'CONTROLLER' ? 'var(--secondary)' : 'rgba(255,255,255,0.1)',
              color: viewMode === 'CONTROLLER' ? '#fff' : 'text.secondary'
            }}
          />

          {/* Environmental Data (Controller Mode Only) */}
          {viewMode === 'CONTROLLER' && remoteStatus.temperature !== undefined && (
            <Box display="flex" gap={1} ml={1} sx={{ opacity: 0.8 }}>
              <Typography variant="caption" sx={{ color: '#fbbf24', fontSize: '0.7rem' }}>
                {remoteStatus.temperature.toFixed(1)}°C
              </Typography>
              <Typography variant="caption" sx={{ color: '#38bdf8', fontSize: '0.7rem' }}>
                {remoteStatus.altitude?.toFixed(0)}m
              </Typography>
            </Box>
          )}
        </Box>

        <Typography className="tech-text" sx={{ fontSize: '0.65rem', color: 'var(--success)' }}>{t('common.synced')}</Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, flex: 1, minHeight: 0 }}>
        <Box sx={{
          flex: 2,
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '16px',
          border: '1px solid var(--glass-border)',
          position: 'relative',
          overflow: 'hidden',
          minHeight: 0
        }}>
          <MpuGraphic
            pitch={currentGyro[0]}
            roll={currentGyro[1]}
            type={viewMode === 'CAR' ? 'car' : 'controller'}
          />
        </Box>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, minWidth: '150px' }}>
          {/* EJE X (PITCH) SECTION */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
              <ValuesEchart data={{ title: "EJE X", value: radToDeg(currentGyro[0]) }} />
            </Box>
            <Box px={1} sx={{ flexShrink: 0 }}>
              <Slider
                disabled={viewMode === 'CONTROLLER'} // Read-only for controller
                size="small" // ...
                min={-180}
                max={180}
                step={1}
                value={radToDeg(currentGyro[0])}
                onChange={(_: Event, val: number | number[]) => {
                  const degValue = typeof val === 'number' ? val : val[0];
                  const radValue = degToRad(degValue);
                  // Only allow setting Robot orientation manually
                  if (viewMode === 'CAR') setOrientation(radValue, currentGyro[1]);
                }}
                sx={{ color: 'var(--primary)', height: 4, py: 1 }}
              />
            </Box>
          </Box>

          {/* EJE Y (ROLL) SECTION */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
              <ValuesEchart data={{ title: "EJE Y", value: radToDeg(currentGyro[1]) }} />
            </Box>
            <Box px={1} sx={{ flexShrink: 0 }}>
              <Slider
                disabled={viewMode === 'CONTROLLER'}
                size="small"
                min={-180}
                max={180}
                step={1}
                value={radToDeg(currentGyro[1])}
                onChange={(_: Event, val: number | number[]) => {
                  const degValue = typeof val === 'number' ? val : val[0];
                  const radValue = degToRad(degValue);
                  if (viewMode === 'CAR') setOrientation(currentGyro[0], radValue);
                }}
                sx={{ color: 'var(--secondary)', height: 4, py: 1 }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};
