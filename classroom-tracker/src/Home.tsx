import React, {useCallback, useEffect, useRef, useState} from "react";
// import logo from './logo.svg';
import "./App.css";
import {attendanceService} from "./service/attendanceService";
import {ctUtils} from "./service/utils";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import {TransitionProps} from "@mui/material/transitions";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
// import {Html5QrcodeScanner, Html5QrcodeScanType} from 'html5-qrcode';
import Html5QrcodePlugin from "./components/Html5QrcodePlugin";
//import ResultContainerPlugin from './components/ResultsContainerPlugin';
import ClassroomView from "./components/ClassroomView";
//import {QrReader} from "react-qr-reader";
import {StyledEngineProvider} from "@mui/material/styles";
import {Html5QrcodeScanType} from "html5-qrcode";

import {
    Alert,
    AlertColor,
    AlertTitle,
    Backdrop,
    CircularProgress,
} from "@mui/material";
import Fab from '@mui/material/Fab';
import NavigationIcon from '@mui/icons-material/Navigation';

import {useNavigate} from "react-router-dom";
import {googleLogout} from "@react-oauth/google";


const fabStyle = {
    margin: 0,
    bottom: 'auto',
    right: 20,
    top: 20,
    left: 'auto',
    position: 'fixed',
};

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

// const handleError = (err: any) => {
//   console.error(err);
// };
let readinessTimer: NodeJS.Timeout;

function Home() {


    const [open, setOpen] = React.useState(false);
    const [dialogText, setDialogText] = React.useState("");
    const [dialogTitle, setDialogTitle] = React.useState("Error");
    const [pauseScanning, setPauseScanning] = React.useState<boolean>(false);
    const [isScanMode, setIsScanMode] = React.useState<boolean>(false);
    const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);
    const [alertSeverity, setAlertSeverity] = React.useState<AlertColor>("error");

    const navigate = useNavigate()

    const pauseScanningStateRef = useRef();

    // @ts-ignore
    pauseScanningStateRef.current = pauseScanning;
    const handleClose = () => {
        setOpen(false);
    };

    function setOpenWithTimeout(timeout: number) {
        setOpen(true);
        setTimeout(() => {
            setOpen(false);
            setPauseScanning(false);
            console.log("setting stuff");
        }, timeout);
    }

    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState(undefined);

    async function scanStudentCode(decodedText: any) {
        // @ts-ignore
        try {
            setLoading(true);
            const response = await attendanceService.scanStudent(decodedText);

            const result_data = response.data;

            const scanTimeFormatted = ctUtils.formatTime(result_data.last_modified);

            if (result_data.is_present) {
                setDialogTitle(
                    `ENTRY SCAN COMPLETE for ${result_data.first_name} ${result_data.last_name} `,
                );

                setDialogText(
                    `${result_data.first_name} ${result_data.last_name} has entered the classroom at ${scanTimeFormatted}.`,
                );
                setAlertSeverity("success");
            } else {
                setDialogTitle(
                    `EXIT SCAN COMPLETE for ${result_data.first_name} ${result_data.last_name} `,
                );
                setDialogText(
                    `${result_data.first_name} ${result_data.last_name} has left the classroom at ${scanTimeFormatted}.`,
                );
                setAlertSeverity("info");
            }


            setLoading(false);
        } catch (error: any) {
            setLoading(false);
            setAlertSeverity("error");
            if (error.response.status === 404 && error.response.data.message) {
                setDialogText(error.response.data.message);
            } else if (error.response.data.message) {
                setDialogText(
                    `Error ${error.response.status}: ${error.response.data.message}`,
                );
            }
            // setLoading(false);
            // console.log(error);
        }
    }

    useEffect(() => {
        const setupReadinessTimer = () => {
            console.log()
            if (isScanMode) {
                attendanceService.testReadiness()
            }
            readinessTimer = setTimeout(
                setupReadinessTimer, ctUtils.minutesToMillis(1)
            )
        }
        setupReadinessTimer();
        return () => {
            clearTimeout(readinessTimer)
        }
    }, [isScanMode]);
    const onNewScanResult = (decodedText: any, decodedResult: any) => {
        if (!pauseScanningStateRef.current) {
            setPauseScanning(true);


            if (!isNaN(decodedText)) {
                scanStudentCode(decodedText).then(() => {
                    setOpenWithTimeout(3000);
                });
            } else {
                console.log("qr code is not a number");
                setLoading(false);
                setAlertSeverity("error");
                setDialogText(`This does not seem to be a valid student QR code.`);
                setOpenWithTimeout(3000);
            }
        } else {
            console.log("scanning is paused");
        }
    };

    function onScanError(error: any) {
        // Handle on success condition with the decoded text or result.
        console.log(error);
    }

    const activateScanMode = () => {
        setIsScanMode(true);
    };
    const logoutGoogle = () => {

        console.log("logging out")
        localStorage.clear();

        navigate('/login');
        googleLogout();
    }
    return (<>
        <StyledEngineProvider injectFirst>


            {isScanMode ? (
                <>
                    <Backdrop
                        sx={{color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1}}
                        open={loading}
                        onClick={handleClose}
                    >
                        <CircularProgress color="inherit"/>
                    </Backdrop>
                    <Dialog
                        open={open}
                        TransitionComponent={Transition}
                        keepMounted
                        onClose={handleClose}
                        aria-describedby="alert-dialog-slide-description"
                    >
                        <DialogContent>
                            <Alert
                                severity={alertSeverity}
                                iconMapping={{
                                    info: <LogoutIcon fontSize="inherit"/>,
                                    success: <LoginIcon fontSize="inherit"/>,
                                }}
                            >
                                <AlertTitle>{dialogTitle}</AlertTitle>
                                {dialogText}
                            </Alert>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Ok</Button>
                        </DialogActions>
                    </Dialog>
                    <Html5QrcodePlugin
                        fps={10}
                        qrbox={350}
                        disableFlip={true}
                        rememberLastUsedCamera={true}
                        qrCodeSuccessCallback={onNewScanResult}
                        qrCodeErrorCallback={onScanError}
                        supportedScanTypes={[Html5QrcodeScanType.SCAN_TYPE_CAMERA]}
                        // isPaused={pauseScanning}
                    />
                    <Fab
                        color="error"
                        sx={fabStyle}
                        onClick={logoutGoogle}>
                        <LogoutIcon/>
                    </Fab>

                </>
            ) : (
                <React.StrictMode>
                    <ClassroomView
                        isScanModeValue={isScanMode}
                        onActivateScanMode={activateScanMode}
                    />

                </React.StrictMode>
            )}

        </StyledEngineProvider></>);


    //   // const onNewScanResult = (decodedText: string, decodedResult: Html5QrcodeScanner) => {
}

export default Home;
