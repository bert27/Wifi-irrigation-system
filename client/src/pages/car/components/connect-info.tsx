import { Box, Skeleton } from "@mui/material";

interface ConnectInfoProps {
  connectedWs: boolean | undefined;
}

export const ConnectInfo = (props: ConnectInfoProps) => {
  const { connectedWs } = props;
  const size = "20px";
  return (
    <Box component="div">
      {connectedWs !== undefined ? (
        <Box
          component="div"
          sx={{ display: "flex", alignItems: "center", width: "100%" }}
        >
          <Box
            component="div"
            sx={{
              backgroundColor: connectedWs ? "green" : "red",
              borderRadius: "50%",
              width: size,
              height: size,
              margin: "0.5em",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "1em",
            }}
          ></Box>

          {connectedWs ? "WebSocket Conectado" : "WebSocket Desconectado"}
        </Box>
      ) : (
        <Skeleton
          variant="rounded"
          animation="wave"
          width={180}
          height={60}
          sx={{
            backgroundColor: "#9a9ea2",
          }}
        />
      )}
    </Box>
  );
};
