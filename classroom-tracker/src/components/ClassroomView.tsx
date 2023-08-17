import * as React from 'react';
import Box from '@mui/material/Box';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowsProp,
  GridValueFormatterParams,
} from '@mui/x-data-grid';
import {darken, lighten, styled} from '@mui/material/styles';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import InfoIcon from '@mui/icons-material/Info';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import DoneIcon from '@mui/icons-material/Done';
import Chip from '@mui/material/Chip';
import moment from 'moment';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';
import Fingerprint from '@mui/icons-material/Fingerprint';
import {useEffect, useState} from "react";
import {axiosInstance} from "../service/axios";
import { v4 as uuidv4 } from 'uuid';
import {AxiosResponse} from "axios";




const StyledChip = styled(Chip)(({ theme  }) => ({
  justifyContent: 'left',
  '& .icon': {
    color: 'inherit',
  },
  '&.Open': {
    color: theme.palette.info.dark,
    border: `1px solid ${theme.palette.info.main}`,
  },
  '&.Filled': {
    color: theme.palette.success.dark,
    border: `1px solid ${theme.palette.success.main}`,
  },
  '&.PartiallyFilled': {
    color: theme.palette.warning.dark,
    border: `1px solid ${theme.palette.warning.main}`,
  },
  '&.Rejected': {
    color: theme.palette.error.dark,
    border: `1px solid ${theme.palette.error.main}`,
  },
}));

interface StatusProps {
  status: string;
}

const getBackgroundColor = (color: string, mode: string) =>
  mode === 'dark' ? darken(color, 0.7) : lighten(color, 0.7);

const getHoverBackgroundColor = (color: string, mode: string) =>
  mode === 'dark' ? darken(color, 0.6) : lighten(color, 0.6);

const getSelectedBackgroundColor = (color: string, mode: string) =>
  mode === 'dark' ? darken(color, 0.5) : lighten(color, 0.5);

const getSelectedHoverBackgroundColor = (color: string, mode: string) =>
  mode === 'dark' ? darken(color, 0.4) : lighten(color, 0.4);

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  '& .super-app-theme--true': {
    backgroundColor: getBackgroundColor(
      theme.palette.success.main,
      theme.palette.mode
    ),
    '&:hover': {
      backgroundColor: getHoverBackgroundColor(
        theme.palette.success.main,
        theme.palette.mode
      ),
    },
    '&.Mui-selected': {
      backgroundColor: getSelectedBackgroundColor(
        theme.palette.success.main,
        theme.palette.mode
      ),
      '&:hover': {
        backgroundColor: getSelectedHoverBackgroundColor(
          theme.palette.success.main,
          theme.palette.mode
        ),
      },
    },
  },

  '& .super-app-theme--false': {
    backgroundColor: getBackgroundColor(
      theme.palette.error.main,
      theme.palette.mode
    ),
    '&:hover': {
      backgroundColor: getHoverBackgroundColor(
        theme.palette.error.main,
        theme.palette.mode
      ),
    },
    '&.Mui-selected': {
      backgroundColor: getSelectedBackgroundColor(
        theme.palette.error.main,
        theme.palette.mode
      ),
      '&:hover': {
        backgroundColor: getSelectedHoverBackgroundColor(
          theme.palette.error.main,
          theme.palette.mode
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
                                          onActivateScanMode
                                        }: Props)  {
    const [isScan, setIsScan] = React.useState<Boolean>(false);
    // const [studentList, setStudentList] = React.useState<StudentType[] >([
    const [studentList, setStudentList] = React.useState({id:1});
    const [isLoaded,setIsLoaded] = useState(false);
    const [rowData,setRowData] = useState([]);

    useEffect(()=> {
        // @ts-ignore
      function getStudents() {
              axiosInstance
            .get("/students")
            .then((response) => {
              setIsLoaded(true);
              console.log(response.data);
              setRowData(response.data);
            })
      }
getStudents()
              const interval = setInterval(() => getStudents(), 10000)
        return () => {
          clearInterval(interval);
        }
            },[]);

  const Status = React.memo((props: StatusProps) => {
    const { status } = props;

    let icon: any = null;
    if (status === 'Out') {
      icon = <ReportProblemIcon className="icon" />;
    } else if (status === 'Open') {
      icon = <InfoIcon className="icon" />;
    } else if (status === 'PartiallyFilled') {
      icon = <AutorenewIcon className="icon" />;
    } else if (status === 'In') {
      icon = <DoneIcon className="icon" />;
    }

    let label: string = status;
    if (status === 'Out') {
      label = 'Out';
    }
    if (status === 'In') {
      label = 'In';
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
      return '';
    }

    return <Status status={params.value} />;
  }


  const rows: GridRowsProp = [studentList]

  const columns: GridColDef[] = [
    {
      editable: false,
      field: 'first_name',
      headerName: 'First Name',
      width: 150,
    },
    {
      editable: false,
      field: 'last_name',
      headerName: 'Last Name',
      width: 150,
    },
    {
      editable: false,
      type: 'singleSelect',
      renderCell: renderStatus,
      field: 'status',
      headerName: 'Status',
      width: 150,
      valueOptions: ['In', 'Out'],
      valueGetter: ({ row }) => {
        if (row.is_present) {
          return 'In';
        }
        return 'Out';
      },
    },
    {
      editable: false,
      field: 'points',
      headerName: 'Points',
      width: 120,

      type: 'integer',
      // valueGetter: ({ value }) => value && new Date(value),
    },
    {
      editable: false,
      field: 'lastModified',
      headerName: 'Last Scan',
      width: 225,

      type: 'dateTime',
      //TODO: make sure we don't need this
      // valueGetter: ( value ) => {
      //   return value && new Date(value);
      // },
      valueFormatter: (params: { value: any; }) =>
      moment(params?.value).format("MMMM DD, YYYY h:mm A"),
    },
  ];

  return (

    <Box sx={{ width: '100%' }}>
          <Box sx={{ height: 400, width: '100%' }}>


      <StyledDataGrid
        // {...data}
        columns={columns}
        rows={rowData}
        getRowClassName={(params) => `super-app-theme--${params.row.is_present}`}
        getRowId={row => uuidv4()}
        initialState={{
          sorting: {
            sortModel: [{ field: 'status', sort: 'asc' }],
          },
        }}
      />
    </Box>
             <Button
                 // variant="outlined"
                 startIcon={<Fingerprint />}
                 variant="contained"
        onClick={() =>
            onActivateScanMode()
        }
      >

         Scan Mode
             </Button>
    </Box>
  );
}

