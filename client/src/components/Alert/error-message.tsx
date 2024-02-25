import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Alert, Box, Button, Snackbar } from "@mui/material";
import React, { useEffect, useState } from "react";

interface ErrorMessageInterface {
  errors: (string | undefined)[];
}

/**
 * Error message component.
 *
 * @param props - Messages error string[].
 * @returns Analytics page component.
 */
export default function ErrorMessage(
  props: ErrorMessageInterface
): React.ReactElement {
  const { errors } = props;
  const [isError, setIsError] = useState(false);
  const [errorMessages, setErrorMessages] = useState([] as string[]);
  const [isVisibleMessageError, setIsVisibleMessageError] = useState(false);

  useEffect(() => {
    const errorsMessages = [] as string[];
    errors.forEach((error) => {
      if (error) {
        setIsError(true);
        errorsMessages.push(error);
      }
    });

    setErrorMessages(errorsMessages);
  }, [errors]);

  const color = "white";
  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      autoHideDuration={6000}
      onClose={() => {
        setIsError(false);
      }}
      open={isError}
    >
      <Alert
        data-testid="error-alert"
        elevation={6}
        icon={false}
        severity="error"
        sx={{
          display: "flex",
          alignItems: "center",
          "& .MuiAlert-message": { display: "flex", flexDirection: "column" },
        }}
        variant="filled"
      >
        <Box
          component="div"
          sx={{ display: "flex", alignItems: "center", color: color }}
        >
          <Button
            data-testid="error-button"
            onClick={() => {
              setIsVisibleMessageError(!isVisibleMessageError);
            }}
          >
            <ErrorOutlineIcon sx={{ color: color }} />
            <div style={{ color: color, padding: "5px" }}>
              Something bad just happened 😬
            </div>
            {isVisibleMessageError ? (
              <ExpandLessIcon sx={{ color: color }} />
            ) : (
              <ExpandMoreIcon sx={{ color: color }} />
            )}
          </Button>
        </Box>
        {isVisibleMessageError ? (
          <div style={{ marginLeft: "35px" }}>
            {errorMessages?.map(
              (errorMessage: string | { message: string }, i) => (
                // eslint-disable-next-line react/no-array-index-key -- index
                <div data-testid="error-message" key={i}>
                  {typeof errorMessage === "string"
                    ? errorMessage
                    : errorMessage.message}
                </div>
              )
            )}
          </div>
        ) : null}
      </Alert>
    </Snackbar>
  );
}
