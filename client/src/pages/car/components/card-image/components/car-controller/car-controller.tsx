import React, { useState } from "react";
import { Box, Typography, Paper, Tooltip, Grid } from "@mui/material";
import { ResponseWebSocketInterface } from "@/pages/car/models/robot-model";
import { robotService } from "@/services/robot.service";
import { SliderLineComponent } from "@/pages/car/components/sub-components/slider";
import { InputNumber } from "@/pages/car/components/sub-components/input-number";

// Icons
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import AdjustIcon from '@mui/icons-material/Adjust';
import SpeedIcon from '@mui/icons-material/Speed';
import TimerIcon from '@mui/icons-material/Timer';

interface CardControllerProps {
  recibedMessage: ResponseWebSocketInterface;
}

export const CardController = ({ recibedMessage }: CardControllerProps) => {
  const [settings, setSettings] = useState({
    time: 1000,
    pwm: 140,
  });

  const handleDirection = async (name: string) => {
    try {
      await robotService.sendOutputRobotUI({ name });
    } catch (e) {
      console.error(e);
    }
  };

  const isActive = (dir: string) => recibedMessage.jostickDirection === dir;

  const ControlBtn = ({ dir, icon: Icon, label }: { dir: string; icon: any; label: string }) => (
    <Tooltip title={label} arrow placement="top">
      <Paper
        onClick={() => handleDirection(dir)}
        className="glass-card"
        sx={{
          width: 64,
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          background: isActive(dir) ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.05)',
          color: isActive(dir) ? 'var(--secondary)' : 'rgba(255,255,255,0.8)',
          border: isActive(dir) ? '2px solid var(--secondary)' : '1px solid rgba(255,255,255,0.25)',
          boxShadow: isActive(dir) ? '0 0 20px var(--secondary-glow)' : 'inset 0 0 10px rgba(0,0,0,0.3)',
          transition: 'all 0.2s ease',
          '&:active': { transform: 'scale(0.9)' },
          '&:hover': { 
            borderColor: isActive(dir) ? 'var(--secondary)' : 'rgba(255,255,255,0.6)',
            color: 'var(--text-main)',
            background: isActive(dir) ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255,255,255,0.1)'
          }
        }}
      >
        <Icon sx={{ fontSize: 32 }} />
      </Paper>
    </Tooltip>
  );

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Settings Panel */}
      {/* Settings & Status Panel (Vertical Stack) */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2, background: 'rgba(255,255,255,0.05)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
        
        {/* Pulse Duration */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box display="flex" alignItems="center" gap={1}>
            <TimerIcon sx={{ fontSize: 16, color: 'var(--accent)' }} />
            <Typography className="tech-text" sx={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>PULSE DURATION</Typography>
          </Box>
          <Box width="60%">
            <InputNumber
              value={settings.time}
              onChange={(v) => setSettings(s => ({ ...s, time: v }))}
              label=""
            />
          </Box>
        </Box>

        {/* Throttle Output */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box display="flex" alignItems="center" gap={1}>
            <SpeedIcon sx={{ fontSize: 16, color: 'var(--accent)' }} />
            <Typography className="tech-text" sx={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>THROTTLE</Typography>
          </Box>
          <Box width="60%">
            <SliderLineComponent
              onChangePwmValue={(v) => setSettings(s => ({ ...s, pwm: v }))}
              valuePwm={settings.pwm}
              label=""
            />
          </Box>
        </Box>

        {/* Status Terminal */}
        <Box sx={{ 
          mt: 1, 
          p: 1.5, 
          background: '#050505', 
          borderRadius: '4px', 
          border: '1px solid var(--secondary)',
          fontFamily: '"Fira Code", monospace',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 0 10px rgba(0, 255, 0, 0.1)'
        }}>
           <Box 
             sx={{ 
               position: 'absolute', 
               top: 0, 
               left: 0, 
               right: 0, 
               height: '2px', 
               background: 'rgba(0, 255, 0, 0.3)',
               boxShadow: '0 0 5px var(--secondary)'
             }} 
           />
           <Typography sx={{ 
             fontFamily: 'monospace', 
             fontSize: '0.7rem', 
             color: 'var(--secondary)', 
             fontWeight: 700,
             letterSpacing: '1px',
             textTransform: 'uppercase'
           }}>
             {`> CMD: `}
             <span style={{ color: '#fff' }}>{recibedMessage.jostickDirection || 'IDLE'}</span>
             <span className="blink">_</span>
           </Typography>
        </Box>
      </Box>

      {/* Main Control Area (Side-by-Side) */}
      <Box sx={{ flex: 1, display: 'flex', gap: 4, alignItems: 'center', minHeight: 0 }}>
        
        {/* LEFT: Wheel/Status Indicators (Vertical) */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 2,
          justifyContent: 'center',
          width: '80px'
        }}>
          {['FL', 'FR', 'RL', 'RR'].map(wheel => (
             <Box key={wheel} sx={{ 
               p: 1.5, 
               textAlign: 'center', 
               border: '1px solid rgba(255,255,255,0.15)', 
               borderRadius: '12px',
               background: 'rgba(255,255,255,0.03)',
               display: 'flex',
               flexDirection: 'column',
               alignItems: 'center',
               gap: 0.5,
               transition: 'all 0.3s ease',
               '&:hover': {
                 background: 'rgba(255,255,255,0.08)',
                 borderColor: 'var(--accent)'
               }
             }}>
                <Typography className="tech-text" sx={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 700 }}>{wheel}</Typography>
                <Box sx={{ 
                  width: 8, 
                  height: 8, 
                  borderRadius: '50%', 
                  background: 'var(--success)', 
                  boxShadow: '0 0 8px var(--success)' 
                }} />
             </Box>
          ))}
        </Box>
        
        {/* RIGHT: D-PAD Visualization */}
        <Box sx={{ flex: 1, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          {/* Connection Lines Decor */}
          <Box sx={{ 
            position: 'absolute', 
            width: 160, 
            height: 160, 
            border: '1px dashed rgba(255,255,255,0.15)', 
            borderRadius: '50%',
            animation: 'rotate 20s linear infinite'
          }} />
          
          {/* Controls Layout */}
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box mb={2} display="flex" justifyContent="center">
              <ControlBtn dir="Arriba" icon={KeyboardArrowUpIcon} label="FORWARD" />
            </Box>
            <Box display="flex" gap={2} alignItems="center">
              <ControlBtn dir="Izquierda" icon={KeyboardArrowLeftIcon} label="TURN LEFT" />
              <Box 
                className="glass-card"
                onClick={() => handleDirection("CENTER")}
                sx={{ 
                  width: 80, 
                  height: 80, 
                  borderRadius: '50%',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  cursor: 'pointer',
                  background: 'rgba(255,255,255,0.05)',
                  color: isActive("CENTER") ? 'var(--primary)' : 'rgba(255,255,255,0.8)',
                  border: isActive("CENTER") ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.3)',
                  boxShadow: isActive("CENTER") ? '0 0 30px var(--primary-glow)' : 'inset 0 0 20px rgba(0,0,0,0.5)',
                  transition: 'all 0.3s ease',
                  '&:hover': { borderColor: 'var(--primary)', color: 'var(--primary)' }
                }}
              >
                <AdjustIcon sx={{ fontSize: 40 }} />
              </Box>
              <ControlBtn dir="Derecha" icon={KeyboardArrowRightIcon} label="TURN RIGHT" />
            </Box>
            <Box mt={2} display="flex" justifyContent="center">
              <ControlBtn dir="Abajo" icon={KeyboardArrowDownIcon} label="REVERSE" />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
