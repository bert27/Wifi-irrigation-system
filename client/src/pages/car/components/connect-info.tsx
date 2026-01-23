import { Box, Typography } from "@mui/material";

interface ConnectInfoProps {
  connectedRobot: boolean;
  connectedRemote: boolean;
  isMock?: boolean;
}

export const ConnectInfo = ({ connectedRobot, connectedRemote, isMock }: ConnectInfoProps) => {

  const StatusBadge = ({ label, active, simulated }: { label: string, active: boolean, simulated?: boolean }) => {
    // If simulated, it should look disconnected (Red/Offline) as per user request
    const isActuallyConnected = active && !simulated;

    const color = isActuallyConnected ? 'var(--success)' : 'var(--error)';
    const glow = isActuallyConnected ? 'var(--success-glow)' : 'var(--error-glow)';
    const textLabel = isActuallyConnected ? label : "OFFLINE";

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box
          className={isActuallyConnected ? "status-pulse" : ""}
          sx={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: color,
            boxShadow: `0 0 8px ${glow}`,
          }}
        />
        <Typography sx={{
          fontSize: '0.7rem',
          fontWeight: 700,
          color: isActuallyConnected ? 'var(--text-main)' : 'var(--text-muted)'
        }}>
          {textLabel}
        </Typography>
      </Box>
    );
  };

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
      <StatusBadge label="ROBOT" active={connectedRobot} simulated={isMock} />
      <Box sx={{ width: '1px', height: '12px', background: 'rgba(255,255,255,0.1)' }} />
      <StatusBadge label="REMOTE" active={connectedRemote} simulated={isMock} />
    </Box>
  );
};
