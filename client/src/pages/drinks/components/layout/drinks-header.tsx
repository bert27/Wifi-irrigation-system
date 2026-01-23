import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export const DrinksHeader = () => {
    const { t } = useTranslation();

    return (
        <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
                className="tech-text"
                sx={{
                    fontSize: { xs: "2rem", md: "3.5rem" },
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "4px",
                    background: "linear-gradient(90deg, var(--primary), var(--accent))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow: "0 0 40px var(--primary-glow)",
                    mb: 1,
                }}
            >
                {t('drinks.title')}
            </Typography>
            <Typography
                sx={{
                    fontSize: "0.9rem",
                    color: "var(--text-muted)",
                    letterSpacing: "3px",
                }}
            >
                {t('drinks.subtitle')}
            </Typography>
        </Box>
    );
};
