import React from "react";
import { Grid, Box, Typography, Paper, Skeleton } from "@mui/material";
import LocalBarIcon from "@mui/icons-material/LocalBar";
import { Cocktail } from "@/pages/drinks/models/drinks-model";
import { useTranslation } from "react-i18next";

interface CocktailsGridProps {
  cocktails: Cocktail[];
  onSelectCocktail: (cocktail: Cocktail) => void;
  selectedIndex?: number | null;
  loading?: boolean;
}

export const CocktailsGrid: React.FC<CocktailsGridProps> = ({ cocktails, onSelectCocktail, selectedIndex, loading }) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
            <Paper className="glass-card" sx={{ p: 3, height: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
              <Skeleton variant="circular" width={60} height={60} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
              <Skeleton variant="text" width="60%" height={32} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
              <Skeleton variant="text" width="40%" height={20} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
            </Paper>
          </Grid>
        ))}
      </Grid>
    );
  }
  return (
    <Grid container spacing={3} sx={{ mt: 2 }}>
      {cocktails.map((cocktail, index) => {
        const isSelected = selectedIndex === (index + 1); // index is 0-based, selectedIndex from raw ESP is 1-based (based on counter)

        return (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={cocktail.id}>
            <Paper
              onClick={() => onSelectCocktail(cocktail)}
              className={`glass-card ${isSelected ? 'active-selection' : ''}`}
              sx={{
                p: 3,
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                background: isSelected
                  ? "rgba(99, 102, 241, 0.2)"
                  : "rgba(255,255,255,0.03)",
                border: "1px solid",
                borderColor: isSelected
                  ? "var(--primary)"
                  : "rgba(255,255,255,0.1)",
                boxShadow: isSelected
                  ? "0 0 30px var(--primary-glow)"
                  : "none",
                transform: isSelected ? "translateY(-5px) scale(1.02)" : "none",
                "&:hover": {
                  transform: "translateY(-5px)",
                  background: isSelected ? "rgba(99, 102, 241, 0.25)" : "rgba(99, 102, 241, 0.1)",
                  borderColor: "var(--primary)",
                  boxShadow: "0 10px 30px var(--primary-glow)",
                },
                "&:active": {
                  transform: "translateY(-2px)",
                },
              }}
            >
              {/* Neon glow effect bar */}
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "3px",
                  background: "linear-gradient(90deg, var(--primary), var(--accent))",
                  opacity: isSelected ? 1 : 0,
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
                  {cocktail.name.toUpperCase()}
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
        );
      })}
    </Grid>
  );
};
