import { Box, Typography, Grid, Paper, Slider } from "@mui/material";
import { useState } from "react";
import { robotService } from "@/pages/car/services/robot.service";

export interface OutputDataInterface {
  name: string;
  colorLabel: string;
  pin: number;
  state: number;
}

export const CardOutputs = ({ globalPwm, lastCmd }: { globalPwm: number, lastCmd?: string }) => {
  const [outputs, setOutputs] = useState<OutputDataInterface[]>([
    { name: "FRONT LEFT", colorLabel: "black", pin: 25, state: 0 },
    { name: "FRONT RIGHT", colorLabel: "black", pin: 4, state: 0 },
    { name: "REAR LEFT", colorLabel: "yellow", pin: 14, state: 0 },
    { name: "REAR RIGHT", colorLabel: "yellow", pin: 19, state: 0 },
    { name: "FL REVERSE", colorLabel: "blue", pin: 26, state: 0 },
    { name: "FR REVERSE", colorLabel: "blue", pin: 17, state: 0 },
    { name: "RL REVERSE", colorLabel: "white", pin: 27, state: 0 },
    { name: "RR REVERSE", colorLabel: "white", pin: 21, state: 0 },
  ]);

  const handleToggle = async (index: number) => {
    const newOutputs = [...outputs];
    const target = newOutputs[index];

    // Toggle state
    target.state = target.state === 0 ? globalPwm : 0;

    setOutputs(newOutputs);
    try {
      await robotService.sendDataOutputSelectedToServer(target);
    } catch (e) {
      console.error(e);
    }
  };

  const getColorForLabel = (label: string) => {
    const colorMap: Record<string, string> = {
      black: '#10b981',
      yellow: '#fbbf24',
      blue: '#3b82f6',
      white: '#B650EF'
    };
    return colorMap[label] || '#10b981';
  };

  return (
    <Box id="card-outputs" sx={{ width: '100%', height: '100%', overflowY: 'auto', minHeight: 0 }}>
      {/* Defines a Cyberpunk styled switch locally */}
      <style>
        {`
          .cyber-switch {
            position: relative;
            display: inline-block;
            width: 50px;
            height: 24px;
          }
          .cyber-switch input {
            opacity: 0;
            width: 0;
            height: 0;
          }
          .cyber-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0,0,0,0.5);
            border: 1px solid var(--glass-border);
            clip-path: polygon(10% 0, 100% 0, 100% 100%, 0 100%, 0 100%, 0 25%);
            transition: .4s;
            box-shadow: inset 0 0 10px rgba(0,0,0,0.8);
          }
          .cyber-slider:before {
            position: absolute;
            content: "";
            height: 16px;
            width: 16px;
            left: 4px;
            bottom: 3px;
            background-color: var(--text-muted);
            clip-path: polygon(0 0, 100% 0, 100% 70%, 70% 100%, 0 100%);
            transition: .4s;
            box-shadow: 0 0 5px rgba(0,0,0,0.5);
          }
          .cyber-switch input:checked + .cyber-slider[data-color="black"] {
            background-color: rgba(16, 185, 129, 0.1);
            border-color: #10b981;
            box-shadow: 0 0 10px rgba(16, 185, 129, 0.3);
          }
          .cyber-switch input:checked + .cyber-slider[data-color="black"]:before {
            transform: translateX(24px);
            background-color: #10b981;
            box-shadow: 0 0 10px #10b981;
          }
          .cyber-switch input:checked + .cyber-slider[data-color="yellow"] {
            background-color: rgba(251, 191, 36, 0.1);
            border-color: #fbbf24;
            box-shadow: 0 0 10px rgba(251, 191, 36, 0.3);
          }
          .cyber-switch input:checked + .cyber-slider[data-color="yellow"]:before {
            transform: translateX(24px);
            background-color: #fbbf24;
            box-shadow: 0 0 10px #fbbf24;
          }
          .cyber-switch input:checked + .cyber-slider[data-color="blue"] {
            background-color: rgba(59, 130, 246, 0.1);
            border-color: #3b82f6;
            box-shadow: 0 0 10px rgba(59, 130, 246, 0.3);
          }
          .cyber-switch input:checked + .cyber-slider[data-color="blue"]:before {
            transform: translateX(24px);
            background-color: #3b82f6;
            box-shadow: 0 0 10px #3b82f6;
          }
          .cyber-switch input:checked + .cyber-slider[data-color="white"] {
            background-color: rgba(182, 80, 239, 0.1);
            border-color: #B650EF;
            box-shadow: 0 0 10px rgba(182, 80, 239, 0.3);
          }
          .cyber-switch input:checked + .cyber-slider[data-color="white"]:before {
            transform: translateX(24px);
            background-color: #B650EF;
            box-shadow: 0 0 10px #B650EF;
          }
        `}
      </style>
      <Grid container spacing={1}>
        {outputs.map((item, index) => (
          <Grid size={{ xs: 12, sm: 6, lg: 6 }} key={index}>
            <Paper
              id={`card-output-pin-${item.pin}`}
              className="glass-card"
              sx={{
                p: 1.5,
                border: item.state ? `1px solid ${getColorForLabel(item.colorLabel)}` : '1px solid var(--glass-border)',
                background: item.state ? `${getColorForLabel(item.colorLabel)}10` : 'transparent',
                transition: 'all 0.3s ease',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Decorative corner */}
              <Box sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '10px',
                height: '10px',
                borderTop: item.state ? `2px solid ${getColorForLabel(item.colorLabel)}` : 'none',
                borderRight: item.state ? `2px solid ${getColorForLabel(item.colorLabel)}` : 'none',
                opacity: 0.5
              }} />

              <Box>
                <Typography className="tech-text" sx={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                  PIN {item.pin}
                </Typography>
                <Typography variant="body2" className="tech-text" sx={{ fontWeight: 700, fontSize: '0.8rem', color: item.state ? getColorForLabel(item.colorLabel) : 'var(--text-main)' }}>
                  {item.name}
                </Typography>
              </Box>

              <label className="cyber-switch">
                <input type="checkbox" checked={item.state > 0} onChange={() => handleToggle(index)} />
                <span className="cyber-slider" data-color={item.colorLabel}></span>
              </label>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
