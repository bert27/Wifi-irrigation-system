import { Box, Typography } from "@mui/material";
import { color } from "pages/drinks/tabs/config-tab-drinks/card-config-tab";
import { SliderComponent } from "pages/drinks/tabs/config-tab-drinks/components/slider-material";

export const SliderLineComponent = ({
  onChangePwmValue,
  valuePwm,
  label = "PWM", // Valor predeterminado para label
}: {
  onChangePwmValue: (pwmTmp: number) => void;
  valuePwm: number;
  label?: string;
}) => {
  return (
    <>
      <Typography
        variant="subtitle2"
        gutterBottom={false}
        sx={{ fontWeight: "bold", color: color }}
      >
        {label}:
      </Typography>
      <Box
        component="div"
        sx={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <SliderComponent
          onChangeValue={onChangePwmValue}
          valueSlider={valuePwm}
        />
      </Box>
    </>
  );
};
