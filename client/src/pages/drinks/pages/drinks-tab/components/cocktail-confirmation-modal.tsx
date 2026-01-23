import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Button
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { ICocktail } from "@/pages/drinks/models/drinks-model";

interface CocktailConfirmationModalProps {
    cocktail: ICocktail | null;
    onConfirm: () => void;
    onCancel: () => void;
}

export const CocktailConfirmationModal: React.FC<CocktailConfirmationModalProps> = ({
    cocktail,
    onConfirm,
    onCancel
}) => {
    const { t } = useTranslation();
    return (
        <Dialog
            open={Boolean(cocktail)}
            onClose={onCancel}
            PaperProps={{
                sx: {
                    background: "rgba(15, 23, 42, 0.95)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid var(--primary-glow)",
                    borderRadius: "16px",
                    color: "#fff",
                    minWidth: "300px"
                }
            }}
        >
            <DialogTitle sx={{ fontWeight: 800, textAlign: 'center', pt: 3 }}>
                {t('common.accept')}?
            </DialogTitle>
            <DialogContent sx={{ textAlign: 'center', pb: 2 }}>
                <Typography sx={{ color: 'var(--text-muted)', mb: 1 }}>
                    {t('drinks.confirm.question', { defaultValue: 'Do you want this drink?' })}
                </Typography>
                <Typography
                    variant="h5"
                    sx={{ color: 'var(--primary)', fontWeight: 800 }}
                    data-testid="selected-cocktail-name"
                >
                    {cocktail ? t(`drinks.cocktails.${cocktail.name.toLowerCase()}`, { defaultValue: cocktail.name }) : ""}
                </Typography>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 4, px: 3 }}>
                <Button
                    onClick={onCancel}
                    sx={{
                        color: 'var(--text-muted)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        '&:hover': { background: 'rgba(255,255,255,0.05)' }
                    }}
                >
                    {t('common.cancel')}
                </Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    sx={{
                        background: 'linear-gradient(90deg, var(--primary), var(--accent))',
                        boxShadow: '0 0 15px var(--primary-glow)',
                        fontWeight: 700,
                        px: 4
                    }}
                >
                    {t('common.accept')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
