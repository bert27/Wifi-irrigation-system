import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Button
} from "@mui/material";
import { Cocktail } from "@/pages/drinks/models/drinks-model";

interface CocktailConfirmationModalProps {
    cocktail: Cocktail | null;
    onConfirm: () => void;
    onCancel: () => void;
}

export const CocktailConfirmationModal: React.FC<CocktailConfirmationModalProps> = ({
    cocktail,
    onConfirm,
    onCancel
}) => {
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
                ¿Aceptar?
            </DialogTitle>
            <DialogContent sx={{ textAlign: 'center', pb: 2 }}>
                <Typography sx={{ color: 'var(--text-muted)', mb: 1 }}>
                    ¿Quieres esta bebida?
                </Typography>
                <Typography variant="h5" sx={{ color: 'var(--primary)', fontWeight: 800 }}>
                    {cocktail?.name}
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
                    Cancelar
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
                    Aceptar
                </Button>
            </DialogActions>
        </Dialog>
    );
};
