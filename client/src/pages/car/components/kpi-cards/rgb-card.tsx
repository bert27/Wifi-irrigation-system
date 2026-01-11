import { Box, Paper, Typography, SxProps, Theme } from "@mui/material";
import PaletteIcon from '@mui/icons-material/Palette';
import { HexColorPicker } from "react-colorful";

interface RgbCardProps {
  color: string;
  handleColorChange: (color: string) => void;
  panelStyle: any;
  sx?: SxProps<Theme>;
  id?: string;
}

import { useTranslation } from "react-i18next";

export const RgbCard: React.FC<RgbCardProps> = ({ color, handleColorChange, panelStyle, sx, id }) => {
  const { t } = useTranslation();
  return (
    <Paper 
      id={id} 
      className="glass-effect" 
      sx={{ 
        ...panelStyle, 
        p: 2, 
        position: 'relative', 
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        ...sx
      }}
    >
        {/* Ambient Glow Background */}
        {/* Ambient Glow Background */}
        <Box sx={{ 
            position: 'absolute', 
            top: '-50%', 
            left: '-50%', 
            right: '-50%', 
            bottom: '-50%', 
            background: `radial-gradient(circle at 50% 50%, ${color}40 0%, transparent 70%)`,
            zIndex: 0,
            pointerEvents: 'none',
            transition: 'background 0.3s ease'
        }} />

        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, position: 'relative', zIndex: 10, mb: 0.5 }}>
            <PaletteIcon sx={{ fontSize: 16, color: 'var(--primary)', filter: 'drop-shadow(0 0 5px var(--primary))' }} />
            <Typography variant="caption" className="tech-text" sx={{ color: 'var(--text-muted)', fontSize: '0.75rem', letterSpacing: '1px' }}>
              {t('car.rgb.title')}
            </Typography>
        </Box>
        
        {/* Main Content Area */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          width: '100%', 
          flex: 1, 
          position: 'relative',
          zIndex: 10,
          gap: 1
        }}>
          
          {/* Top Left: Hex Code */}
          <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              alignSelf: 'flex-start'
          }}>
              <Typography className="tech-text" sx={{ 
                  color: '#fff', 
                  textShadow: `0 0 10px ${color}`,
                  fontWeight: 700, 
                  fontFamily: '"Fira Code", monospace', 
                  fontSize: '0.9rem',
                  letterSpacing: '1.2px'
              }}>
                  {color.toUpperCase()}
              </Typography>
          </Box>

          {/* Middle Left: Small Color Viewer */}
          <Box 
            id="rgb-color-display"
            sx={{ 
                width: '30px',
                height: '30px',
                borderRadius: '6px',
                background: color,
                boxShadow: `
                  inset 0 0 5px rgba(255,255,255,0.4), 
                  0 0 10px ${color}44
                `,
                border: '1px solid rgba(255,255,255,0.2)',
                alignSelf: 'flex-start',
                ml: 0.5 
            }} 
          />

          {/* Bottom: Wide Picker */}
          <Box 
            id="rgb-color-picker"
            sx={{ 
                width: '85%', 
                alignSelf: 'center',
                flex: 1, 
                minHeight: '150px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-end',
                mt: 0.5,
                '& .react-colorful': {
                    width: '100%',
                    height: '180px',
                    borderRadius: '8px'
                },
                '& .react-colorful__saturation': {
                    borderRadius: '8px 8px 0 0'
                },
                '& .react-colorful__hue': {
                    borderRadius: '0 0 8px 8px',
                    height: '16px'
                }
            }}
          >
            <HexColorPicker 
                color={color} 
                onChange={handleColorChange} 
            />
          </Box>
        </Box>
    </Paper>
  );
};
