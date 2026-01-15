import { Box } from "@mui/material";
import { IRemoteControlReceiveStatus } from "@/pages/car/models/model";
import { ButtonImage } from "./button-image";
export interface ArrowControlProps {
  data: {
    name: string;
    image: string;
  };
  recibedMessage: IRemoteControlReceiveStatus;
  id: string;
  handleDirection: (name: string) => Promise<void>;
}
export const ArrowControl = (props: ArrowControlProps) => {
  const { data, recibedMessage, id, handleDirection } = props;
  const { joystickDirection } = recibedMessage;

  return (
    <>
      {joystickDirection === id ? (
        <div style={{ background: "blue" }}>
          <ButtonImage data={data} handleDirection={handleDirection} />
        </div>
      ) : (
        <Box component="div">
          <ButtonImage data={data} handleDirection={handleDirection} />
        </Box>
      )}
    </>
  );
};
