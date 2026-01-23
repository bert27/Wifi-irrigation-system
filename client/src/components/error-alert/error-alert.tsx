import { Alert, Snackbar } from "@mui/material";

interface ErrorAlertProps {
    error: string | null;
    onClose?: () => void;
}

export const ErrorAlert = ({ error, onClose }: ErrorAlertProps) => {
    return (
        <Snackbar
            open={!!error}
            autoHideDuration={4000}
            onClose={onClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
            <Alert
                severity="error"
                sx={{
                    background: "linear-gradient(135deg, var(--error), #d32f2f)",
                    color: "#fff",
                    fontWeight: 700,
                    boxShadow: "0 0 20px var(--error-glow)",
                }}
            >
                {error}
            </Alert>
        </Snackbar>
    );
};
