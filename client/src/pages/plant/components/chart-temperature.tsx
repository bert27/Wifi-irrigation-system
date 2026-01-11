import React from 'react';
import ReactECharts from 'echarts-for-react';

export const ChartTemperature: React.FC = () => {
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const tempData = [22, 24, 21, 25, 26, 23, 22];

    const option = {
        grid: {
            top: 25,
            bottom: 0,
            left: 0,
            right: 0,
            containLabel: true
        },
        tooltip: {
            trigger: 'axis',
            formatter: '{b}: {c}°C',
            backgroundColor: '#1D252D',
            textStyle: {
                color: '#fff'
            },
            borderColor: 'var(--accent)'
        },
        xAxis: {
            type: 'category',
            data: days,
            boundaryGap: false,
            axisLine: { 
                show: true,
                lineStyle: {
                    color: 'rgba(255,255,255,0.2)'
                }
            },
            axisTick: { show: false },
            splitLine: { show: false },
            axisLabel: {
                show: true,
                color: 'white',
                fontFamily: 'var(--font-tech)',
                interval: 0,
                rotate: 0,
                fontSize: 10
            }
        },
        yAxis: {
            type: 'value',
            show: true,
            splitLine: { 
                show: true,
                lineStyle: {
                    color: 'rgba(255,255,255,0.05)'
                }
            },
            axisLabel: {
                color: 'white',
                fontFamily: 'var(--font-tech)',
                formatter: '{value}°',
                fontSize: 10
            },
            axisLine: { show: false }
        },
        series: [{
            data: tempData,
            type: 'line',
            smooth: true,
            symbol: 'none',
            lineStyle: {
                width: 0
            },
            itemStyle: {
                color: 'var(--accent)'
            },
            label: {
                show: true,
                position: 'top',
                formatter: '{c}°C',
                color: 'var(--accent)',
                fontSize: 10,
                fontFamily: 'var(--font-tech)'
            },
            areaStyle: {
                opacity: 0.5,
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: '#0AB2D5'
                    }, {
                        offset: 1, color: 'rgba(0, 245, 212, 0.1)'
                    }]
                }
            }
        }]
    };

    return (
        <ReactECharts 
            option={option} 
            style={{ height: '200px', width: '100%' }}
            theme="dark"
        />
    );
};
