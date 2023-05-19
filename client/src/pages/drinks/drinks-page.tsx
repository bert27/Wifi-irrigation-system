import { Box, Button, Typography } from "@mui/material";
 

export const DrinksPage = (props: any) => {

  const drinks=["Cocacola","Sex on the beach","Zumo de naranja","vodzka con cocacola","Granadina","vodzka"]
  return (
    <>
      <Box
        sx={{
          backgroundColor: "#0B2447",
          minHeight: "100vh",
          padding: "2em",
          color: "white",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Elige una bebida:
        </Typography>

        <Box sx={{ marginTop: "10px",width: "60%",display: "flex",alignItems: "center",flexWrap: "wrap" }}>
        {drinks.map((drink) => <Box sx={{padding: "1em"}}>  <Button sx={{backgroundColor: "#576CBC"}} variant="contained">{drink}</Button></Box>)}
        </Box>
      </Box>
    </>
  );
};
