import React from "react";
import { Box, Tabs, Tab } from "@mui/material";
import LocalBarIcon from "@mui/icons-material/LocalBar";
import SettingsIcon from "@mui/icons-material/Settings";
import OpacityIcon from "@mui/icons-material/Opacity";
import { useTranslation } from "react-i18next";
import { useMediaQuery, useTheme } from "@mui/material";
import { TabType } from "../../models/drinks-model";

interface DrinksTabsProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

export const DrinksTabs: React.FC<DrinksTabsProps> = ({ activeTab, onTabChange }) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const iconPosition = isMobile ? "top" : "start";

    return (
        <Box
            sx={{
                mb: 4,
                display: "flex",
                justifyContent: "center",
            }}
        >
            <Tabs
                value={activeTab}
                onChange={(_, v) => onTabChange(v as TabType)}
                sx={{
                    "& .MuiTabs-indicator": {
                        height: "3px",
                        background: "linear-gradient(90deg, var(--primary), var(--accent))",
                        boxShadow: "0 0 10px var(--primary-glow)",
                    },
                    "& .MuiTab-root": {
                        color: "rgba(255,255,255,0.6)",
                        fontWeight: 700,
                        letterSpacing: "2px",
                        fontSize: "0.9rem",
                        minWidth: { xs: "auto", sm: 120 },
                        px: { xs: 2, sm: 3 },
                        transition: "all 0.3s ease",
                        "&:hover": {
                            color: "var(--text-main)",
                            background: "rgba(255,255,255,0.05)",
                        },
                    },
                    "& .Mui-selected": {
                        color: "var(--primary) !important",
                        textShadow: "0 0 10px var(--primary-glow)",
                    },
                }}
            >
                <Tab value="drinks" label={t('drinks.tabs.drinks')} icon={<LocalBarIcon />} iconPosition={iconPosition} />
                <Tab value="config" label={isMobile ? t('drinks.tabs.config_short') : t('drinks.tabs.config')} icon={<SettingsIcon />} iconPosition={iconPosition} />
                <Tab value="manual" label={isMobile ? t('drinks.tabs.manual_short') : t('drinks.tabs.manual')} icon={<OpacityIcon />} iconPosition={iconPosition} />
            </Tabs>
        </Box>
    );
};
