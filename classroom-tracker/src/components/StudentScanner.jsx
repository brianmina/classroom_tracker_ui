// import React, { useState } from 'react';
// import logo from './logo.svg';
// // import './Home.css';
//
//
// import {QrReader} from 'react-qr-reader';
// import Box from "@mui/material/Box";
// // const [selected, setSelected] = useState("environment");
// // const [startScan, setStartScan] = useState(false);
// // const [loadingScan, setLoadingScan] = useState(false);
// // const [data, setData] = useState("");
//
//
// const handleError = (err: any) => {
//     console.error(err);
// };
//
// const StudentScanner = () => {
//     const [selected, setSelected] = useState("environment");
//     const [startScan, setStartScan] = useState(false);
//     const [loadingScan, setLoadingScan] = useState(false);
//     const [data, setData] = useState("");
//
//
//       const handleScan = async (scanData: React.SetStateAction<string>) => {
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
//
// return (
//     <>
//         <QrReader
//             onResult={(result, error) => {
//                 if (!!result) {
//                     // @ts-ignore
//                     setData(result?.text);
//                 }
//
//                 if (!!error) {
//                     console.info(error);
//                 }
//             }}
//             containerStyle={{ width: '100%' }}
//          constraints={{facingMode}}/>
//         <p>{data}</p>
//     </>
// //     <Box className="Home">
// //         <section className="Home-section">
// //         <div className="Home-section-title">Classroom Tracker</div>
// // <h2>
// //         Last Scan:
// //         {selected}
// //       </h2>
// //
// //
// //                 <button
// //                     onClick={() => {
// //                     setStartScan(!startScan);
// //                 }}
// //                     >
// //                 {startScan ? "Stop Scan" : "Start Scan"}
// //             </button>
// //             {startScan && (
// //                 <>
// //                     <select onChange={(e) => setSelected(e.target.value)}>
// //                         <option value={"environment"}>Back Camera</option>
// //                         <option value={"user"}>Front Camera</option>
// //                     </select>
// //                     <QrReader
// //                         //facingMode={selected}
// //                         delay={1000}
// //                         onError={handleError}
// //                         onScan={handleScan}
// //                         // chooseDeviceId={()=>selected}
// //                         style={{ width: "300px" }}
// //                     />
// //                 </>
// //             )}
// //             {loadingScan && <p>Loading</p>}
// //             {data !== "" && <p>{data}</p>}
// //
// //         </section>
// //         </Box>
// )
// };
// export { StudentScanner };
//
//
//
// file = Html5QrcodePlugin.jsx
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect } from 'react';

const qrcodeRegionId = "html5qr-code-full-region";

// Creates the configuration object for Html5QrcodeScanner.
const createConfig = (props) => {
    let config = {};
    if (props.fps) {
        config.fps = props.fps;
    }
    if (props.qrbox) {
        config.qrbox = props.qrbox;
    }
    if (props.aspectRatio) {
        config.aspectRatio = props.aspectRatio;
    }
    if (props.disableFlip !== undefined) {
        config.disableFlip = props.disableFlip;
    }
    return config;
};

const Html5QrcodePlugin = (props) => {

    useEffect(() => {
        // when component mounts
        const config = createConfig(props);
        const verbose = props.verbose === true;
        // Suceess callback is required.
        if (!(props.qrCodeSuccessCallback)) {
            throw "qrCodeSuccessCallback is required callback.";
        }
        const html5QrcodeScanner = new Html5QrcodeScanner(qrcodeRegionId, config, verbose);
        html5QrcodeScanner.render(props.qrCodeSuccessCallback, props.qrCodeErrorCallback);

        // cleanup function when component will unmount
        return () => {
            html5QrcodeScanner.clear().catch(error => {
                console.error("Failed to clear html5QrcodeScanner. ", error);
            });
        };
    }, []);

    return (
        <div id={qrcodeRegionId} />
    );
};

export default Html5QrcodePlugin;