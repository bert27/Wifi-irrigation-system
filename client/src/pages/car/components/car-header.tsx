import { Box, Typography, Button, IconButton } from "@mui/material";
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { ConnectInfo } from "./connect-info";

interface HeaderProps {
  connected: boolean;
  ledState: boolean;
  onToggleLed: () => void;
  onPing: () => void;
  height: string;
}

export const CarHeader: React.FC<HeaderProps> = ({ connected, ledState, onToggleLed, onPing, height }) => {
  return (
    <Box 
      component="header"
      sx={{ 
        height: height, 
        flexShrink: 0,
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 2 
      }}
    >
      <Box>
        <Typography variant="h4" className="tech-text neon-glow" sx={{ fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>
          ROBOT<span style={{ color: 'var(--primary)' }}>CORE</span>
        </Typography>
        <ConnectInfo connectedWs={connected} />
      </Box>
      
      <Box display="flex" gap={2}>
        <IconButton 
          onClick={onToggleLed}
          className="glass-card"
          size="small"
          sx={{ 
            p: 1.5,
            color: ledState ? 'var(--primary)' : 'var(--text-dim)',
            borderColor: ledState ? 'var(--primary)' : 'var(--glass-border)',
            boxShadow: ledState ? '0 0 20px var(--primary-glow)' : 'none'
          }}
        >
          <PowerSettingsNewIcon />
        </IconButton>
        
        <Button
          variant="contained"
          onClick={onPing}
          disabled={!connected}
          className="tech-text"
          size="small"
          sx={{ 
            background: 'linear-gradient(45deg, var(--primary), var(--secondary))',
            borderRadius: '12px',
            px: 3,
            fontWeight: 700,
            boxShadow: '0 8px 16px var(--primary-glow)',
            color: '#fff !important'
          }}
        >
          PING
        </Button>
      </Box>
    </Box>
  );
};
