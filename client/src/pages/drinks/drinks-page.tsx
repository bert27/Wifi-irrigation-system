import { Box } from "@mui/material";
import { ComponentTabs } from "../../components/Tabs/sidenavbar";

export const DrinksPage = (props: any) => {
  return (
    <>
      <Box
        sx={{
          backgroundColor: "#0B2447",
          minHeight: "100vh",
          padding: "2em",
          color: "white",
          width: "100%",
        }}
      >
        <ComponentTabs />
      </Box>
    </>
  );
};
