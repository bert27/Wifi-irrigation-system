import { Box, Paper, Typography, SxProps, Theme } from "@mui/material";
import PaletteIcon from '@mui/icons-material/Palette';
import { HexColorPicker } from "react-colorful";
import { useTranslation } from "react-i18next";
import "./styles.css";

interface RgbCardProps {
  color: string;
  handleColorChange: (color: string) => void;
  panelStyle: any;
  sx?: SxProps<Theme>;
  id?: string;
}

export const RgbCard: React.FC<RgbCardProps> = ({ color, handleColorChange, panelStyle, sx, id }) => {
  const { t } = useTranslation();
  return (
    <Paper
      id={id || "rgb-card"}
      className="glass-effect rgb-card-container"
      sx={{
        ...panelStyle,
        p: { xs: 1.5, md: 2 },
        ...sx
      }}
    >
      {/* Ambient Glow Background */}
      <Box
        className="ambient-glow"
        sx={{
          background: `radial-gradient(circle at 50% 50%, ${color}40 0%, transparent 70%)`
        }}
      />

      {/* Header */}
      <Box className="rgb-header">
        <PaletteIcon sx={{ fontSize: 16, color: 'var(--primary)', filter: 'drop-shadow(0 0 5px var(--primary))' }} />
        <Typography variant="caption" className="tech-text" sx={{ color: 'var(--text-muted)', fontSize: '0.75rem', letterSpacing: '1px' }}>
          {t('car.rgb.title')}
        </Typography>
      </Box>

      {/* Main Content Area */}
      <Box className="main-content">

        {/* Top Row: Hex Code + Color Viewer */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
          <Box className="hex-display-container">
            <Typography className="tech-text hex-text" sx={{
              textShadow: `0 0 10px ${color}`,
              fontSize: { xs: '0.8rem', md: '0.9rem' }
            }}>
              {color.toUpperCase()}
            </Typography>
          </Box>

          <Box
            id="rgb-color-display"
            className="color-viewer"
            sx={{
              background: color,
              width: { xs: '25px', md: '30px' },
              height: { xs: '25px', md: '30px' },
              boxShadow: `
                    inset 0 0 5px rgba(255,255,255,0.4), 
                    0 0 10px ${color}44
                  `
            }}
          />
        </Box>

        {/* Bottom: Wide Picker */}
        <Box
          id="rgb-color-picker"
          className="color-picker-container"
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
