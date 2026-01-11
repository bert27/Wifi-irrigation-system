import { Box, Typography } from "@mui/material";
import WifiIcon from '@mui/icons-material/Wifi';
import SensorsOffIcon from '@mui/icons-material/SensorsOff';

interface ConnectInfoProps {
  connectedWs: boolean | undefined;
}

export const ConnectInfo = (props: ConnectInfoProps) => {
  const { connectedWs } = props;
  
  const statusColor = connectedWs ? 'var(--success)' : 'var(--error)';
  const glowShadow = connectedWs ? 'var(--success-glow)' : 'var(--error-glow)';

  return (
    <Box 
      className="glass-card" 
      sx={{ 
        display: "inline-flex", 
        alignItems: "center", 
        gap: 2, 
        px: 2, 
        py: 1,
        border: `1px solid ${statusColor}44`,
        background: `${statusColor}11`,
      }}
    >
      <Box 
        className={connectedWs ? "status-pulse" : ""}
        sx={{ 
          width: 10, 
          height: 10, 
          borderRadius: "50%", 
          backgroundColor: statusColor,
          boxShadow: `0 0 10px ${glowShadow}`,
        }} 
      />
      
      <Box display="flex" alignItems="center" gap={1}>
        {connectedWs ? (
          <WifiIcon sx={{ fontSize: 18, color: 'var(--success)' }} />
        ) : (
          <SensorsOffIcon sx={{ fontSize: 18, color: 'var(--error)' }} />
        )}
        <Typography 
          className="tech-text"
          sx={{ 
            fontSize: '0.75rem', 
            fontWeight: 700,
            color: connectedWs ? 'var(--success)' : 'var(--text-muted)',
            letterSpacing: 1
          }}
        >
          {connectedWs ? "SYSTEM ONLINE" : "SYSTEM OFFLINE"}
        </Typography>
      </Box>
    </Box>
  );
};
