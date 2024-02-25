import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { robotService } from "../../../services/robot-service";
import ErrorMessage from "../../../components/Alert/error-message";

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
      component="div"
      sx={{
        width: "100%",
        lineHeight: "1.5em",
        whiteSpace: "pre-wrap",
        textOverflow: "ellipsis",
        textAlign: "left",
        fontWeight: "bold",
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
      }}
    >
      <Box
        component="div"
        sx={{
          width: 20,
          height: 20,
          borderRadius: 10,
          background: color,
          marginRight: 1,
          border: "2px solid black",
        }}
      />
      <Box component="div"> {name}</Box>
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

export interface ColumnInterface {
  id: string;
  motorA1: number;
  motorA2: number;
  motorB1: number;
  motorB2: number;
}
function CellButton(props: { row: ColumnInterface }): React.ReactElement {
  const { row } = props;
  const [isActivate, setIsActivate] = useState(false);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const sendDataToServer = async () => {
    setIsLoading(true);
    setErrorMessage(undefined);
    const response = await robotService.sendRowTableOutputsMotors(row);

    if (response?.type === "error") {
      console.log("error", response);
      setErrorMessage(response.message);
    } else {
      console.log("response", response);
      setIsActivate(!isActivate);
    }
    setIsLoading(false);
  };

  const activateMotors = () => {
    sendDataToServer();
  };
  return (
    <>
      <ErrorMessage errors={[errorMessage]} />
      <Box
        sx={{ width: "100%", justifyContent: "center", display: "flex" }}
        component="div"
      >
        {isLoading ? (
          <CircularProgress size={30} />
        ) : (
          <Button
            sx={{ backgroundColor: "#009688" }}
            variant="contained"
            onClick={activateMotors}
          >
            {isActivate ? "Desactivar" : "Activar"}
          </Button>
        )}
      </Box>
    </>
  );
}

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
    {
      field: "buttons",
      headerName: "Activate",
      minWidth: width,
      renderCell: (params: { row: ColumnInterface }) => {
        return <CellButton row={params.row} />;
      },
    },
  ];

  const [rows, setRows] = useState([
    { id: "01", motorA1: 0, motorA2: 0, motorB1: 0, motorB2: 0 },
    { id: "02", motorA1: 0, motorA2: 0, motorB1: 0, motorB2: 1 },
    { id: "03", motorA1: 0, motorA2: 0, motorB1: 1, motorB2: 0 },
    { id: "04", motorA1: 0, motorA2: 0, motorB1: 1, motorB2: 1 },
    { id: "05", motorA1: 1, motorA2: 0, motorB1: 0, motorB2: 1 },
    { id: "06", motorA1: 1, motorA2: 0, motorB1: 1, motorB2: 1 },
    { id: "07", motorA1: 1, motorA2: 1, motorB1: 0, motorB2: 1 },
    { id: "08", motorA1: 1, motorA2: 1, motorB1: 1, motorB2: 1 },
    { id: "09", motorA1: 0, motorA2: 0, motorB1: 0, motorB2: 0 },
    { id: "10", motorA1: 0, motorA2: 0, motorB1: 1, motorB2: 0 },
    { id: "11", motorA1: 0, motorA2: 1, motorB1: 0, motorB2: 0 },
    { id: "12", motorA1: 0, motorA2: 1, motorB1: 1, motorB2: 0 },
    { id: "13", motorA1: 1, motorA2: 0, motorB1: 0, motorB2: 0 },
    { id: "14", motorA1: 1, motorA2: 0, motorB1: 1, motorB2: 0 },
    { id: "15", motorA1: 1, motorA2: 1, motorB1: 0, motorB2: 0 },
  ]);

  return (
    <Box sx={{ marginTop: "2em" }} component="div">
      <Typography variant="h6" gutterBottom>
        Outputs:
      </Typography>
      <DataGrid
        columns={columns}
        //  onRowClick={(event, rowData) => {
        //    console.log(rowData);
        //  }}
        rows={rows}
        //rowHeight={50}
      />
    </Box>
  );
};
