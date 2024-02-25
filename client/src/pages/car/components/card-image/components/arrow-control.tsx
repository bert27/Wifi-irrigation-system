import { Box } from "@mui/material";
import { ResponseWebSocketInterface } from "../../../car-page";
import { ButtonImage } from "./button-image";
export interface ArrowControlProps {
  data: {
    name: string;
    image: string;
  };
  recibedMessage: ResponseWebSocketInterface;
  id: string;
  handleDirection: (name: string) => Promise<void>;
}
export const ArrowControl = (props: ArrowControlProps) => {
  const { data, recibedMessage, id, handleDirection } = props;
  const { jostickDirection } = recibedMessage;

  return (
    <>
      {jostickDirection === id ? (
        <div style={{ background: "blue" }}>
          <ButtonImage data={data} handleDirection={handleDirection} />
        </div>
      ) : (
        <Box component="div">
          <ButtonImage data={data} handleDirection={handleDirection}/>
        </Box>
      )}
    </>
  );
};
