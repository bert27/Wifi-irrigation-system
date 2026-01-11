import React from "react";
import { Box, Typography, Paper, Tooltip } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import AdjustIcon from "@mui/icons-material/Adjust";

interface ManualControlsProps {
  onPumpCommand: (pumpId: number) => void;
}

export const ManualControls: React.FC<ManualControlsProps> = ({ onPumpCommand }) => {
  const [activePump, setActivePump] = React.useState<number | null>(null);

  const handlePump = (pumpId: number) => {
    setActivePump(pumpId);
    onPumpCommand(pumpId);
    setTimeout(() => setActivePump(null), 1000);
  };

  const ControlBtn = ({ pumpId, icon: Icon, label }: { pumpId: number; icon: any; label: string }) => (
    <Tooltip title={label} arrow placement="top">
      <Paper
        onClick={() => handlePump(pumpId)}
        className="glass-card"
        sx={{
          width: 64,
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          background: activePump === pumpId ? "rgba(99, 102, 241, 0.2)" : "rgba(255,255,255,0.05)",
          color: activePump === pumpId ? "var(--secondary)" : "rgba(255,255,255,0.8)",
          border: activePump === pumpId ? "2px solid var(--secondary)" : "1px solid rgba(255,255,255,0.25)",
          boxShadow: activePump === pumpId ? "0 0 20px var(--secondary-glow)" : "inset 0 0 10px rgba(0,0,0,0.3)",
          transition: "all 0.2s ease",
          "&:active": { transform: "scale(0.9)" },
          "&:hover": {
            borderColor: activePump === pumpId ? "var(--secondary)" : "rgba(255,255,255,0.6)",
            color: "var(--text-main)",
            background: activePump === pumpId ? "rgba(99, 102, 241, 0.3)" : "rgba(255,255,255,0.1)",
          },
        }}
      >
        <Icon sx={{ fontSize: 32 }} />
      </Paper>
    </Tooltip>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "400px",
        position: "relative",
      }}
    >
      {/* Title */}
      <Typography
        className="tech-text"
        sx={{
          fontSize: "1.2rem",
          fontWeight: 700,
          color: "var(--accent)",
          mb: 4,
          letterSpacing: "2px",
        }}
      >
        MANUAL PUMP CONTROL
      </Typography>

      {/* Decorative circle */}
      <Box
        sx={{
          position: "absolute",
          width: 200,
          height: 200,
          border: "1px dashed rgba(255,255,255,0.15)",
          borderRadius: "50%",
          animation: "rotate 20s linear infinite",
        }}
      />

      {/* D-Pad Layout */}
      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Box mb={2} display="flex" justifyContent="center">
          <ControlBtn pumpId={1} icon={KeyboardArrowUpIcon} label="PUMP 1" />
        </Box>
        <Box display="flex" gap={2} alignItems="center">
          <ControlBtn pumpId={4} icon={KeyboardArrowLeftIcon} label="PUMP 4" />
          <Box
            className="glass-card"
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.05)",
              color: "rgba(255,255,255,0.8)",
              border: "1px solid rgba(255,255,255,0.3)",
              boxShadow: "inset 0 0 20px rgba(0,0,0,0.5)",
            }}
          >
            <AdjustIcon sx={{ fontSize: 40 }} />
          </Box>
          <ControlBtn pumpId={2} icon={KeyboardArrowRightIcon} label="PUMP 2" />
        </Box>
        <Box mt={2} display="flex" justifyContent="center">
          <ControlBtn pumpId={3} icon={KeyboardArrowDownIcon} label="PUMP 3" />
        </Box>
      </Box>

      {/* Status indicators */}
      <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
        {[1, 2, 3, 4].map((id) => (
          <Box
            key={id}
            sx={{
              p: 1.5,
              textAlign: "center",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "12px",
              background: activePump === id ? "rgba(99, 102, 241, 0.2)" : "rgba(255,255,255,0.03)",
              transition: "all 0.3s ease",
            }}
          >
            <Typography className="tech-text" sx={{ fontSize: "0.7rem", color: "var(--text-secondary)", fontWeight: 700 }}>
              P{id}
            </Typography>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: activePump === id ? "var(--secondary)" : "var(--success)",
                boxShadow: activePump === id ? "0 0 8px var(--secondary)" : "0 0 8px var(--success)",
                mx: "auto",
                mt: 0.5,
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};
