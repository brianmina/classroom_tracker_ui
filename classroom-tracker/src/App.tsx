import React, {useCallback, useEffect, useState} from 'react';
// import logo from './logo.svg';
import './App.css';
import { attendanceService } from "./service/attendanceService";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

// import {Html5QrcodeScanner, Html5QrcodeScanType} from 'html5-qrcode';
import Html5QrcodePlugin from './components/Html5QrcodePlugin';
//import ResultContainerPlugin from './components/ResultsContainerPlugin';
import ClassroomView from './components/ClassroomView';
//import {QrReader} from "react-qr-reader";
import {StyledEngineProvider} from "@mui/material/styles";
import {Html5QrcodeScanType} from "html5-qrcode";
import StudentScanner from "./components/StudentScanner";
import {Alert, AlertColor, AlertTitle, Backdrop, CircularProgress} from "@mui/material";


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
// TODO: Add favicon and change app name

function App() {
        const [open, setOpen] = React.useState(false);
        const [dialogText, setDialogText] = React.useState("");
        const [pauseScanning, setPauseScanning] = React.useState<boolean>(false);
    const [isScanMode, setIsScanMode] = React.useState<boolean>(false);
    const [alertSeverity, setAlertSeverity] = React.useState<AlertColor>('error');

      const handleClose = () => {
        setOpen(false);
      };


    function setOpenWithTimeout(timeout: number) {
        setOpen(true)
        setTimeout(()=> {
            setOpen(false)
            setPauseScanning(false)
            console.log("setting stuff")
        }, timeout)

    }

      const [loading, setLoading] = useState(false);
      const [resultData, setResultData] = useState(undefined);
            async function scanStudentCode(decodedText: any) {
                try{
                    setLoading(true)
                    const result_data = await attendanceService.scanStudent(decodedText)
                    console.log("0" + result_data.first_name)
                    console.log("1" + result_data.data)
                    if (result_data.is_present) {
                         setDialogText(`${result_data.first_name} ${result_data.last_name} is entering the classroom.`)
                        setAlertSeverity("success")
                    } else {
                        setDialogText(`${result_data.first_name} ${result_data.last_name} is leaving the classroom.`)
                                                setAlertSeverity("info")

                    }

                    // setResultData(result_data)
                    setLoading(false);
                    console.log(resultData)  ;


                  } catch (error) {
                    setLoading(false)
                    console.log(error)

                }
            }

    useEffect(() => {
        console.log('ps' + pauseScanning)
    },[pauseScanning])
    const onNewScanResult = (decodedText: any, decodedResult: any) => {

        if (!pauseScanning) {
            // isPaused = true
            // setTimeout(()=>{
            //     isPaused = false
            // }, 4000)
            // @ts-ignore
            setPauseScanning(true)
            console.log(`Scan result: ${decodedText}`, decodedResult);

            console.log("L" + loading + "O"+ open)

            if (!isNaN(decodedText)) {

                console.log(decodedText)
                // @ts-ignore
                console.log("pausingscanning")
                // console.log("pause is " + pauseScanning)
                scanStudentCode(decodedText).then(() => {
                        // console.log(resultData)
                        // @ts-ignore
                        // setDialogText(resultData?.name)
                        //         setPauseScanning(true)

                        setOpenWithTimeout(3000)

                    }
                )
            } else {
                console.log("error decoding ", decodedResult)
            }
        } else {
         console.log("scanning is paused")
        }

    }

    function onScanError(error: any,) {
        // Handle on success condition with the decoded text or result.
        console.log(error)
    }

    // function onScanError(errorMessage: any) {
    //     // handle on error condition, with error message
    //     console.error(errorMessage)
    // }
    const activateScanMode =  () => {
        setIsScanMode(true);
        // @ts-ignore
        // this.setIsScanMode(true);
    }
    // @ts-ignore
    // @ts-ignore
    return (
<StyledEngineProvider injectFirst>

    {isScanMode ?

     <>
         <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
          onClick={handleClose}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
         <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Use Google's location service?"}</DialogTitle>
        <DialogContent>
          {/*<DialogContentText id="alert-dialog-slide-description">*/}
          {/*    {dialogText}*/}
          {/*</DialogContentText>*/}
            <Alert severity={alertSeverity}>
  <AlertTitle>{dialogText}</AlertTitle>
  This is an error {dialogText} — <strong>check it out!</strong>
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
        /> </>
        : (
            <React.StrictMode>
                <ClassroomView
                    isScanModeValue={isScanMode}
                    onActivateScanMode={activateScanMode}/>
            </React.StrictMode>)}
    </StyledEngineProvider>


    )
//   // const onNewScanResult = (decodedText: string, decodedResult: Html5QrcodeScanner) => {


}

export default App;



