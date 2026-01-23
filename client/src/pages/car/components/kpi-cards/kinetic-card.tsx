import { Box, Paper, Typography, SxProps, Theme } from "@mui/material";
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { CardController } from "../card-image/components/car-controller/car-controller";
import { IRemoteControlReceiveStatus } from "../../models/model";

interface KineticCardProps {
  remoteStatus: IRemoteControlReceiveStatus;
  panelStyle: SxProps<Theme>;
  sx?: SxProps<Theme>;
  id?: string;
  onDirection: (name: string) => void;
  pulseDuration: number;
  onPulseDurationChange: (val: number) => void;
  throttle: number;
  onThrottleChange: (val: number) => void;
}

import { useTranslation } from "react-i18next";

export const KineticCard: React.FC<KineticCardProps> = ({
  remoteStatus,
  panelStyle,
  sx,
  id,
  onDirection,
  pulseDuration,
  onPulseDurationChange,
  throttle,
  onThrottleChange
}) => {
  const { t } = useTranslation();
  return (
    <Paper
      id={id || "kinetic-card"}
      className="glass-effect"
      sx={[
        ...(Array.isArray(panelStyle) ? panelStyle : [panelStyle]),
        {
          p: 2,
          justifyContent: 'center',
          maxWidth: '100%',
          overflow: 'hidden',
          boxSizing: 'border-box',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Typography variant="subtitle2" className="tech-text" sx={{ color: 'var(--secondary)', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
        <SportsEsportsIcon fontSize="small" /> {t('car.kinetic.title')}
      </Typography>

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 0 }}>
        <CardController
          recibedMessage={remoteStatus}
          onDirection={onDirection}
          pulseDuration={pulseDuration}
          onPulseDurationChange={onPulseDurationChange}
          throttle={throttle}
          onThrottleChange={onThrottleChange}
        />
      </Box>
    </Paper>
  );
};
