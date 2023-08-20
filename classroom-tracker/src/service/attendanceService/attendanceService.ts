import internal from "stream";
import { axiosInstance } from "../axios";

class AttendanceService {
  scanStudent(id: string) {
    const scanStudentUrl = ("/students/" + id) as string;
    return axiosInstance.post(scanStudentUrl).then((response) => response);
  }

  getAttendance() {
    const getAttendance = "/students";
    return axiosInstance.get(getAttendance).then((response) => response.data);
  }
}

export const attendanceService = new AttendanceService();
