import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";

interface CustomHeaderProps {
  color: string;
  name: string;
}

const CustomHeader = (props: CustomHeaderProps) => {
  const { color, name } = props;

  const handleClick = () => {};

  return (
    <Box
      onClick={handleClick}
      sx={{
        color: color === "white" || color === "yellow" ? "black" : "white",
        background: color,
        width: "100%",
      }}
    >
      {name}
    </Box>
  );
};
/*
const CustomCell = () => {
  const [count, setCount] = useState(5);

  const handleClick = () => {
    setCount(count + 1);
  };

  return <Box onClick={handleClick} sx={{color: "black"}}>Increment: {count}</Box>;
};*/

export const TableOutputs = (props: any) => {
  const width = 200;
  const columns = [
    {
      field: "motorA1",
      headerName: "Motor A1",
      minWidth: width,
      renderHeader: () => <CustomHeader color={"blue"} name={"Motor A1"} />,
      //   renderCell: () => <CustomCell />,
    },
    {
      field: "motorA2",
      headerName: "Motor A2",
      minWidth: width,
      renderHeader: () => <CustomHeader color={"black"} name={"Motor A2"} />,
      //   renderCell: () => <CustomCell />,
    },
    {
      field: "motorB1",
      headerName: "Motor B1",
      minWidth: width,
      renderHeader: () => <CustomHeader color={"yellow"} name={"Motor B1"} />,
      //   renderCell: () => <CustomCell />,
    },
    {
      field: "motorB2",
      headerName: "Motor B2",
      minWidth: width,
      renderHeader: () => <CustomHeader color={"white"} name={"Motor B2"} />,
      // renderCell: () => <CustomCell />,
    },
  ];

  const [rows, setRows] = useState([
    { id: 1, motorA1: 1, motorA2: 0, motorB1: 0, motorB2: 1 },
  ]);

  return (
    <Box sx={{ marginTop: "2em" }}>
      <Typography variant="h6" gutterBottom>
        Outputs:
      </Typography>
      <DataGrid
        columns={columns}
        onRowClick={(event, rowData) => {
          console.log(rowData);
        }}
        rows={rows}
        rowHeight={50}
      />
    </Box>
  );
};
