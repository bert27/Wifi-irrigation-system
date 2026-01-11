import React, { useState } from "react";
import { Grid, Box, Typography, Paper, Button, Slider } from "@mui/material";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";
import { PumpConfig } from "../models/drinks-model";

interface PumpConfigPanelProps {
  pumps: PumpConfig[];
  onUpdatePump: (id: number, data: { pwm: number; timeCalibration: number }) => void;
}

export const PumpConfigPanel: React.FC<PumpConfigPanelProps> = ({ pumps, onUpdatePump }) => {
  return (
    <Grid container spacing={3} sx={{ mt: 2 }}>
      {pumps.map((pump) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={pump.id}>
          <PumpCard pump={pump} onUpdate={onUpdatePump} />
        </Grid>
      ))}
    </Grid>
  );
};

const PumpCard: React.FC<{ pump: PumpConfig; onUpdate: (id: number, data: any) => void }> = ({
  pump,
  onUpdate,
}) => {
  const [pwm, setPwm] = useState(pump.pwm);
  const [timeCalibration, setTimeCalibration] = useState(pump.timeCalibration);

  const handleToggle = () => {
    const newPwm = pwm > 0 ? 0 : 255;
    setPwm(newPwm);
    onUpdate(pump.id, { pwm: newPwm, timeCalibration });
  };

  const handleSave = () => {
    onUpdate(pump.id, { pwm, timeCalibration });
  };

  return (
    <Paper
      className="glass-effect"
      sx={{
        p: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography className="tech-text" sx={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--accent)" }}>
            {pump.title}
          </Typography>
          <Typography sx={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{pump.liquid}</Typography>
        </Box>
        <Button
          variant="contained"
          size="small"
          onClick={handleToggle}
          sx={{
            background: pwm > 0 ? "linear-gradient(135deg, var(--success), var(--accent))" : "rgba(255,255,255,0.1)",
            minWidth: "auto",
            p: 1,
          }}
        >
          {pwm === 0 ? <WaterDropOutlinedIcon /> : <WaterDropIcon />}
        </Button>
      </Box>

      {/* PWM Slider */}
      <Box>
        <Typography className="tech-text" sx={{ fontSize: "0.7rem", color: "var(--text-muted)", mb: 1 }}>
          PWM: {pwm}
        </Typography>
        <Slider
          value={pwm}
          onChange={(_e: Event, v: number | number[]) => setPwm(v as number)}
          min={0}
          max={255}
          sx={{
            "& .MuiSlider-thumb": {
              background: "var(--primary)",
              boxShadow: "0 0 10px var(--primary-glow)",
            },
            "& .MuiSlider-track": {
              background: "linear-gradient(90deg, var(--primary), var(--accent))",
            },
            "& .MuiSlider-rail": {
              background: "rgba(255,255,255,0.1)",
            },
          }}
        />
      </Box>

      {/* Time Calibration */}
      <Box>
        <Typography className="tech-text" sx={{ fontSize: "0.7rem", color: "var(--text-muted)", mb: 1 }}>
          TIME: {timeCalibration}s
        </Typography>
        <Slider
          value={timeCalibration}
          onChange={(_e: Event, v: number | number[]) => setTimeCalibration(v as number)}
          min={0}
          max={20}
          sx={{
            "& .MuiSlider-thumb": {
              background: "var(--accent)",
              boxShadow: "0 0 10px var(--accent-glow)",
            },
            "& .MuiSlider-track": {
              background: "var(--accent)",
            },
            "& .MuiSlider-rail": {
              background: "rgba(255,255,255,0.1)",
            },
          }}
        />
      </Box>

      {/* Save Button */}
      <Button
        variant="contained"
        onClick={handleSave}
        sx={{
          background: "linear-gradient(90deg, var(--primary), var(--accent))",
          fontWeight: 700,
          letterSpacing: "1px",
        }}
      >
        SET
      </Button>
    </Paper>
  );
};
