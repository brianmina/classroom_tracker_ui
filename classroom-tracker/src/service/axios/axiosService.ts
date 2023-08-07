import axios from "axios";
import {CLASSROOM_TRACKER_API_URL} from "../../constants/constants";

export const axiosInstance = axios.create({
    baseURL: CLASSROOM_TRACKER_API_URL, //TODO: make this an env var
    timeout: 1000,
    headers: {}
})