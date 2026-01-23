import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Box, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";
import type { IBottle, ICocktail } from "@/pages/drinks/models/drinks-model";
import { CocktailConfigCard } from "./components/cocktail-config-card";
import { CocktailRecipeModal } from "./components/cocktail-recipe-modal";
import { drinksService } from "@/pages/drinks/services/drinks.service";

interface ICocktailsConfigTabPageProps {
    cocktails: ICocktail[];
    bottles: IBottle[];
    onUpdateCocktail: (name: string, ingredients: { name: string; quantity: number }[]) => void;
    onRefreshCocktails: () => void;
}

export const CocktailsConfigTabPage: React.FC<ICocktailsConfigTabPageProps> = ({
    cocktails,
    bottles,
    onUpdateCocktail,
    onRefreshCocktails,
}) => {
    const { t } = useTranslation();
    const [selectedCocktail, setSelectedCocktail] = useState<ICocktail | null>(null);
    const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
    const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

    const handleOpenRecipeModal = (cocktail: ICocktail) => {
        setSelectedCocktail(cocktail);
        setIsRecipeModalOpen(true);
    };

    const handleResetRecipes = async () => {
        try {
            await drinksService.resetRecipes();
            setIsResetDialogOpen(false);
            onRefreshCocktails();
        } catch (error) {
            console.error("Failed to reset recipes", error);
        }
    };

    return (
        <Box sx={{ mt: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                <Button
                    variant="outlined"
                    color="warning"
                    startIcon={<RestoreIcon />}
                    onClick={() => setIsResetDialogOpen(true)}
                    sx={{ textTransform: "none" }}
                >
                    {t('drinks.config.reset')}
                </Button>
            </Box>

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

            <Dialog open={isResetDialogOpen} onClose={() => setIsResetDialogOpen(false)}>
                <DialogTitle>{t('drinks.config.resetConfirmTitle')}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {t('drinks.config.resetConfirmText')}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsResetDialogOpen(false)}>{t('common.cancel')}</Button>
                    <Button onClick={handleResetRecipes} color="warning" variant="contained">
                        {t('drinks.config.reset')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
