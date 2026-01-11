import Chart from "echarts-for-react";
import { Box } from "@mui/material";

interface DataInterface {
  title: string;
  value: number;
}
interface ValuesEchartProps {
  data: DataInterface;
}
export const ValuesEchart = (props: ValuesEchartProps) => {
  const { data } = props;

  const animationDuration = 500;
  
  const option = {
    backgroundColor: 'transparent',
    series: [
      {
        type: "gauge",
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 180,
        splitNumber: 5,
        radius: '120%', // Increased radius to fill space
        center: ['50%', '85%'], // Moved down
        axisLine: {
          lineStyle: {
            width: 8,
            color: [
              [0.3, "#06b6d4"],  // Accent
              [0.7, "#6366f1"],  // Primary
              [1, "#d946ef"]     // Secondary
            ]
          }
        },
        pointer: {
          icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
          length: '12%',
          width: 8,
          offsetCenter: [0, '-55%'],
          itemStyle: {
            color: 'inherit',
            shadowBlur: 10,
            shadowColor: 'rgba(0,0,0,0.5)'
          }
        },
        axisTick: { length: 8, lineStyle: { color: 'rgba(255,255,255,0.2)', width: 1 } },
        splitLine: { length: 12, lineStyle: { color: 'rgba(255,255,255,0.4)', width: 2 } },
        axisLabel: { show: false }, // Hidden for compactness
        title: {
          offsetCenter: [0, '-30%'],
          fontSize: 10,
          color: '#64748b',
          fontWeight: 700,
          fontFamily: 'Space Grotesk'
        },
        detail: {
          fontSize: 18,
          offsetCenter: [0, '-5%'],
          valueAnimation: true,
          formatter: (val: number) => typeof val === 'number' ? val.toFixed(2) + '°' : val + '°',
          color: 'inherit',
          fontFamily: 'Space Grotesk',
          fontWeight: 800
        },
        data: [
          {
            value: data.value,
            name: data.title
          }
        ]
      }
    ]
  };

  return (
    <Box sx={{ width: '100%', height: '100%', minHeight: '100px', position: 'relative' }}>
       <Chart
        option={option}
        style={{ height: "100%", width: "100%" }}
        lazyUpdate={true}
        opts={{ renderer: 'svg' }}
      />
    </Box>
  );
};
