import { Box, Typography } from "@mui/material";
import WifiIcon from '@mui/icons-material/Wifi';
import SensorsOffIcon from '@mui/icons-material/SensorsOff';
import { useTranslation } from "react-i18next";

interface ConnectInfoProps {
  connectedRobot: boolean;
  connectedRemote: boolean;
}

export const ConnectInfo = ({ connectedRobot, connectedRemote }: ConnectInfoProps) => {
  const { t } = useTranslation();

  const StatusBadge = ({ label, active }: { label: string, active: boolean }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box
        className={active ? "status-pulse" : ""}
        sx={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: active ? 'var(--success)' : 'var(--error)',
          boxShadow: `0 0 8px ${active ? 'var(--success-glow)' : 'var(--error-glow)'}`,
        }}
      />
      <Typography sx={{
        fontSize: '0.7rem',
        fontWeight: 700,
        color: active ? 'var(--text-main)' : 'var(--text-muted)'
      }}>
        {label}
      </Typography>
    </Box>
  );

  return (
    <Box
      className="glass-card"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 3,
        px: 2,
        py: 1,
        border: `1px solid var(--glass-border)`,
        background: `rgba(0,0,0,0.2)`,
      }}
    >
      <StatusBadge label="ROBOT" active={connectedRobot} />
      <Box sx={{ width: '1px', height: '12px', background: 'rgba(255,255,255,0.1)' }} />
      <StatusBadge label="REMOTE" active={connectedRemote} />
    </Box>
  );
};
