

import Chart from 'echarts-for-react';

export const ValuesEchart = () => {
  const option = {
    title: {
      text: 'Estadisticas App',
      subtext: 'Fotos',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 30, name: 'Proyectos' },
          { value: 400, name: 'Pagina edicion' },
          { value: 100, name: 'Stock' },
        ],
        emphasis: {
          itemStyle: {
            //   shadowBlur: 10,
            shadowOffsetX: 0,
            //shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };

  return <Chart option={option} theme={'dark'} />;
};
