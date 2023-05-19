import { Box, Link, Paper, Tooltip, Typography } from "@mui/material";
import { Link as LinkDom } from "react-router-dom";
import WaterDrop from "@mui/icons-material/WaterDrop";
import LocalBarIcon from '@mui/icons-material/LocalBar';

interface IconSideNavBarInterface {
  name: string;
  linkTo: string;
  icon: React.ReactElement;
}

const iconsPages = [
  { name: "Riego", linkTo: "/", icon: <WaterDrop /> },
  { name: "Drinks", linkTo: "/drinks", icon: <LocalBarIcon /> },
];
export const SideNavBar = (): React.ReactElement => {
  return (
    <Box className="side-nav-bar" style={{background: "#282828",height: "auto"}}>

        {iconsPages.map((iconPage: IconSideNavBarInterface) => (
          <Box style={{ padding: "1vw" }}>
            <Link
              arioa-label={iconPage.name}
              component={LinkDom}
              to={iconPage.linkTo}
            >
              <Tooltip placement="right-start" title={iconPage.name}>
                <Typography color="#009688">{iconPage.icon}</Typography>
              </Tooltip>
            </Link>
          </Box>
        ))}

    </Box>
  );
};
