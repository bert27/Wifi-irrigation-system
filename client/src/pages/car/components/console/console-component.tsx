import { RobotStatus } from "../../models/robot-model";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";

interface ConsoleComponentProps {
  message: RobotStatus;
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
        {t('car.console.joystick')}: {message.jostickDirection || "N/A"}
      </Box>
      <Box component="div">
        {t('car.console.gyroscope')}: {message.giroscope || "N/A"}
      </Box>
      {message.giroscopeValues && (
        <Box component="div" sx={{ display: "flex", gap: "0.5rem" }}>
          <span>X: {message.giroscopeValues[0]}</span>
          <span>Y: {message.giroscopeValues[1]}</span>
        </Box>
      )}
    </Box>
  );
};
