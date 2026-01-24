import { Box, Typography, Slider } from "@mui/material";

interface SliderLineProps {
  onChangePwmValue: (pwmTmp: number) => void;
  valuePwm: number;
  label?: string;
}

export const SliderLineComponent = ({
  onChangePwmValue,
  valuePwm,
  label = "PWM",
}: SliderLineProps) => {
  return (
    <Box sx={{ width: "100%" }}>
      {label && (
        <Typography variant="caption" className="tech-text" sx={{ color: 'var(--text-muted)' }}>
          {label}
        </Typography>
      )}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}>
        <Slider
          value={valuePwm}
          onChange={(_: Event, val: number | number[]) => onChangePwmValue(val as number)}
          min={0}
          max={255}
          valueLabelDisplay="auto"
          sx={{
            color: 'var(--primary)',
            height: 8,
            '& .MuiSlider-track': {
              border: 'none',
              background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
            },
            '& .MuiSlider-thumb': {
              height: 24,
              width: 24,
              backgroundColor: 'var(--text-main)',
              border: '2px solid var(--primary)',
              '&:focus, &:hover, &.Mui-active': {
                boxShadow: '0 0 0 8px rgba(99, 102, 241, 0.16)',
              },
              '&::before': {
                display: 'none',
              },
            },
            '& .MuiSlider-rail': {
              opacity: 0.3,
              backgroundColor: 'var(--text-muted)',
            },
          }}
        />
        <Typography 
          className="tech-text"
          sx={{ 
            color: 'var(--secondary)', 
            minWidth: 40, 
            textAlign: 'right', 
            fontWeight: 700 
          }}
        >
          {valuePwm}
        </Typography>
      </Box>
    </Box>
  );
};
