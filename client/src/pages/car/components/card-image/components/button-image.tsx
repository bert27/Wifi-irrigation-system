import { IconButton } from "@mui/material";
import { robotService } from "../../../../../services/robot-service";

export interface ButtonImageProps {
  data: {
    name: string;
    image: string;
  };
}
const sizeIcons = "100px";

export const ButtonImage = (props: ButtonImageProps) => {
  const click = async (name: string) => {
    console.log("name", name);
    const response = await robotService.sendOutputRobotUI({ name: name });
    console.log("response", response);
  };
  const { data } = props;
  return (
    <IconButton onClick={() => click(data.name)}>
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
