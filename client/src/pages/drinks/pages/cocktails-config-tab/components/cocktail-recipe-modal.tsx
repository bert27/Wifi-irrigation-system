import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Slider,
    List,
    ListItem,
    ListItemText,
    Divider
} from "@mui/material";
import { IBottle, ICocktail } from "@/pages/drinks/models/drinks-model";
import { useTranslation } from "react-i18next";
import SaveIcon from "@mui/icons-material/Save";
import LocalBarIcon from "@mui/icons-material/LocalBar";

interface CocktailRecipeModalProps {
    open: boolean;
    onClose: () => void;
    cocktail: ICocktail | null;
    bottles: IBottle[];
    onSave: (name: string, ingredients: { name: string; quantity: number }[]) => void;
}

export const CocktailRecipeModal: React.FC<CocktailRecipeModalProps> = ({
    open,
    onClose,
    cocktail,
    bottles,
    onSave
}) => {
    const { t } = useTranslation();
    const [recipe, setRecipe] = useState<{ name: string; quantity: number }[]>([]);

    useEffect(() => {
        if (cocktail) {
            console.log("[CocktailRecipeModal] Opening modal for:", cocktail.name, "Current cocktails recipe:", cocktail.recipe);
            console.log("[CocktailRecipeModal] Available bottles in UI:", bottles.map(b => b.liquid));

            // Map initial proportions
            const initial = cocktail.recipe?.map(r => ({ name: r.liquid, quantity: r.quantity })) || [];

            // Ensure all bottles are present in the UI for adjustment
            const allIngredients = bottles.map(b => {
                // Use case-insensitive matching to be robust against "Zumo de Naranja" vs "Zumo de naranja"
                const existing = initial.find(i => i.name.toLowerCase().trim() === b.liquid.toLowerCase().trim());

                if (existing) {
                    console.log(`[CocktailRecipeModal] Matched ingredient: ${b.liquid} -> ${existing.quantity}ml`);
                }

                return { name: b.liquid, quantity: existing ? existing.quantity : 0 };
            });

            setRecipe(allIngredients);
        }
    }, [cocktail, bottles]);

    const handleQuantityChange = (name: string, value: number) => {
        setRecipe(prev => prev.map(ing => ing.name === name ? { ...ing, quantity: value } : ing));
    };

    const handleSave = () => {
        if (cocktail) {
            // Send only non-zero ingredients
            const filtered = recipe.filter(r => r.quantity > 0);
            onSave(cocktail.name, filtered);
            onClose();
        }
    };

    if (!cocktail) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth className="glass-effect-dialog">
            <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5, pb: 1 }}>
                <LocalBarIcon sx={{ color: "var(--accent)" }} />
                <Typography className="tech-text" sx={{ color: "var(--accent)", fontWeight: 700 }}>
                    {t('drinks.recipe.editTitle', { name: t(`drinks.cocktails.${cocktail.name.toLowerCase()}`, { defaultValue: cocktail.name }) })}
                </Typography>
            </DialogTitle>

            <DialogContent sx={{ mt: 1 }}>
                <Typography variant="caption" sx={{ color: "var(--text-muted)", mb: 3, display: "block" }}>
                    {t('drinks.recipe.helpText')}
                </Typography>

                <List disablePadding>
                    {recipe.map((ing, idx) => (
                        <React.Fragment key={ing.name}>
                            {idx > 0 && <Divider sx={{ opacity: 0.1, my: 1 }} />}
                            <ListItem sx={{ px: 0, flexDirection: "column", alignItems: "stretch", gap: 1 }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                    <ListItemText
                                        primary={t(`drinks.liquids.${ing.name.toLowerCase()}`, { defaultValue: ing.name })}
                                        primaryTypographyProps={{ sx: { fontWeight: 600, color: "var(--text-main)" } }}
                                    />
                                    <Typography sx={{ color: "var(--accent)", fontWeight: 700 }}>
                                        {ing.quantity} ml
                                    </Typography>
                                </Box>
                                <Slider
                                    value={ing.quantity}
                                    onChange={(_, val) => handleQuantityChange(ing.name, val as number)}
                                    min={0}
                                    max={250}
                                    step={5}
                                    sx={{
                                        color: "var(--accent)",
                                        '& .MuiSlider-thumb': {
                                            boxShadow: "0 0 10px var(--accent-glow)",
                                        }
                                    }}
                                />
                            </ListItem>
                        </React.Fragment>
                    ))}
                </List>
            </DialogContent>

            <DialogActions sx={{ p: 2.5, gap: 1.5 }}>
                <Button onClick={onClose} sx={{ color: "var(--text-muted)" }}>
                    {t('common.cancel')}
                </Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    startIcon={<SaveIcon />}
                    sx={{
                        background: "linear-gradient(135deg, var(--primary), var(--accent))",
                        boxShadow: "0 4px 15px var(--primary-glow)",
                        fontWeight: 700,
                        px: 3
                    }}
                >
                    {t('common.save')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
