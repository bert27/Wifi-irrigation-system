import { Box, Paper, Typography, Slider, SxProps, Theme, Chip, useTheme, useMediaQuery } from "@mui/material";
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
  headlightColor?: string;
}

import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export const TelemetryCard: React.FC<TelemetryCardProps> = ({ robotStatus, remoteStatus, setOrientation, panelStyle, sx, id, headlightColor }) => {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<'CAR' | 'CONTROLLER'>('CAR');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1} flexWrap="wrap" gap={1} flexShrink={0}>
        <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
          <Typography variant="subtitle2" className="tech-text" sx={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 1, fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
            <PsychologyIcon fontSize="small" /> {isMobile ? "TELEMETRÍA" : t('car.telemetry.title')}
          </Typography>
          <Box display="flex" gap={1}>
            <Chip
              icon={<DirectionsCarIcon style={{ color: viewMode === 'CAR' ? '#fff' : 'inherit', fontSize: '1rem' }} />}
              label="CAR"
              size="small"
              clickable
              onClick={() => setViewMode('CAR')}
              sx={{
                height: 24,
                fontSize: '0.65rem',
                backgroundColor: viewMode === 'CAR' ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                color: viewMode === 'CAR' ? '#fff' : 'text.secondary'
              }}
            />
            <Chip
              icon={<SportsEsportsIcon style={{ color: viewMode === 'CONTROLLER' ? '#fff' : 'inherit', fontSize: '1rem' }} />}
              label="CTRL"
              size="small"
              clickable
              onClick={() => setViewMode('CONTROLLER')}
              sx={{
                height: 24,
                fontSize: '0.65rem',
                backgroundColor: viewMode === 'CONTROLLER' ? 'var(--secondary)' : 'rgba(255,255,255,0.1)',
                color: viewMode === 'CONTROLLER' ? '#fff' : 'text.secondary'
              }}
            />
          </Box>

          {/* Environmental Data */}
          {viewMode === 'CONTROLLER' && remoteStatus.temperature !== undefined && (
            <Box display="flex" gap={1} sx={{ opacity: 0.8 }}>
              <Typography variant="caption" sx={{ color: '#fbbf24', fontSize: '0.65rem', fontWeight: 'bold' }}>
                {remoteStatus.temperature.toFixed(1)}°C
              </Typography>
            </Box>
          )}
        </Box>

        {!isMobile && <Typography className="tech-text" sx={{ fontSize: '0.65rem', color: 'var(--success)' }}>{t('common.synced')}</Typography>}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2, flex: 1, minHeight: isMobile ? '350px' : 0 }}>
        <Box sx={{
          flex: isMobile ? 'none' : 2,
          height: isMobile ? '200px' : 'auto',
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
            headlightColor={headlightColor}
          />
        </Box>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: isMobile ? 'row' : 'column', gap: 1, minWidth: isMobile ? 'none' : '150px' }}>
          {/* EJE X (PITCH) SECTION */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: isMobile ? '120px' : 0 }}>
            <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
              <ValuesEchart data={{ title: isMobile ? "X" : "EJE X", value: radToDeg(currentGyro[0]) }} />
            </Box>
            <Box px={1} sx={{ flexShrink: 0 }}>
              <Slider
                disabled={viewMode === 'CONTROLLER'}
                size="small"
                min={-180}
                max={180}
                step={1}
                value={radToDeg(currentGyro[0])}
                onChange={(_: Event, val: number | number[]) => {
                  const degValue = typeof val === 'number' ? val : val[0];
                  const radValue = degToRad(degValue);
                  if (viewMode === 'CAR') setOrientation(radValue, currentGyro[1]);
                }}
                sx={{ color: 'var(--primary)', height: 4, py: 1 }}
              />
            </Box>
          </Box>

          {/* EJE Y (ROLL) SECTION */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: isMobile ? '120px' : 0 }}>
            <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
              <ValuesEchart data={{ title: isMobile ? "Y" : "EJE Y", value: radToDeg(currentGyro[1]) }} />
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
