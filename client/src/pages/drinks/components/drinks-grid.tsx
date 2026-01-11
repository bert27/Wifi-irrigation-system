import React from "react";
import { Grid, Box, Typography, Paper } from "@mui/material";
import LocalBarIcon from "@mui/icons-material/LocalBar";
import { Drink } from "../models/drinks-model";

interface DrinksGridProps {
  drinks: Drink[];
  onSelectDrink: (drink: Drink) => void;
}

import { useTranslation } from "react-i18next";

export const DrinksGrid: React.FC<DrinksGridProps> = ({ drinks, onSelectDrink }) => {
  const { t } = useTranslation();
  return (
    <Grid container spacing={3} sx={{ mt: 2 }}>
      {drinks.map((drink) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={drink.id}>
          <Paper
            onClick={() => onSelectDrink(drink)}
            className="glass-card"
            sx={{
              p: 3,
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
              transition: "all 0.3s ease",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.1)",
              "&:hover": {
                transform: "translateY(-5px)",
                background: "rgba(99, 102, 241, 0.1)",
                borderColor: "var(--primary)",
                boxShadow: "0 10px 30px var(--primary-glow)",
              },
              "&:active": {
                transform: "translateY(-2px)",
              },
            }}
          >
            {/* Neon glow effect */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "3px",
                background: "linear-gradient(90deg, var(--primary), var(--accent))",
                opacity: 0,
                transition: "opacity 0.3s ease",
                ".glass-card:hover &": {
                  opacity: 1,
                },
              }}
            />

            <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--primary), var(--accent))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 20px var(--primary-glow)",
                }}
              >
                <LocalBarIcon sx={{ fontSize: 32, color: "#fff" }} />
              </Box>

              <Typography
                className="tech-text"
                sx={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "var(--text-main)",
                  textAlign: "center",
                  letterSpacing: "1px",
                }}
              >
                {drink.name.toUpperCase()}
              </Typography>

              <Box
                sx={{
                  width: "100%",
                  height: "2px",
                  background: "linear-gradient(90deg, transparent, var(--accent), transparent)",
                  opacity: 0.5,
                }}
              />

              <Typography
                sx={{
                  fontSize: "0.7rem",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                }}
              >
                {t('drinks.grid.tapToMix')}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};
