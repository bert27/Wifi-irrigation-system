import React, { useState } from "react";
import { Grid, Box, Typography, Paper, IconButton, Tooltip } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { Bottle, Cocktail } from "../models/drinks-model";
import { useTranslation } from "react-i18next";
import { PumpSettingsModal } from "./pump-settings-modal";

interface PumpConfigPanelProps {
  cocktails: Cocktail[];
  bottles: Bottle[];
  onUpdatePump: (id: number, data: { pwm: number; timeCalibration: number }) => void;
}

export const PumpConfigPanel: React.FC<PumpConfigPanelProps> = ({ cocktails, bottles, onUpdatePump }) => {
  const { t } = useTranslation();
  const [selectedPump, setSelectedPump] = useState<Bottle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (pumpId: number) => {
    const pump = bottles.find((p) => p.id === pumpId);
    if (pump) {
      setSelectedPump(pump);
      setIsModalOpen(true);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        {cocktails.map((cocktail) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={cocktail.id}>
            <CocktailConfigCard cocktail={cocktail} onConfigPump={handleOpenModal} />
          </Grid>
        ))}
      </Grid>

      <PumpSettingsModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        pump={selectedPump}
        onSave={onUpdatePump}
      />
    </Box>
  );
};

const CocktailConfigCard: React.FC<{ cocktail: Cocktail; onConfigPump: (id: number) => void }> = ({
  cocktail,
  onConfigPump
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
        <Typography sx={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
          Configurar Bombas:
        </Typography>
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

