import React from "react";
import "./i18n";
import "./styles.css";
import { Irrigation } from "@/pages/irrigation/irrigation-page-index";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { DrinksPage } from "@/pages/drinks/drinks-page";
import { SideNavBar } from "@/components/Menu/sidenavbar";
import { Box } from "@mui/material";
import { CarPage } from "@/pages/car/car-page";
import { RemoteControlProvider } from "@/context/remote-control-context";
import { ConnectivityProvider } from "@/context/connectivity-context";

export const App: React.FC = () => {
  return (
    <Router>
      <RemoteControlProvider>
        <ConnectivityProvider>
          <Box sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            width: "100%",
            minHeight: "100vh"
          }}>
            <SideNavBar />
            <Box component="main" sx={{ flexGrow: 1, overflowX: "hidden" }}>
              <Routes>
                <Route path="/" element={<CarPage />} />
                <Route path="/irrigation" element={<Irrigation />} />
                <Route path="/drinks" element={<DrinksPage />} />
                <Route path="/drinks/:tabRouter" element={<DrinksPage />} />
                <Route path="*" element={<Irrigation />} />
              </Routes>
            </Box>
          </Box>
        </ConnectivityProvider>
      </RemoteControlProvider>
    </Router>
  );
};
