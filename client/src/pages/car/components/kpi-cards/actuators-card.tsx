import { Box, Paper, Typography, Slider, SxProps, Theme } from "@mui/material";
import WifiIcon from '@mui/icons-material/Wifi';
import { CardOutputs } from "../card-outputs";

interface ActuatorsCardProps {
  globalPwm: number;
  setGlobalPwm: (val: number) => void;
  panelStyle: any;
  sx?: SxProps<Theme>;
  id?: string;
  lastCmd?: string;
}

import { useTranslation } from "react-i18next";

export const ActuatorsCard: React.FC<ActuatorsCardProps> = ({ globalPwm, setGlobalPwm, panelStyle, sx, id, lastCmd }) => {
  const { t } = useTranslation();
  return (
    <Paper
      id={id || "actuators-card"}
      className="glass-effect"
      sx={{
        ...panelStyle,
        p: 2,
        display: 'flex',
        flexDirection: 'row',
        gap: 2,
        overflow: 'hidden',
        ...sx
      }}
    >
      {/* Left: Matrix */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
        <Typography variant="subtitle2" className="tech-text" sx={{ color: 'var(--accent)', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <WifiIcon fontSize="small" /> {t('car.actuators.title')}
        </Typography>
        <Box sx={{ flexGrow: 1, minHeight: 0, overflowY: 'auto' }}>
          <CardOutputs globalPwm={globalPwm} lastCmd={lastCmd} />
        </Box>
      </Box>

      {/* Right: Vertical PWM Card */}
      <Box sx={{
        width: '50px',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'rgba(0,0,0,0.2)',
        borderRadius: '12px',
        py: 1,
        border: '1px solid var(--glass-border)'
      }}>
        <Typography className="tech-text" sx={{ fontSize: '0.65rem', color: 'var(--text-muted)', mb: 1, writingMode: 'vertical-rl', transform: 'rotate(180deg)', textOrientation: 'mixed' }}>PWM</Typography>
        <Box sx={{ flex: 1, width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Slider
            orientation="vertical"
            value={globalPwm}
            onChange={(_: Event, val: number | number[]) => setGlobalPwm(val as number)}
            min={0}
            max={255}
            sx={{
              color: 'var(--warning)',
              '& .MuiSlider-track': { border: 'none', background: 'linear-gradient(to top, var(--warning), var(--error))' },
              '& .MuiSlider-thumb': { backgroundColor: 'var(--text-main)', border: '2px solid var(--warning)', width: 14, height: 14 },
              '& .MuiSlider-rail': { opacity: 0.3, backgroundColor: 'var(--text-muted)' }
            }}
          />
        </Box>
      </Box>
    </Paper>
  );
};
