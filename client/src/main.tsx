import "./styles.css";
import { Plant } from "./pages/first-plant/plant-page-index";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { DrinksPage } from "./pages/drinks/drinks-page";
import { SideNavBar } from "./components/Menu/sidenavbar";
import { Box } from "@mui/material";
import { CarPage } from "./pages/car/car-page";

export const RoutingWeb = () => {
  return (
    <>
      <Router>
        <Box style={{display: "flex"}} component="div">
        <SideNavBar/>
        <Routes>
          <Route path="/" element={<CarPage />} />
          <Route path="/water" element={<Plant/>} />
          <Route path="/drinks" element={<DrinksPage/>} />
          <Route path="/drinks/:tabRouter" element={<DrinksPage/>} />
          <Route path="*" element={<Plant />} />
        </Routes>
        </Box>
      </Router>
  
    </>
  );
};
