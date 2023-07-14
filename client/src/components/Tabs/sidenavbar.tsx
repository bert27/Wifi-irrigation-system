import { Button, Paper, Tab, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import { ConfigTabDrinks } from "../../pages/drinks/tabs/config-tab-drinks/config-tab-drinks";
import { Controls } from "../../pages/drinks/controls";
const tabsUrl = {
  config: {
    url: "/drinks/config",
    tab: "config",
    value: "config",
  },
  drinks: {
    url: "/drinks",
    tab: "drinks",
    value: "drinks",
  },

  controls: {
    url: "/drinks/controls",
    tab: "controls",
    value: "controls",
  },
};

const drinks = [
  "Cocacola",
  "Sex on the beach",
  "Zumo de naranja",
  "vodzka con cocacola",
  "Granadina",
  "vodzka",
];

export const ComponentTabs = (): React.ReactElement => {
  const [valueTab, setValueTab] = useState("drinks");
  const { tabRouter } = useParams<{ tabRouter: string }>();
  useEffect(() => {
    if (tabRouter === tabsUrl.config.tab) {
      setValueTab(tabsUrl.config.value);
    }    else if (tabRouter === tabsUrl.controls.tab) {
      setValueTab(tabsUrl.controls.value);
    }else {
      setValueTab(tabsUrl.drinks.value);
    }
  }, [tabRouter]);
  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <TabContext value={valueTab}>
          <Paper elevation={2}>
            <Tabs value={valueTab} aria-label="tabs routing">
              <Tab
                label="Drinks"
                value={tabsUrl.drinks.value}
                to={tabsUrl.drinks.url}
                component={Link}
              />
              <Tab
                label="Config"
                value={tabsUrl.config.value}
                to={tabsUrl.config.url}
                component={Link}
              />
              <Tab
                label="Controls"
                value={tabsUrl.controls.value}
                to={tabsUrl.controls.url}
                component={Link}
              />
            </Tabs>
          </Paper>
          <TabPanel
            value={tabsUrl.config.value}
            id={tabsUrl.config.value}
            aria-labelledby={tabsUrl.config.value}
            sx={{ padding: "0px", marginTop: "10px" }}
          >
            <ConfigTabDrinks />
          </TabPanel>
          <TabPanel
            value={tabsUrl.drinks.value}
            id={tabsUrl.drinks.value}
            aria-labelledby={tabsUrl.drinks.value}
          >
            <Typography variant="h6" gutterBottom>
              Elige una bebida:
            </Typography>

            <Box
              sx={{
                marginTop: "10px",
                width: "60%",
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {drinks.map((drink) => (
                <Box sx={{ padding: "1em" }} key={drink}>
                  <Button
                    sx={{ backgroundColor: "#576CBC" }}
                    variant="contained"
                  >
                    {drink}
                  </Button>
                </Box>
              ))}
            </Box>
          </TabPanel>
          <TabPanel
            value={tabsUrl.controls.value}
            id={tabsUrl.controls.value}
            aria-labelledby={tabsUrl.controls.value}
          >
            <Box
              sx={{
                marginTop: "10px",
                width: "60%",
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Controls/>
            </Box>
          </TabPanel>
        </TabContext>
      </Box>
    </>
  );
};
