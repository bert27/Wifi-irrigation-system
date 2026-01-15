import { Box, Typography } from "@mui/material";

interface DataInterface {
  title: string;
  value: number;
}
interface ValuesEchartProps {
  data: DataInterface;
}

export const ValuesEchart = (props: ValuesEchartProps) => {
  const { data } = props;

  if (!data) return null;

  // Simple Gauge calculations
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(data.value, 0), 180);
  // Map 0-180 to a portion of the circle (half circle)
  const offset = circumference - ((progress / 180) * (circumference / 2));

  return (
    <Box sx={{ width: '100%', height: '100%', minHeight: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      {/* SVG Gauge */}
      <svg width="120" height="80" viewBox="0 0 120 70">
        {/* Background Arc */}
        <path d="M 10 60 A 50 50 0 0 1 110 60" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" strokeLinecap="round" />

        {/* Progress Arc */}
        <path
          d="M 10 60 A 50 50 0 0 1 110 60"
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${circumference / 2} ${circumference}`}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />

        {/* Gradient Definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#d946ef" />
          </linearGradient>
        </defs>
      </svg>

      {/* Value Text */}
      <Box sx={{ position: 'absolute', bottom: '15%', textAlign: 'center' }}>
        <Typography sx={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.5rem', lineHeight: 1 }}>
          {data.value.toFixed(0)}°
        </Typography>
        <Typography sx={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase' }}>
          {data.title}
        </Typography>
      </Box>
    </Box>
  );
};
