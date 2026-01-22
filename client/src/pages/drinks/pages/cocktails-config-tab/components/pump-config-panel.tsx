import React, { useState } from "react";
import { Grid, Box, Typography, Paper, Tooltip, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { IBottle, ICocktail } from "@/pages/drinks/models/drinks-model";
import { useTranslation } from "react-i18next";
import { CocktailRecipeModal } from "./cocktail-recipe-modal";

interface PumpConfigPanelProps {
  cocktails: ICocktail[];
  bottles: IBottle[];
  onUpdatePump: (id: number, data: { pwm: number; timeCalibration: number }) => void;
  onUpdateCocktail: (name: string, ingredients: { name: string; quantity: number }[]) => void;
}

export const PumpConfigPanel: React.FC<PumpConfigPanelProps> = ({
  cocktails,
  bottles,
  onUpdatePump,
  onUpdateCocktail
}) => {
  const { t } = useTranslation();

  const [selectedCocktail, setSelectedCocktail] = useState<ICocktail | null>(null);
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);

  const handleOpenRecipeModal = (cocktail: ICocktail) => {
    setSelectedCocktail(cocktail);
    setIsRecipeModalOpen(true);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        {cocktails.map((cocktail) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={cocktail.id}>
            <CocktailConfigCard
              cocktail={cocktail}
              onEditRecipe={() => handleOpenRecipeModal(cocktail)}
            />
          </Grid>
        ))}
      </Grid>

      <CocktailRecipeModal
        open={isRecipeModalOpen}
        onClose={() => setIsRecipeModalOpen(false)}
        cocktail={selectedCocktail}
        bottles={bottles}
        onSave={onUpdateCocktail}
      />
    </Box>
  );
};



const CocktailConfigCard: React.FC<{
  cocktail: ICocktail;
  onEditRecipe: () => void;
}> = ({
  cocktail,
  onEditRecipe
}) => {
    return (
      <Paper
        onClick={onEditRecipe}
        className="glass-effect"
        sx={{
          p: 2.5,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          cursor: "pointer",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 10px 20px rgba(0,0,0,0.3)",
          },
        }}
      >
        <Typography className="tech-text" sx={{ fontSize: "1rem", fontWeight: 700, color: "var(--accent)" }}>
          {cocktail.name}
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: "auto" }}>
          <Tooltip title="Editar Receta" arrow>
            <Button
              size="small"
              startIcon={<EditIcon />}
              sx={{
                color: "var(--text-muted)",
                fontSize: "0.7rem",
                "&:hover": { color: "var(--accent)" },
                pointerEvents: "none"
              }}
            >
              Receta
            </Button>
          </Tooltip>
        </Box>
      </Paper>
    );
  };


