import "./styles.css";
import { Plant } from "./pages/first-plant/plant-page-index";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { DrinksPage } from "./pages/drinks/drinks-page";

export const RoutingWeb = () => {
  return (
    <>
      <Router>
        <Routes>
          
          <Route path="/" element={<Plant />} />
          <Route path="/bebidas" element={<DrinksPage/>} />
          <Route path="*" element={<Plant />} />
        </Routes>
      </Router>
    </>
  );
};
