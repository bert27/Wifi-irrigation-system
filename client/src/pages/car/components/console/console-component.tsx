import { ResponseWebSocketInterface } from "../../car-page";
import { Box } from "@mui/material";

interface ConsoleComponentProps {
  message: ResponseWebSocketInterface;
}
export const ConsoleComponent = (props: ConsoleComponentProps) => {
  const { message } = props;
  return (
    <Box
      component="div"
      sx={{
        display: "flex",
        background: "black",
        color: "white",
        padding: "0.5em",

        width: "100%",
      }}
    >
      Message from ESP8266:
      <Box component="div">Jostick: {message.jostickDirection}</Box>
      <Box component="div">Giroscopio: {message.giroscope}</Box>
      <Box component="div">X: {message.giroscopeValues[0]}</Box>
      <Box component="div">Y: {message.giroscopeValues[1]}</Box>
    </Box>
  );
};
