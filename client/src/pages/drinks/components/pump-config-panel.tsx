import React, { useState } from "react";
import { Grid, Box, Typography, Paper, IconButton, Tooltip, Button } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import EditIcon from "@mui/icons-material/Edit";
import { Bottle, Cocktail } from "../models/drinks-model";
import { useTranslation } from "react-i18next";
import { PumpSettingsModal } from "./pump-settings-modal";
import { CocktailRecipeModal } from "./cocktail-recipe-modal";

interface PumpConfigPanelProps {
  cocktails: Cocktail[];
  bottles: Bottle[];
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
  const [selectedPump, setSelectedPump] = useState<Bottle | null>(null);
  const [isPumpModalOpen, setIsPumpModalOpen] = useState(false);

  const [selectedCocktail, setSelectedCocktail] = useState<Cocktail | null>(null);
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);

  const handleOpenPumpModal = (pumpId: number) => {
    const pump = bottles.find((p) => p.id === pumpId);
    if (pump) {
      setSelectedPump(pump);
      setIsPumpModalOpen(true);
    }
  };

  const handleOpenRecipeModal = (cocktail: Cocktail) => {
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
              onConfigPump={handleOpenPumpModal}
              onEditRecipe={() => handleOpenRecipeModal(cocktail)}
            />
          </Grid>
        ))}
      </Grid>

      <PumpSettingsModal
        open={isPumpModalOpen}
        onClose={() => setIsPumpModalOpen(false)}
        pump={selectedPump}
        onSave={onUpdatePump}
      />

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
  cocktail: Cocktail;
  onConfigPump: (id: number) => void;
  onEditRecipe: () => void;
}> = ({
  cocktail,
  onConfigPump,
  onEditRecipe
}) => {
    return (
      <Paper
        className="glass-effect"
        sx={{
          p: 2.5,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 2,
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

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: "auto" }}>
          <Tooltip title="Editar Receta" arrow>
            <Button
              size="small"
              startIcon={<EditIcon />}
              onClick={onEditRecipe}
              sx={{
                color: "var(--text-muted)",
                fontSize: "0.7rem",
                "&:hover": { color: "var(--accent)" }
              }}
            >
              Receta
            </Button>
          </Tooltip>

          <Box sx={{ display: "flex", gap: 1 }}>
            {[1, 2, 3, 4].map((id) => (
              <Tooltip key={id} title={`Configurar Bomba ${id}`} arrow>
                <IconButton
                  size="small"
                  onClick={() => onConfigPump(id)}
                  sx={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    "&:hover": {
                      background: "var(--primary-glow)",
                      borderColor: "var(--primary)",
                    },
                  }}
                >
                  <SettingsIcon sx={{ fontSize: "1rem", color: "var(--text-muted)" }} />
                </IconButton>
              </Tooltip>
            ))}
          </Box>
        </Box>
      </Paper>
    );
  };
