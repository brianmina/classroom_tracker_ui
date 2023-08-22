import internal from "stream";
import {axiosInstance} from "../axios";

class AttendanceService {
    scanStudent(id: string) {
        const scanStudentUrl = ("/students/" + id) as string;
        return axiosInstance.post(scanStudentUrl).then((response) => response);
    }

    getAttendance() {
        const getAttendance = "/students";
        return axiosInstance.get(getAttendance).then((response) => response.data);
    }

    testReadiness() {
        return axiosInstance.get("/readiness").then(() => {
            console.log("readiness tested")
        }).catch(() => {
            console.log("error testing readiness")
        })
    }
}

export const attendanceService = new AttendanceService();
