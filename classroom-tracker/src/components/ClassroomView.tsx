import * as React from "react";
import Box from "@mui/material/Box";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowsProp,
  GridToolbar,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridValueFormatterParams,
} from "@mui/x-data-grid";
import { darken, lighten, styled } from "@mui/material/styles";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import InfoIcon from "@mui/icons-material/Info";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import DoneIcon from "@mui/icons-material/Done";
import Chip from "@mui/material/Chip";
import moment from "moment";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import Stack from "@mui/material/Stack";
import Fingerprint from "@mui/icons-material/Fingerprint";
import { useEffect, useState } from "react";
import { axiosInstance } from "../service/axios";
import { v4 as uuidv4 } from "uuid";
import { AxiosResponse } from "axios";
import { ctUtils } from "../service/utils";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import { Container, Grid } from "@mui/material";
// import Container from "@mui/material/Container";

const StyledChip = styled(Chip)(({ theme }) => ({
  justifyContent: "left",
  "& .icon": {
    color: "inherit",
  },
  "&.Open": {
    color: theme.palette.info.dark,
    border: `1px solid ${theme.palette.info.main}`,
  },
  "&.Filled": {
    color: theme.palette.success.dark,
    border: `1px solid ${theme.palette.success.main}`,
  },
  "&.PartiallyFilled": {
    color: theme.palette.warning.dark,
    border: `1px solid ${theme.palette.warning.main}`,
  },
  "&.Rejected": {
    color: theme.palette.error.dark,
    border: `1px solid ${theme.palette.error.main}`,
  },
}));

interface StatusProps {
  status: string;
}

const getBackgroundColor = (color: string, mode: string) =>
  mode === "dark" ? darken(color, 0.7) : lighten(color, 0.7);

const getHoverBackgroundColor = (color: string, mode: string) =>
  mode === "dark" ? darken(color, 0.6) : lighten(color, 0.6);

const getSelectedBackgroundColor = (color: string, mode: string) =>
  mode === "dark" ? darken(color, 0.5) : lighten(color, 0.5);

const getSelectedHoverBackgroundColor = (color: string, mode: string) =>
  mode === "dark" ? darken(color, 0.4) : lighten(color, 0.4);

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  "& .super-app-theme--true": {
    backgroundColor: getBackgroundColor(
      theme.palette.success.main,
      theme.palette.mode,
    ),
    "&:hover": {
      backgroundColor: getHoverBackgroundColor(
        theme.palette.success.main,
        theme.palette.mode,
      ),
    },
    "&.Mui-selected": {
      backgroundColor: getSelectedBackgroundColor(
        theme.palette.success.main,
        theme.palette.mode,
      ),
      "&:hover": {
        backgroundColor: getSelectedHoverBackgroundColor(
          theme.palette.success.main,
          theme.palette.mode,
        ),
      },
    },
  },

  "& .super-app-theme--false": {
    backgroundColor: getBackgroundColor(
      theme.palette.error.main,
      theme.palette.mode,
    ),
    "&:hover": {
      backgroundColor: getHoverBackgroundColor(
        theme.palette.error.main,
        theme.palette.mode,
      ),
    },
    "&.Mui-selected": {
      backgroundColor: getSelectedBackgroundColor(
        theme.palette.error.main,
        theme.palette.mode,
      ),
      "&:hover": {
        backgroundColor: getSelectedHoverBackgroundColor(
          theme.palette.error.main,
          theme.palette.mode,
        ),
      },
    },
  },
}));

// Child
type Props = {
  isScanModeValue?: boolean;
  onActivateScanMode: () => void;
};

export default function StylingRowsGrid({
  isScanModeValue,
  onActivateScanMode,
}: Props) {
  const [isScan, setIsScan] = React.useState<Boolean>(false);
  // const [studentList, setStudentList] = React.useState<StudentType[] >([
  const [studentList, setStudentList] = React.useState({ id: 1 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [rowData, setRowData] = useState([]);

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport />

        <Grid>
          <Button
            variant="contained"
            size="small"
            // disabled={selectionModel.length === 0}
            startIcon={<Fingerprint />}
            onClick={() => onActivateScanMode()}
          >
            ScanMode
          </Button>
        </Grid>
      </GridToolbarContainer>
    );
  }

  useEffect(() => {
    // @ts-ignore
    function getStudents() {
      axiosInstance.get("/students").then((response) => {
        setIsLoaded(true);
        console.log(response.data);
        setRowData(response.data);
      });
    }

    getStudents();
    const interval = setInterval(() => getStudents(), 10000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const Status = React.memo((props: StatusProps) => {
    const { status } = props;

    let icon: any = null;
    if (status === "Out") {
      icon = <LogoutIcon className="icon" />;
    } else if (status === "In") {
      icon = <LoginIcon className="icon" />;
    }

    let label: string = status;
    if (status === "Out") {
      label = "Out";
    }
    if (status === "In") {
      label = "In";
    }

    return (
      <StyledChip
        className={status}
        icon={icon}
        size="small"
        label={label}
        variant="outlined"
      />
    );
  });

  function renderStatus(params: GridRenderCellParams<any, string>) {
    if (params.value == null) {
      return "";
    }

    return <Status status={params.value} />;
  }

  const rows: GridRowsProp = [studentList];

  const columns: GridColDef[] = [
    {
      editable: false,
      field: "first_name",
      flex: 1,

      headerName: "First Name",
    },
    {
      editable: false,
      field: "last_name",
      flex: 1,

      headerName: "Last Name",
    },
    {
      editable: false,
      type: "singleSelect",
      renderCell: renderStatus,
      field: "status",
      headerName: "Status",
      width: 150,
      valueOptions: ["In", "Out"],
      valueGetter: ({ row }) => {
        if (row.is_present) {
          return "In";
        }
        return "Out";
      },
    },
    {
      editable: false,
      field: "points",
      headerName: "Points",
      flex: 1,

      type: "integer",
      // valueGetter: ({ value }) => value && new Date(value),
    },
    {
      editable: false,
      field: "period",
      headerName: "Period",
      flex: 1,

      type: "integer",
      // valueGetter: ({ value }) => value && new Date(value),
    },
    {
      editable: false,
      field: "last_modified",
      headerName: "Last Scan",
      width: 225,

      type: "dateTime",
      // TODO: make sure we don't need this
      // valueGetter: ({ value }) => {
      //   return value && ctUtils.convertTime(value as string);
      // },
      valueFormatter: (params: { value: any }) =>
        ctUtils.formatTime(params?.value),
      // // TODO: date missing, don't default now
    },
  ];

  return (
    <Container maxWidth="lg">
      {/*<Container height="100vh" display="flex" flexDirection="column">*/}
      <Box
        // flex={1}

        sx={{
          // overflow: "auto",
          // overflowY: "hidden",
          // minHeight: '100vh',
          height: "100vh",
          // flex:{1}
          //      overflow:"auto"
          //      width: '90%'
          // , height: 700
        }}
      >
        {/*<div style={{ height: "90vh" }}>*/}
        <StyledDataGrid
          // {...data}
          columns={columns}
          rows={rowData}
          // rowsPerPageOptions={[25]}
          getRowClassName={(params) =>
            `super-app-theme--${params.row.is_present}`
          }
          slots={{ toolbar: CustomToolbar }}
          getRowId={(row) => uuidv4()}
          //TODO: max this work?
          // slotProps={{
          //   toolbar: {
          //     showQuickFilter: true,
          //   },
          // }}
          // autoPageSize={true}
          initialState={{
            // filter: {
            //   filterModel: {
            //     items: [],
            //     quickFilterValues: [],
            //   },
            // },
            sorting: {
              sortModel: [
                { field: "status", sort: "asc" },
                { field: "last_modified", sort: "desc" },
              ],
            },
            pagination: { paginationModel: { pageSize: 30 } },
          }}
          pageSizeOptions={[30, 50, 100]}
        />
        {/*</div>*/}
      </Box>
    </Container>
  );
}
