import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import { ReactComponent as IcoWaterOn } from "../../../../icons/waterOn.svg";
import { ReactComponent as IcoWaterOff } from "../../../../icons/waterOff.svg";

interface CardConfigTabProps {
  title: string;
  formData: {
    pwm: number;
    statePump: string;
  };
  onChangeStatePumpButton: () => Promise<void>;
  onChangePWM: (pwmTmp: string) => void;
}
export const CardConfigTab = (props: CardConfigTabProps) => {
  const { formData, onChangePWM, onChangeStatePumpButton, title } = props;

  const sendFormData = () => {};
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "baseline" }}>
          {formData.statePump === "ON" ? (
            <IcoWaterOn className="buttonsvg" style={{ fill: "black" }} />
          ) : (
            <IcoWaterOff className="buttonsvg " style={{ fill: "black" }} />
          )}
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            marginBottom: "1em",
          }}
        >
          <Typography variant="h6" gutterBottom>
            {formData.statePump}
          </Typography>
          <Button
            sx={{ backgroundColor: "#009688" }}
            variant="contained"
            onClick={onChangeStatePumpButton}
          >
            {formData.statePump === "ON" ? "PAUSE" : "ON"}
          </Button>
        </Box>
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            marginBottom: "1em",
          }}
        >
          <TextField
            fullWidth={false}
            label={"Water pump pwm"}
            value={formData.pwm}
            type={"number"}
            placeholder={"Nombre"}
            variant={"standard"}
            onChange={(
              e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            ) => {
              onChangePWM(e.currentTarget.value);
            }}
          />
          <Button
            sx={{ backgroundColor: "#009688" }}
            variant="contained"
            onClick={sendFormData}
          >
            {"set"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
