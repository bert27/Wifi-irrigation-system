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
      <Box component="div" sx={{ marginRight: "1em",fontWeight: "bold" }}>
        Message from ESP32:
      </Box>

      <Box component="div" sx={{ marginRight: "1em" }}>
        Jostick: {message.jostickDirection}
      </Box>
      <Box component="div" sx={{ marginRight: "1em" }}>
        Giroscopio: {message.giroscope}
      </Box>
      {message.giroscopeValues && (
        <Box component="div">
          <Box component="div">X: {message.giroscopeValues[0]}</Box>
          <Box component="div">Y: {message.giroscopeValues[1]}</Box>
        </Box>
      )}
    </Box>
  );
};
