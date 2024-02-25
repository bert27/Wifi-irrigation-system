import { IconButton } from "@mui/material";
import { robotService } from "../../../../../services/robot-service";

export interface ButtonImageProps {
  data: {
    name: string;
    image: string;
  };
  handleDirection: (name: string) => Promise<void>;
}
const sizeIcons = "4vw";

export const ButtonImage = (props: ButtonImageProps) => {
  const { data, handleDirection } = props;
  return (
    <IconButton onClick={() => handleDirection(data.name)}>
      <img
        style={{
          width: sizeIcons,
          height: sizeIcons,
        }}
        src={data.image}
        alt="icon info traveler"
      />
    </IconButton>
  );
};
