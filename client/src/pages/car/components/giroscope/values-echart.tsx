import Chart from "echarts-for-react";

interface DataInterface {
  title: string;
  value: number
}
interface ValuesEchartProps {
  data: DataInterface
}
export const ValuesEchart = (props: ValuesEchartProps) => {
  const {data}=props;
  const option2 = {
    series: [
      {
        type: "gauge",
        startAngle: 180,
        endAngle: 0,
        center: ["50%", "85%"],
        radius: "100%",
        min: 0,
        max: 180,
        
        splitNumber: 8,
        axisLine: {
          lineStyle: {
            width: 6,
            color: [
              [0.5, "#FF6E76"],
            //  [0.5, "#FDDD60"],
           //   [0.75, "#58D9F9"],
              [1, "#7CFFB2"],
            ],
          },
        },
        pointer: {
          icon: "path://M12.8,0.7l12,40.1H0.7L12.8,0.7z",
          length: "12%",
          width: 20,
          offsetCenter: [0, "-60%"],
          itemStyle: {
            color: "auto",
          },
        },
        axisTick: {
          length: 12,
          lineStyle: {
            color: "auto",
            width: 2,
          },
        },
        splitLine: {
          length: 20,
          lineStyle: {
            color: "auto",
            width: 5,
          },
        },
        axisLabel: {
          color: "#464646",
          fontSize: 20,
          distance: -60,
          rotate: "tangential",
          formatter: function (value: number) {
           // console.log("value",value)
            if (value > 0 && value < 40) {
              return "Izquierda";
            }
            if (value > 150 && value < 180) {
              return "Derecha";
            }
            return "";
          },
        },
        title: {
          offsetCenter: [0, "-10%"],
          fontSize: 20,
        },
        detail: {
          fontSize: 30,
          offsetCenter: [0, "-35%"],
          valueAnimation: true,
          formatter: function (value: number) {
           // console.log("value33",value)
            return value;
          },
          color: "inherit",
        },
        data: [
          {
            value: data.value,
            name: data.title,
          },
        ],
     
      },
    ],
    title: {
      text: "Giros del giroscopio",
      subtext: "Valores",
      left: "center",
      top: 40,

    },
  };
  const option3 = {
    series: [
      {
        type: "gauge",
        axisLine: {
          lineStyle: {
            width: 30,
            color: [
              [0.3, "#67e0e3"],
              [0.7, "#37a2da"],
              [1, "#fd666d"],
            ],
          },
        },
        pointer: {
          itemStyle: {
            color: "auto",
          },
        },
        axisTick: {
          distance: -30,
          length: 8,
          lineStyle: {
            color: "#fff",
            width: 2,
          },
        },
        splitLine: {
          distance: -30,
          length: 30,
          lineStyle: {
            color: "#fff",
            width: 4,
          },
        },
        axisLabel: {
          color: "inherit",
          distance: 40,
          fontSize: 20,
        },
        detail: {
          valueAnimation: true,
          formatter: "{value} Grados",
          color: "inherit",
        },
        data: [
          {
            value: 70,
          },
        ],
        max: 180,
        radius: "80%",
        center: ["20%", "50%"],
      },
    ],
    title: {
      text: "Giros del giroscopio",
      subtext: "Valores",
      left: "center",
      top: 500
    },
  };

  return <Chart option={option2} theme={"dark"} style={{ height: "300px",width: "30%",marginLeft: "30px" }} />;
};
