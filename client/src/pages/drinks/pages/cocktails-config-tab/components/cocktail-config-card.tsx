import React from "react";
import { Paper, Typography, Box, Tooltip, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useTranslation } from "react-i18next";
import type { ICocktail } from "@/pages/drinks/models/drinks-model";

interface ICocktailConfigCardProps {
    cocktail: ICocktail;
    onEditRecipe: () => void;
}

export const CocktailConfigCard: React.FC<ICocktailConfigCardProps> = ({
    cocktail,
    onEditRecipe
}) => {
    const { t } = useTranslation();
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
                {t(`drinks.cocktails.${cocktail.name.toLowerCase()}`, { defaultValue: cocktail.name })}
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
