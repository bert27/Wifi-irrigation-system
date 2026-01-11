import { Box, Paper, Typography, Slider, SxProps, Theme } from "@mui/material";
import PsychologyIcon from '@mui/icons-material/Psychology';
import { MpuGraphic } from "../giroscope/mpu-graphic";
import { ValuesEchart } from "../giroscope/values-echart";
import { RobotStatus } from "../../models/robot-model";

interface TelemetryCardProps {
  robotStatus: RobotStatus;
  setOrientation: (pitch: number, roll: number) => void;
  panelStyle: any;
  sx?: SxProps<Theme>;
  id?: string;
}

export const TelemetryCard: React.FC<TelemetryCardProps> = ({ robotStatus, setOrientation, panelStyle, sx, id }) => {
  // Conversion functions
  const radToDeg = (rad: number) => (rad * 180) / Math.PI;
  const degToRad = (deg: number) => (deg * Math.PI) / 180;

  return (
    <Paper id={id} className="glass-effect" sx={{ ...panelStyle, p: 2, overflow: 'hidden', ...sx }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1} flexShrink={0}>
        <Typography variant="subtitle2" className="tech-text" sx={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 1 }}>
          <PsychologyIcon fontSize="small" /> NEURAL TELEMETRY
        </Typography>
        <Typography className="tech-text" sx={{ fontSize: '0.65rem', color: 'var(--success)' }}>SYNCED</Typography>
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
            data={{ height: "100%", width: "100%" }} 
            recibedMessage={robotStatus} 
            setOrientation={setOrientation}
          />
        </Box>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, minWidth: '150px' }}>
            {/* PITCH SECTION */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
                  <ValuesEchart data={{ title: "PITCH", value: radToDeg(robotStatus.giroscopeValues?.[0] || 0) }} />
              </Box>
              <Box px={1} sx={{ flexShrink: 0 }}>
                <Slider 
                  size="small"
                  min={-180} 
                  max={180} 
                  step={1}
                  value={radToDeg(robotStatus.giroscopeValues?.[0] || 0)}
                  onChange={(_: Event, val: number | number[]) => {
                    const degValue = typeof val === 'number' ? val : val[0];
                    const radValue = degToRad(degValue);
                    setOrientation(radValue, robotStatus.giroscopeValues?.[1] || 0);
                  }}
                  sx={{ color: 'var(--primary)', height: 4, py: 1 }}
                />
              </Box>
            </Box>

            {/* ROLL SECTION */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
                  <ValuesEchart data={{ title: "ROLL", value: radToDeg(robotStatus.giroscopeValues?.[1] || 0) }} />
              </Box>
              <Box px={1} sx={{ flexShrink: 0 }}>
                <Slider 
                  size="small"
                  min={-180} 
                  max={180} 
                  step={1}
                  value={radToDeg(robotStatus.giroscopeValues?.[1] || 0)}
                  onChange={(_: Event, val: number | number[]) => {
                    const degValue = typeof val === 'number' ? val : val[0];
                    const radValue = degToRad(degValue);
                    setOrientation(robotStatus.giroscopeValues?.[0] || 0, radValue);
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
