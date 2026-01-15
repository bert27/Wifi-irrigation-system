import { IDashboardState } from "../../models/model";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";

interface ConsoleComponentProps {
  message: IDashboardState;
}

export const ConsoleComponent = (props: ConsoleComponentProps) => {
  const { t } = useTranslation();
  const { message } = props;
  return (
    <Box
      component="div"
      className="glass-effect"
      sx={{
        display: "flex",
        background: "rgba(0,0,0,0.4) !important",
        color: "var(--text-main)",
        padding: "1rem",
        width: "100%",
        borderRadius: "12px",
        marginTop: "1rem",
        fontSize: "0.85rem",
        fontFamily: "var(--font-tech)",
        gap: "1.5rem",
        flexWrap: "wrap",
        border: '1px solid var(--glass-border)'
      }}
    >
      <Box component="div" sx={{ color: "var(--accent)", fontWeight: "bold" }}>
        {t('car.console.title')}
      </Box>

      <Box component="div">
        {t('car.console.joystick')}: {message.remote.joystickDirection || "N/A"}
      </Box>
      <Box component="div">
        {/* Default to Remote Gyro for Console if that's what we want, or Robot Gyro */}
        Gyroscopio Mando: {message.remote.remoteGyroscopeValues ? `X:${message.remote.remoteGyroscopeValues[0]} Y:${message.remote.remoteGyroscopeValues[1]}` : "N/A"}
      </Box>
      <Box component="div">
        Gyroscopio Robot: {message.robot.robotGyroscopeValues ? `X:${message.robot.robotGyroscopeValues[0]} Y:${message.robot.robotGyroscopeValues[1]}` : "N/A"}
      </Box>
    </Box>
  );
};
