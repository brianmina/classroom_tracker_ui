import internal from "stream";
import {axiosInstance} from "../axios";

class AttendanceService {
    scanStudent(id: number) {
        const scanStudentUrl = "/students" + id as string;
        return axiosInstance
            .post(scanStudentUrl)
            .then((response) => response.data )
    }

    getAttendance() {
        const getAttendance = "/students"
        return axiosInstance
            .get(getAttendance)
            .then((response) => response.data )
    }
}
export const attendanceService = new AttendanceService();
