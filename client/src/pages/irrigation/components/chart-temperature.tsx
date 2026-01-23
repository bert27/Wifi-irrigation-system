import React from 'react';
import ReactECharts from 'echarts-for-react';

interface ChartTemperatureProps {
    isPumpActive?: boolean;
}

export const ChartTemperature: React.FC<ChartTemperatureProps> = ({ isPumpActive = false }) => {
    const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const tempData = [22, 24, 21, 25, 26, 23, 22];

    // Mock historical pump data, last element is current state
    const pumpData = [0, 1, 0, 0, 1, 0, isPumpActive ? 1 : 0];

    const option = {
        grid: {
            top: 40,
            bottom: 20,
            left: 10,
            right: 10,
            containLabel: true
        },
        legend: {
            show: true,
            textStyle: { color: '#fff', fontSize: 10 },
            top: 0
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: '#1D252D',
            textStyle: { color: '#fff' },
            borderColor: 'var(--accent)',
            formatter: (params: any) => {
                let res = `${params[0].name}<br/>`;
                params.forEach((item: any) => {
                    const value = item.seriesName === 'Bomba'
                        ? (item.value ? 'ACTIVA' : 'INACTIVA')
                        : `${item.value}°C`;
                    res += `${item.marker} ${item.seriesName}: <b>${value}</b><br/>`;
                });
                return res;
            }
        },
        xAxis: {
            type: 'category',
            data: days,
            boundaryGap: true,
            axisLine: {
                show: true,
                lineStyle: { color: 'rgba(255,255,255,0.2)' }
            },
            axisLabel: { color: 'white', fontSize: 10 }
        },
        yAxis: [
            {
                type: 'value',
                name: 'Temp',
                min: 15,
                max: 35,
                splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
                axisLabel: { color: 'white', fontSize: 10, formatter: '{value}°' }
            },
            {
                type: 'value',
                name: 'Bomba',
                min: 0,
                max: 1,
                interval: 1,
                show: false, // Hide the 0-1 axis to keep it clean
                splitLine: { show: false }
            }
        ],
        series: [
            {
                name: 'Temperatura',
                data: tempData,
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 6,
                lineStyle: { width: 3, color: 'var(--accent)' },
                itemStyle: { color: 'var(--accent)' },
                areaStyle: {
                    opacity: 0.2,
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: '#0AB2D5' },
                            { offset: 1, color: 'transparent' }
                        ]
                    }
                }
            },
            {
                name: 'Bomba',
                type: 'bar',
                yAxisIndex: 1,
                data: pumpData,
                barWidth: '40%',
                itemStyle: {
                    color: 'rgba(0, 245, 212, 0.3)',
                    borderRadius: [4, 4, 0, 0]
                },
                emphasis: {
                    itemStyle: {
                        color: 'rgba(0, 245, 212, 0.6)'
                    }
                }
            }
        ]
    };

    return (
        <ReactECharts
            option={option}
            style={{ height: '200px', width: '100%' }}
            theme="dark"
        />
    );
};
