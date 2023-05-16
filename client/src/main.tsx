import "./styles.css";
import { Plant } from "./pages/Plant";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

export const RoutingWeb = (props: any) => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Plant />} />
          <Route path="/bebidas" element={<>second page</>} />
        </Routes>
      </Router>
    </>
  );
};
