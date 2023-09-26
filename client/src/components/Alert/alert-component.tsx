import { Snackbar, Alert, AlertColor } from "@mui/material";

interface AlertComponentInterface {
  open: boolean;
  message: string | undefined;
  setOpenSnackbar: (value: React.SetStateAction<boolean>) => void;
  severity?: AlertColor;
}
export const AlertComponent = (props: AlertComponentInterface) => {
  const { open, message, setOpenSnackbar,severity } = props;
  return (
    <Snackbar
      open={open}
      autoHideDuration={2000}
      onClose={() => setOpenSnackbar(false)}
    >
      <Alert
        onClose={() => setOpenSnackbar(false)}
        severity={severity ?? "info"}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};
