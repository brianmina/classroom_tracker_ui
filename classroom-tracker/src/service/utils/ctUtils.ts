import axios from "axios";
import { CLASSROOM_TRACKER_API_URL } from "../../constants/constants";
import moment from "moment/moment";

class CtUtils {
  formatTime(lastModified: string) {
    console.log("lm" + lastModified);
    if (lastModified === null) {
      return "";
    }
    return moment.utc(lastModified).local().format("MMMM DD, YYYY h:mm A");
  }

  convertTime(lastModified: string) {
    return moment.utc(lastModified).local();
  }
}

export const ctUtils = new CtUtils();
