import { ResponseWebSocketInterface } from "../../car-page";

interface ConsoleComponentProps {
  message: ResponseWebSocketInterface;
}
export const ConsoleComponent = (props: ConsoleComponentProps) => {
  const { message } = props;
  return (
    <div
      style={{
        background: "black",
        color: "white",
        padding: "1em",
        marginBottom: "0.4em",
      }}
    >
      Message from ESP8266: 
      <div>Jostick: {message.jostickDirection}</div>
      <div>Giroscopio: {message.giroscope}</div>
      <div>X: {message.giroscopeValues[0]}</div>
      <div>Y: {message.giroscopeValues[1]}</div>
    </div>
  );
};
