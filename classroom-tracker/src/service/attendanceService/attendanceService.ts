import internal from "stream";
import {axiosInstance} from "../axios";

class AttendanceService {
    scanStudent(id: number) {
        const scanStudentUrl = "/students" + id as string;
        return axiosInstance
            .post(scanStudentUrl)
            .then((response) => response.data )
    }
}
export const attendanceService = new AttendanceService();
