import React from "react";
import "./i18n";

import { Irrigation } from "@/pages/irrigation/irrigation-page-index";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { DrinksPage } from "@/pages/drinks/drinks-page";
import { SideNavBar } from "@/components/Menu/sidenavbar";

import { CarPage } from "@/pages/car/car-page";
import { RemoteControlProvider } from "@/context/remote-control-context";
import { ConnectivityProvider } from "@/context/connectivity-context";

export const App: React.FC = () => {
  return (
    <Router>
      <RemoteControlProvider>
        <ConnectivityProvider>
          <section className="app-layout">
            <SideNavBar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<CarPage />} />
                <Route path="/irrigation" element={<Irrigation />} />
                <Route path="/drinks" element={<DrinksPage />} />
                <Route path="/drinks/:tabRouter" element={<DrinksPage />} />
                <Route path="*" element={<Irrigation />} />
              </Routes>
            </main>
          </section>
        </ConnectivityProvider>
      </RemoteControlProvider>
    </Router>
  );
};
