import { Box, Link, Tooltip, Typography } from "@mui/material";
import { Link as LinkDom } from "react-router-dom";
import WaterDrop from "@mui/icons-material/WaterDrop";
import LocalBarIcon from "@mui/icons-material/LocalBar";
import SmartToyIcon from "@mui/icons-material/SmartToy";

interface IconSideNavBarInterface {
  name: string;
  linkTo: string;
  icon: React.ReactElement;
}

const iconsPages = [
  { name: "Robot", linkTo: "/", icon: <SmartToyIcon /> },
  { name: "Drinks", linkTo: "/drinks", icon: <LocalBarIcon /> },
  { name: "Riego", linkTo: "/water", icon: <WaterDrop /> },
];
export const SideNavBar = (): React.ReactElement => {
  return (
    <div
      className="side-nav-bar"
      style={{ background: "#282828", height: "auto" }}
    >
      {iconsPages.map((iconPage: IconSideNavBarInterface) => (
        <div style={{ padding: "1vw" }} key={iconPage.name}>
          <Link
            arioa-label={iconPage.name}
            component={LinkDom}
            to={iconPage.linkTo}
          >
            <Tooltip placement="right-start" title={iconPage.name}>
              <Typography color="#009688">{iconPage.icon}</Typography>
            </Tooltip>
          </Link>
        </div>
      ))}
    </div>
  );
};
