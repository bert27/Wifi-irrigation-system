import { Box, Link, Tooltip } from "@mui/material";
import { Link as LinkDom, useLocation } from "react-router-dom";
import WaterDrop from "@mui/icons-material/WaterDrop";
import LocalBarIcon from "@mui/icons-material/LocalBar";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import "./sidenavbar.css";

import { NavItem } from "./models/navigation-model";

const iconsPages = [
  { name: "Robot", linkTo: "/", icon: <SmartToyIcon /> },
  { name: "Drinks", linkTo: "/drinks", icon: <LocalBarIcon /> },
  { name: "Irrigation", linkTo: "/irrigation", icon: <WaterDrop /> },
];

export const SideNavBar = (): React.ReactElement => {
  const location = useLocation();

  return (
    <div className="side-nav-bar">
      {iconsPages.map((iconPage: NavItem) => {
        const isActive = location.pathname === iconPage.linkTo;
        return (
          <div 
            className={`nav-item ${isActive ? 'active' : ''}`} 
            key={iconPage.name}
          >
            <Link
              aria-label={iconPage.name}
              component={LinkDom}
              to={iconPage.linkTo}
              underline="none"
            >
              <Tooltip placement="right" title={iconPage.name} arrow>
                <div className="nav-icon">
                  {iconPage.icon}
                </div>
              </Tooltip>
            </Link>
          </div>
        );
      })}
    </div>
  );
};
