import { Box, Paper, Typography, SxProps, Theme } from "@mui/material";
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { CardController } from "../card-image/components/car-controller/car-controller";
import { IRemoteControlReceiveStatus } from "../../models/model";

interface KineticCardProps {
  remoteStatus: IRemoteControlReceiveStatus;
  panelStyle: any;
  sx?: SxProps<Theme>;
  id?: string;
  lastCmd?: string;
}

import { useTranslation } from "react-i18next";

export const KineticCard: React.FC<KineticCardProps> = ({ remoteStatus, panelStyle, sx, id, lastCmd }) => {
  const { t } = useTranslation();
  return (
    <Paper
      id={id || "kinetic-card"}
      className="glass-effect"
      sx={{
        ...panelStyle,
        p: 2,
        justifyContent: 'center',
        maxWidth: '100%',
        overflow: 'hidden',
        boxSizing: 'border-box',
        ...sx
      }}
    >
      <Typography variant="subtitle2" className="tech-text" sx={{ color: 'var(--secondary)', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
        <SportsEsportsIcon fontSize="small" /> {t('car.kinetic.title')}
      </Typography>

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 0 }}>
        <CardController recibedMessage={remoteStatus} lastCmd={lastCmd} />
      </Box>
    </Paper>
  );
};
