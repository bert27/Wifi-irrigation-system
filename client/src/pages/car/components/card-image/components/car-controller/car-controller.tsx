import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { IRemoteControlReceiveStatus } from "@/pages/car/models/model";
import { SliderLineComponent } from "@/pages/car/components/sub-components/slider";
import { InputNumber } from "@/pages/car/components/sub-components/input-number";

// Icons
import SpeedIcon from '@mui/icons-material/Speed';
import TimerIcon from '@mui/icons-material/Timer';

import { JostickController } from "@/components/jostick-controller/jostick-controller";

interface CardControllerProps {
  recibedMessage: IRemoteControlReceiveStatus;
  lastCmd?: string;
  onDirection: (name: string) => void;
}

export const CardController = ({ recibedMessage, lastCmd, onDirection }: CardControllerProps) => {
  const [settings, setSettings] = useState({
    time: 1000,
    pwm: 140,
  });

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
            id="seria-display"
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
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {`> CMD: `}
            <span style={{ color: '#fff' }}>
              {lastCmd || (recibedMessage.buttonJostick === 'off' ? 'CENTER' : recibedMessage.joystickDirection) || 'IDLE'}
            </span>
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
        <JostickController id="jostick-controller" recibedMessage={recibedMessage} onDirection={onDirection} />
      </Box>
    </Box>
  );
};
