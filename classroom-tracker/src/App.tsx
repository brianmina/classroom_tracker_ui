import React, { useState } from 'react';
// import logo from './logo.svg';
import './App.css';
import { attendanceService } from "./service/attendanceService";

// import {Html5QrcodeScanner, Html5QrcodeScanType} from 'html5-qrcode';
import Html5QrcodePlugin from './components/Html5QrcodePlugin';
//import ResultContainerPlugin from './components/ResultsContainerPlugin';
import ClassroomView from './components/ClassroomView';
//import {QrReader} from "react-qr-reader";
import {StyledEngineProvider} from "@mui/material/styles";
import {Html5QrcodeScanType} from "html5-qrcode";
import StudentScanner from "./components/StudentScanner";


const handleError = (err: any) => {
  console.error(err);
};
// TODO: Add favicon and change app name

function App() {
    const [isScanMode, setIsScanMode] = React.useState<boolean>(false);
    function onNewScanResult(decodedText: any, decodedResult: any) {
        // Handle on success condition with the decoded text or result.
        console.log(`Scan result: ${decodedText}`, decodedResult);
        if (!isNaN(decodedText)) {
            console.log(decodedText)
            const result = attendanceService.scanStudent(decodedText);
            console.log(result)
        } else {
            console.log("error decoding ", decodedResult)
        }

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
    return (
<StyledEngineProvider injectFirst>

    {isScanMode ?
        <Html5QrcodePlugin
            fps={10}
            qrbox={250}
            disableFlip={true}
            rememberLastUsedCamera={true}
            qrCodeSuccessCallback={onNewScanResult}
            qrCode
            supportedScanTypes={[Html5QrcodeScanType.SCAN_TYPE_CAMERA]}
        />
        : (
            <React.StrictMode>
                <ClassroomView
                    isScanModeValue={isScanMode}
                    onActivateScanMode={activateScanMode}/>
            </React.StrictMode>)}
    </StyledEngineProvider>


    )
//   // const onNewScanResult = (decodedText: string, decodedResult: Html5QrcodeScanner) => {


//   //
//   // //   // handle decoded results here
//   // // };
//   // const [decodedResults, setDecodedResults] = useState<Array<Html5QrcodeScanner>>([]);
//   // const onNewScanResult = (decodedText: string, decodedResult: Html5QrcodeScanner) => {
//   //     console.log("App [result]", decodedResult);
//   //     setDecodedResults(prev => [...prev, decodedResult]);
//   // };

//     const [selected, setSelected] = useState("environment");
//   const [startScan, setStartScan] = useState(false);
//   const [loadingScan, setLoadingScan] = useState(false);
//   const [data, setData] = useState("");

//   const handleScan = async (scanData: React.SetStateAction<string>) => {
//     setLoadingScan(true);
//     console.log(`loaded data data`, scanData);
//     if (scanData && scanData !== "") {
//       console.log(`loaded >>>`, scanData);
//       setData(scanData);
//       setStartScan(false);
//       setLoadingScan(false);
//       // setPrecScan(scanData);
//     }
//   };
//   const handleError = (err: any) => {
//     console.error(err);
//   };
// return (
//     <div className="App">
//         <section className="App-section">
//         <div className="App-section-title">Classroom Tracker</div>
// <h2>
//         Last Scan:
//         {selected}
//       </h2>

//       <button
//         onClick={() => {
//           setStartScan(!startScan);
//         }}
//       >
//         {startScan ? "Stop Scan" : "Start Scan"}
//       </button>
//       {startScan && (
//         <>
//           <select onChange={(e) => setSelected(e.target.value)}>
//             <option value={"environment"}>Back Camera</option>
//             <option value={"user"}>Front Camera</option>
//           </select>
//           <QrReader
//             //facingMode={selected}
//             delay={1000}
//             onError={handleError}
//             onScan={handleScan}
//             // chooseDeviceId={()=>selected}
//             style={{ width: "300px" }}
//           />
//         </>
//       )}
//       {loadingScan && <p>Loading</p>}
//       {data !== "" && <p>{data}</p>}

//         </section>
//        <ClassroomView/>
//     </div>
// );



}

export default App;
